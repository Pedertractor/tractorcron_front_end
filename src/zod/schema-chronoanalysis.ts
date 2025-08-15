import { z } from 'zod';

export const initialInformationsSchema = z.object({
  id: z.string().optional(),
  employeeId: z.number().optional(),
  employeeName: z.string().min(4),
  employeeCardNumber: z
    .string()
    .min(4, 'Cartão obrigatório')
    .max(4, 'Precisamos apenas dos 4 dígitos')
    .regex(/^\d{4}$/, 'O cartão precisar ser em numeros!'),
  sectorId: z.number().optional(),
  sectorName: z.string().min(4),
  sectorCostCenter: z
    .string()
    .min(4, 'Centro de custo obrigatório')
    .max(4, 'Precisamos apenas dos 4 dígitos')
    .regex(/^\d{4}$/, 'O c.c precisar ser em numeros!'),
  employeeUnit: z.string().optional(),
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  of: z.string().min(1, 'OF obrigatório'),
  op: z.string().min(1, 'OP obrigatório'),
  sop: z.boolean(),
  revision: z.string().min(1, 'Revisão obrigatória'),
  internalCode: z
    .string()
    .min(1, 'Código interno obrigatório')
    .max(10, 'O código interno está com muitas informações'),
  partNumber: z.string().min(4, 'Part Number obrigatório'),
});

export type TypeInitialInformationsData = z.infer<
  typeof initialInformationsSchema
>;

export const filterChronoanalysis = z.object({
  partNumber: z.string().optional(),
  of: z.string().optional(),
  unit: z.string().optional(),
  cardNumber: z.string().optional(),
  costCenter: z.string().optional(),
  dataRange: z
    .object({
      to: z.string().optional(),
      from: z.string().optional(),
    })
    .optional(),
  userChronoanalistId: z.string().optional(),
  clientId: z.string().optional(),
});

export type TypeFilterChronoanalysis = z.infer<typeof filterChronoanalysis>;
