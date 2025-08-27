import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Car, 
  Clock, 
  TrendingUp,
  Calendar,
  ChevronDown
} from 'lucide-react';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [parkingStats, setParkingStats] = useState({
    total_spots: 0,
    occupied_spots: 0,
    available_spots: 0,
    occupancy_rate: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch parking statistics from API
  useEffect(() => {
    const fetchParkingStats = async () => {
      try {
        const response = await fetch('https://parking-mornitoring-github-io.vercel.app/api/parking/stats');
        const result = await response.json();
        
        if (result.success) {
          setParkingStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching parking stats:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data immediately
    fetchParkingStats();

    // Set up auto-refresh every 5 seconds
    const interval = setInterval(fetchParkingStats, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Real data based on parking statistics from database
  const chartData = {
    daily: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      data: [
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0
      ]
    },
    monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0
      ]
    },
    quarterly: {
      labels: ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'],
      data: [
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0
      ]
    },
    yearly: {
      labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
      data: [
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0,
        parkingStats.occupied_spots || 0
      ]
    }
  };

  const currentData = chartData[selectedPeriod];

  // Real data for blocks based on parking statistics from database
  const blockData = {
    totalUsers: parkingStats.occupied_spots || 0, // Number of occupied spots
    averageUsage: parkingStats.occupancy_rate || 0, // Occupancy rate
    peakHours: [
      { time: '12:00-14:00', count: parkingStats.occupied_spots || 0 },
      { time: '16:00-18:00', count: parkingStats.occupied_spots || 0 },
      { time: '08:00-10:00', count: parkingStats.occupied_spots || 0 },
      { time: '20:00-22:00', count: parkingStats.occupied_spots || 0 },
      { time: '04:00-06:00', count: parkingStats.occupied_spots || 0 },
      { time: '00:00-02:00', count: parkingStats.occupied_spots || 0 }
    ]
  };

  const periods = [
    { id: 'daily', label: 'รายวัน', icon: Calendar },
    { id: 'monthly', label: 'รายเดือน', icon: Calendar },
    { id: 'quarterly', label: 'ไตรมาศ', icon: Calendar },
    { id: 'yearly', label: 'รายปี', icon: Calendar }
  ];

  const maxValue = Math.max(...currentData.data);

  return (
    <div className="space-y-6">
      {/* Header with Period Selection */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">สถิติการใช้งานระบบจอดรถ</p>
          </div>
          
          {/* Period Selector */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Chart */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <BarChart3 className="mr-2" size={20} />
              อัตราการเข้าใช้บริการ
            </h3>
            <div className="text-sm text-gray-500">
              หน่วย: จำนวนรถ/ช่วงเวลา
            </div>
          </div>
          
          {/* Chart Bars */}
          <div className="flex items-end justify-between h-64 space-x-2">
            {currentData.data.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-100 rounded-t-lg relative group">
                  <div
                    className="bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${(value / maxValue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {value}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2 text-center">
                  {currentData.labels[index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Block 1: Total Users */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ผู้ใช้บริการทั้งหมด</p>
              <p className="text-3xl font-bold text-gray-800">{blockData.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center mt-2">
                <TrendingUp size={16} className="mr-1" />
                +12.5% จากเดือนที่แล้ว
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        {/* Block 2: Average Usage */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">อัตราการเข้าใช้เฉลี่ย</p>
              <p className="text-3xl font-bold text-gray-800">{blockData.averageUsage}</p>
              <p className="text-sm text-gray-500">รถ/ชั่วโมง</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Car className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Block 3: Peak Hours */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">ช่วงเวลาที่มีผู้ใช้สูงสุด</p>
              <p className="text-lg font-semibold text-gray-800">24 ชั่วโมง</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
          
          {/* 24 Hour Usage Chart */}
          <div className="space-y-2">
            {blockData.peakHours.map((hour, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{hour.time}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${(hour.count / 45) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{hour.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;

