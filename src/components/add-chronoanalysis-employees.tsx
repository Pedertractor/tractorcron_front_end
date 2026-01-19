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
    <Card text='Informe o(s) colaborador(es)' className='flex mt-5 relative'>
      <div className=' absolute top-2 right-3 flex items-center justify-center gap-3 p-1 px-2 border border-border rounded-lg'>
        <Users size={22} className=' text-background-base-blue-select' />
        <span className=' font-medium'>{employeeList.length}</span>
      </div>
      <div className=' flex gap-4 w-full items-center justify-center'>
        <Label title='Cartão' className=' relative h-25'>
          <CheckRequestStatus
            data={employeeData}
            loading={isLoadingEmployee}
            status={isStatusEmployee}
            disabled={isDisabled}
          />
          <div className=' flex items-center gap-0.5 w-full'>
            <Button
              type='button'
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
        </Label>
      </div>
      <div className=' grid grid-cols-4 gap-3 '>
        {employeeList.map((item, index) => (
          <div
            key={index}
            className=' border border-border rounded-lg p-3 px-5 flex items-center justify-between gap-5 cursor-pointer relative'
            onClick={() => {
              if (employeeList.length > 1) removeEmployee(item.employeeId);
              else toast.info('Você precisa ter pelo menos um colaborador!');
            }}
          >
            {employeeList.length > 1 && (
              <CircleXIcon
                size={20}
                className=' absolute bottom-14 left-70 bg-red-200 text-red-700 rounded-full'
              />
            )}

            <IdCardLanyard
              size={30}
              className=' text-background-base-blue-select'
            />
            <div className=' justify-center gap-1 flex-col flex w-full'>
              <p className=' text-sm'>
                {item.employeeName && item.employeeName.length > 20
                  ? `${item.employeeName?.slice(0, 20)}...`
                  : item.employeeName}
              </p>
              <div className='flex items-center justify-between text-sm  w-4/5'>
                <p className=' font-semibold'>{item.employeeCardNumber}</p>
                <p>{item.employeeUnit}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AddChronoanalysisEmployee;
