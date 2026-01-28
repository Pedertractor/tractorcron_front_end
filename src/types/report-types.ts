export interface ReportProps {
  costCenterInformations: { costcenter: string; value: number }[];
  clientsInformations: { name: string; value: number }[];
  groupTotalByMonth: {
    month: string;
    totalTimeSeconds: number;
    goalSeconds: number;
  }[];
  totalTimeGoals: string;
  totalTime: string;
  totalProcess: number;
  porcent: string;
}
