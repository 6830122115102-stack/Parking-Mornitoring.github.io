import React, { useState, useEffect, useRef } from 'react';
import ParkingSpot from './ParkingSpot';
import { useParkingAPI } from '../hooks/useParkingAPI';

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
  
  // Use parking API hook
  const { 
    getParkingSpots, 
    updateParkingSpotStatus,
    clearError 
  } = useParkingAPI();

  // สร้าง parking grid เริ่มต้น - จะถูกแทนที่ด้วยข้อมูลจากฐานข้อมูล
  const [parkingSpots, setParkingSpots] = useState({
    A: [], B: [], C: [], D: []
  });

  // Load parking spots from API
  const loadParkingSpots = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getParkingSpots();
      
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
        console.log('✅ Parking spots loaded from API:', newParkingSpots);
      } else {
        throw new Error(result.error || 'Failed to fetch parking spots');
      }
    } catch (err) {
      console.error('❌ Error loading parking spots:', err);
      setError(`ไม่สามารถโหลดข้อมูลได้: ${err.message}`);
      
      // Fallback to default data
      initializeDefaultSpots();
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with default data as fallback
  const initializeDefaultSpots = () => {
    const defaultSpots = {
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
    
    setParkingSpots(defaultSpots);
    console.log('📋 Using default parking spots data');
  };

  useEffect(() => {
    // Load parking spots from API
    loadParkingSpots();
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
        console.log(`🔄 Updating ${spotId} to ${newStatus}...`);
        
        // Store original status for rollback (unused but kept for future use)
        // const originalStatus = contextMenuSpot.status;
        
        // Update local state immediately (optimistic update)
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
        
        // Update via API
        const result = await updateParkingSpotStatus(spotId, newStatus);
        
        if (result.success) {
          console.log(`✅ Successfully updated ${spotId} to ${newStatus}`);
          
          // Update with actual data from API
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
          
          setError(null);
          clearError();
        } else {
          throw new Error(result.error || 'Failed to update status');
        }
        
      } catch (error) {
        console.error('❌ Error updating status:', error);
        
        // Revert local state
        setParkingSpots(prev => ({
          ...prev,
          [section]: prev[section].map(spot =>
            spot.id === spotId ? { ...spot, status: contextMenuSpot.status } : spot
          )
        }));
        
        setError(`ไม่สามารถอัปเดต ${spotId}: ${error.message}`);
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
    loadParkingSpots();
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
