import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Você precisa inserir um email válido!' }),
  password: z.string().min(2, { message: 'Porfavor preencha o campo senha' }),
});

export type TypeLogin = z.infer<typeof loginSchema>;
