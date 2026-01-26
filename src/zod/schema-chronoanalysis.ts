import { z } from 'zod';

export const editInformationsSchema = z
  .object({
    id: z.string(),
    sectorId: z.number(),
    sectorName: z.string().min(4),
    sectorCostCenter: z
      .string()
      .min(4, 'Centro de custo obrigatório')
      .max(4, 'Precisamos apenas dos 4 dígitos')
      .regex(/^\d{4}$/, 'O c.c precisar ser em numeros!'),
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
    isRequest: z.boolean(),
    firstCron: z.boolean(),
    isKaizen: z.boolean(),
    numberKaizen: z.string().nullable().optional(),
    enhancement: z.string().nullable().optional(),
    howManyParts: z.number(),
  })
  .superRefine((data, ctx) => {
    if (data.isKaizen && !data.numberKaizen?.trim()) {
      ctx.addIssue({
        path: ['numberKaizen'],
        message: 'Número do Kaizen é obrigatório quando Kaizen está ativo',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type TypeEditInformations = z.infer<typeof editInformationsSchema>;

export const initialInformationsSchema = z.object({
  id: z.string().optional(),
  sectorId: z.number().optional(),
  sectorName: z.string().min(4),
  sectorCostCenter: z
    .string()
    .min(4, 'Centro de custo obrigatório')
    .max(4, 'Precisamos apenas dos 4 dígitos')
    .regex(/^\d{4}$/, 'O c.c precisar ser em numeros!'),
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
  typeOfChronoanalysis: z.string().min(1, 'Tipo de cronoanálise obrigatório'),
  isRequest: z.boolean(),
  firstCron: z.boolean(),
  isKaizen: z.boolean(),
  numberKaizen: z.string().optional(),
  enhancement: z.string().optional(),
});

export type TypeInitialInformationsData = z.infer<
  typeof initialInformationsSchema
>;

export const filterChronoanalysis = z.object({
  partNumber: z.string().optional(),
  internalCode: z.string().optional(),
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
  isKaizen: z.boolean(),
  isSend: z.boolean(),
});

export type TypeFilterChronoanalysis = z.infer<typeof filterChronoanalysis>;
