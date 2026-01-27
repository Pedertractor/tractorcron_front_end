import { editStrikeZone } from '../db/db-functions';
import { seedStrikeZone } from '../seed/seed-strikezone';
import Button from './ui/button/button';

export interface PropsStrikeZoneComponent {
  activitieStrikeZoneId: number | undefined;
  activitieId: number;
  setAttTable?: (props: boolean) => void;
}

const StrikeZoneComponent = ({
  activitieStrikeZoneId,
  activitieId,
  setAttTable,
}: PropsStrikeZoneComponent) => {
  return seedStrikeZone.map((item, index) => (
    <Button
      type='button'
      key={`${item.id}-${index}`}
      className={`
        ${item.id === activitieStrikeZoneId ? 'opacity-100 text-white' : ' opacity-30'}
        ${item.name === 'A' ? 'bg-green-600' : item.name === 'B' ? 'bg-yellow-600' : 'bg-red-600'}
        `}
      onClick={() => editStrikeZone(activitieId, item.id, setAttTable)}
    >
      {item.name}
    </Button>
  ));
};

export default StrikeZoneComponent;
