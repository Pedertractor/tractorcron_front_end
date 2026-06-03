import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email({ message: 'Informe um e-mail válido.' }),
  password: z
    .string()
    .min(2, { message: 'A senha deve ter pelo menos 2 caracteres.' }),
  cardNumber: z
    .string()
    .min(4, { message: 'Informe o cartão com 4 dígitos.' })
    .max(4, { message: 'Informe o cartão com 4 dígitos.' }),
  unit: z.enum(['PEDERTRACTOR', 'TRACTOR'], {
    required_error: 'Selecione a unidade.',
  }),
  role: z.enum(['ADMIN', 'USER', 'CHRONOANALIST'], {
    required_error: 'Selecione o papel do usuário.',
  }),
});

export type TypeCreateUser = z.infer<typeof createUserSchema>;
