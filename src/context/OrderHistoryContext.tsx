import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

export type Order = {
  orderId: string;

  orderType:
    | 'instant'
    | 'subscription';

  items: any[];

  totalAmount: number;

  status:
    | 'scheduled'
    | 'delivered'
    | 'cancelled';

  deliveryDate: string;

  paymentMethod: string;
};

type OrderHistoryContextType = {
  orders: Order[];

  addOrder: (
    order: Order
  ) => void;
};

const OrderHistoryContext =
  createContext<
    OrderHistoryContextType | undefined
  >(undefined);

export const OrderHistoryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [orders, setOrders] =
    useState<Order[]>([]);

  const addOrder = (
    order: Order
  ) => {

    setOrders(prev => [
      order,
      ...prev,
    ]);

  };

  return (
    <OrderHistoryContext.Provider
      value={{
        orders,
        addOrder,
      }}
    >
      {children}
    </OrderHistoryContext.Provider>
  );
};

export const useOrderHistory =
  () => {

    const context =
      useContext(
        OrderHistoryContext
      );

    if (!context) {

      throw new Error(
        'useOrderHistory must be used inside OrderHistoryProvider'
      );

    }

    return context;
  };