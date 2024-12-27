import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Focus,
  BookOpenCheck,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  appName: string;
  appIcon: ReactNode;
  onNavigate?: () => void;
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/',
  },
  {
    icon: Focus,
    label: 'Daily Focus',
    path: '/focus',
  },
  {
    icon: BookOpenCheck,
    label: 'Weekly Review',
    path: '/review',
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
  },
];

export default function Sidebar({ appName, appIcon, onNavigate }: SidebarProps) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="flex items-center gap-2 p-6 border-b">
        <Link to="/" className="flex items-center gap-2" onClick={onNavigate}>
          {appIcon}
          <span className="font-semibold text-xl tracking-tight">{appName}</span>
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.label}>
                <Link to={item.path} onClick={onNavigate}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start h-10 font-medium',
                      isActive && 'bg-secondary'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}