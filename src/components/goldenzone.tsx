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
      variant={item.id === activitieGoldenZoneId ? 'select-blue' : 'base-blue'}
      onClick={() => {
        editGoldenZone(activitieId, item.id, setAttTable);
      }}
    >
      {item.name}
    </Button>
  ));
};

export default GoldenZoneComponent;
