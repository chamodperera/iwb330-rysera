import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/models";
import { getOrders } from "@/services/order";
import { useEffect, useState } from "react";

export function Orders() {
  const [currOrders, setOrders] = useState<Order[]>([]); // Ensure the default state is an empty array

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getOrders();
      if (orders) {
        setOrders(orders);
      }
      console.log("orders", orders);
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Print Time</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currOrders.length > 0 ? (
            currOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>
                  {order.orderDate.replace(
                    /(\d{4})-(\d{2})-(\d{2}).*/,
                    "$2/$3/$1"
                  )}
                </TableCell>
                <TableCell>{order.fileName}</TableCell>
                <TableCell>{order.printTime}</TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell className="text-right font-semibold text-base">
                  {order.status}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
