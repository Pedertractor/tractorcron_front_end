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
import { Image, Send } from 'lucide-react';
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
                text='Tempo total'
                textInfo={chronoanalysis.workPaceAssessment.timeCalculate}
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
          <div className=' flex flex-col  gap-3 border border-border rounded-lg p-2 relative'>
            <Button
              onClick={() => setIsOpenImage(!isOpenImage)}
              type='button'
              size={'icon'}
              disabled={
                !isStatusPart || isLoadingPart || !partData ? true : false
              }
              className={`absolute top-2 right-2  
                ${
                  !isStatusPart || isLoadingPart || (!partData ? true : false)
                    ? 'border border-dashed border-border bg-white opacity-30'
                    : 'bg-background-blue transition hover:bg-background-base-blue cursor-pointer'
                }`}
            >
              <Image />
            </Button>
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

          <div className=' flex flex-col  gap-3 border border-border rounded-lg p-2'>
            <h3 className=' text-initial font-semibold'>
              Informações de execução
            </h3>
            <div className=' flex items-center justify-between'>
              <div className=' flex flex-col text-sm gap-1 text-initial'>
                <p className='font-semibold'>Cronoanalista</p>
                <span className=' rounded-lg border border-border py-1 px-2 '>
                  {chronoanalysis.user.employeeName}
                </span>
              </div>
              <div className=' flex flex-col gap-1 '>
                <p className='font-semibold text-sm'>Setor</p>
                <div className=' flex items-center gap-1'>
                  <div className=' flex items-center text-sm gap-1  text-initial'>
                    <span className=' rounded-lg border border-border py-1 px-2 '>
                      {chronoanalysis.sectorCostCenter}
                    </span>
                  </div>
                  <div className=' flex items-center text-sm gap-1  text-initial'>
                    <span className=' rounded-lg border border-border py-1 px-2 '>
                      {chronoanalysis.sectorName}
                    </span>
                  </div>
                </div>
              </div>

              <div className=' flex flex-col gap-1 '>
                <p className='font-semibold text-sm'>
                  Colaborador cronometrado
                </p>
                <div className=' flex items-center gap-1'>
                  <div className=' flex items-center text-sm gap-1  text-initial'>
                    <span className=' rounded-lg border border-border py-1 px-2 '>
                      {chronoanalysis.employeeUnit.slice(0, 1)}
                    </span>
                  </div>
                  <div className=' flex items-center text-sm gap-1  text-initial'>
                    <span className=' rounded-lg border border-border py-1 px-2 '>
                      {chronoanalysis.employeeCardNumber}
                    </span>
                  </div>
                  <div className=' flex items-center text-sm gap-1  text-initial'>
                    <span className=' rounded-lg border border-border py-1 px-2 '>
                      {chronoanalysis.employeeName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=' flex flex-col  gap-2  p-2'>
            <h3 className=' text-initial font-semibold'>Atividades</h3>
            <TableActivities
              authFunc={false}
              allActivities={chronoanalysis.activities}
            />
          </div>

          <div className=' flex flex-col  gap-3 border border-border rounded-lg p-2'>
            <h3 className=' text-initial font-semibold'>
              Avaliação de ritimo de trabalho
            </h3>
            <div className=' flex items-center justify-between'>
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
              <div className=' flex flex-col gap-1 '>
                <p className='font-semibold text-sm text-green-700'>
                  Tempo padrão
                </p>
                <div className=' flex items-center gap-1'>
                  <div className=' flex items-center text-sm gap-1  text-green-700'>
                    <span className=' rounded-lg border border-green-50 py-1 px-2 bg-green-100'>
                      {chronoanalysis.workPaceAssessment.standardTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=' flex flex-col  gap-3 border border-border rounded-lg p-2'>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetail;
