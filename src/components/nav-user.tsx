import { Cog, ChevronsUpDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const avatarBgClasses = [
  'bg-background-default-active text-initial',
  'bg-background-blue-active text-white',
  'bg-background-red-active text-white',
  'bg-background-green-active text-white',
  'bg-background-orange-active text-white',
] as const;

function getAvatarClass(name: string) {
  const index = name.charCodeAt(0) % avatarBgClasses.length;
  return avatarBgClasses[index];
}

function logout(navigate: ReturnType<typeof useNavigate>) {
  localStorage.removeItem('email');
  localStorage.removeItem('name');
  localStorage.removeItem('role');
  localStorage.removeItem('token');
  localStorage.removeItem('startTime');
  localStorage.removeItem('endTime');
  navigate('/login');
}

export function NavUser({
  name,
  email,
}: {
  name: string | null;
  email: string | null;
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  if (!name) {
    return null;
  }

  const displayName = name.length > 7 ? `${name.slice(0, 7)}.` : name;
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='bg-white hover:bg-zinc-50 data-[state=open]:bg-white data-[state=open]:text-initial'
            >
              <Avatar className='size-8 rounded-lg'>
                <AvatarFallback
                  className={cn('rounded-lg text-sm font-semibold', getAvatarClass(name))}
                >
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold text-initial'>{displayName}</span>
                <span className='truncate text-xs text-secondary'>{email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border border-border bg-white text-initial shadow-md'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='size-8 rounded-lg'>
                  <AvatarFallback
                    className={cn('rounded-lg text-sm font-semibold', getAvatarClass(name))}
                  >
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{displayName}</span>
                  <span className='truncate text-xs text-muted-foreground'>{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2'>
              <Cog className='size-4' />
              configurações
            </DropdownMenuItem>
            <DropdownMenuItem
              className='gap-2'
              onClick={() => logout(navigate)}
            >
              <LogOut className='size-4' />
              sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
