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

const ListActivities = ({
  setAttTable,
  activities,
  handleAddActivitie,
}: PropsListActivities) => {
  const [open, setOpen] = useState(false);

  if (handleAddActivitie && setAttTable)
    return (
      <Card className='grid grid-cols-4 w-full gap-5 overflow-y-auto max-h-[280px] min-h-[280px]'>
        {activities
          .sort((a, b) => {
            if (a.classification === 'VAA' && b.classification !== 'VAA')
              return -1;
            if (a.classification !== 'VAA' && b.classification === 'VAA')
              return 1;
            return a.id - b.id;
          })
          .map((item, index) => (
            <Button
              size={'full'}
              className=' relative '
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
    );

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className=' w-fit text-start flex items-center gap-1 underline  rounded-md py-2 px-5'>
        Atividades
        {open ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
      </CollapsibleTrigger>
      <CollapsibleContent className=' py-1 grid grid-cols-4 w-full gap-5 overflow-y-auto max-h-[220px]'>
        {activities
          .sort((a, b) => {
            if (a.classification === 'VAA' && b.classification !== 'VAA')
              return -1;
            if (a.classification !== 'VAA' && b.classification === 'VAA')
              return 1;
            return a.id - b.id;
          })
          .map((item, index) => (
            <div
              className=' relative border rounded-md w-full text-center border-border p-2'
              key={`${item.id}-${index}`}
            >
              {item.name.length >= 30
                ? `${item.name.slice(0, 30)}...`
                : item.name}
            </div>
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ListActivities;
