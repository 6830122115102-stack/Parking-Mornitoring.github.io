-- Fix Security Warnings in Supabase
-- Run this in Supabase SQL Editor

-- Fix Function Search Path Mutable warnings
-- These functions need to have search_path set to prevent security issues

-- 1. Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql' SET search_path = public;

-- 2. Fix calculate_parking_duration function  
CREATE OR REPLACE FUNCTION calculate_parking_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.action = 'release' AND OLD.action = 'occupy' THEN
    NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.timestamp - OLD.timestamp)) / 60;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql' SET search_path = public;

-- Verify the functions are updated
SELECT 
  proname as function_name,
  prosrc as function_source,
  proconfig as function_config
FROM pg_proc 
WHERE proname IN ('update_updated_at_column', 'calculate_parking_duration');
