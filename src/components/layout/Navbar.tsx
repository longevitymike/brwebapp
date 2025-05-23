import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Activity, Award, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="hidden md:flex fixed top-0 left-0 h-full w-16 bg-background dark:bg-sidebar shadow-lg flex-col items-center justify-center gap-8 z-10">
      <NavItem to="/dashboard" icon={<Home className="w-6 h-6" />} label="Home" />
      <NavItem to="/dashboard/progress" icon={<Activity className="w-6 h-6" />} label="Progress" />
      <NavItem to="/dashboard/badges" icon={<Award className="w-6 h-6" />} label="Badges" />
      <NavItem to="/dashboard/settings" icon={<Settings className="w-6 h-6" />} label="Settings" />
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        relative flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200
        ${isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'}
      `}
      title={label}
    >
      {({ isActive }) => (
        <>
          {icon}
          {isActive && (
            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full" />
          )}
        </>
      )}
    </NavLink>
  );
};

export default Navbar;
