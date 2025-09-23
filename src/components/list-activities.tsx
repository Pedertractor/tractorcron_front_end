import type { RegisterPresetActivities } from '../db/db';
import Card from './ui/card/card';
import Button from './ui/button/button';

export interface PropsListActivities {
  setAttTable?: (props: boolean) => void;
  activities: RegisterPresetActivities[];
  handleAddActivitie?: (
    name: string,
    activitieId: number,
    setAttTable: (props: boolean) => void
  ) => void;
}

const ListActivities = ({
  setAttTable,
  activities,
  handleAddActivitie,
}: PropsListActivities) => {
  if (handleAddActivitie && setAttTable)
    return (
      <Card className='grid grid-cols-4 w-full gap-5 overflow-y-auto max-h-[280px] min-h-[280px]'>
        {activities.map((item, index) => (
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
    <div className=' py-1 grid grid-cols-4 w-full gap-5 overflow-y-auto max-h-[220px]'>
      {activities.map((item, index) => (
        <Button
          size={'full'}
          className=' relative '
          type='button'
          key={`${item.id}-${index}`}
        >
          {item.name.length >= 30 ? `${item.name.slice(0, 30)}...` : item.name}
        </Button>
      ))}
    </div>
  );
};

export default ListActivities;
