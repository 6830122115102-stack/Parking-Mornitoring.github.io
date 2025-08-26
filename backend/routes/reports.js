const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');

// GET /api/reports/daily - Get daily reports
router.get('/daily', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let query = supabase
      .from('parking_history')
      .select('*')
      .order('timestamp', { ascending: false });

    if (start_date && end_date) {
      query = query
        .gte('timestamp', start_date)
        .lte('timestamp', end_date);
    } else {
      // Default to last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.gte('timestamp', sevenDaysAgo.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    // Group by date
    const dailyStats = {};
    data.forEach(record => {
      const date = new Date(record.timestamp).toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date: date,
          total_cars: 0,
          total_duration: 0,
          release_count: 0
        };
      }
      
      if (record.action === 'occupy') {
        dailyStats[date].total_cars++;
      } else if (record.action === 'release') {
        dailyStats[date].release_count++;
        dailyStats[date].total_duration += record.duration_minutes || 0;
      }
    });

    // Calculate averages
    const reports = Object.values(dailyStats).map(stat => ({
      ...stat,
      avg_parking_time: stat.release_count > 0 
        ? (stat.total_duration / stat.release_count / 60).toFixed(1) 
        : 0
    }));

    res.json({
      success: true,
      data: reports,
      count: reports.length
    });
  } catch (error) {
    console.error('Error fetching daily reports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch daily reports',
      message: error.message
    });
  }
});

// GET /api/reports/weekly - Get weekly reports
router.get('/weekly', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parking_history')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Group by week
    const weeklyStats = {};
    data.forEach(record => {
      const date = new Date(record.timestamp);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyStats[weekKey]) {
        weeklyStats[weekKey] = {
          week_start: weekKey,
          total_cars: 0,
          total_duration: 0,
          release_count: 0
        };
      }
      
      if (record.action === 'occupy') {
        weeklyStats[weekKey].total_cars++;
      } else if (record.action === 'release') {
        weeklyStats[weekKey].release_count++;
        weeklyStats[weekKey].total_duration += record.duration_minutes || 0;
      }
    });

    // Calculate averages
    const reports = Object.values(weeklyStats).map(stat => ({
      ...stat,
      avg_parking_time: stat.release_count > 0 
        ? (stat.total_duration / stat.release_count / 60).toFixed(1) 
        : 0
    }));

    res.json({
      success: true,
      data: reports,
      count: reports.length
    });
  } catch (error) {
    console.error('Error fetching weekly reports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weekly reports',
      message: error.message
    });
  }
});

// GET /api/reports/monthly - Get monthly reports
router.get('/monthly', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parking_history')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Group by month
    const monthlyStats = {};
    data.forEach(record => {
      const date = new Date(record.timestamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          month: monthKey,
          total_cars: 0,
          total_duration: 0,
          release_count: 0
        };
      }
      
      if (record.action === 'occupy') {
        monthlyStats[monthKey].total_cars++;
      } else if (record.action === 'release') {
        monthlyStats[monthKey].release_count++;
        monthlyStats[monthKey].total_duration += record.duration_minutes || 0;
      }
    });

    // Calculate averages
    const reports = Object.values(monthlyStats).map(stat => ({
      ...stat,
      avg_parking_time: stat.release_count > 0 
        ? (stat.total_duration / stat.release_count / 60).toFixed(1) 
        : 0
    }));

    res.json({
      success: true,
      data: reports,
      count: reports.length
    });
  } catch (error) {
    console.error('Error fetching monthly reports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch monthly reports',
      message: error.message
    });
  }
});

// GET /api/reports/analytics - Get analytics summary
router.get('/analytics', async (req, res) => {
  try {
    // Get parking spots stats
    const { data: spots, error: spotsError } = await supabase
      .from('parking_spots')
      .select('*');

    if (spotsError) throw spotsError;

    // Get parking history stats
    const { data: history, error: historyError } = await supabase
      .from('parking_history')
      .select('*');

    if (historyError) throw historyError;

    // Calculate statistics
    const totalSpots = spots.length;
    const occupiedSpots = spots.filter(spot => spot.status === 'occupied').length;
    const availableSpots = totalSpots - occupiedSpots;
    const occupancyRate = ((occupiedSpots / totalSpots) * 100).toFixed(1);

    // Calculate average parking time
    const releaseRecords = history.filter(record => record.action === 'release');
    const totalDuration = releaseRecords.reduce((sum, record) => sum + (record.duration_minutes || 0), 0);
    const avgParkingTime = releaseRecords.length > 0 ? (totalDuration / releaseRecords.length / 60).toFixed(1) : 0;

    // Calculate total cars today
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = history.filter(record => 
      record.timestamp.startsWith(today) && record.action === 'occupy'
    );
    const totalCarsToday = todayRecords.length;

    // Calculate average users per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRecords = history.filter(record => 
      new Date(record.timestamp) >= sevenDaysAgo && record.action === 'occupy'
    );
    const uniqueUsers = [...new Set(recentRecords.map(record => record.user_id))];
    const avgUsersPerDay = (uniqueUsers.length / 7).toFixed(0);

    res.json({
      success: true,
      data: {
        parking_stats: {
          total_spots: totalSpots,
          occupied_spots: occupiedSpots,
          available_spots: availableSpots,
          occupancy_rate: parseFloat(occupancyRate)
        },
        usage_stats: {
          total_cars_today: totalCarsToday,
          avg_parking_time: parseFloat(avgParkingTime),
          avg_users_per_day: parseInt(avgUsersPerDay)
        },
        history_stats: {
          total_records: history.length,
          total_releases: releaseRecords.length,
          total_duration_hours: (totalDuration / 60).toFixed(1)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

// GET /api/reports/history - Get parking history
router.get('/history', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const { data, error } = await supabase
      .from('parking_history')
      .select('*')
      .order('timestamp', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) throw error;

    res.json({
      success: true,
      data: data,
      count: data.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching parking history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch parking history',
      message: error.message
    });
  }
});

module.exports = router;
