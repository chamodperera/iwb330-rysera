import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Button} from '@/components/ui/button';
import QuantityInput from './qunatityInput';

interface FileState {
  file: {
    name: string;
  };
  status: 'idle' | 'uploading' | 'uploaded' | 'error' | 'estimated';
}

interface EstimatedValue {
  price: number;
  time: string;
  weight: number;
}

interface PriceSummaryProps {
  fileStates: FileState[];
  estimatedValues: (EstimatedValue | null)[];
}

const PriceSummary: React.FC<PriceSummaryProps> = ({ fileStates, estimatedValues }) => {
  const [quantities, setQuantities] = useState<number[]>(fileStates.map(() => 1));

  const handleQuantityChange = (index: number, quantity: number) => {
    setQuantities(prevQuantities => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] = quantity;
      return newQuantities;
    });
  };

  const calculateTotal = () => {
    return Object.values(estimatedValues)
      .filter((value, index): value is { price: number; time: string; weight: number } => value !== null)
      .reduce((sum, value, index) => sum + value.price * quantities[index], 0);
  };

  return (
    <div>
      {estimatedValues.length !== 0 &&(
        <div>
      <Card className="mt-6 ">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Price Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48 pr-4">
            {fileStates.map((fileState, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                {estimatedValues[index] && (
                  <>
                  <QuantityInput
                      value={quantities[index]}
                      onChange={(quantity) => handleQuantityChange(index, quantity)}
                    />
                    <span className="text-sm truncate max-w-[140px] ml-4">
                      {fileState.file.name}
                    </span>
                    <span className="text-sm font-medium ml-4">
                      Rs.{(estimatedValues[index].price * quantities[index]).toFixed(2)}
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
      )}
    </div>
  );
};

export default PriceSummary;