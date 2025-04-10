
import { NavLink } from 'react-router-dom';
import { Home, Activity, Award, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNav = () => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10 px-2">
      <div className="flex items-center justify-around">
        <NavItem to="/" icon={<Home className="w-5 h-5" />} label="Home" />
        <NavItem to="/progress" icon={<Activity className="w-5 h-5" />} label="Progress" />
        <NavItem to="/badges" icon={<Award className="w-5 h-5" />} label="Badges" />
        <NavItem to="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
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
        flex flex-col items-center justify-center py-3 px-4 min-h-[56px]
        ${isActive ? 'text-primary' : 'text-gray-500'}
      `}
    >
      {({ isActive }) => (
        <>
          <div className={`${isActive ? 'bg-primary/10 text-primary' : ''} p-2 rounded-full`}>
            {icon}
          </div>
          <span className="text-xs mt-1 font-medium">{label}</span>
          {isActive && <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full" />}
        </>
      )}
    </NavLink>
  );
};

export default MobileNav;
