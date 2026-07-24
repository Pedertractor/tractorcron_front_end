import { z } from 'zod';

export const createActivitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Informe o nome da atividade' })
    .max(80, { message: 'Nome muito longo' }),
  classification: z.enum(['VAA', 'NVAA', 'SVAA'], {
    required_error: 'Selecione a classificação',
  }),
  typeMovement: z.enum(
    [
      'SOLDAR',
      'MONTAR',
      'CAMINHAR',
      'LIMPAR',
      'AJUSTAR',
      'PEGAR',
      'RETRABALHAR',
      'INSPECIONAR',
      'IDENTIFICAR',
      'POSICIONAR',
      'DOBRAR',
      'USINAR',
      'MEDIR',
      'OUTROS',
      'MASCARAR',
      'CALAFETAR',
      'REPASAR',
      'CALIBRAR',
    ],
    { required_error: 'Selecione o tipo de movimento' },
  ),
  activityType: z.enum(
    [
      'SOLDAGEM',
      'MONTAGEM',
      'DOBRA',
      'USINAGEM',
      'PREP_PINTURA',
      'REPASSE_DE_ROSCA',
      'GERAL',
    ],
    { required_error: 'Selecione o tipo da atividade' },
  ),
});

export type TypeCreateActivity = z.infer<typeof createActivitySchema>;
