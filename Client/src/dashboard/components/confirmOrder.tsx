import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Order, User } from "@/types";
import { sendOrders } from "@/services/order";
import { useNavigate } from "react-router-dom";
import { sendQuote } from "@/services/quote";
import { sendtoSheet } from "@/services/sheets";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UseUser } from "@/userContext";

interface ConfirmAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orders: Order[];
  user: User | null;
}

export function ConfirmAlert({
  open,
  onOpenChange,
  orders,
  user,
}: ConfirmAlertProps) {
  const { setFileStates, setCurrentFileIndex, setEstimatedValues } = UseUser();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const handleSendOrder = async () => {
    await sendOrders(orders);
  };

  const handleSendQuote = async () => {
    await sendQuote({
      customer: user?.name || "Unknown",
      email: user?.email || "Unknown",
      products: orders.map((order) => ({
        name: order.fileName,
        rate: parseFloat(order.price),
        quantity: order.quantity,
      })),
    });
  };

  const handleSendToSheet = async () => {
    await sendtoSheet({
      customer: user?.name || "Unknown",
      email: user?.email || "Unknown",
      products: orders.map((order) => ({
        name: order.fileName,
        rate: parseFloat(order.price),
        quantity: order.quantity,
        url: order.url,
      })),
    });
    onOpenChange(false);
    navigate("/dashboard/orders");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Order</AlertDialogTitle>
          <AlertDialogDescription>
            Please review and confirm your order
          </AlertDialogDescription>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48 pr-4">
                {orders.map((order, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 gap-5"
                  >
                    <span className="text-sm truncate max-w-[140px]">
                      {order.fileName}
                    </span>
                    <span className="text-sm font-medium">
                      Rs.{order.price} x {order.quantity}
                    </span>
                  </div>
                ))}
              </ScrollArea>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    Rs.
                    {orders
                      .reduce(
                        (sum, order) =>
                          sum + parseFloat(order.price) * order.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!isProcessing ? (
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Cancel
            </Button>
          ) : null}
          <Button
            onClick={async () => {
              if (!isProcessing) {
                setIsProcessing(true);
                try {
                  await handleSendOrder();
                  console.log("Sending to sheet");
                  await handleSendQuote();
                  await handleSendToSheet();
                } catch (error) {
                  // Handle the error as needed
                  console.error("Error while confirming order:", error);
                } finally {
                  onOpenChange(false);
                  navigate("/dashboard/orders");
                  setFileStates([]);
                  setCurrentFileIndex(0);
                  setEstimatedValues([]);
                  setIsProcessing(false);
                }
              }
            }}
          >
            {isProcessing ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-5" />
            ) : (
              "Confirm Order"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
