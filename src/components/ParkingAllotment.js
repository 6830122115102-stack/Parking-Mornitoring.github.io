import React, { useState, useEffect, useRef } from 'react';
import ParkingSpot from './ParkingSpot';

const ParkingAllotment = () => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuSpot, setContextMenuSpot] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  
  // เก็บ reference สำหรับ spots ที่กำลังอัปเดต
  const updatingSpots = useRef(new Set());

  // สร้าง parking grid เริ่มต้น - จะถูกแทนที่ด้วยข้อมูลจากฐานข้อมูล
  const [parkingSpots, setParkingSpots] = useState({
    A: [], B: [], C: [], D: []
  });

  // Fetch parking spots from API
  const fetchParkingSpots = async (forceRefresh = false) => {
    // Don't fetch if currently updating specific spots (unless forced)
    if (isUpdating && !forceRefresh) {
      console.log('Skipping fetch - currently updating...');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Try multiple API endpoints in case of deployment changes
      const apiEndpoints = [
        'https://parking-mornitoring-github-io.vercel.app/api/parking/spots',
        'https://parking-mornitoring-github-ex4epk3mh-golfs-projects-ada858e6.vercel.app/api/parking/spots'
      ];
      
      let response;
      let lastError;
      
      for (const endpoint of apiEndpoints) {
        try {
          console.log(`Trying API endpoint: ${endpoint}`);
          response = await fetch(endpoint);
          
          if (response.ok) {
            console.log(`✅ Successfully connected to: ${endpoint}`);
            break;
          } else {
            console.log(`❌ Failed to connect to: ${endpoint} (${response.status})`);
            lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          console.log(`❌ Network error for: ${endpoint}`, error.message);
          lastError = error;
        }
      }
      
      if (!response || !response.ok) {
        throw lastError || new Error('All API endpoints failed');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Convert API data to our format
        const newParkingSpots = {
          A: [], B: [], C: [], D: []
        };
        
        result.data.forEach(spot => {
          const section = spot.spot_id.charAt(0);
          if (newParkingSpots[section]) {
            newParkingSpots[section].push({
              id: spot.spot_id,
              status: spot.status,
              layout: 'id-left',
              occupied_by: spot.occupied_by,
              occupied_at: spot.occupied_at,
              released_at: spot.released_at,
              updated_at: spot.updated_at
            });
          }
        });
        
        // Sort spots by ID to maintain consistent order
        Object.keys(newParkingSpots).forEach(section => {
          newParkingSpots[section].sort((a, b) => a.id.localeCompare(b.id));
        });
        
        setParkingSpots(newParkingSpots);
        setLastFetchTime(new Date());
        console.log('Parking spots loaded from database:', newParkingSpots);
      } else {
        throw new Error(result.error || 'Failed to fetch parking spots');
      }
    } catch (error) {
      console.error('Error fetching parking spots:', error);
      setError(`ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้: ${error.message}`);
      
      // Fallback to default data if API fails
      const fallbackSpots = {
        A: [
          { id: 'A01', status: 'available', layout: 'id-left' },
          { id: 'A02', status: 'available', layout: 'id-left' },
          { id: 'A03', status: 'available', layout: 'id-left' },
          { id: 'A04', status: 'available', layout: 'id-left' },
          { id: 'A05', status: 'available', layout: 'id-left' },
          { id: 'A06', status: 'available', layout: 'id-left' },
          { id: 'A07', status: 'available', layout: 'id-left' },
          { id: 'A08', status: 'available', layout: 'id-left' },
        ],
        B: [
          { id: 'B01', status: 'available', layout: 'id-left' },
          { id: 'B02', status: 'available', layout: 'id-left' },
          { id: 'B03', status: 'available', layout: 'id-left' },
          { id: 'B04', status: 'available', layout: 'id-left' },
          { id: 'B05', status: 'available', layout: 'id-left' },
          { id: 'B06', status: 'available', layout: 'id-left' },
          { id: 'B07', status: 'available', layout: 'id-left' },
          { id: 'B08', status: 'available', layout: 'id-left' },
        ],
        C: [
          { id: 'C01', status: 'available', layout: 'id-left' },
          { id: 'C02', status: 'available', layout: 'id-left' },
          { id: 'C03', status: 'available', layout: 'id-left' },
          { id: 'C04', status: 'available', layout: 'id-left' },
          { id: 'C05', status: 'available', layout: 'id-left' },
          { id: 'C06', status: 'available', layout: 'id-left' },
          { id: 'C07', status: 'available', layout: 'id-left' },
          { id: 'C08', status: 'available', layout: 'id-left' },
        ],
        D: [
          { id: 'D01', status: 'available', layout: 'id-left' },
          { id: 'D02', status: 'available', layout: 'id-left' },
          { id: 'D03', status: 'available', layout: 'id-left' },
          { id: 'D04', status: 'available', layout: 'id-left' },
          { id: 'D05', status: 'available', layout: 'id-left' },
          { id: 'D06', status: 'available', layout: 'id-left' },
          { id: 'D07', status: 'available', layout: 'id-left' },
          { id: 'D08', status: 'available', layout: 'id-left' },
        ],
      };
      
      setParkingSpots(fallbackSpots);
      console.log('Using fallback data due to API error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load initial data from database
    fetchParkingSpots(true);
    
    // Auto-refresh every 15 seconds (less frequent to avoid conflicts)
    const interval = setInterval(() => {
      // Only refresh if no spots are currently being updated
      if (updatingSpots.current.size === 0) {
        fetchParkingSpots();
      } else {
        console.log('Skipping auto-refresh - spots are being updated');
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleContextMenu = (e, spot) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuSpot(spot);
    setShowContextMenu(true);
  };

  const handleStatusChange = async (newStatus) => {
    if (contextMenuSpot && !isUpdating) {
      const spotId = contextMenuSpot.id;
      const section = spotId.charAt(0);
      
      // Mark this spot as being updated
      updatingSpots.current.add(spotId);
      setIsUpdating(true);
      
      try {
        console.log(`Updating ${spotId} to ${newStatus}...`);
        
        // Store original status for rollback
        const originalStatus = contextMenuSpot.status;
        
        // Update local state immediately for better UX (optimistic update)
        setParkingSpots(prev => ({
          ...prev,
          [section]: prev[section].map(spot =>
            spot.id === spotId ? { 
              ...spot, 
              status: newStatus,
              updated_at: new Date().toISOString()
            } : spot
          )
        }));
        
        // Update status in database using spot_id
        const updateEndpoints = [
          `https://parking-mornitoring-github-io.vercel.app/api/parking/spots/${spotId}/status`,
          `https://parking-mornitoring-github-ex4epk3mh-golfs-projects-ada858e6.vercel.app/api/parking/spots/${spotId}/status`
        ];
        
        let response;
        let lastError;
        
        for (const endpoint of updateEndpoints) {
          try {
            console.log(`Trying update endpoint: ${endpoint}`);
            response = await fetch(endpoint, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: newStatus,
                user_id: 'admin' // Default user ID for manual changes
              })
            });
            
            if (response.ok) {
              console.log(`✅ Successfully updated via: ${endpoint}`);
              break;
            } else {
              console.log(`❌ Failed to update via: ${endpoint} (${response.status})`);
              lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
          } catch (error) {
            console.log(`❌ Network error for update: ${endpoint}`, error.message);
            lastError = error;
          }
        }
        
        if (!response || !response.ok) {
          throw lastError || new Error('All update endpoints failed');
        }

        const result = await response.json();
        
        if (result.success) {
          console.log(`Successfully updated ${spotId} to ${newStatus}`);
          
          // Update local state with the actual data from database
          setParkingSpots(prev => ({
            ...prev,
            [section]: prev[section].map(spot =>
              spot.id === spotId ? { 
                ...spot, 
                status: result.data.status,
                occupied_by: result.data.occupied_by,
                occupied_at: result.data.occupied_at,
                released_at: result.data.released_at,
                updated_at: result.data.updated_at
              } : spot
            )
          }));
          
          // Show success message
          console.log(`Parking spot ${spotId} status updated to ${newStatus} and saved to database`);
          
          // Clear any previous errors
          setError(null);
        } else {
          console.error('Failed to update status:', result.error);
          // Revert local state if API call failed
          setParkingSpots(prev => ({
            ...prev,
            [section]: prev[section].map(spot =>
              spot.id === spotId ? { ...spot, status: originalStatus } : spot
            )
          }));
          
          // Show user-friendly error message
          let errorMessage = `ไม่สามารถอัปเดต ${spotId}`;
          if (result.message) {
            errorMessage += `: ${result.message}`;
          } else if (result.error) {
            errorMessage += `: ${result.error}`;
          }
          setError(errorMessage);
        }
      } catch (error) {
        console.error('Error updating status:', error);
        // Revert local state if API call failed
        setParkingSpots(prev => ({
          ...prev,
          [section]: prev[section].map(spot =>
            spot.id === spotId ? { ...spot, status: contextMenuSpot.status } : spot
          )
        }));
        setError(`Error updating ${spotId}: ${error.message}`);
      } finally {
        // Remove this spot from updating set
        updatingSpots.current.delete(spotId);
        setIsUpdating(false);
      }
    }
    setShowContextMenu(false);
  };

  const handleClickOutside = () => {
    setShowContextMenu(false);
  };

  // Function to refresh data manually
  const handleRefresh = () => {
    fetchParkingSpots(true);
  };

  return (
    <div className="space-y-8">
      {/* Header with refresh button and status */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Parking Allotment</h2>
        <div className="flex items-center space-x-4">
          {lastFetchTime && (
            <span className="text-sm text-gray-500">
              Last updated: {lastFetchTime.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && Object.values(parkingSpots).every(section => section.length === 0) && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading parking spots...</p>
        </div>
      )}

      {/* Parking Spots Grid */}
      <div className="bg-gray-100 p-8 rounded-xl shadow-sm">
        <div className="flex justify-center space-x-12">
          {Object.entries(parkingSpots).map(([section, spots]) => (
            <div key={section} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">
                Section {section}
              </h3>
              <div className="space-y-3">
                {spots.map((spot) => (
                  <ParkingSpot
                    key={spot.id}
                    spot={spot}
                    onContextMenu={(e) => handleContextMenu(e, spot)}
                    isUpdating={updatingSpots.current.has(spot.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Legend */}
      <div className="bg-white rounded-xl p-6 shadow-sm max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Status Legend</h3>
        <div className="flex justify-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 border-2 border-gray-300 rounded-lg"></div>
            <span className="text-gray-700 font-medium">Available</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-800 rounded-lg"></div>
            <span className="text-gray-700 font-medium">Occupied</span>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[150px]"
          style={{ 
            left: contextMenuPosition.x, 
            top: contextMenuPosition.y 
          }}
          onClick={handleClickOutside}
        >
          <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
            Change Status: {contextMenuSpot?.id}
          </div>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleStatusChange('available')}
          >
            Available
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleStatusChange('occupied')}
          >
            Occupied
          </button>
        </div>
      )}

      {/* Overlay to close context menu */}
      {showContextMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleClickOutside}
        />
      )}
    </div>
  );
};

export default ParkingAllotment;
