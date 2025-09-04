// API Service for Parking System
class ParkingAPI {
  constructor() {
    this.baseURL = this.getBaseURL();
    this.timeout = 10000; // 10 seconds timeout
  }

  // Get the correct base URL based on environment
  getBaseURL() {
    // In production, use the current domain
    if (window.location.hostname.includes('vercel.app')) {
      return `${window.location.protocol}//${window.location.hostname}`;
    }
    // In development, use localhost
    return 'http://localhost:5000';
  }

  // Generic fetch method with error handling
  async fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: this.timeout,
    };

    const config = { ...defaultOptions, ...options };

    try {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ API Response: ${url}`, data);
      
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${url}`, error);
      throw error;
    }
  }

  // Get all parking spots
  async getParkingSpots() {
    return this.fetch('/api/parking/spots');
  }

  // Get specific parking spot
  async getParkingSpot(spotId) {
    return this.fetch(`/api/parking/spots/${spotId}`);
  }

  // Update parking spot status
  async updateParkingSpotStatus(spotId, status, userId = 'admin') {
    return this.fetch(`/api/parking/spots/${spotId}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        user_id: userId
      })
    });
  }

  // Get parking statistics
  async getParkingStats() {
    return this.fetch('/api/parking/stats');
  }

  // Health check
  async healthCheck() {
    return this.fetch('/api/health');
  }
}

// Create singleton instance
const parkingAPI = new ParkingAPI();

export default parkingAPI;
