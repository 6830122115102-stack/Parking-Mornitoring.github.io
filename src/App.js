import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ParkingAllotment from './components/ParkingAllotment';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Report from './components/Report';
import Settings from './components/Settings';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {activeSection === 'dashboard' && (
            <Dashboard />
          )}
          {activeSection === 'allotment' && (
            <ParkingAllotment />
          )}
          {activeSection === 'users' && (
            <Users />
          )}
          {activeSection === 'report' && (
            <Report />
          )}
          {activeSection === 'settings' && (
            <Settings />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
