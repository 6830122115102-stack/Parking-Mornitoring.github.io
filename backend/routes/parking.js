const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');

// Parking spots routes using Supabase database

// GET /api/parking/spots - Get all parking spots
router.get('/spots', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parking_spots')
      .select('*')
      .order('spot_id');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch parking spots from database',
        message: error.message
      });
    }

    res.json({
      success: true,
      data: data || [],
      count: data ? data.length : 0
    });
  } catch (error) {
    console.error('Error fetching parking spots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch parking spots',
      message: error.message
    });
  }
});

// GET /api/parking/spots/:id - Get specific parking spot
router.get('/spots/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('parking_spots')
      .select('*')
      .eq('spot_id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Parking spot not found'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch parking spot from database',
        message: error.message
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching parking spot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch parking spot',
      message: error.message
    });
  }
});

// PUT /api/parking/spots/:id/status - Update parking spot status
router.put('/spots/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, user_id } = req.body;

    if (!status || !['available', 'occupied'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be "available" or "occupied"'
      });
    }

    // Prepare update data
    const updateData = {
      status: status,
      updated_at: new Date().toISOString()
    };

    if (status === 'occupied') {
      updateData.occupied_by = user_id;
      updateData.occupied_at = new Date().toISOString();
      updateData.released_at = null;
    } else {
      updateData.occupied_by = null;
      updateData.released_at = new Date().toISOString();
    }

    // Update in Supabase
    const { data, error } = await supabase
      .from('parking_spots')
      .update(updateData)
      .eq('spot_id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Parking spot not found'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Failed to update parking spot in database',
        message: error.message
      });
    }

    // Log to parking history
    await supabase
      .from('parking_history')
      .insert({
        spot_id: id,
        user_id: user_id,
        action: status === 'occupied' ? 'occupy' : 'release',
        timestamp: new Date().toISOString()
      });

    res.json({
      success: true,
      data: data,
      message: `Parking spot ${id} status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating parking spot status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update parking spot status',
      message: error.message
    });
  }
});

// GET /api/parking/stats - Get parking statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total spots
    const { data: totalData, error: totalError } = await supabase
      .from('parking_spots')
      .select('id', { count: 'exact' });

    if (totalError) {
      console.error('Supabase error:', totalError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch parking statistics from database',
        message: totalError.message
      });
    }

    // Get occupied spots
    const { data: occupiedData, error: occupiedError } = await supabase
      .from('parking_spots')
      .select('id', { count: 'exact' })
      .eq('status', 'occupied');

    if (occupiedError) {
      console.error('Supabase error:', occupiedError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch parking statistics from database',
        message: occupiedError.message
      });
    }

    const totalSpots = totalData?.length || 0;
    const occupiedSpots = occupiedData?.length || 0;
    const availableSpots = totalSpots - occupiedSpots;
    const occupancyRate = totalSpots > 0 ? ((occupiedSpots / totalSpots) * 100).toFixed(1) : '0.0';

    res.json({
      success: true,
      data: {
        total_spots: totalSpots,
        occupied_spots: occupiedSpots,
        available_spots: availableSpots,
        occupancy_rate: parseFloat(occupancyRate)
      }
    });
  } catch (error) {
    console.error('Error fetching parking stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch parking statistics',
      message: error.message
    });
  }
});

module.exports = router;
