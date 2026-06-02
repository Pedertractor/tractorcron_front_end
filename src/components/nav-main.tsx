import { BarChart3, Clock, type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export const navItems = [
  {
    title: 'Nova Cronoanálise',
    url: '/cronoanalise',
    icon: Clock,
    rolePermition: ['ADMIN', 'CHRONOANALIST'],
  },
  {
    title: 'Analisar Cronoanálise',
    url: '/relatorio',
    icon: BarChart3,
    rolePermition: ['ADMIN', 'CHRONOANALIST'],
  },
] as const;

export function NavMain({ role }: { role: string | null }) {
  const { pathname } = useLocation();

  const visibleItems = navItems.filter(
    (item) => role && item.rolePermition.includes(role as 'ADMIN' | 'CHRONOANALIST')
  );

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navegação</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) => (
          <NavMainItem key={item.url} item={item} pathname={pathname} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavMainItem({
  item,
  pathname,
}: {
  item: (typeof navItems)[number];
  pathname: string;
}) {
  const Icon = item.icon as LucideIcon;
  const isActive =
    pathname === item.url || pathname.startsWith(`${item.url}/`);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
        <Link to={item.url}>
          <Icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
