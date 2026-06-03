export interface listChronoanalistProps {
  id: number;
  employeeName: string;
  employeeId: number;
}

export type UserRole = 'ADMIN' | 'USER' | 'CHRONOANALIST';

export interface UserListItem {
  id: number;
  email: string;
  role: UserRole;
  employeeId: number;
  employeeName: string;
  createdAt: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  cardNumber: string;
  unit: 'PEDERTRACTOR' | 'TRACTOR';
  role: UserRole;
}
