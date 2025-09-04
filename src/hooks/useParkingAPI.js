import { useState, useCallback } from 'react';
import parkingAPI from '../services/api';

// Custom hook for parking API operations
export const useParkingAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all parking spots
  const getParkingSpots = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await parkingAPI.getParkingSpots();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update parking spot status
  const updateParkingSpotStatus = useCallback(async (spotId, status, userId = 'admin') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await parkingAPI.updateParkingSpotStatus(spotId, status, userId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get parking statistics
  const getParkingStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await parkingAPI.getParkingStats();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Health check
  const healthCheck = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await parkingAPI.healthCheck();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getParkingSpots,
    updateParkingSpotStatus,
    getParkingStats,
    healthCheck,
    clearError: () => setError(null)
  };
};
