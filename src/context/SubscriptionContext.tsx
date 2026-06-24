import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

type SubscriptionData = {
  frequency: string;

  selectedDays: string[];

  deliveryTime: string;

  subscriptionItems: any[];

  instantItems: any[];

  instantTotal: number;

  paymentMethod: string;

  walletAmount: number;

  subscriptionStatus: string;

  nextDeliveryDate: string;
};

type SubscriptionContextType = {
  subscriptionData:
    SubscriptionData | null;

  setSubscriptionData: (
    data: SubscriptionData
  ) => void;
};

const SubscriptionContext =
  createContext<
    SubscriptionContextType | undefined
  >(undefined);

export const SubscriptionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [
    subscriptionData,
    setSubscriptionData,
  ] =
    useState<SubscriptionData | null>(
      null
    );

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionData,
        setSubscriptionData,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription =
  () => {

    const context =
      useContext(
        SubscriptionContext
      );

    if (!context) {

      throw new Error(
        'useSubscription must be used inside SubscriptionProvider'
      );

    }

    return context;
};