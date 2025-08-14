import { findEmployee } from '@/api/employee-api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type EmployeeUniqueType = {
  id: number;
  name: string;
  cardNumber: string;
  unit: string;
  status: true;
  Designation: [
    {
      id: number;
      startDate: string;
      endDate: null;
      sector: {
        id: number;
        name: string;
        costCenter: string;
        normalizedName: string;
        createdAt: string;
        updatedAt: string;
      };
      position: {
        id: number;
        value: string;
        name: string;
        normalizedName: string;
        createdAt: string;
        updatedAt: string;
      };
      leader: {
        id: number;
        name: string;
        employeeId: number;
        createdAt: string;
        updatedAt: string;
      };
      createdAt: string;
      updatedAt: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
};

export function useEmployee(unit?: string, cardNumber?: string) {
  const [employeeData, setEmployeeData] = useState<null | EmployeeUniqueType>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isStatus, setIsStatus] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsDisabled(false);

    if (
      !unit ||
      !cardNumber ||
      (cardNumber && cardNumber.length < 4) ||
      !/^\d{4}$/.test(cardNumber)
    ) {
      setIsStatus(true);
      setEmployeeData(null);
      return;
    }

    if (cardNumber && unit) {
      setIsStatus(true);
      setIsLoading(true);
      const supportFindUniqueEmployee = async () => {
        const { status, message, data } = await findEmployee({
          cardNumber,
          unit,
        });

        if (!status) {
          setIsLoading(false);
          setIsStatus(false);
          setEmployeeData(null);
          return toast.error(message);
        }

        if (!data.status) {
          setIsLoading(false);
          setIsDisabled(true);
          return toast.info('Colaborador encontrado, porém desativado.');
        }

        setIsDisabled(false);
        setIsLoading(false);
        setEmployeeData(data);
      };

      supportFindUniqueEmployee();
    }
  }, [cardNumber, unit]);

  return {
    isStatus,
    isLoading,
    employeeData,
    isDisabled,
  };
}
