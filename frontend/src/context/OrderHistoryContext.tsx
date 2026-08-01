// import React, {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
// } from 'react';

// export type Order = {
//   orderId: string;

//   orderType:
//     | 'instant'
//     | 'subscription';

//   items: any[];

//   totalAmount: number;

//   status:
//     | 'scheduled'
//     | 'delivered'
//     | 'cancelled';

//   deliveryDate: string;

//   paymentMethod: string;
// };

// type OrderHistoryContextType = {
//   orders: Order[];

//   addOrder: (
//     order: Order
//   ) => void;
// };

// const OrderHistoryContext =
//   createContext<
//     OrderHistoryContextType | undefined
//   >(undefined);

// export const OrderHistoryProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {

//   const [orders, setOrders] =
//     useState<Order[]>([]);

//   const addOrder = (
//     order: Order
//   ) => {

//     setOrders(prev => [
//       order,
//       ...prev,
//     ]);

//   };

//   return (
//     <OrderHistoryContext.Provider
//       value={{
//         orders,
//         addOrder,
//       }}
//     >
//       {children}
//     </OrderHistoryContext.Provider>
//   );
// };

// export const useOrderHistory =
//   () => {

//     const context =
//       useContext(
//         OrderHistoryContext
//       );

//     if (!context) {

//       throw new Error(
//         'useOrderHistory must be used inside OrderHistoryProvider'
//       );

//     }

//     return context;
//   };
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';


export type Order = {

  orderId:string;

  orderType:
  | 'instant'
  | 'subscription';

  items:any[];

  totalAmount:number;

  status:
  | 'scheduled'
  | 'delivered'
  | 'cancelled';

  deliveryDate:string;

  paymentMethod:string;

};


type OrderHistoryContextType = {

 orders:Order[];

 addOrder:(order:Order)=>void;

};


const OrderHistoryContext =
createContext<OrderHistoryContextType | undefined>(
undefined
);



export const OrderHistoryProvider = ({
children
}:{
children:ReactNode
})=>{


const [orders,setOrders]=
useState<Order[]>([]);



useEffect(()=>{


const loadOrders=async()=>{

try{

  await AsyncStorage.removeItem("order_history");
const saved =await AsyncStorage.getItem("order_history");


if(saved){

setOrders(
JSON.parse(saved)
);

}


}
catch(error){

console.log(
"Load order error",
error
);

}

};


loadOrders();


},[]);



const addOrder=(order:Order)=>{


setOrders(prev=>{

const updated=[
order,
...prev
];


AsyncStorage.setItem(
"order_history",
JSON.stringify(updated)
);


return updated;


});


};



return(

<OrderHistoryContext.Provider
value={{
orders,
addOrder
}}
>

{children}

</OrderHistoryContext.Provider>


);


};



export const useOrderHistory=()=>{


const context=
useContext(OrderHistoryContext);


if(!context){

throw new Error(
"useOrderHistory must be inside provider"
);

}


return context;


};