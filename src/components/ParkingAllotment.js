import React, { useState } from 'react';
import ParkingSpot from './ParkingSpot';

const ParkingAllotment = () => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuSpot, setContextMenuSpot] = useState(null);

  // สร้าง parking grid ใหม่ - เริ่มต้นทุก block เป็น Available และใช้ layout เดียวกัน
  const [parkingSpots, setParkingSpots] = useState({
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
  });

  const handleContextMenu = (e, spot) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuSpot(spot);
    setShowContextMenu(true);
  };

  const handleStatusChange = (newStatus) => {
    if (contextMenuSpot) {
      setParkingSpots(prev => ({
        ...prev,
        [contextMenuSpot.id.charAt(0)]: prev[contextMenuSpot.id.charAt(0)].map(spot =>
          spot.id === contextMenuSpot.id ? { ...spot, status: newStatus } : spot
        )
      }));
    }
    setShowContextMenu(false);
  };

  const handleClickOutside = () => {
    setShowContextMenu(false);
  };

  return (
    <div className="space-y-8">
      {/* Parking Spots Grid - Redesign ใหม่ */}
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
