import Card from './ui/card/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import {
  changeSendStatus,
  exportPDFReport,
  listChronoanalysisProps,
} from '@/api/chronoanalysis-api';
import { Checkbox } from './ui/checkbox';
import { Download, EyeIcon, Users } from 'lucide-react';
import { toast } from 'sonner';

export interface TableChronoanalysisProps {
  data: listChronoanalysisProps[];
  PagesLength?: number;
  currentPage?: number;
  handlePageChange?: (value: number) => void;
  totalPages?: number;
  setIsChronoanalysis?: (item: listChronoanalysisProps | undefined) => void;
  setIsOpenModal?: (props: boolean) => void;
}

const TableChronoanalysis = ({
  data,
  PagesLength,
  currentPage,
  handlePageChange,
  totalPages,
  setIsChronoanalysis,
  setIsOpenModal,
}: TableChronoanalysisProps) => {
  async function onChangeChangeSendStatus(id: string) {
    const { status, message } = await changeSendStatus(id);

    if (status === 200) {
      toast.success(message);
      window.location.reload();
      return;
    }

    toast.error(message);
  }
  async function handleDownloadReport(uuid: string) {
    const { blob, status } = await exportPDFReport(uuid);

    if (status === 200) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cronoanalise_${uuid}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      return;
    }

    toast.error('Erro ao baixar relatório');
  }

  if (setIsChronoanalysis && setIsOpenModal)
    return (
      <Card>
        <div className=' overflow-y-auto rounded-md'>
          <Table>
            <TableCaption>lista das cronoanálises</TableCaption>
            <TableHeader>
              <TableRow className=' border-zinc-50 bg-zinc-200 rounded-lg'>
                <TableHead>Part number</TableHead>
                <TableHead>Código interno</TableHead>
                <TableHead>OP</TableHead>
                <TableHead>Cronoanalista</TableHead>
                <TableHead>
                  <Users size={18} />
                </TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tempo Padrão</TableHead>
                <TableHead>Data</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow
                  key={item.id}
                  className=' border-border text-sm text-initial transition hover:bg-zinc-100 '
                >
                  <TableCell>{item.partNumber}</TableCell>
                  <TableCell>{item.internalCode}</TableCell>
                  <TableCell>{item.op}</TableCell>
                  <TableCell>
                    {item.user.employeeName.toLowerCase().slice(0, 15)}...
                  </TableCell>
                  <TableCell className=''>
                    {item.chronoanalysisEmployee.length}
                  </TableCell>
                  <TableCell>{item.client.name.toLowerCase()}</TableCell>
                  <TableCell>
                    {item.workPaceAssessment.standardTimeDecimal}
                  </TableCell>

                  <TableCell>
                    {new Date(item.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className=' z-10'>
                    <Checkbox
                      className=' cursor-pointer'
                      checked={item.isSend}
                      onCheckedChange={() => onChangeChangeSendStatus(item.id)}
                    />
                  </TableCell>
                  <TableCell
                    className=' cursor-pointer '
                    onClick={() => handleDownloadReport(item.id)}
                  >
                    <Download size={18} className=' text-zinc-800' />
                  </TableCell>
                  <TableCell
                    className=' cursor-pointer '
                    onClick={() => {
                      setIsChronoanalysis(item);
                      setIsOpenModal(true);
                    }}
                  >
                    <EyeIcon size={18} className=' text-zinc-800' />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {currentPage && handlePageChange && totalPages ? (
            <div className=' mt-5 px-2 flex items-center justify-center'>
              <span className=' p-1.5 px-3 flex items-center text-xs justify-center w-15 border border-border rounded-lg text-secondary font-medium'>
                {PagesLength}
              </span>
              <Pagination className=''>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? 'opacity-50 pointer-events-none'
                          : ''
                      }
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: totalPages > 10 ? totalPages / 2 : totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href='#'
                        isActive={page === currentPage}
                        onClick={() => {
                          handlePageChange(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {totalPages > 10 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href='#'
                      onClick={() => {
                        if (currentPage < totalPages)
                          handlePageChange(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? 'opacity-50 pointer-events-none'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <p className=' p-1.5 px-3 flex items-center justify-center w-25 border border-border rounded-lg text-secondary text-xs font-medium'>{`${currentPage}${' '}/${' '}${totalPages}`}</p>
            </div>
          ) : null}
        </div>
      </Card>
    );
};

export default TableChronoanalysis;
