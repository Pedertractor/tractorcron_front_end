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
import { getPaginationRange } from '@/lib/pagination';
import {
  changeSendStatus,
  type ChronoanalysisListItem,
} from '@/api/chronoanalysis-api';
import { Checkbox } from './ui/checkbox';
import {
  Copy,
  CopyCheck,
  Edit,
  EyeIcon,
  LoaderCircle,
  Trash2,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const url = import.meta.env.VITE_URL_FRONT_END_URL;

export interface TableChronoanalysisProps {
  data: ChronoanalysisListItem[];
  role: string | null;
  loading?: boolean;
  PagesLength?: number;
  currentPage?: number;
  handlePageChange?: (value: number) => void;
  totalPages?: number;
  onOpenDetail?: (id: string) => void;
  onSendStatusChange?: () => void;
  setIsOpenModalEdit?: (props: boolean) => void;
  setIsIdChrono?: (props: string | null) => void;
  setIsOpenModalDelete?: (props: boolean) => void;
}

const TableChronoanalysis = ({
  data,
  role,
  loading,
  PagesLength,
  currentPage,
  handlePageChange,
  totalPages,
  onOpenDetail,
  onSendStatusChange,
  setIsOpenModalEdit,
  setIsIdChrono,
  setIsOpenModalDelete,
}: TableChronoanalysisProps) => {
  const [copied, setCopied] = useState('');

  async function onChangeChangeSendStatus(id: string) {
    const { status, message } = await changeSendStatus(id);

    if (status === 200) {
      toast.success(message);
      onSendStatusChange?.();
      return;
    }

    toast.error(message);
  }

  async function handleCopy(uuid: string) {
    const text = `${url}/${uuid}`;
    const textarea = document.createElement('textarea');
    textarea.value = text;

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  if (onOpenDetail && setIsIdChrono && setIsOpenModalEdit && setIsOpenModalDelete)
    return (
      <Card className='gap-2'>
        <div
          className={`relative overflow-x-auto rounded-md ${
            loading ? 'min-h-[120px]' : ''
          }`}
        >
          {loading && (
            <div
              className='absolute inset-0 z-10 flex items-center justify-center rounded-md bg-white/75'
              aria-busy='true'
              aria-live='polite'
            >
              <div className='flex items-center gap-2'>
                <div className='animate-spin text-secondary rounded-full'>
                  <LoaderCircle size={15} />
                </div>
                <span className='text-secondary text-xs font-medium'>
                  Carregando cronoanálises...
                </span>
              </div>
            </div>
          )}
          <Table className={loading ? 'pointer-events-none opacity-50' : undefined}>
            <TableCaption className='sr-only'>
              lista das cronoanálises
            </TableCaption>
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
                <TableHead>Tempo Decimal</TableHead>
                <TableHead>Tempo D./Nº Peças</TableHead>

                <TableHead>Data</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
                {role && role === 'ADMIN' && (
                  <>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                  </>
                )}

                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow
                  key={item.id}
                  className=' border-border text-sm text-initial '
                >
                  <TableCell>{item.partNumber}</TableCell>
                  <TableCell>{item.internalCode}</TableCell>
                  <TableCell>{item.op}</TableCell>
                  <TableCell>
                    {item.user.employeeName.length > 15
                      ? `${item.user.employeeName.toLowerCase().slice(0, 15)}...`
                      : item.user.employeeName.toLowerCase()}
                  </TableCell>
                  <TableCell className=''>
                    {item.chronoanalysisEmployee.length}
                  </TableCell>
                  <TableCell>{item.client.name?.toLowerCase()}</TableCell>
                  <TableCell className=' px-12'>
                    {item.workPaceAssessment?.standardTimeDecimal ?? '-'}
                  </TableCell>
                  <TableCell className=' px-12'>
                    {item.workPaceAssessment
                      ?.standardTimeDecimalByNumberOfParts ?? '-'}
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
                    onClick={() => onOpenDetail(item.id)}
                  >
                    <EyeIcon size={18} className=' text-zinc-800' />
                  </TableCell>
                  {role && role === 'ADMIN' && (
                    <>
                      <TableCell
                        className=' cursor-pointer '
                        onClick={() => {
                          setIsIdChrono(item.id);
                          setIsOpenModalEdit(true);
                        }}
                      >
                        <Edit size={18} className=' text-zinc-800' />
                      </TableCell>
                      <TableCell
                        className=' cursor-pointer '
                        onClick={() => {
                          setIsIdChrono(item.id);
                          setIsOpenModalDelete(true);
                        }}
                      >
                        <Trash2
                          size={18}
                          className=' text-red-800  rounded-sm'
                        />
                      </TableCell>
                    </>
                  )}

                  <TableCell
                    className=' cursor-pointer '
                    onClick={() => {
                      handleCopy(item.id);
                      setCopied(item.id);
                    }}
                  >
                    {copied === item.id ? (
                      <CopyCheck size={18} className=' text-zinc-800' />
                    ) : (
                      <Copy size={18} className=' text-zinc-800' />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {currentPage && handlePageChange && totalPages ? (
            <div
              className={`mt-3 px-2 flex flex-wrap items-center justify-center gap-2 max-w-full ${
                loading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
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

                  {getPaginationRange(currentPage, totalPages).map(
                    (item, index) =>
                      item === 'ellipsis' ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={item}>
                          <PaginationLink
                            href='#'
                            isActive={item === currentPage}
                            onClick={() => {
                              handlePageChange(item);
                            }}
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                      ),
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
