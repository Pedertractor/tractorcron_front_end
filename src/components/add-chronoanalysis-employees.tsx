import Button from './ui/button/button';
import Card from './ui/card/card';
import Input from './ui/input';
import Label from './ui/label/label';
import { useEffect, useState } from 'react';
import { useEmployee } from '@/hooks/use-employees';
import CheckRequestStatus from './check-request-status';
import { CircleXIcon, IdCardLanyard, Users } from 'lucide-react';
import { toast } from 'sonner';

export interface EmployeeProps {
  employeeId: number | undefined;
  employeeUnit: 'PEDERTRACTOR' | 'TRACTOR' | undefined | string;
  employeeName: undefined | string;
  employeeCardNumber: undefined | string;
}

const AddChronoanalysisEmployee = ({
  employeeList,
  setEmployeeList,
}: {
  employeeList: EmployeeProps[];
  setEmployeeList: React.Dispatch<React.SetStateAction<EmployeeProps[]>>;
}) => {
  const [employee, setEmployee] = useState<EmployeeProps>({
    employeeId: undefined,
    employeeUnit: undefined,
    employeeName: undefined,
    employeeCardNumber: undefined,
  });

  const {
    employeeData,
    isLoading: isLoadingEmployee,
    isStatus: isStatusEmployee,
    isDisabled,
  } = useEmployee(employee.employeeUnit, employee.employeeCardNumber);

  useEffect(() => {
    if (
      isStatusEmployee &&
      !isLoadingEmployee &&
      employeeData &&
      employeeData.id &&
      employeeData.cardNumber &&
      employeeData.unit
    ) {
      const alreadyExists = employeeList.some(
        (emp) => emp.employeeId === employeeData.id,
      );

      if (!alreadyExists) {
        setEmployeeList((prev) => [
          ...prev,
          {
            employeeId: employeeData.id,
            employeeUnit: employeeData.unit,
            employeeName: employeeData.name,
            employeeCardNumber: employeeData.cardNumber,
          },
        ]);
      }

      setEmployee({
        employeeId: undefined,
        employeeUnit: undefined,
        employeeName: undefined,
        employeeCardNumber: '',
      });
    }
  }, [
    employeeData,
    employeeList,
    isLoadingEmployee,
    isStatusEmployee,
    setEmployeeList,
  ]);

  function removeEmployee(employeeId: number | undefined) {
    setEmployeeList((prev) =>
      prev.filter((item) => item.employeeId !== employeeId),
    );
  }

  return (
    <Card
      text='Informe o(s) colaborador(es)'
      className='relative mt-3 flex sm:mt-5 [&>h2]:pr-14 sm:[&>h2]:pr-0'
    >
      <div className='absolute top-2 right-2 flex items-center justify-center gap-1.5 rounded-lg border border-border p-1 px-1.5 sm:top-2 sm:right-3 sm:gap-3 sm:px-2'>
        <Users
          size={18}
          className='text-background-base-blue-select sm:h-[22px] sm:w-[22px]'
        />
        <span className='text-xs font-medium sm:text-sm'>{employeeList.length}</span>
      </div>
      <div className=' flex gap-4 w-full items-center justify-center'>
        <Label title='Cartão' className='relative sm:h-25'>
          <CheckRequestStatus
            data={employeeData}
            loading={isLoadingEmployee}
            status={isStatusEmployee}
            disabled={isDisabled}
          >
            <div className='flex w-full items-center gap-0.5'>
              <Button
                type='button'
                size={' md-desk'}
                className='h-9 w-9 shrink-0 p-0 text-sm'
                variant={`${
                  employee.employeeUnit === 'PEDERTRACTOR'
                    ? 'select-blue'
                    : 'default'
                }`}
                onClick={() =>
                  setEmployee((prev) => ({
                    ...prev,
                    employeeUnit: 'PEDERTRACTOR',
                  }))
                }
              >
                P
              </Button>
              <Button
                type='button'
                size={' md-desk'}
                className='h-9 w-9 shrink-0 p-0 text-sm'
                variant={`${
                  employee.employeeUnit === 'TRACTOR' ? 'select-blue' : 'default'
                }`}
                onClick={() =>
                  setEmployee((prev) => ({
                    ...prev,
                    employeeUnit: 'TRACTOR',
                  }))
                }
              >
                T
              </Button>
              <Input
                disabled={!employee.employeeUnit ? true : false}
                className='w-full'
                maxLength={4}
                inputMode='numeric'
                placeholder='ex: 0072 | ex: 5532'
                value={employee.employeeCardNumber ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmployee((prev) => ({
                    ...prev,
                    employeeCardNumber: e.target.value,
                  }))
                }
              />
            </div>
          </CheckRequestStatus>
        </Label>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
        {employeeList.map((item, index) => (
          <div
            key={index}
            className='relative flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border p-2 sm:gap-5 sm:p-3 sm:px-5'
            onClick={() => {
              if (employeeList.length > 1) removeEmployee(item.employeeId);
              else toast.info('Você precisa ter pelo menos um colaborador!');
            }}
          >
            {employeeList.length > 1 && (
              <CircleXIcon
                size={16}
                className='absolute -right-1.5 -top-1.5 rounded-full bg-red-200 text-red-700 sm:-right-2 sm:-top-2 sm:h-5 sm:w-5'
              />
            )}

            <IdCardLanyard
              size={22}
              className='shrink-0 text-background-base-blue-select sm:h-[30px] sm:w-[30px]'
            />
            <div className='flex w-full min-w-0 flex-col justify-center gap-0.5'>
              <p className='line-clamp-2 text-xs leading-tight sm:text-sm'>
                {item.employeeName}
              </p>
              <div className='flex w-full items-center justify-between gap-2 text-xs sm:text-sm'>
                <p className='font-semibold'>{item.employeeCardNumber}</p>
                <p className='truncate text-[10px] sm:text-xs'>{item.employeeUnit}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AddChronoanalysisEmployee;
