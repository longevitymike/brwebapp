
import { NavLink } from 'react-router-dom';
import { Home, Activity, Award, Settings } from 'lucide-react';

const MobileNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background dark:bg-sidebar shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10 px-2">
      <div className="flex items-center justify-around">
        <NavItem to="/" icon={<Home />} label="Home" />
        <NavItem to="/progress" icon={<Activity />} label="Progress" />
        <NavItem to="/badges" icon={<Award />} label="Badges" />
        <NavItem to="/settings" icon={<Settings />} label="Settings" />
      </div>
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
        flex flex-col items-center justify-center py-3 px-4
        ${isActive ? 'text-primary' : 'text-gray-500'}
      `}
    >
      {({ isActive }) => (
        <>
          <div className={`${isActive ? 'bg-primary/10 text-primary' : ''} p-2 rounded-full`}>
            {icon}
          </div>
          <span className="text-xs mt-1">{label}</span>
          {isActive && <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full" />}
        </>
      )}
    </NavLink>
  );
};

export default MobileNav;
