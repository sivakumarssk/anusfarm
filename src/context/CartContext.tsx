import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

import AsyncStorage
from '@react-native-async-storage/async-storage';

export type CartItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  image: any;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  lastAddedItem: CartItem | null;

  addToCart: (
    product: Omit<CartItem, 'quantity'>
  ) => void;

  increaseQuantity: (
    id: string
  ) => void;

  decreaseQuantity: (
    id: string
  ) => void;

  removeItem: (
    id: string
  ) => void;

  clearCart: () => void;

  totalItems: number;
};

const CartContext =
createContext<CartContextType | null>(
  null
);

const CART_STORAGE_KEY =
  '@anu_farm_cart';

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [
    cartItems,
    setCartItems,
  ] = useState<CartItem[]>([]);

  const [
  lastAddedItem,
  setLastAddedItem,
] = useState<CartItem | null>(null);

  useEffect(() => {

  const loadCart = async () => {

    try {

      const savedCart =
        await AsyncStorage.getItem(
          CART_STORAGE_KEY
        );

      if (savedCart) {

        setCartItems(
          JSON.parse(savedCart)
        );

      }

    } catch (error) {

      console.log(
        'Error loading cart:',
        error
      );

    }

  };

  loadCart();

}, []);

useEffect(() => {

  const saveCart = async () => {

    try {

      await AsyncStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );

    } catch (error) {

      console.log(
        'Error saving cart:',
        error
      );

    }

  };

  saveCart();

}, [cartItems]);

  const addToCart = (
    product: Omit<CartItem, 'quantity'>
  ) => {

    setLastAddedItem({
  ...product,
  quantity: 1,
});

    setCartItems(prev => {

      const existing =
      prev.find(
        item =>
          item.id === product.id
      );

      if (existing) {

        return prev.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );

      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];

    });

  };

 const increaseQuantity = (
  id: string
) => {

  const item =
    cartItems.find(
      item => item.id === id
    );

  if (item) {
    setLastAddedItem(item);
  }

  setCartItems(prev =>
    prev.map(item =>
      item.id === id
        ? {
            ...item,
            quantity:
              item.quantity + 1,
          }
        : item
    )
  );

};

  const decreaseQuantity = (
    id: string
  ) => {

    setCartItems(prev =>
      prev
        .map(item =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          item =>
            item.quantity > 0
        )
    );

  };

  const removeItem = (
    id: string
  ) => {

    setCartItems(prev =>
      prev.filter(
        item =>
          item.id !== id
      )
    );

  };

  const clearCart = () => {

  setCartItems([]);

};

  const totalItems =
    cartItems.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  return (

    <CartContext.Provider
     value={{
  cartItems,
  lastAddedItem,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
  totalItems,
}}
    >

      {children}

    </CartContext.Provider>

  );

};

export const useCart = () => {

  const context =
    useContext(CartContext);

  if (!context) {

    throw new Error(
      'useCart must be used inside CartProvider'
    );

  }

  return context;

};