import { BarChart3, Clock, Users, type LucideIcon } from 'lucide-react';
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
  {
    title: 'Usuários',
    url: '/admin/usuarios',
    icon: Users,
    rolePermition: ['ADMIN'],
  },
] as const satisfies ReadonlyArray<{
  title: string;
  url: string;
  icon: LucideIcon;
  rolePermition: readonly ('ADMIN' | 'CHRONOANALIST' | 'USER')[];
}>;

export function NavMain({ role }: { role: string | null }) {
  const { pathname } = useLocation();

  const visibleItems = navItems.filter(
    (item) =>
      role &&
      (item.rolePermition as readonly string[]).includes(role),
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
