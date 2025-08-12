import type { RegisterPresetActivities } from '../db/db';
import Icon from './ui/icon';
import PinIconComponent from '../assets/icons/pin-icon.svg?react';
import Card from './ui/card/card';
import Button from './ui/button/button';

export interface PropsListActivities {
  setAttTable?: (props: boolean) => void;
  activities: RegisterPresetActivities[];
  setAttListPinedActivities?: (props: boolean) => void;
  pinedActivitie?: (
    presetActivitieId: number,
    setAttListPinedActivities: (props: boolean) => void
  ) => void;
  handleAddActivitie?: (
    name: string,
    activitieId: number,
    setAttTable: (props: boolean) => void
  ) => void;
}

const ListActivities = ({
  setAttTable,
  activities,
  setAttListPinedActivities,
  pinedActivitie,
  handleAddActivitie,
}: PropsListActivities) => {
  if (handleAddActivitie && setAttTable)
    return (
      <Card className='grid grid-cols-4 w-full gap-5 overflow-y-auto max-h-[280px] min-h-[280px]'>
        {activities
          .sort((a, b) => +b.liked - +a.liked)
          .map((item, index) => (
            <Button
              size={'full'}
              className=' relative '
              key={`${item.id}-${index}`}
              onClick={() => {
                handleAddActivitie(item.name, item.id, setAttTable);
              }}
            >
              {item.liked && (
                <div className=' absolute top-2 right-2 rotate-45'>
                  <Icon
                    svg={PinIconComponent}
                    className=' size-4 stroke-background-red fill-background-red-active'
                  />
                </div>
              )}
              {item.name.length >= 30
                ? `${item.name.slice(0, 30)}...`
                : item.name}
            </Button>
          ))}
      </Card>
    );

  if (pinedActivitie && setAttListPinedActivities)
    return (
      <div className=' py-1 grid grid-cols-4 w-full gap-5 overflow-y-auto max-h-[220px]'>
        {activities
          .sort((a, b) => +b.liked - +a.liked)
          .map((item, index) => (
            <Button
              size={'full'}
              className=' relative '
              type='button'
              key={`${item.id}-${index}`}
              onClick={() => {
                pinedActivitie(item.id, setAttListPinedActivities);
              }}
            >
              {item.liked && (
                <div className=' absolute top-2 right-2'>
                  <Icon
                    svg={PinIconComponent}
                    className=' size-4 stroke-background-red fill-background-red-active'
                  />
                </div>
              )}
              {item.name.length >= 30
                ? `${item.name.slice(0, 30)}...`
                : item.name}
            </Button>
          ))}
      </div>
    );
};

export default ListActivities;
