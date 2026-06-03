import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { UserListItem, UserRole } from '@/types/user-types';
import { format, parseISO } from 'date-fns';

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  USER: 'Usuário',
  CHRONOANALIST: 'Cronoanalista',
};

const ROLE_BADGE_CLASS: Record<UserRole, string> = {
  ADMIN: 'border-transparent bg-background-blue text-white',
  CHRONOANALIST: 'border-transparent bg-background-base-blue text-initial',
  USER: 'border-transparent bg-muted text-muted-foreground',
};

interface TableUsersProps {
  items: UserListItem[];
  loading: boolean;
}

function UserRoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge variant='default' className={cn(ROLE_BADGE_CLASS[role])}>
      {ROLE_LABELS[role]}
    </Badge>
  );
}

function TableSkeleton() {
  return (
    <>
      <div className='space-y-3 md:hidden'>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className='h-24 w-full' />
        ))}
      </div>
      <div className='hidden space-y-3 md:block'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className='h-10 w-full' />
        ))}
      </div>
    </>
  );
}

function UsersMobileList({ items }: { items: UserListItem[] }) {
  return (
    <ul className='space-y-3 md:hidden'>
      {items.map((user) => (
        <li
          key={user.id}
          className='rounded-lg border border-border/20 bg-background p-4'
        >
          <div className='flex items-start justify-between gap-3'>
            <p className='min-w-0 text-sm leading-snug font-medium'>
              {user.employeeName}
            </p>
            <UserRoleBadge role={user.role} />
          </div>
          <p className='text-muted-foreground mt-2 text-sm break-all'>
            {user.email}
          </p>
          <div className='text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs'>
            <span>Cartão: {user.employeeId}</span>
            <span>
              Cadastro: {format(parseISO(user.createdAt), 'dd/MM/yyyy')}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

const TableUsers = ({ items, loading }: TableUsersProps) => {
  if (loading) {
    return <TableSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-border/25 bg-muted/10 px-4 py-12 text-center'>
        <p className='text-sm font-medium'>Nenhum usuário registrado</p>
        <p className='text-muted-foreground mt-1 text-sm'>
          Cadastre o primeiro usuário clicando em &quot;Novo usuário&quot;.
        </p>
      </div>
    );
  }

  return (
    <>
      <UsersMobileList items={items} />

      <div className='hidden md:block'>
        <Table>
          <TableHeader className='[&_tr]:border-border/20'>
            <TableRow className='border-border/20 hover:bg-transparent'>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Cartão</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Cadastro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((user) => (
              <TableRow
                key={user.id}
                className='border-border/20 hover:bg-muted/20'
              >
                <TableCell className='font-medium'>{user.employeeName}</TableCell>
                <TableCell className='text-muted-foreground max-w-[240px] truncate'>
                  {user.email}
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {user.employeeId}
                </TableCell>
                <TableCell>
                  <UserRoleBadge role={user.role} />
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {format(parseISO(user.createdAt), 'dd/MM/yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TableUsers;
