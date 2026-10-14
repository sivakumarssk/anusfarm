// import React, {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
// } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export type CartItem = {
//   id: number;
//   name: string;
//   category: string;
//   unit: string;
//   price: number;
//   image: string;
//   quantity: number;
//   type: 'subscription' | 'instant';
// };

// type CartContextType = {
//   cartItems: CartItem[];
//   lastAddedItem: CartItem | null;
//   addToCart: (product: CartItem) => void;
//   increaseQuantity: (id: number) => void;
//   decreaseQuantity: (id: number) => void;
//   removeItem: (id: number) => void;
//   clearCart: () => void;
//   totalItems: number;
// };

// const CartContext = createContext<CartContextType | null>(null);

// const CART_STORAGE_PREFIX = '@anu_farm_cart_';

// export const CartProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [cartLoaded, setCartLoaded] = useState(false);

//   // Check which user is logged in and load only that user's cart.
//   useEffect(() => {
//     let active = true;

//     const loadUserCart = async () => {
//       setCartLoaded(false);

//       try {
//         const token = await AsyncStorage.getItem('token');
//         const savedUserId = await AsyncStorage.getItem('userId');

//         if (!active) return;

//         if (!token || !savedUserId) {
//           setUserId(null);
//           setCartItems([]);
//           setLastAddedItem(null);
//           setCartLoaded(true);
//           return;
//         }

//         setUserId(savedUserId);

//         // const savedCart = await AsyncStorage.getItem(
//         //   `${CART_STORAGE_PREFIX}${savedUserId}`
//         // );
//         // if (!active) return;
//         // setCartItems(savedCart ? JSON.parse(savedCart) : []);

//    console.log('Logged-in user ID:', savedUserId);

// console.log(
//   'User-specific cart:',
//   await AsyncStorage.getItem(`${CART_STORAGE_PREFIX}${savedUserId}`)
// );

// console.log(
//   'Old shared cart:',
//   await AsyncStorage.getItem('@anu_farm_cart')
// );      
// let savedCart = await AsyncStorage.getItem(
//   `${CART_STORAGE_PREFIX}${savedUserId}`
// );

// // Migrate the old shared cart if this user's cart
// // has not been created yet.
// if (savedCart === null) {
//   const oldCart = await AsyncStorage.getItem('@anu_farm_cart');

//   if (oldCart !== null) {
//     savedCart = oldCart;

//     await AsyncStorage.setItem(
//       `${CART_STORAGE_PREFIX}${savedUserId}`,
//       oldCart
//     );

//     // Remove the old shared key after migration.
//     await AsyncStorage.removeItem('@anu_farm_cart');
//   }
// }

// if (!active) return;

// setCartItems(savedCart ? JSON.parse(savedCart) : []);



//         setLastAddedItem(null);
//       } catch (error) {
//         console.log('Error loading user cart:', error);
//         if (active) {
//           setCartItems([]);
//         }
//       } finally {
//         if (active) {
//           setCartLoaded(true);
//         }
//       }
//     };

//     loadUserCart();

//     return () => {
//       active = false;
//     };
//   }, []);

//   // Save only to the logged-in user's cart key.
//   useEffect(() => {
//     if (!cartLoaded || !userId) return;

//     const saveCart = async () => {
//       try {
//         await AsyncStorage.setItem(
//           `${CART_STORAGE_PREFIX}${userId}`,
//           JSON.stringify(cartItems)
//         );
//       } catch (error) {
//         console.log('Error saving user cart:', error);
//       }
//     };

//     saveCart();
//   }, [cartItems, userId, cartLoaded]);

//   const addToCart = (product: CartItem) => {
//     setLastAddedItem({ ...product, quantity: 1 });

//     setCartItems(prev => {
//       const existing = prev.find(item => item.id === product.id);

//       if (existing) {
//         return prev.map(item =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }

//       return [...prev, { ...product, quantity: 1 }];
//     });
//   };

//   const increaseQuantity = (id: number) => {
//     const item = cartItems.find(item => item.id === id);
//     if (item) setLastAddedItem(item);

