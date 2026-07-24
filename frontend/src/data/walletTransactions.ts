export type TransactionType =
  | 'credit'
  | 'debit';

export type Transaction = {
  id: string;
  type: TransactionType;
  title: string;
  subtitle: string;
  amount: string;
  date: string;
};

export const walletTransactions: Transaction[] = [
  {
    id: '1',
    type: 'credit',
    title: 'Added to Wallet',
    subtitle: 'Paid using UPI',
    amount: '200',
    date: '1 May 2026, 10:30 AM',
  },
  {
    id: '2',
    type: 'debit',
    title: 'Order Payment',
    subtitle: 'Order #ORD123',
    amount: '270',
    date: '1 May 2026, 10:30 AM',
  },
  {
    id: '3',
    type: 'credit',
    title: 'Added to Wallet',
    subtitle: 'Paid using Debit Card',
    amount: '250',
    date: '1 May 2026, 10:30 AM',
  },
];