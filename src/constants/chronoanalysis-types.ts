export type ChronoanalysisTypeValue =
  | 'SOLDAGEM'
  | 'MONTAGEM'
  | 'DOBRA'
  | 'USINAGEM'
  | 'PREP_PINTURA'
  | 'REPASSE_DE_ROSCA'
  | 'OUTROS';

export type TypeOfChronoanalysisFrontend =
  | 'welding'
  | 'montage'
  | 'bend'
  | 'machining'
  | 'prepPainting'
  | 'repasseRosca';

export const CHRONOANALYSIS_TYPE_OPTIONS: {
  value: ChronoanalysisTypeValue;
  label: string;
}[] = [
  { value: 'SOLDAGEM', label: 'Soldagem' },
  { value: 'MONTAGEM', label: 'Montagem' },
  { value: 'DOBRA', label: 'Dobra' },
  { value: 'USINAGEM', label: 'Usinagem' },
  { value: 'PREP_PINTURA', label: 'Prep. pintura' },
  { value: 'REPASSE_DE_ROSCA', label: 'Repasse de rosca' },
  { value: 'OUTROS', label: 'Outros' },
];

const FRONTEND_TO_DB: Record<
  TypeOfChronoanalysisFrontend,
  ChronoanalysisTypeValue
> = {
  welding: 'SOLDAGEM',
  montage: 'MONTAGEM',
  bend: 'DOBRA',
  machining: 'USINAGEM',
  prepPainting: 'PREP_PINTURA',
  repasseRosca: 'REPASSE_DE_ROSCA',
};

const DB_TO_FRONTEND: Record<
  ChronoanalysisTypeValue,
  TypeOfChronoanalysisFrontend | null
> = {
  SOLDAGEM: 'welding',
  MONTAGEM: 'montage',
  DOBRA: 'bend',
  USINAGEM: 'machining',
  PREP_PINTURA: 'prepPainting',
  REPASSE_DE_ROSCA: 'repasseRosca',
  OUTROS: null,
};

export function mapTypeOfChronoanalysisToDb(
  typeOfChronoanalysis: string,
): ChronoanalysisTypeValue {
  return (
    FRONTEND_TO_DB[typeOfChronoanalysis as TypeOfChronoanalysisFrontend] ??
    'OUTROS'
  );
}

export function mapTypeOfChronoanalysisFromDb(
  value: string,
): TypeOfChronoanalysisFrontend {
  return (
    DB_TO_FRONTEND[value as ChronoanalysisTypeValue] ?? 'welding'
  );
}

export function getChronoanalysisTypeLabel(
  value: ChronoanalysisTypeValue,
): string {
  return (
    CHRONOANALYSIS_TYPE_OPTIONS.find((option) => option.value === value)
      ?.label ?? value
  );
}

const FRONTEND_TYPE_LABELS: Record<TypeOfChronoanalysisFrontend, string> = {
  welding: 'Soldagem',
  montage: 'Montagem',
  bend: 'Dobra',
  machining: 'Usinagem',
  prepPainting: 'Prep. pintura',
  repasseRosca: 'Repasse de rosca',
};

export function getTypeOfChronoanalysisFrontendLabel(
  typeOfChronoanalysis: string,
): string {
  if (typeOfChronoanalysis in FRONTEND_TYPE_LABELS) {
    return FRONTEND_TYPE_LABELS[
      typeOfChronoanalysis as TypeOfChronoanalysisFrontend
    ];
  }

  return getChronoanalysisTypeLabel(
    typeOfChronoanalysis as ChronoanalysisTypeValue,
  );
}
