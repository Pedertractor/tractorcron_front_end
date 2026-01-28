export interface ReportProps {
  costCenterInformations: { costcenter: string; value: number }[];
  clientsInformations: { name: string; value: number }[];
  groupTotalByMonth: {
    month: string;
    totalTimeSeconds: number;
    goalSeconds: number;
  }[];
  totalTime: string;
  totalProcess: number;
}
