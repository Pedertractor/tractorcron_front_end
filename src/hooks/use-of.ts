import { findUniqueOf } from '@/api/of-api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type OfType = {
  ofNumber: string;
  partCode: string;
  date: string;
  quantity: number;
  originalQuantity: number;
  observation: string;
};

export function useOf(manufacturingOrder?: string) {
  const [ofData, setOfData] = useState<null | OfType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatus, setIsStatus] = useState(true);

  useEffect(() => {
    if (!manufacturingOrder || manufacturingOrder.length < 8) {
      setIsStatus(true);
      setOfData(null);
      return;
    }
    setIsStatus(true);
    setIsLoading(true);

    const supportFindUniqueOf = async () => {
      const { data, message, status } = await findUniqueOf(manufacturingOrder);
      if (status !== 200) {
        setIsLoading(false);
        setIsStatus(false);
        setOfData(null);
        return toast.error(message);
      }
      setIsLoading(false);
      setOfData(data);
    };

    supportFindUniqueOf();
  }, [manufacturingOrder]);

  return {
    isStatus,
    isLoading,
    ofData,
  };
}
