import Check from './check';
import Error from './error';
import Info from './info';
import Loading from './loading';

interface checkStatus {
  loading: boolean;
  data: Record<string, unknown> | null;
  status: boolean;
  disabled?: boolean;
}

const CheckRequestStatus = ({
  loading,
  data,
  status,
  disabled,
}: checkStatus) => {
  return (
    <div
      className=' absolute top-1 right-0 flex items-center justify-center'
      title={
        loading
          ? 'carregando'
          : data && !loading && status
          ? 'sucesso'
          : !status && !loading
          ? 'erro'
          : disabled
          ? 'informação'
          : undefined
      }
    >
      {loading ? (
        <Loading />
      ) : data && !loading && status ? (
        <Check />
      ) : !status && !loading ? (
        <Error />
      ) : disabled ? (
        <Info />
      ) : null}
    </div>
  );
};

export default CheckRequestStatus;
