import { z } from 'zod';

export const chronoanalysisRequestSchema = z.object({
  employeeUnit: z.enum(['PEDERTRACTOR', 'TRACTOR'], {
    required_error: 'Unidade obrigatória',
  }),
  employeeCardNumber: z
    .string()
    .min(4, 'Cartão obrigatório')
    .max(4, 'Cartão deve ter 4 dígitos'),
  employeeEmail: z
    .string()
    .min(1, 'E-mail obrigatório')
    .email('Informe um e-mail válido'),
  sectorCostCenter: z
    .string()
    .min(4, 'Centro de custo obrigatório')
    .max(4, 'Centro de custo deve ter 4 dígitos'),
  sectorId: z.number({ required_error: 'Setor inválido' }),
  sectorName: z.string().min(1, 'Setor obrigatório'),
  internalCode: z
    .string()
    .min(6, 'Código interno obrigatório')
    .max(10, 'Código interno inválido'),
  partNumber: z.string().min(1, 'Part number obrigatório'),
  operation: z.string().min(1, 'Operação obrigatória'),
  manufacturingStartDate: z.string().min(1, 'Data de início obrigatória'),
  typeOfChronoanalysis: z.enum([
    'welding',
    'montage',
    'bend',
    'machining',
    'prepPainting',
    'repasseRosca',
  ]),
  productionTime: z.enum(['UNDER_3H', 'OVER_3H'], {
    required_error: 'Tempo de produção obrigatório',
  }),
  timingType: z.enum(['FIRST_CRON', 'KAIZEN', 'TIME_REVIEW'], {
    required_error: 'Tipo de cronometragem obrigatório',
  }),
  observation: z.string().optional(),
});

export type TypeChronoanalysisRequestData = z.infer<
  typeof chronoanalysisRequestSchema
>;
