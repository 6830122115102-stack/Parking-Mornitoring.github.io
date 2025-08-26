import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  Car,
  Clock,
  Users
} from 'lucide-react';

const Report = () => {
  const [selectedReport, setSelectedReport] = useState('daily');
  const [selectedPeriod, setSelectedPeriod] = useState('this-week');

  // Mock report data - เอาส่วนรายได้ออก
  const reportData = {
    daily: {
      title: 'รายงานรายวัน',
      data: [
        { date: '2024-03-20', cars: 45, avgTime: 2.3 },
        { date: '2024-03-19', cars: 42, avgTime: 2.1 },
        { date: '2024-03-18', cars: 48, avgTime: 2.5 },
        { date: '2024-03-17', cars: 35, avgTime: 2.0 },
        { date: '2024-03-16', cars: 52, avgTime: 2.8 },
        { date: '2024-03-15', cars: 41, avgTime: 2.2 },
        { date: '2024-03-14', cars: 46, avgTime: 2.4 }
      ]
    },
    weekly: {
      title: 'รายงานรายสัปดาห์',
      data: [
        { week: 'Week 1', cars: 320, avgTime: 2.3 },
        { week: 'Week 2', cars: 345, avgTime: 2.4 },
        { week: 'Week 3', cars: 330, avgTime: 2.2 },
        { week: 'Week 4', cars: 360, avgTime: 2.5 }
      ]
    },
    monthly: {
      title: 'รายงานรายเดือน',
      data: [
        { month: 'มกราคม', cars: 1250, avgTime: 2.3 },
        { month: 'กุมภาพันธ์', cars: 1350, avgTime: 2.4 },
        { month: 'มีนาคม', cars: 1500, avgTime: 2.5 }
      ]
    }
  };

  const currentData = reportData[selectedReport];

  const getTotalCars = () => {
    return currentData.data.reduce((sum, item) => sum + item.cars, 0);
  };

  const getAvgTime = () => {
    const totalTime = currentData.data.reduce((sum, item) => sum + item.avgTime, 0);
    return (totalTime / currentData.data.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
            <p className="text-gray-600">รายงานและสถิติการใช้งานระบบจอดรถ</p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Download size={20} />
            <span>ดาวน์โหลดรายงาน</span>
          </button>
        </div>

        {/* Report Type Selection */}
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {Object.keys(reportData).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedReport(type)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedReport === type
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {type === 'daily' ? 'รายวัน' : type === 'weekly' ? 'รายสัปดาห์' : 'รายเดือน'}
              </button>
            ))}
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="this-week">สัปดาห์นี้</option>
            <option value="last-week">สัปดาห์ที่แล้ว</option>
            <option value="this-month">เดือนนี้</option>
            <option value="last-month">เดือนที่แล้ว</option>
          </select>
        </div>
      </div>

      {/* Summary Cards - เอาส่วนรายได้ออก */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Car className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">จำนวนรถทั้งหมด</dt>
                <dd className="text-lg font-medium text-gray-900">{getTotalCars().toLocaleString()}</dd>
                <dd className="text-sm text-gray-600">คัน</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">เวลาจอดเฉลี่ย</dt>
                <dd className="text-lg font-medium text-gray-900">{getAvgTime()}</dd>
                <dd className="text-sm text-gray-600">ชั่วโมง</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">ผู้ใช้เฉลี่ย</dt>
                <dd className="text-lg font-medium text-gray-900">{(getTotalCars() / currentData.data.length).toFixed(0)}</dd>
                <dd className="text-sm text-gray-600">คน/วัน</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Report Table - เอาส่วนรายได้ออก */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{currentData.title}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {selectedReport === 'daily' ? 'วันที่' : selectedReport === 'weekly' ? 'สัปดาห์' : 'เดือน'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จำนวนรถ (คัน)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เวลาจอดเฉลี่ย (ชม.)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {selectedReport === 'daily' 
                      ? new Date(item.date).toLocaleDateString('th-TH')
                      : item.week || item.month
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.cars.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.avgTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Placeholder - เอาส่วนรายได้ออก */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <BarChart3 className="mr-2" size={20} />
            กราฟแสดงจำนวนรถ
          </h3>
          <div className="text-sm text-gray-500">
            หน่วย: คัน
          </div>
        </div>
        
        {/* Simple Bar Chart - แสดงจำนวนรถแทนรายได้ */}
        <div className="flex items-end justify-between h-64 space-x-2">
          {currentData.data.map((item, index) => {
            const maxCars = Math.max(...currentData.data.map(d => d.cars));
            const height = (item.cars / maxCars) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-100 rounded-t-lg relative group">
                  <div
                    className="bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.cars.toLocaleString()} คัน
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2 text-center">
                  {selectedReport === 'daily' 
                    ? new Date(item.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
                    : item.week || item.month
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Report;
