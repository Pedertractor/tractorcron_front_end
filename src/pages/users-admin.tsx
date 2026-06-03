import { listUsers } from '@/api/users-api';
import ModalCreateUser from '@/components/modal-create-user';
import TableUsers from '@/components/table-users';
import { Button } from '@/components/ui/button';
import type { UserListItem } from '@/types/user-types';
import { UserPlus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const UsersAdminPage = () => {
  const [items, setItems] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    const result = await listUsers();

    setLoading(false);

    if (!result.status) {
      toast.error(result.message);
      return;
    }

    setItems(result.data);
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return (
    <div className='flex flex-col gap-4 sm:gap-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-xl font-bold tracking-tight sm:text-2xl'>
            Usuários
          </h1>
          <p className='text-muted-foreground text-sm'>
            Gerencie os usuários registrados no sistema.
          </p>
        </div>
        <Button
          type='button'
          className='bg-background-blue hover:bg-background-blue-active w-full text-white sm:w-auto'
          onClick={() => setIsOpenModal(true)}
        >
          <UserPlus className='size-4' />
          Novo usuário
        </Button>
      </div>

      <TableUsers items={items} loading={loading} />

      <ModalCreateUser
        open={isOpenModal}
        setOpen={setIsOpenModal}
        onCreated={() => void fetchUsers()}
      />
    </div>
  );
};

export default UsersAdminPage;
