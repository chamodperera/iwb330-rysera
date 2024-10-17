import { EstimatedValuesCard } from "@/components/estimated-values-card";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/loadingButton";
import { api } from "@/services/uploadService";
import { useState } from "react";

interface EstimatorProps {
  unit: string;
  status: string;
  isEstimating: boolean | undefined;
  loadTime: string;
  estimatedValues: { price: number; time: string; weight: number } | null;
  onEstimateStart?: () => void;
  onEstimateComplete?: (price: number, time: string, weight: number) => void;
  onLoadTime?: (loadTime: string) => void;
  uploadedUrl: string;
  uploadedVolume: number;
}

const Estimator: React.FC<EstimatorProps> = ({ 
  unit,
  status,
  isEstimating,
  estimatedValues, 
  loadTime, 
  onEstimateStart, 
  onEstimateComplete, 
  onLoadTime,
  uploadedUrl,
  uploadedVolume
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleEstimate = async () => {
    if (estimatedValues) {
      return;
    }

    onEstimateStart?.();
    setError(null);

    const startTime = performance.now();
    
    try {
      const weight = unit === 'mm' ? uploadedVolume * 0.00124 : uploadedVolume * 1.24;
      
      const estimateResult = await api.getEstimate(uploadedUrl, weight);
      
      onEstimateComplete?.(estimateResult.price, estimateResult.time, weight);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      onEstimateComplete?.(0, '0', 0); // Reset the estimating state on error
    } finally {
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      onLoadTime?.(duration);
    }
  };

  return (
    <div>
      {!estimatedValues && !isEstimating && (
        <Button
          variant="default"
          size="lg"
          className="mb-6"
          onClick={handleEstimate}
          disabled={status !== 'uploaded'}
        >
          Estimate Price
        </Button>
      )}
      {isEstimating && !estimatedValues && <ButtonLoading />}
      {estimatedValues && (
        <EstimatedValuesCard 
          loadTime={loadTime}
          estimatedPrice={estimatedValues.price}
          printDuration={estimatedValues.time}
          materialWeight={estimatedValues.weight.toFixed(2)}
        />
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default Estimator;