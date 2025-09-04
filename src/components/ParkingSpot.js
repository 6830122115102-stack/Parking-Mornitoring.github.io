import React from 'react';

const ParkingSpot = ({ spot, onContextMenu, isUpdating = false }) => {

  const getSpotStyle = () => {
    if (isUpdating) {
      return 'bg-yellow-400 border-yellow-500 animate-pulse';
    }
    if (spot.status === 'occupied') {
      return 'bg-blue-800 border-blue-800';
    }
    return 'bg-white border-gray-300';
  };

  const getLabelStyle = () => {
    return 'bg-gray-100 border-gray-300 text-gray-700';
  };

  const renderSpotContent = () => {
    const idBox = (
      <div className={`w-20 h-10 border-2 rounded-lg flex items-center justify-center transition-all ${getLabelStyle()}`}>
        <span className="text-sm font-semibold">{spot.id}</span>
      </div>
    );

    const carBox = (
      <button
        onContextMenu={onContextMenu}
        disabled={isUpdating}
        className={`w-16 h-10 rounded-lg border-2 transition-all hover:scale-105 flex items-center justify-center cursor-pointer hover:shadow-md disabled:cursor-not-allowed disabled:hover:scale-100 ${getSpotStyle()}`}
      >
        {/* แสดง car.png เฉพาะเมื่อสถานะเป็น Occupied */}
        {spot.status === 'occupied' && !isUpdating && (
          <img 
            src="/images/car.png" 
            alt="Car" 
            className="w-5 h-5 filter brightness-0 invert" 
          />
        )}
        {/* แสดง loading indicator เมื่อกำลังอัปเดต */}
        {isUpdating && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
      </button>
    );

    // สลับตำแหน่งตาม layout
    if (spot.layout === 'icon-left') {
      return (
        <>
          {carBox}
          {idBox}
        </>
      );
    } else {
      return (
        <>
          {idBox}
          {carBox}
        </>
      );
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {renderSpotContent()}
    </div>
  );
};

export default ParkingSpot;
