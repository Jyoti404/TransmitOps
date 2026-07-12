import { Role } from '../store/authStore';

export interface NavItem {
  label: string;
  path: string;
  roles: Role[]; 
}
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'],
  },
  { label: 'Fleet', path: '/vehicles', roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
  { label: 'Drivers', path: '/drivers', roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
  { label: 'Trips', path: '/trips', roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
  { label: 'Maintenance', path: '/maintenance', roles: ['FLEET_MANAGER'] },
  { label: 'Fuel & Expenses', path: '/fuel-expenses', roles: ['FLEET_MANAGER', 'DRIVER', 'FINANCIAL_ANALYST'] },
  { label: 'Analytics', path: '/reports', roles: ['FLEET_MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
  {
    label: 'Settings',
    path: '/settings',
    roles: ['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'],
  },
];

export const ROLE_LABELS: Record<Role, string> = {
  FLEET_MANAGER: 'Fleet Manager',
  DRIVER: 'Driver',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
};
