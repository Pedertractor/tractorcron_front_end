import { findUniquePart } from '@/api/parts-api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type PartUniqueType = {
  client: string;
  createdAt: string;
  description: string;
  group: string;
  id: number;
  localPath: string;
  partCode: string;
  partNumber: string;
  serverPath: string;
  status: boolean;
  updatedAt: string;
};

export function useParts(partCode?: string) {
  const [partData, setPartData] = useState<null | PartUniqueType>(null);
  // const [countParts, setCountParts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatus, setIsStatus] = useState(true);

  useEffect(() => {
    if (!partCode || partCode.length < 6) {
      setIsStatus(true);
      setPartData(null);
      return;
    }
    console.log('re-render');
    setIsStatus(true);
    setIsLoading(true);
    const supportFindUniquePart = async () => {
      const { data, message, status } = await findUniquePart(partCode);
      if (status !== 200) {
        setIsLoading(false);
        setIsStatus(false);
        return toast.error(message);
      }

      setIsLoading(false);
      setPartData(data);
    };

    supportFindUniquePart();
  }, [partCode]);

  return {
    isStatus,
    isLoading,
    partData,
  };
}
