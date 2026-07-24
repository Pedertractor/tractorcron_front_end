import {
  listActivities,
  reorderActivities,
  setActivityActive,
} from '@/api/activities-api';
import ModalCreateActivity from '@/components/modal-create-activity';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card/card';
import PresetButton from '@/components/ui/button/button';
import { Switch } from '@/components/ui/switch';
import { CHRONOANALYSIS_TYPE_OPTIONS } from '@/constants/chronoanalysis-types';
import { cn } from '@/lib/utils';
import type {
  ActivityCatalogItem,
  ActivityCatalogType,
} from '@/types/activity-catalog-types';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type HTMLAttributes } from 'react';
import { toast } from 'sonner';

type AdminActivityFilter = ActivityCatalogType;

const ADMIN_TYPE_OPTIONS: { value: AdminActivityFilter; label: string }[] = [
  ...CHRONOANALYSIS_TYPE_OPTIONS.filter((option) => option.value !== 'OUTROS').map(
    (option) => ({
      value: option.value as AdminActivityFilter,
      label: option.label,
    }),
  ),
  { value: 'GERAL', label: 'Geral' },
];

function sortByOrder(activities: ActivityCatalogItem[]) {
  return [...activities].sort((a, b) => {
    const orderA = a.sortOrder ?? a.id;
    const orderB = b.sortOrder ?? b.id;
    if (orderA !== orderB) return orderA - orderB;
    return a.id - b.id;
  });
}

function ActivityCardBody({
  activity,
  selectedType,
  showGrip,
  gripProps,
  togglingId,
  canToggle,
  onToggleActive,
}: {
  activity: ActivityCatalogItem;
  selectedType: AdminActivityFilter;
  showGrip: boolean;
  gripProps?: HTMLAttributes<HTMLButtonElement>;
  togglingId: number | null;
  canToggle: boolean;
  onToggleActive?: (activity: ActivityCatalogItem) => void;
}) {
  return (
    <>
      <div className='flex min-w-0 flex-1 items-center gap-2'>
        {showGrip && (
          <button
            type='button'
            className='text-muted-foreground hover:text-foreground -ml-1 shrink-0 cursor-grab touch-none rounded p-1 active:cursor-grabbing'
            aria-label={`Arrastar ${activity.name}`}
            {...gripProps}
          >
            <GripVertical className='size-4' />
          </button>
        )}
        <div className='min-w-0 flex-1'>
          <p className='line-clamp-2 text-xs leading-snug break-words sm:text-sm'>
            {activity.name}
          </p>
          {selectedType !== 'GERAL' && activity.activityType === 'GERAL' && (
            <span className='text-muted-foreground text-[10px]'>geral</span>
          )}
          {!activity.isActive && (
            <span className='text-muted-foreground block text-[10px]'>
              inativa
            </span>
          )}
        </div>
      </div>
      <Switch
        checked={activity.isActive === true}
        disabled={!canToggle || togglingId === activity.id}
        onCheckedChange={(checked) => {
          if (!onToggleActive) return;
          if (checked === activity.isActive) return;
          onToggleActive(activity);
        }}
        aria-label={
          activity.isActive
            ? `Desativar ${activity.name}`
            : `Ativar ${activity.name}`
        }
      />
    </>
  );
}

function SortableActivityCard({
  activity,
  selectedType,
  togglingId,
  onToggleActive,
}: {
  activity: ActivityCatalogItem;
  selectedType: AdminActivityFilter;
  togglingId: number | null;
  onToggleActive: (activity: ActivityCatalogItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: activity.id,
  });

  const style = {
    transform: CSS.Transform.toString(isDragging ? null : transform),
    transition: isDragging ? undefined : transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative flex min-h-[3.25rem] items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2',
        !activity.isActive && !isDragging && 'bg-muted/50 opacity-70',
        isDragging && 'z-10 opacity-30',
      )}
    >
      <ActivityCardBody
        activity={activity}
        selectedType={selectedType}
        showGrip
        gripProps={{ ...attributes, ...listeners }}
        togglingId={togglingId}
        canToggle={false}
        onToggleActive={onToggleActive}
      />
    </div>
  );
}

function StaticActivityCard({
  activity,
  selectedType,
  togglingId,
  onToggleActive,
}: {
  activity: ActivityCatalogItem;
  selectedType: AdminActivityFilter;
  togglingId: number | null;
  onToggleActive: (activity: ActivityCatalogItem) => void;
}) {
  return (
    <div
      className={cn(
        'relative flex min-h-[3.25rem] items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2',
        !activity.isActive && 'bg-muted/50 opacity-70',
      )}
    >
      <ActivityCardBody
        activity={activity}
        selectedType={selectedType}
        showGrip={false}
        togglingId={togglingId}
        canToggle
        onToggleActive={onToggleActive}
      />
    </div>
  );
}

