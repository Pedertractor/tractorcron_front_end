import { useState } from 'react';
import { Link } from 'react-router';

import Icon from '@/components/ui/icon';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import logoLittle from '@/assets/logo/icon-logo.svg?react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role] = useState(() => localStorage.getItem('role'));
  const [name] = useState(() => localStorage.getItem('name'));
  const [email] = useState(() => localStorage.getItem('email'));

  return (
    <Sidebar
      collapsible='icon'
      className='border-border bg-white'
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild tooltip='Tcron'>
              <Link to='/'>
                <div className='flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-background-base-blue'>
                  <Icon svg={logoLittle} className='size-5' />
                </div>
                <div className='grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden'>
                  <span className='truncate text-sm font-semibold text-initial'>
                    Tcron
                  </span>
                  <span className='truncate text-xs text-secondary'>
                    sistema para cronoanálise
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain role={role} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser name={name} email={email} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
