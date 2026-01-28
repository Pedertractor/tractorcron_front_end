import { editGoldenZone } from '../db/db-functions';
import { seedGoldenZone } from '../seed/seed-goldenzone';
import Button from './ui/button/button';

export interface PropsGoldenZoneComponent {
  activitieGoldenZoneId: number | undefined;
  activitieId: number;
  setAttTable?: (props: boolean) => void;
}
const GoldenZoneComponent = ({
  activitieGoldenZoneId,
  activitieId,
  setAttTable,
}: PropsGoldenZoneComponent) => {
  return seedGoldenZone.map((item, index) => (
    <Button
      type='button'
      key={`${item.id}-${index}`}
      className={`
        ${item.id === activitieGoldenZoneId ? 'opacity-100 text-white' : ' opacity-30'}
        ${item.name === 'AA' ? 'bg-green-600' : item.name === 'A' ? ' bg-blue-600' : item.name === 'B' ? 'bg-yellow-600' : item.name === 'C' ? 'bg-orange-600' : 'bg-red-600'}
        `}
      onClick={() => {
        editGoldenZone(activitieId, item.id, setAttTable);
      }}
    >
      {item.name}
    </Button>
  ));
};

export default GoldenZoneComponent;
