import { findSectorByCc } from '@/api/sector-api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type SectorUniqueType = {
  id: string;
  name: string;
  costCenter: string;
  normalizedName: string;
  createdAt: string;
  updatedAt: string;
};

export function useSector(costCenter?: string) {
  const [sectorData, setSectorData] = useState<null | SectorUniqueType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatus, setIsStatus] = useState(true);

  useEffect(() => {
    if (!costCenter || costCenter.length < 4) {
      setIsStatus(true);
      setSectorData(null);
      return;
    }

    setIsStatus(true);
    setIsLoading(true);

    const supportFindUniqueSector = async () => {
      const { status, message, data } = await findSectorByCc(costCenter);

      if (!status) {
        setIsLoading(false);
        setIsStatus(false);
        return toast.error(message);
      }

      setIsLoading(false);
      setSectorData(data);
    };

    supportFindUniqueSector();
  }, [costCenter]);

  return {
    isStatus,
    isLoading,
    sectorData,
  };
}
