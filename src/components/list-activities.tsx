import type { RegisterPresetActivities } from '../db/db';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Card from './ui/card/card';
import Button from './ui/button/button';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

export interface PropsListActivities {
  setAttTable?: (props: boolean) => void;
  activities: RegisterPresetActivities[];
  handleAddActivitie?: (
    name: string,
    activitieId: number,
    setAttTable: (props: boolean) => void,
  ) => void;
}

const sortActivities = (activities: RegisterPresetActivities[]) =>
  [...activities].sort((a, b) => {
    if (a.classification === 'VAA' && b.classification !== 'VAA') return -1;
    if (a.classification !== 'VAA' && b.classification === 'VAA') return 1;
    return a.id - b.id;
  });

const ListActivities = ({
  setAttTable,
  activities,
  handleAddActivitie,
}: PropsListActivities) => {
  const [open, setOpen] = useState(false);
  const sortedActivities = sortActivities(activities);

  if (handleAddActivitie && setAttTable)
    return (
      <>
        <Card className='hidden w-full grid-cols-4 gap-5 overflow-y-auto max-h-[280px] min-h-[280px] md:grid'>
          {sortedActivities.map((item, index) => (
            <Button
              size={'full'}
              className='relative'
              key={`${item.id}-${index}`}
              onClick={() => {
                handleAddActivitie(item.name, item.id, setAttTable);
              }}
            >
              {item.name.length >= 30
                ? `${item.name.slice(0, 30)}...`
                : item.name}
            </Button>
          ))}
        </Card>

        <Card className='grid w-full grid-cols-2 gap-3 overflow-y-auto max-h-[10.5rem] min-h-[10.5rem] md:hidden'>
          {sortedActivities.map((item, index) => (
            <Button
              size={'full'}
              className='relative text-xs'
              key={`mobile-${item.id}-${index}`}
              onClick={() => {
                handleAddActivitie(item.name, item.id, setAttTable);
              }}
            >
              {item.name.length >= 22
                ? `${item.name.slice(0, 22)}...`
                : item.name}
            </Button>
          ))}
        </Card>
      </>
    );

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className='flex w-fit items-center gap-1 rounded-md px-5 py-2 text-start underline'>
        Atividades
        {open ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
      </CollapsibleTrigger>
      <CollapsibleContent className='grid w-full grid-cols-2 gap-2 overflow-y-auto py-1 max-h-[16rem] md:grid-cols-4 md:gap-5 md:max-h-[220px]'>
        {sortedActivities.map((item, index) => (
          <div
            className='relative flex min-h-[2.75rem] w-full items-center justify-center rounded-md border border-border p-2 text-center text-xs leading-snug break-words md:min-h-0 md:text-sm'
            key={`${item.id}-${index}`}
          >
            <span className='line-clamp-2'>{item.name}</span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ListActivities;
