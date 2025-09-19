import {
  changeSendStatus,
  type listChronoanalysisProps,
} from '@/api/chronoanalysis-api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TableActivities from './table-activities';
import LabelActivitieInfo from './label-activities-info';
import { useEffect, useState } from 'react';
import {
  activitiesDataChartsProps,
  getActivitiesDataCharts,
} from '@/api/activities-api';
import { toast } from 'sonner';
import { ChartBarDefault } from './chart-bar';
import Loading from './loading';
import { CharPieDefault } from './chart-pie';
import { useParts } from '@/hooks/use-parts';
import { Button } from './ui/button';
import { Cog, IdCardLanyard, Image, Send, User, Users } from 'lucide-react';
import ModalImage from './modal-image';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

export interface ModalDetailProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  chronoanalysis: listChronoanalysisProps;
}

const ModalDetail = ({ open, setOpen, chronoanalysis }: ModalDetailProps) => {
  const [isLoading, setIsloading] = useState(false);
  const [dataGraph, setDataGraph] = useState<
    activitiesDataChartsProps | undefined
  >(undefined);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const {
    isLoading: isLoadingPart,
    isStatus: isStatusPart,
    partData,
  } = useParts(chronoanalysis.internalCode);

  useEffect(() => {
    const supportGetDatasForGraph = async () => {
      const { data, error, status } = await getActivitiesDataCharts(
        chronoanalysis.id,
        setIsloading
      );

      if (!status) {
        toast.info(error);
      }

      if (status) {
        setDataGraph(data);
      }
    };

    supportGetDatasForGraph();
  }, [chronoanalysis.id]);

  async function onChangeChangeSendStatus(id: string) {
    const { status, message } = await changeSendStatus(id);

    if (status === 200) {
      toast.success(message);
      window.location.reload();
      return;
    }

    toast.error(message);
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <DialogContent className=' bg-white border-none flex flex-col'>
        {isOpenImage && (
          <ModalImage
            openModal={isOpenImage}
            setOpenModal={setIsOpenImage}
            partData={partData}
          />
        )}
        <DialogHeader className=' h-fit'>
          <DialogTitle>Revisão da cronoanálise</DialogTitle>
          <DialogDescription className=' flex justify-between items-center'>
            <LabelActivitieInfo text='ID' textInfo={chronoanalysis.id} />
            <span className=' flex items-center gap-4'>
              <LabelActivitieInfo
                text='Iniciado'
                textInfo={new Date(
                  chronoanalysis.startDate
                ).toLocaleTimeString()}
                secondTextInfo={new Date(
                  chronoanalysis.startDate
                ).toLocaleDateString()}
              />
              <LabelActivitieInfo
                text='Finalizado'
                textInfo={new Date(chronoanalysis.endDate).toLocaleTimeString()}
                secondTextInfo={new Date(
                  chronoanalysis.endDate
                ).toLocaleDateString()}
              />
              <LabelActivitieInfo
                text='Tempo decimal'
                textInfo={chronoanalysis.workPaceAssessment.standardTimeDecimal.toString()}
              />
            </span>
            <span className=' flex items-center justify-center gap-2.5  py-1 px-1.5 rounded-md'>
              <span className='text-zinc-900 font-semibold'>KAIZEN</span>
              <Checkbox checked={chronoanalysis.isKaizen} />
            </span>
            <span className=' flex items-center justify-center gap-1'>
              <Label className=' flex items-center justify-center gap-2.5 py-2 px-1.5 rounded-md hover:bg-zinc-50 transition cursor-pointer'>
                <Send size={20} className='text-zinc-900' />
                <Checkbox
                  className=' cursor-pointer'
                  checked={chronoanalysis.isSend}
                  onCheckedChange={() =>
                    onChangeChangeSendStatus(chronoanalysis.id)
                  }
                />
              </Label>
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className=' flex flex-col w-full gap-2 overflow-y-auto py-1'>
          <div className=' flex flex-col  gap-3 border border-border rounded-lg  relative px-4 py-5'>
            <div className=' absolute top-2 right-2 flex items-center justify-center gap-5'>
              <div className=' flex items-center justify-center border border-border py-1 px-3 rounded-lg gap-2'>
                <Cog size={22} className=' text-background-base-blue-select' />
                <p>{chronoanalysis.howManyParts}</p>
              </div>
              <Button
                onClick={() => setIsOpenImage(!isOpenImage)}
                type='button'
                size={'icon'}
                disabled={
                  !isStatusPart || isLoadingPart || !partData ? true : false
                }
                className={`
                ${
                  !isStatusPart || isLoadingPart || (!partData ? true : false)
                    ? 'border border-dashed border-border bg-white opacity-30'
                    : 'bg-background-blue transition hover:bg-background-base-blue cursor-pointer'
                }`}
              >
                <Image />
              </Button>
            </div>

            <h3 className=' text-initial font-semibold'>
              Informações das peças
            </h3>
            <div className=' flex items-center justify-between'>
              <div className=' flex flex-col text-sm gap-1  text-initial'>
                <p className='font-semibold'>Part number</p>
                <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                  {chronoanalysis.partNumber}
                </span>
              </div>
              <div className=' flex gap-1'>
                <div className=' flex flex-col text-sm gap-1  text-initial'>
                  <p className='font-semibold'>Revisão</p>
                  <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                    {chronoanalysis.revision}
                  </span>
                </div>
                <div className=' flex flex-col text-sm gap-1  text-initial'>
                  <p className='font-semibold'>Código interno</p>
                  <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                    {chronoanalysis.internalCode}
                  </span>
                </div>
              </div>

              <div className=' flex flex-col text-sm gap-1  text-initial'>
                <p className='font-semibold'>Ordem de fabricação (OF)</p>
                <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                  {chronoanalysis.of}
                </span>
              </div>
              <div className=' flex gap-1'>
                <div className=' flex flex-col text-sm gap-1  text-initial'>
                  <p className='font-semibold'>SOP</p>
                  <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                    {chronoanalysis.sop ? 'existe' : 'não existe'}
                  </span>
                </div>
                <div className=' flex flex-col text-sm gap-1  text-initial'>
                  <p className='font-semibold'>OP</p>
                  <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                    {chronoanalysis.op}
                  </span>
                </div>
              </div>

              <div className=' flex flex-col text-sm gap-1  text-initial'>
                <p className='font-semibold'>Cliente</p>
                <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                  {chronoanalysis.client.name}
                </span>
              </div>
            </div>
          </div>

          <div className=' flex flex-col  gap-3 border border-border rounded-lg  p-4 w-full relative'>
            <div className=' absolute top-2 right-2 flex items-center justify-center gap-3 py-1 px-3  border border-border rounded-lg'>
              {chronoanalysis.chronoanalysisEmployee.length > 1 ? (
                <Users
                  size={22}
                  className=' text-background-base-blue-select'
                />
              ) : (
                <User size={22} className=' text-background-base-blue-select' />
              )}
              <span className=' font-medium'>
                {chronoanalysis.chronoanalysisEmployee.length}
              </span>
            </div>
            <h3 className=' text-initial font-semibold'>
              Informações de execução
            </h3>
            <div className=' flex flex-col justify-center gap-3'>
              <div className=' flex items-center justify-center gap-3 w-full'>
                <div className=' flex flex-col text-sm gap-1 text-initial  w-full'>
                  <p className='font-semibold'>Cronoanalista</p>
                  <span className=' rounded-lg border border-border py-1 px-2 '>
                    {chronoanalysis.user.employeeName}
                  </span>
                </div>
                <div className=' flex flex-col gap-1 w-full'>
                  <p className='font-semibold text-sm'>Setor</p>
                  <div className=' flex items-center gap-1'>
                    <div className=' flex items-center text-sm gap-1  text-initial'>
                      <span className=' rounded-lg border border-border py-1 px-2 '>
                        {chronoanalysis.sectorCostCenter}
                      </span>
                    </div>
                    <div className=' flex items-center text-sm gap-1  text-initial w-full'>
                      <span className=' rounded-lg border border-border py-1 px-2 w-full'>
                        {chronoanalysis.sectorName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className=' flex flex-col gap-1 w-full '>
                <p className='font-semibold text-sm'>
                  {chronoanalysis.chronoanalysisEmployee.length > 1
                    ? 'Colaboradores cronometrados'
                    : 'Colaborador cronometrado'}
                </p>
                <div className='grid grid-cols-3 w-full gap-3'>
                  {chronoanalysis.chronoanalysisEmployee.map((employee) => (
                    <div
                      key={employee.employeeId}
                      className=' border border-border rounded-xl p-3 px-5 flex items-center justify-between gap-5 w-full'
                    >
                      <IdCardLanyard
                        size={30}
                        className=' text-background-base-blue-select'
                      />
                      <div className=' justify-center gap-1 flex-col flex w-full'>
                        <p className=' text-sm'>
                          {employee.employeeName &&
                          employee.employeeName.length > 20
                            ? `${employee.employeeName}`
                            : employee.employeeName}
                        </p>
                        <div className='flex items-center justify-between text-sm  w-4/5'>
                          <p className=' font-semibold'>
                            {employee.employeeCardNumber}
                          </p>
                          <p>{employee.employeeUnit}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className=' flex flex-col  gap-2  p-4'>
            <h3 className=' text-initial font-semibold'>Atividades</h3>
            <TableActivities
              authFunc={false}
              allActivities={chronoanalysis.activities}
            />
          </div>

          <div className=' flex flex-col  gap-3 border border-border rounded-lg  p-4'>
            <h3 className=' text-initial font-semibold'>
              Avaliação de ritimo de trabalho
            </h3>
            <div className=' flex items-center justify-between'>
              <div className=' flex items-center justify-center gap-7'>
                <div className=' flex flex-col gap-1 '>
                  <p className='font-semibold text-sm'>Habilidade</p>
                  <div className=' flex items-center gap-1'>
                    <div className=' flex items-center text-sm gap-1  text-initial'>
                      <span className=' rounded-lg border border-border py-1 px-2 '>
                        {chronoanalysis.workPaceAssessment.hability}
                      </span>
                    </div>
                    <div className=' flex items-center text-sm gap-1  text-initial'>
                      <span className=' rounded-lg border border-border py-1 px-2 '>
                        {chronoanalysis.workPaceAssessment.habilityPorcent}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className=' flex flex-col gap-1 '>
                  <p className='font-semibold text-sm'>Esforço</p>
                  <div className=' flex items-center gap-1'>
                    <div className=' flex items-center text-sm gap-1  text-initial'>
                      <span className=' rounded-lg border border-border py-1 px-2 '>
                        {chronoanalysis.workPaceAssessment.effort}
                      </span>
                    </div>
                    <div className=' flex items-center text-sm gap-1  text-initial'>
                      <span className=' rounded-lg border border-border py-1 px-2 '>
                        {chronoanalysis.workPaceAssessment.effortPorcent}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className=' flex flex-col gap-1 '>
                  <p className='font-semibold text-sm'>Eficiência</p>
                  <div className=' flex items-center gap-1'>
                    <div className=' flex items-center text-sm gap-1  text-initial'>
                      <span className=' rounded-lg border border-border py-1 px-2 '>
                        {chronoanalysis.workPaceAssessment.efficiencyPorcent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className=' flex flex-col gap-1 '>
                <p className='font-semibold text-sm'>Tempo geral</p>
                <div className=' flex items-center gap-1'>
                  <div className=' flex items-center text-sm gap-1  text-initial'>
                    <span className=' rounded-lg border border-border py-1 px-2 '>
                      {chronoanalysis.workPaceAssessment.timeCalculate}
                    </span>
                  </div>
                </div>
              </div>
              <div className=' flex items-center justify-center gap-5'>
                <div className=' flex flex-col gap-1 '>
                  <p className='font-semibold text-sm text-green-700'>
                    Tempo padrão
                  </p>
                  <div className=' flex items-center gap-1'>
                    <div className=' flex items-center text-sm gap-1  text-green-700 w-full'>
                      <span className=' rounded-lg border border-green-50 py-1 px-2 bg-green-100 w-full text-center'>
                        {chronoanalysis.workPaceAssessment.standardTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className=' flex flex-col gap-1 '>
                  <p className='font-semibold text-sm text-green-700'>
                    Decimal
                  </p>
                  <div className=' flex items-center gap-1'>
                    <div className=' flex items-center text-sm gap-1  text-green-700 w-full'>
                      <span className=' rounded-lg border border-green-50 py-1 px-2 bg-green-100 w-full text-center'>
                        {chronoanalysis.workPaceAssessment.standardTimeDecimal}
                      </span>
                    </div>
                  </div>
                </div>
                <div className=' flex flex-col gap-1 '>
                  <p className='font-semibold text-sm text-green-700'>
                    Decimal / peças
                  </p>
                  <div className=' flex items-center gap-1'>
                    <div className=' flex items-center text-sm gap-1  text-green-700 w-full'>
                      <span className=' rounded-lg border border-green-50 py-1 px-2 bg-green-100 w-full text-center'>
                        {
                          chronoanalysis.workPaceAssessment
                            .standardTimeDecimalByNumberOfParts
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=' flex flex-col  gap-3 border border-border rounded-lg  p-4'>
            <h3 className=' text-initial font-semibold'>
              Levantamento gráfico
            </h3>
            <div className=' h-fullflex flex-col items-center justify-center gap-2 w-full'>
              <div className='w-full h-[300px] p-2 border border-border rounded-lg mb-2'>
                <h4 className=' text-sm font-medium'>Descrição do movimento</h4>
                {isLoading && <Loading />}
                {dataGraph && (
                  <ChartBarDefault
                    chartData={dataGraph.activityNameChartData}
                    fill='var(--chart-2)'
                  />
                )}
              </div>
              <div className=' flex items-center justify-center gap-2 w-full'>
                <div className=' w-1/2  p-2 border border-border rounded-lg'>
                  <h4 className=' text-sm font-medium'>
                    Classificação do movimento
                  </h4>
                  {isLoading && <Loading />}
                  {dataGraph && !isLoading && (
                    <CharPieDefault
                      chartData={dataGraph.classificationChartData}
                    />
                  )}
                </div>

                <div className=' w-1/2 p-2 border border-border rounded-lg'>
                  <h4 className=' text-sm font-medium'>Tipo do movimento</h4>
                  {isLoading && <Loading />}

                  {dataGraph && !isLoading && (
                    <ChartBarDefault
                      chartData={dataGraph.typeMovementChartData}
                      fill='var(--chart-3)'
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {chronoanalysis.enhancement && (
            <div className=' flex flex-col  gap-3 border border-border rounded-lg  p-3 w-full'>
              <h3 className=' text-initial font-semibold'>
                Melhorias e observações
              </h3>
              <Label title=''>
                <textarea
                  defaultValue={chronoanalysis.enhancement ?? ''}
                  rows={8}
                  disabled
                  className=' p-3 border border-border rounded-xl text-secondary resize-none w-full max-h-35 overflow-y-auto '
                />
              </Label>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetail;
