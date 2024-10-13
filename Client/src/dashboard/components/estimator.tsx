import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonLoading } from '@/components/ui/loadingButton';
import { EstimatedValuesCard } from '@/components/estimated-values-card';

interface EstimatorProps {
  file: File;
  loading: boolean;
  estimatedPrice: number | null;
  onEstimate: () => void;
}

const Estimator: React.FC<EstimatorProps> = ({ file, loading, estimatedPrice, onEstimate }) => {
  const [localLoading, setLocalLoading] = useState(loading);
  const [localEstimatedPrice, setLocalEstimatedPrice] = useState<number | null>(estimatedPrice);

  useEffect(() => {
    // Reset state when file changes
    setLocalLoading(loading);
    setLocalEstimatedPrice(estimatedPrice);
  }, [file, loading, estimatedPrice]);

  const handleEstimatePrice = () => {
    setLocalLoading(true);
    onEstimate();
  };

  return (
    <div>
      {!localLoading && localEstimatedPrice === null && (
        <Button
          variant="default"
          size="lg"
          className="mb-6"
          onClick={handleEstimatePrice}
        >
          Estimate Price
        </Button>
      )}
      {localLoading && <ButtonLoading />}
      {localEstimatedPrice !== null && (
        <EstimatedValuesCard />
      )}
    </div>
  );
};

export default Estimator;