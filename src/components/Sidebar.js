import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  FileText, 
  Settings 
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'allotment', label: 'Allotment', icon: Car },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'report', label: 'Report', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-80 bg-sidebar-dark text-white flex flex-col">
      {/* Logo */}
      <div className="p-8 border-b border-gray-600">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
          <span className="text-primary-yellow font-bold text-2xl">P</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-4 px-6 py-4 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-gray-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={24} />
                  <span className="font-semibold text-lg">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
