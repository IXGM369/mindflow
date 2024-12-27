import { 
  LayoutDashboard, 
  Focus, 
  BookOpenCheck, 
  Settings,
  Calendar,
  BookOpen,
  Lightbulb,
  BarChart3,
  FileBox
} from 'lucide-react';

export const routes = [
  {
    path: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    path: '/focus',
    icon: Focus,
    label: 'Daily Focus',
  },
  {
    path: '/calendar',
    icon: Calendar,
    label: 'Calendar',
  },
  {
    path: '/insights',
    icon: Lightbulb,
    label: 'Insights',
  },
  {
    path: '/analytics',
    icon: BarChart3,
    label: 'Analytics',
  },
  {
    path: '/knowledge',
    icon: BookOpen,
    label: 'Knowledge Base',
  },
  {
    path: '/resources',
    icon: FileBox,
    label: 'Resources',
  },
  {
    path: '/review',
    icon: BookOpenCheck,
    label: 'Weekly Review',
  },
  {
    path: '/settings',
    icon: Settings,
    label: 'Settings',
  },
];