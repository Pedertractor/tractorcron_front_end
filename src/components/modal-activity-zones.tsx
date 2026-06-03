import type { RegisterActivities } from '@/db/db';
import { deleteActivitie } from '@/db/db-functions';
import TrashComponent from '@/assets/icons/trash-icon.svg?react';
import IconCheckComponent from '@/assets/icons/check-icon.svg?react';
import GoldenZoneComponent from './goldenzone';
import StrikeZoneComponent from './strikezone';
import Button from './ui/button/button';
import Text from './ui/text';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from './ui/icon';
import LoadingIcon2Component from '@/assets/icons/loading-icon-2.svg?react';

export interface ModalActivityZonesProps {
  activity: RegisterActivities | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setAttTable?: (props: boolean) => void;
  allowDelete?: boolean;
}

const ModalActivityZones = ({
  activity,
  open,
  onOpenChange,
  setAttTable,
  allowDelete = true,
}: ModalActivityZonesProps) => {
  if (!activity) return null;

  const handleDelete = () => {
    deleteActivitie(activity.id, setAttTable);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className='h-auto max-h-[90vh] w-[calc(100%-1.5rem)] max-w-md gap-4 overflow-y-auto border-0 p-4 shadow-xl sm:p-6'
      >
        <DialogHeader className='text-left'>
          <DialogTitle className='text-base font-semibold sm:text-lg'>
            {activity.name}
          </DialogTitle>
          <DialogDescription className='sr-only'>
            Defina a golden zone, strike zone ou exclua esta atividade.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-start gap-3'>
          <div className='grid w-full grid-cols-2 gap-3'>
            <div className='rounded-lg border border-border p-2 text-left'>
              <Text variant='text-label'>Hora início</Text>
              <Text variant='information' className='mt-1 block'>
                {new Date(activity.startTime).toLocaleTimeString()}
              </Text>
            </div>
            <div className='rounded-lg border border-border p-2 text-left'>
              <Text variant='text-label'>Hora fim</Text>
              <Text variant='information' className='mt-1 flex items-center gap-1'>
                {activity.endTime ? (
                  new Date(activity.endTime).toLocaleTimeString()
                ) : (
                  <Icon className='size-4' svg={LoadingIcon2Component} animate />
                )}
              </Text>
            </div>
          </div>

          <div className='flex w-full flex-col items-start gap-2'>
            <Text variant='text-label'>Golden zone</Text>
            <div className='flex w-full flex-nowrap items-center justify-start gap-2'>
              <GoldenZoneComponent
                activitieGoldenZoneId={activity.goldenZoneId}
                activitieId={activity.id}
                setAttTable={setAttTable}
                buttonClassName='!h-10 !w-10 !min-w-10 shrink-0 text-sm'
              />
            </div>
          </div>

          <div className='flex w-full flex-col items-start gap-2'>
            <Text variant='text-label'>Strike zone</Text>
            <div className='flex w-full flex-nowrap items-center justify-start gap-2'>
              <StrikeZoneComponent
                activitieStrikeZoneId={activity.strikeZoneId}
                activitieId={activity.id}
                setAttTable={setAttTable}
                buttonClassName='!h-10 !w-10 !min-w-10 shrink-0 text-sm'
              />
            </div>
          </div>

          <div className='flex w-full items-center justify-end gap-2 pt-2'>
            <Button
              type='button'
              svg={IconCheckComponent}
              variant='default'
              className='!h-9 !w-9 shrink-0 !bg-zinc-500 stroke-white text-white active:!bg-zinc-600'
              onClick={() => onOpenChange(false)}
              aria-label='Confirmar'
            />
            {allowDelete ? (
              <Button
                type='button'
                svg={TrashComponent}
                variant='red'
                className='!h-9 !w-9 shrink-0'
                onClick={handleDelete}
                aria-label='Excluir atividade'
              />
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalActivityZones;
