import React from 'react';
import { cn } from '@/lib/utils';
import Check from './check';
import Error from './error';
import Info from './info';
import Loading from './loading';

interface checkStatus {
  loading: boolean;
  data: Record<string, unknown> | null;
  status: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const CheckRequestStatus = ({
  loading,
  data,
  status,
  disabled,
  children,
}: checkStatus) => {
  const title = loading
    ? 'carregando'
    : data && !loading && status
      ? 'sucesso'
      : !status && !loading
        ? 'erro'
        : disabled
          ? 'informação'
          : undefined;

  const statusIcon = loading ? (
    <Loading />
  ) : data && !loading && status ? (
    <Check />
  ) : !status && !loading ? (
    <Error />
  ) : disabled ? (
    <Info />
  ) : null;

  const child = React.isValidElement<{ className?: string }>(children)
    ? React.cloneElement(children, {
        className: cn(
          children.props.className,
          statusIcon ? 'pr-10 sm:pr-11' : undefined,
        ),
      })
    : children;

  return (
    <div className='relative w-full'>
      {child}
      {statusIcon ? (
        <div
          className='pointer-events-none absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center'
          title={title}
        >
          {statusIcon}
        </div>
      ) : null}
    </div>
  );
};

export default CheckRequestStatus;