//     setCartItems(prev =>
//       prev.map(item =>
//         item.id === id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       )
//     );
//   };

//   const decreaseQuantity = (id: number) => {
//     setCartItems(prev =>
//       prev
//         .map(item =>
//           item.id === id
//             ? { ...item, quantity: item.quantity - 1 }
//             : item
//         )
//         .filter(item => item.quantity > 0)
//     );
//   };

//   const removeItem = (id: number) => {
//     setCartItems(prev => prev.filter(item => item.id !== id));
//   };

//   const clearCart = async () => {
//     setCartItems([]);
//     setLastAddedItem(null);

//     if (userId) {
//       await AsyncStorage.removeItem(
//         `${CART_STORAGE_PREFIX}${userId}`
//       );
//     }
//   };

//   const totalItems = cartItems.reduce(
//     (sum, item) => sum + item.quantity,
//     0
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         lastAddedItem,
//         addToCart,
//         increaseQuantity,
//         decreaseQuantity,
//         removeItem,
//         clearCart,
//         totalItems,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);

//   if (!context) {
//     throw new Error('useCart must be used inside CartProvider');
//   }

//   return context;
// };


import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CartItem = {
  id: number;
  name: string;
  category: string;
  unit: string;
  price: number;
  image: string;
  quantity: number;
  type: 'subscription' | 'instant';
};

type CartContextType = {
  cartItems: CartItem[];
  lastAddedItem: CartItem | null;
  addToCart: (product: CartItem) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextType | null>(null);
const CART_STORAGE_PREFIX = '@anu_farm_cart_';

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [cartLoaded, setCartLoaded] = useState(false);

  const loadUserCart = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const savedUserId = await AsyncStorage.getItem('userId');

      if (!token || !savedUserId) {
        setUserId(null);
        setCartItems([]);
        setLastAddedItem(null);
        setCartLoaded(true);
        return;
      }

      const cartKey = `${CART_STORAGE_PREFIX}${savedUserId}`;
      let savedCart = await AsyncStorage.getItem(cartKey);

      // Migrate the old shared cart only when the user's
      // individual cart has never been created.
      if (savedCart === null) {
        const oldCart = await AsyncStorage.getItem('@anu_farm_cart');

        if (oldCart !== null) {
          console.log(
            'Old shared cart found. Confirm which user owns it before migrating.'
          );
        }
      }

      const parsedCart: CartItem[] = savedCart
        ? JSON.parse(savedCart)
        : [];

      setUserId(savedUserId);
      setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
      setLastAddedItem(null);

      console.log('CART USER ID:', savedUserId);
      console.log('CART ITEMS RESTORED:', parsedCart.length);
    } catch (error) {
      console.log('Error loading user cart:', error);
      setCartItems([]);
    } finally {
      setCartLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadUserCart();

    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        loadUserCart();
      }
    });

    return () => subscription.remove();
  }, [loadUserCart]);

  useEffect(() => {
    if (!cartLoaded || !userId) return;

    const saveCart = async () => {
      try {
        const currentUserId = await AsyncStorage.getItem('userId');

        // Never save one user's cart under another user's key.
        if (currentUserId !== userId) return;

        await AsyncStorage.setItem(
          `${CART_STORAGE_PREFIX}${userId}`,
          JSON.stringify(cartItems)
        );
      } catch (error) {
        console.log('Error saving user cart:', error);
      }
    };

    saveCart();
  }, [cartItems, userId, cartLoaded]);

  const addToCart = (product: CartItem) => {
    if (!userId) {
      console.log('Cannot add to cart: user is not logged in.');
      return;
    }

    setLastAddedItem({ ...product, quantity: 1 });

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) setLastAddedItem(item);

    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = async () => {
    setCartItems([]);
    setLastAddedItem(null);

    if (userId) {
      await AsyncStorage.setItem(
        `${CART_STORAGE_PREFIX}${userId}`,
        JSON.stringify([])
      );
    }
  };

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
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
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
};