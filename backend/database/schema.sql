-- Parking System Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Create parking_spots table
CREATE TABLE IF NOT EXISTS parking_spots (
  id SERIAL PRIMARY KEY,
  spot_id VARCHAR(10) UNIQUE NOT NULL, -- A01, B02, etc.
  section VARCHAR(1) NOT NULL, -- A, B, C, D
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied')),
  occupied_by UUID REFERENCES auth.users(id),
  occupied_at TIMESTAMP WITH TIME ZONE,
  released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parking_history table
CREATE TABLE IF NOT EXISTS parking_history (
  id SERIAL PRIMARY KEY,
  spot_id VARCHAR(10) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(20) NOT NULL CHECK (action IN ('occupy', 'release')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_minutes INTEGER
);

-- Create reports table (for analytics)
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  report_date DATE NOT NULL UNIQUE,
  total_cars INTEGER DEFAULT 0,
  avg_parking_time DECIMAL(4,2) DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for parking_spots
CREATE POLICY "Allow public read access to parking spots" ON parking_spots
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to update parking spots" ON parking_spots
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for parking_history
CREATE POLICY "Allow public read access to parking history" ON parking_history
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert parking history" ON parking_history
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for reports
CREATE POLICY "Allow public read access to reports" ON reports
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert reports" ON reports
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert initial parking spots data
INSERT INTO parking_spots (spot_id, section, status) VALUES
-- Section A
('A01', 'A', 'available'),
('A02', 'A', 'available'),
('A03', 'A', 'available'),
('A04', 'A', 'available'),
('A05', 'A', 'available'),
('A06', 'A', 'available'),
('A07', 'A', 'available'),
('A08', 'A', 'available'),

-- Section B
('B01', 'B', 'available'),
('B02', 'B', 'available'),
('B03', 'B', 'available'),
('B04', 'B', 'available'),
('B05', 'B', 'available'),
('B06', 'B', 'available'),
('B07', 'B', 'available'),
('B08', 'B', 'available'),

-- Section C
('C01', 'C', 'available'),
('C02', 'C', 'available'),
('C03', 'C', 'available'),
('C04', 'C', 'available'),
('C05', 'C', 'available'),
('C06', 'C', 'available'),
('C07', 'C', 'available'),
('C08', 'C', 'available'),

-- Section D
('D01', 'D', 'available'),
('D02', 'D', 'available'),
('D03', 'D', 'available'),
('D04', 'D', 'available'),
('D05', 'D', 'available'),
('D06', 'D', 'available'),
('D07', 'D', 'available'),
('D08', 'D', 'available')
ON CONFLICT (spot_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_parking_spots_spot_id ON parking_spots(spot_id);
CREATE INDEX IF NOT EXISTS idx_parking_spots_section ON parking_spots(section);
CREATE INDEX IF NOT EXISTS idx_parking_spots_status ON parking_spots(status);
CREATE INDEX IF NOT EXISTS idx_parking_history_spot_id ON parking_history(spot_id);
CREATE INDEX IF NOT EXISTS idx_parking_history_user_id ON parking_history(user_id);
CREATE INDEX IF NOT EXISTS idx_parking_history_timestamp ON parking_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_parking_history_action ON parking_history(action);
CREATE INDEX IF NOT EXISTS idx_reports_date ON reports(report_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for parking_spots
CREATE TRIGGER update_parking_spots_updated_at 
  BEFORE UPDATE ON parking_spots 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate parking duration
CREATE OR REPLACE FUNCTION calculate_parking_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.action = 'release' AND OLD.action = 'occupy' THEN
    NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.timestamp - OLD.timestamp)) / 60;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for parking_history
CREATE TRIGGER calculate_parking_duration_trigger
  BEFORE INSERT ON parking_history
  FOR EACH ROW EXECUTE FUNCTION calculate_parking_duration();
