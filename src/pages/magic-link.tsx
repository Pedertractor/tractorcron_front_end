import {
  getInformationsForMagicLink,
  MagicLinkResponse,
} from '@/api/magic-link-api';
import { ChartBarDefault } from '@/components/chart-bar';
import { CharPieDefault } from '@/components/chart-pie';
import GoldenZoneClassification from '@/components/golden-zone-classification';
import LabelActivitieInfo from '@/components/label-activities-info';
import StrikeZoneClassification from '@/components/strike-zone-classification';
import TableActivities from '@/components/table-activities';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Text from '@/components/ui/text';
import { Cog, IdCardLanyard, Send, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';

const MagickLinkPage = () => {
  const [report, setReport] = useState<null | MagicLinkResponse>(null);

  const { uuid } = useParams();

  useEffect(() => {
    if (!uuid) return;
    const supportGetInformationsForMagickLink = async () => {
      const { data, error, status } = await getInformationsForMagicLink(uuid);

      if (!status) {
        toast.info(error);
        return;
      }

      setReport(data);
    };

    supportGetInformationsForMagickLink();
  }, [uuid]);

  if (report)
    return (
      <section className=' w-full p-5  h-full'>
        <Text variant={'title'}>Revisão da cronoanálise</Text>
        <div className=' border-border p-5 h-full'>
          <div className=' flex items-center justify-between  h-full'>
            <LabelActivitieInfo text='ID' textInfo={report.chronoanalysis.id} />
            <span className=' flex items-center gap-4'>
              <LabelActivitieInfo
                text='Iniciado'
                textInfo={new Date(
                  report.chronoanalysis.startDate,
                ).toLocaleTimeString()}
                secondTextInfo={new Date(
                  report.chronoanalysis.startDate,
                ).toLocaleDateString()}
              />
              <LabelActivitieInfo
                text='Finalizado'
                textInfo={new Date(
                  report.chronoanalysis.endDate,
                ).toLocaleTimeString()}
                secondTextInfo={new Date(
                  report.chronoanalysis.endDate,
                ).toLocaleDateString()}
              />
              <LabelActivitieInfo
                text='Tempo decimal'
                textInfo={report.chronoanalysis.workPaceAssessment.standardTimeDecimal.toString()}
              />
            </span>
            <span className=' flex items-center justify-center gap-2.5  py-1 px-1.5 rounded-md'>
              <span className='text-zinc-900 font-semibold'>KAIZEN</span>
              <Checkbox checked={report.chronoanalysis.isKaizen} />
            </span>
            <span className=' flex items-center justify-center gap-1'>
              <Label className=' flex items-center justify-center gap-2.5 py-2 px-1.5 rounded-md '>
                <Send size={20} className='text-zinc-900' />
                <Checkbox checked={report.chronoanalysis.isSend} />
              </Label>
            </span>
          </div>
          <div className=' flex flex-col w-full gap-2 overflow-y-auto py-1'>
            <div className=' flex flex-col  gap-3 border border-border rounded-lg  relative px-4 py-5'>
              <div className=' absolute top-2 right-2 flex items-center justify-center gap-5'>
                <div className=' flex items-center justify-center border border-border py-1 px-3 rounded-lg gap-2'>
                  <Cog
                    size={22}
                    className=' text-background-base-blue-select'
                  />
                  <p>{report.chronoanalysis.howManyParts}</p>
                </div>
              </div>

              <h3 className=' text-initial font-semibold'>
                Informações das peças
              </h3>
              <div className=' flex items-center justify-between'>
                <div className=' flex flex-col text-sm gap-1  text-initial'>
                  <p className='font-semibold'>Part number</p>
                  <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                    {report.chronoanalysis.partNumber}
                  </span>
                </div>
                <div className=' flex gap-1'>
                  <div className=' flex flex-col text-sm gap-1  text-initial'>
                    <p className='font-semibold'>Revisão</p>
                    <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                      {report.chronoanalysis.revision}
                    </span>
                  </div>
                  <div className=' flex flex-col text-sm gap-1  text-initial'>
                    <p className='font-semibold'>Código interno</p>
                    <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                      {report.chronoanalysis.internalCode}
                    </span>
                  </div>
                </div>

                <div className=' flex flex-col text-sm gap-1  text-initial'>
                  <p className='font-semibold'>Ordem de fabricação (OF)</p>
                  <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                    {report.chronoanalysis.of}
                  </span>
                </div>
                <div className=' flex gap-1'>
                  <div className=' flex flex-col text-sm gap-1  text-initial'>
                    <p className='font-semibold'>SOP</p>
                    <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                      {report.chronoanalysis.sop ? 'existe' : 'não existe'}
                    </span>
                  </div>
                  <div className=' flex flex-col text-sm gap-1  text-initial'>
                    <p className='font-semibold'>OP</p>
                    <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                      {report.chronoanalysis.op}
                    </span>
                  </div>
                </div>

                <div className=' flex flex-col text-sm gap-1  text-initial'>
                  <p className='font-semibold'>Cliente</p>
                  <span className=' text-center rounded-lg border border-border py-1 px-2 '>
                    {report.chronoanalysis.client.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className=' flex flex-col  gap-3 border border-border rounded-lg  p-4 w-full relative'>
            <div className=' absolute top-2 right-2 flex items-center justify-center gap-3 py-1 px-3  border border-border rounded-lg'>
              {report.chronoanalysis.chronoanalysisEmployee.length > 1 ? (
                <Users
                  size={22}
                  className=' text-background-base-blue-select'
                />
              ) : (
                <User size={22} className=' text-background-base-blue-select' />
              )}
              <span className=' font-medium'>
                {report.chronoanalysis.chronoanalysisEmployee.length}
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
                    {report.chronoanalysis.user.employeeName}
                  </span>
                </div>
                <div className=' flex flex-col gap-1 w-full'>
                  <p className='font-semibold text-sm'>Setor</p>
                  <div className=' flex items-center gap-1'>
                    <div className=' flex items-center text-sm gap-1  text-initial'>
                      <span className=' rounded-lg border border-border py-1 px-2 '>
                        {report.chronoanalysis.sectorCostCenter}
                      </span>
                    </div>
                    <div className=' flex items-center text-sm gap-1  text-initial w-full'>
                      <span className=' rounded-lg border border-border py-1 px-2 w-full'>
                        {report.chronoanalysis.sectorName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className=' flex flex-col gap-1 w-full '>
                <p className='font-semibold text-sm'>
                  {report.chronoanalysis.chronoanalysisEmployee.length > 1
                    ? 'Colaboradores cronometrados'
                    : 'Colaborador cronometrado'}
                </p>
                <div className='grid grid-cols-3 w-full gap-3'>
                  {report.chronoanalysis.chronoanalysisEmployee.map(
                    (employee) => (
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
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className=' flex flex-col w-full gap-2 my-4'>
            <h3 className=' text-initial font-semibold'>Atividades</h3>
            <TableActivities
              authFunc={false}
              allActivities={report.chronoanalysis.activities}
            />
          </div>
          <div className=' flex flex-col  gap-3 border border-border rounded-lg my-4 p-4'>
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
                        {report.chronoanalysis.workPaceAssessment.hability}
                      </span>
                    </div>
                    <div className=' flex items-center text-sm gap-1  text-initial'>
                      <span className=' rounded-lg border border-border py-1 px-2 '>
                        {
                          report.chronoanalysis.workPaceAssessment
                            .habilityPorcent
                        }
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <div className=' flex flex-col gap-1 '>
                  <p className='font-semibold text-sm'>Esforço</p>
                  <div className=' flex items-center gap-1'>
                    <div className=' flex items-center text-sm gap-1  text-initial'>
                      <span className=' rounded-lg border border-border py-1 px-2 '>
                        {report.chronoanalysis.workPaceAssessment.effort}
                      </span>
                    </div>
                    <div className=' flex items-center text-sm gap-1  text-initial'>
                      <span className=' rounded-lg border border-border py-1 px-2 '>
                        {report.chronoanalysis.workPaceAssessment.effortPorcent}
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <div className=' flex flex-col gap-1 '>
                  <p className='font-semibold text-sm'>Eficiência</p>
                  <div className=' flex items-center gap-1'>
                    <div className=' flex items-center text-sm gap-1  text-initial'>
                      <span className=' rounded-lg border border-border py-1 px-2 '>
                        {
                          report.chronoanalysis.workPaceAssessment
                            .efficiencyPorcent
                        }
                        %
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
                      {report.chronoanalysis.workPaceAssessment.timeCalculate}
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
                        {report.chronoanalysis.workPaceAssessment.standardTime}
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
                        {
                          report.chronoanalysis.workPaceAssessment
                            .standardTimeDecimal
                        }
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
                          report.chronoanalysis.workPaceAssessment
                            .standardTimeDecimalByNumberOfParts
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=' flex flex-col  gap-3 border border-border rounded-lg  h-full p-4'>
            <h3 className=' text-initial font-semibold'>
              Levantamento gráfico
            </h3>
            <div className=' h-fullflex flex-col items-center justify-center gap-2 w-full'>
              <div className='w-full h-[300px] p-2 border border-border rounded-lg mb-2'>
                <h4 className=' text-sm font-medium'>Descrição do movimento</h4>
                <ChartBarDefault
                  chartData={report.activitiesReport.activityNameChartData}
                  fill='var(--chart-2)'
                />
              </div>
              <div className=' flex items-center justify-center gap-2 w-full'>
                <div className=' w-1/2 h-full p-2 border border-border rounded-lg'>
                  <h4 className=' text-sm font-medium'>
                    Classificação do movimento
                  </h4>
                  <CharPieDefault
                    chartData={report.activitiesReport.classificationChartData}
                  />
                </div>

                <div className=' w-1/2 h-full p-2 border border-border rounded-lg'>
                  <h4 className=' text-sm font-medium'>Tipo do movimento</h4>

                  <ChartBarDefault
                    chartData={report.activitiesReport.typeMovementChartData}
                    fill='var(--chart-3)'
                  />
                </div>
              </div>
            </div>
            <div className=' flex items-center justify-center gap-2 w-full h-[340px]'>
              <div className=' w-full h-full p-2 border border-border rounded-lg '>
                <h4 className=' text-sm font-medium'>
                  Classificação Ergonomia do Movimento - ST
                </h4>
                <StrikeZoneClassification
                  totalStrikeZone={report.activitiesReport.totalStrikeZone}
                />
              </div>

              <div className=' w-full h-full p-2 border border-border rounded-lg'>
                <h4 className=' text-sm font-medium mb-5'>
                  Classificação Ergonomia do Movimento - GZ
                </h4>

                <GoldenZoneClassification
                  totalGoldenZone={report.activitiesReport.totalGoldenZone}
                />
              </div>
            </div>
          </div>
          {report.chronoanalysis.enhancement && (
            <div className=' flex flex-col  gap-3 border border-border rounded-lg  p-3 w-full'>
              <h3 className=' text-initial font-semibold'>
                Melhorias e observações
              </h3>
              <Label title=''>
                <textarea
                  defaultValue={report.chronoanalysis.enhancement ?? ''}
                  rows={8}
                  disabled
                  className=' p-3 border border-border rounded-xl text-secondary resize-none w-full max-h-35 overflow-y-auto '
                />
              </Label>
            </div>
          )}
        </div>
      </section>
    );
};

export default MagickLinkPage;
