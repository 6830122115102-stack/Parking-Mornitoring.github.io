const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');

// Mock data for parking spots
const mockParkingSpots = [
  // Section A
  { id: 1, spot_id: 'A01', section: 'A', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, spot_id: 'A02', section: 'A', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 3, spot_id: 'A03', section: 'A', status: 'occupied', occupied_by: 'user123', occupied_at: new Date().toISOString(), released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 4, spot_id: 'A04', section: 'A', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 5, spot_id: 'A05', section: 'A', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 6, spot_id: 'A06', section: 'A', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 7, spot_id: 'A07', section: 'A', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 8, spot_id: 'A08', section: 'A', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Section B
  { id: 9, spot_id: 'B01', section: 'B', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 10, spot_id: 'B02', section: 'B', status: 'occupied', occupied_by: 'user456', occupied_at: new Date().toISOString(), released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 11, spot_id: 'B03', section: 'B', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 12, spot_id: 'B04', section: 'B', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 13, spot_id: 'B05', section: 'B', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 14, spot_id: 'B06', section: 'B', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 15, spot_id: 'B07', section: 'B', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 16, spot_id: 'B08', section: 'B', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Section C
  { id: 17, spot_id: 'C01', section: 'C', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 18, spot_id: 'C02', section: 'C', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 19, spot_id: 'C03', section: 'C', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 20, spot_id: 'C04', section: 'C', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 21, spot_id: 'C05', section: 'C', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 22, spot_id: 'C06', section: 'C', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 23, spot_id: 'C07', section: 'C', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 24, spot_id: 'C08', section: 'C', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  
  // Section D
  { id: 25, spot_id: 'D01', section: 'D', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 26, spot_id: 'D02', section: 'D', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 27, spot_id: 'D03', section: 'D', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 28, spot_id: 'D04', section: 'D', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 29, spot_id: 'D05', section: 'D', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 30, spot_id: 'D06', section: 'D', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 31, spot_id: 'D07', section: 'D', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 32, spot_id: 'D08', section: 'D', status: 'available', occupied_by: null, occupied_at: null, released_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

// GET /api/parking/spots - Get all parking spots
router.get('/spots', async (req, res) => {
  try {
    // Use mock data instead of Supabase
    res.json({
      success: true,
      data: mockParkingSpots,
      count: mockParkingSpots.length
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
    
    const spot = mockParkingSpots.find(s => s.spot_id === id);
    
    if (!spot) {
      return res.status(404).json({
        success: false,
        error: 'Parking spot not found'
      });
    }

    res.json({
      success: true,
      data: spot
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

    const spotIndex = mockParkingSpots.findIndex(s => s.spot_id === id);
    
    if (spotIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Parking spot not found'
      });
    }

    // Update spot
    mockParkingSpots[spotIndex].status = status;
    mockParkingSpots[spotIndex].updated_at = new Date().toISOString();

    if (status === 'occupied') {
      mockParkingSpots[spotIndex].occupied_by = user_id;
      mockParkingSpots[spotIndex].occupied_at = new Date().toISOString();
    } else {
      mockParkingSpots[spotIndex].occupied_by = null;
      mockParkingSpots[spotIndex].released_at = new Date().toISOString();
    }

    res.json({
      success: true,
      data: mockParkingSpots[spotIndex],
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
    const totalSpots = mockParkingSpots.length;
    const occupiedSpots = mockParkingSpots.filter(spot => spot.status === 'occupied').length;
    const availableSpots = totalSpots - occupiedSpots;
    const occupancyRate = ((occupiedSpots / totalSpots) * 100).toFixed(1);

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
