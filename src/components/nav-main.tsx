import { BarChart3, Clock, ClipboardList, ListChecks, Users, type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
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
    title: 'Solicitações',
    url: '/solicitacoes',
    icon: ClipboardList,
    rolePermition: ['ADMIN', 'CHRONOANALIST'],
    isNew: true,
  },
  {
    title: 'Analisar Cronoanálise',
    url: '/relatorio',
    icon: BarChart3,
    rolePermition: ['ADMIN', 'CHRONOANALIST'],
  },
  {
    title: 'Atividades',
    url: '/admin/atividades',
    icon: ListChecks,
    rolePermition: ['ADMIN'],
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
  isNew?: boolean;
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
  const isNew = 'isNew' in item && item.isNew;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={isNew ? `${item.title} - novo!` : item.title}
        isActive={isActive}
      >
        <Link to={item.url}>
          <Icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
      {isNew ? (
        <SidebarMenuBadge className='h-4 min-w-0 rounded-full bg-background-orange px-1.5 text-[10px] font-semibold text-white group-data-[collapsible=icon]:top-1 group-data-[collapsible=icon]:right-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:size-1.5 group-data-[collapsible=icon]:min-w-1.5 group-data-[collapsible=icon]:p-0'>
          <span className='group-data-[collapsible=icon]:sr-only'>Novo</span>
        </SidebarMenuBadge>
      ) : null}
    </SidebarMenuItem>
  );
}
