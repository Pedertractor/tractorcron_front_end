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
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  getChronoanalysisTypeLabel,
  type ChronoanalysisTypeValue,
} from '@/constants/chronoanalysis-types';
import {
  Copy,
  CopyCheck,
  Edit,
  EyeIcon,
  LoaderCircle,
  MoreVertical,
  Trash2,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const url = import.meta.env.VITE_URL_FRONT_END_URL;

interface ChronoanalysisRowActionsProps {
  itemId: string;
  role: string | null;
  copied: string;
  onOpenDetail: (id: string) => void;
  onOpenEdit: (id: string) => void;
  onOpenDelete: (id: string) => void;
  onCopy: (id: string) => void;
}

function ChronoanalysisRowActions({
  itemId,
  role,
  copied,
  onOpenDetail,
  onOpenEdit,
  onOpenDelete,
  onCopy,
}: ChronoanalysisRowActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function runAfterMenuClose(action: () => void) {
    setMenuOpen(false);
    window.setTimeout(action, 0);
  }

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon-sm'>
          <span className='sr-only'>Abrir menu de ações</span>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='min-w-40 rounded-lg border border-border bg-white shadow-md'
      >
        <DropdownMenuItem
          onSelect={() => runAfterMenuClose(() => onOpenDetail(itemId))}
        >
          <EyeIcon />
          Visualizar
        </DropdownMenuItem>
        {role && role === 'ADMIN' && (
          <>
            <DropdownMenuItem
              onSelect={() => runAfterMenuClose(() => onOpenEdit(itemId))}
            >
              <Edit />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant='destructive'
              onSelect={() => runAfterMenuClose(() => onOpenDelete(itemId))}
            >
              <Trash2 />
              Deletar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onSelect={() => runAfterMenuClose(() => onCopy(itemId))}
        >
          {copied === itemId ? <CopyCheck /> : <Copy />}
          Copiar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
  onOpenEdit?: (id: string) => void;
  onOpenDelete?: (id: string) => void;
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
  onOpenEdit,
  onOpenDelete,
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

  if (onOpenDetail && onOpenEdit && onOpenDelete)
    return (
      <Card className='min-w-0 max-w-full gap-2 overflow-hidden'>
        <div
          className={`relative w-full min-w-0 max-w-full overflow-x-auto rounded-md ${
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
          <Table
            className={loading ? 'pointer-events-none opacity-50' : undefined}
          >
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
                <TableHead>Tipo de crono.</TableHead>
                <TableHead>Data</TableHead>
                <TableHead></TableHead>
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
                    {item.chronoanalysisType
                      ? getChronoanalysisTypeLabel(
                          item.chronoanalysisType as ChronoanalysisTypeValue,
                        )
                      : '-'}
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
                  <TableCell>
                    <ChronoanalysisRowActions
                      itemId={item.id}
                      role={role}
                      copied={copied}
                      onOpenDetail={onOpenDetail}
                      onOpenEdit={onOpenEdit}
                      onOpenDelete={onOpenDelete}
                      onCopy={(id) => {
                        void handleCopy(id);
                        setCopied(id);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {currentPage && handlePageChange && totalPages ? (
            <div
              className={`mt-3 flex items-center px-2 ${
                loading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <div className='flex flex-1 items-center justify-start'>
                <span className='flex items-center rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-secondary'>
                  {PagesLength ?? 0}{' '}
                  {(PagesLength ?? 0) === 1 ? 'item' : 'itens'}
                </span>
              </div>

              <div className='flex items-center justify-center'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href='#'
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1)
                            handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
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
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              <div className='flex flex-1 items-center justify-end'>
                <p className='flex items-center justify-center rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-secondary'>
                  {currentPage} / {totalPages}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </Card>
    );
};

export default TableChronoanalysis;
