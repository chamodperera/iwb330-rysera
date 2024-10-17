import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonLoading } from '@/components/ui/loadingButton';
import { EstimatedValuesCard } from '@/components/estimated-values-card';
import { api } from '@/services/uploadService';

interface EstimatorProps {
  file: File;
  loading: boolean;
  unit: string;
  loadTime: string;
  estimatedValues: { price: number; time: string; weight: number} | null;
  onEstimateStart?: ()=>void;
  onEstimateComplete?: (price: number, time: string, weight: number) => void;
  onLoadTime?: (loadTime: string) => void;
}

const Estimator: React.FC<EstimatorProps> = ({ file, loading, unit,estimatedValues, loadTime, onEstimateStart, onEstimateComplete, onLoadTime }) => {
  const [error, setError] = useState<string | null>(null);

  const handleEstimate = async () => {
    onEstimateStart?.();
    if (estimatedValues) {
      // If we already have estimated values, use them
      onEstimateComplete?.(estimatedValues.price, estimatedValues.time, estimatedValues.weight);
      return;
    }

    setError(null);

    const startTime = performance.now();
    
    try {
      const uploadResult = await api.uploadFile(file);
      const volume = uploadResult.volume;
      const weight = unit === 'mm' ? volume * 0.00124 : volume * 1.24;
      
      const estimateResult = await api.getEstimate(uploadResult.url, weight);
      
      onEstimateComplete?.(estimateResult.price, estimateResult.time, weight);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      onLoadTime?.(duration);
    }
  };

  return (
    <div>
      {!loading && !estimatedValues && (
        <Button
          variant="default"
          size="lg"
          className="mb-6"
          onClick={handleEstimate}
        >
          Estimate Price
        </Button>
      )}
      {loading && !estimatedValues && <ButtonLoading />}
      {estimatedValues && (
        <EstimatedValuesCard 
          loadTime={loadTime}
          estimatedPrice={estimatedValues.price}
          printDuration={estimatedValues.time}
          materialWeight={estimatedValues.weight.toFixed(2)}
        />
      )}
    </div>
  );
};

export default Estimator;