const ActivitiesAdminPage = () => {
  const [items, setItems] = useState<ActivityCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] =
    useState<AdminActivityFilter>('SOLDAGEM');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const fetchActivities = useCallback(async (presetType: AdminActivityFilter) => {
    setLoading(true);

    const result = await listActivities({
      includeInactive: true,
      presetType,
    });

    setLoading(false);

    if (!result.status) {
      toast.error(result.message);
      return;
    }

    setItems(sortByOrder(result.data));
  }, []);

  useEffect(() => {
    void fetchActivities(selectedType);
  }, [fetchActivities, selectedType]);

  const orderedItems = useMemo(() => sortByOrder(items), [items]);
  const itemIds = useMemo(
    () => orderedItems.map((item) => item.id),
    [orderedItems],
  );

  const activeItem = useMemo(
    () => orderedItems.find((item) => item.id === activeId) ?? null,
    [orderedItems, activeId],
  );

  const handleToggleActive = useCallback(
    async (activity: ActivityCatalogItem) => {
      const nextActive = !activity.isActive;
      setTogglingId(activity.id);

      const result = await setActivityActive(activity.id, nextActive);

      setTogglingId(null);

      if (!result.status) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setItems((prev) =>
        prev.map((item) =>
          item.id === activity.id ? { ...item, isActive: nextActive } : item,
        ),
      );
    },
    [],
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(Number(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((current) => {
      const sorted = sortByOrder(current);
      const oldIndex = sorted.findIndex((item) => item.id === active.id);
      const newIndex = sorted.findIndex((item) => item.id === over.id);

      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
        return current;
      }

      const next = arrayMove(sorted, oldIndex, newIndex).map((item, index) => ({
        ...item,
        sortOrder: index,
      }));
      itemsRef.current = next;
      return next;
    });
  }

  async function handleDragEnd() {
    setActiveId(null);
    setSavingOrder(true);

    const next = sortByOrder(itemsRef.current).map((item, index) => ({
      ...item,
      sortOrder: index,
    }));
    setItems(next);

    const result = await reorderActivities({
      presetType: selectedType,
      orderedIds: next.map((item) => item.id),
    });

    setSavingOrder(false);

    if (!result.status) {
      toast.error(result.message);
      void fetchActivities(selectedType);
    }
  }

  return (
    <div className='flex flex-col gap-4 sm:gap-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-xl font-bold tracking-tight sm:text-2xl'>
            Atividades
          </h1>
          <p className='text-muted-foreground text-sm'>
            Gerencie o catálogo de atividades por tipo de cronoanálise.
          </p>
        </div>
        <Button
          type='button'
          className='bg-background-blue hover:bg-background-blue-active w-full text-white sm:w-auto'
          onClick={() => setIsOpenModal(true)}
        >
          <Plus className='size-4' />
          Nova atividade
        </Button>
      </div>

      <Card text='Preset das atividades'>
        <div className='flex flex-col gap-3'>
          <p className='text-sm font-medium'>Tipo de cronoanálise</p>
          <div className='flex flex-wrap gap-2'>
            {ADMIN_TYPE_OPTIONS.map((option) => (
              <PresetButton
                key={option.value}
                size={' md-desk'}
                type='button'
                className='min-w-[6rem] flex-1 px-3 py-2 text-xs sm:min-w-[8rem] sm:py-2.5 sm:text-sm'
                variant={
                  selectedType === option.value ? 'select-blue' : 'default'
                }
                onClick={() => {
                  setSelectedType(option.value);
                  setIsEditingOrder(false);
                }}
              >
                {option.label.toLowerCase()}
              </PresetButton>
            ))}
          </div>

          <div className='mt-2'>
            <div className='mb-2 flex flex-wrap items-center justify-between gap-2'>
              <p className='text-sm font-medium underline'>Atividades</p>
              <Button
                type='button'
                variant='outline'
                size='icon'
                className={cn(
                  'size-8',
                  isEditingOrder &&
                    'border-background-base-blue-select text-background-base-blue-select',
                )}
                onClick={() => setIsEditingOrder((prev) => !prev)}
                aria-label={
                  isEditingOrder
                    ? 'Concluir edição da sequência'
                    : 'Editar sequência das atividades'
                }
                title={
                  isEditingOrder
                    ? 'Concluir edição da sequência'
                    : 'Editar sequência das atividades'
                }
                disabled={savingOrder}
              >
                <Pencil className='size-3.5' />
              </Button>
            </div>
            {isEditingOrder && (
              <p className='text-muted-foreground mb-2 text-xs'>
                Arraste pelo ícone de grip para definir a ordem do preset.
              </p>
            )}
            {loading ? (
              <p className='text-muted-foreground text-sm'>Carregando...</p>
            ) : orderedItems.length === 0 ? (
              <p className='text-muted-foreground text-sm'>
                Nenhuma atividade para este tipo.
              </p>
            ) : isEditingOrder ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={() => void handleDragEnd()}
                onDragCancel={() => setActiveId(null)}
              >
                <SortableContext items={itemIds} strategy={rectSortingStrategy}>
                  <div className='grid max-h-[28rem] grid-cols-1 gap-2 overflow-y-auto py-1 sm:grid-cols-2 md:grid-cols-4 md:gap-4'>
                    {orderedItems.map((activity) => (
                      <SortableActivityCard
                        key={activity.id}
                        activity={activity}
                        selectedType={selectedType}
                        togglingId={togglingId}
                        onToggleActive={handleToggleActive}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay
                  dropAnimation={{
                    duration: 180,
                    easing: 'cubic-bezier(0.2, 0, 0, 1)',
                  }}
                >
                  {activeItem ? (
                    <div className='flex min-h-[3.25rem] items-center justify-between gap-2 rounded-md border border-background-base-blue-select bg-background px-3 py-2 shadow-xl ring-2 ring-background-base-blue-select/30'>
                      <ActivityCardBody
                        activity={activeItem}
                        selectedType={selectedType}
                        showGrip
                        togglingId={null}
                        canToggle={false}
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            ) : (
              <div className='grid max-h-[28rem] grid-cols-1 gap-2 overflow-y-auto py-1 sm:grid-cols-2 md:grid-cols-4 md:gap-4'>
                {orderedItems.map((activity) => (
                  <StaticActivityCard
                    key={activity.id}
                    activity={activity}
                    selectedType={selectedType}
                    togglingId={togglingId}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <ModalCreateActivity
        open={isOpenModal}
        setOpen={setIsOpenModal}
        defaultActivityType={selectedType}
        onCreated={() => void fetchActivities(selectedType)}
      />
    </div>
  );
};

export default ActivitiesAdminPage;
