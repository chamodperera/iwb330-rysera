import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';  
import { ScrollArea } from '@/components/ui/scroll-area';

interface PriceSummaryProps {
  fileStates: Array<{
    file: File;
    status: string;
  }>;
  estimatedValues: {
    [key: number]: { 
      price: number;
      time: string;
      weight: number;
    } | null;
  };
}

const PriceSummary = ({ fileStates, estimatedValues }: PriceSummaryProps) => {
  // Check if at least one file has been estimated
  const hasEstimates = Object.values(estimatedValues).some(value => value !== null);
  
  // If no estimates yet, don't render anything
  if (!hasEstimates) {
    return null;
  }

  const calculateTotal = () => {
    return Object.values(estimatedValues)
      .filter((value): value is { price: number; time: string; weight: number } => value !== null)
      .reduce((sum, value) => sum + value.price, 0);
  };

  return (
    <div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Price Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48 pr-4">
            {fileStates.map((fileState, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                {estimatedValues[index] && (
                  <>
                    <span className="text-sm truncate max-w-[140px]">
                      {fileState.file.name}
                    </span>
                    <span className="text-sm font-medium">
                      Rs.{estimatedValues[index].price.toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            ))}
          </ScrollArea>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">
                Rs.{calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center mt-4">
        <Button>
          Send to Print
        </Button>
      </div>
    </div>
  );
};

export default PriceSummary;