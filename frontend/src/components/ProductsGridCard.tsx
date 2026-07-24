import React from 'react';
import { useCart } from '../context/CartContext';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Props = {
  item: any;
  setLastAddedProduct: React.Dispatch<
    React.SetStateAction<any>
  >;
  // quantity: number;
  // setCartItems: React.Dispatch<
  //   React.SetStateAction<{
  //     [key: string]: number;
  //   }>
  // >;
};

const ProductsGridCard = ({
  item,
  setLastAddedProduct,
}: Props) => {

// const increaseQuantity = () => {
//   setLastAddedProduct(item);

//   setCartItems(prev => ({
//     ...prev,
//     [item.id]:
//       (prev[item.id] || 0) + 1,
//   }));
// };

const {
  cartItems,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} = useCart();

const cartItem = cartItems.find(
  product => product.id === item.id
);

const quantity =
  cartItem?.quantity || 0;

const handleIncrease = () => {

  setLastAddedProduct(item);

  if (cartItem) {

    increaseQuantity(item.id);

  } else {

    addToCart({
      id: item.id,
      name: item.name,
      category: item.category,
      unit: item.quantity
        .split('|')[0]
        .trim(),
      price: Number(
        item.price.replace('₹', '')
      ),
      image: item.image,
    });

  }

};

const handleDecrease = () => {
  decreaseQuantity(item.id);
};

// const decreaseQuantity = () => {

//   setCartItems(prev => {

//     const currentQty =
//       prev[item.id] || 0;

//     if (currentQty <= 1) {

//       const updated = {
//         ...prev,
//       };

//       delete updated[item.id];

//       return updated;

//     }

//     return {

//       ...prev,

//       [item.id]:
//         currentQty - 1,

//     };

//   });

// };

//   return (

//     <View style={styles.card}>

//       <Image
//         source={item.image}
//         style={styles.image}
//         resizeMode="contain"
//       />

//       <Text
//         numberOfLines={1}
//         style={styles.name}
//       >
//         {item.name}
//       </Text>

//       <Text style={styles.quantity}>
//         {item.quantity}
//       </Text>

//       <Text style={styles.price}>
//         {item.price}
//       </Text>

//      {
//  quantity === 0 ? (

//     <TouchableOpacity
//       style={styles.button}
//       onPress={
  //       increaseQuantity
  //     }
  //   >

  //     <Text
  //       style={styles.buttonText}
  //     >
  //       Add +
  //     </Text>

  //   </TouchableOpacity>

  // ) : (

    // <View
    //   style={styles.quantityContainer}
    // >

    //   <TouchableOpacity
    //     onPress={
    //       decreaseQuantity
    //     }
    //   >

      //   <Text
      //     style={styles.actionText}
      //   >
      //     -
      //   </Text>

      // </TouchableOpacity>

      // <Text
      //   style={styles.countText}
      // >
      //  {quantity}
      // </Text>

//       // <TouchableOpacity
//         onPress={
//           increaseQuantity
//         }
//       >

//         <Text
//           style={styles.actionText}
//         >
//           +
//         </Text>

//       </TouchableOpacity>

//     </View>

//   )
// }

//     </View>

//   );

// };

return (

  <View style={styles.card}>

    <Image
      source={item.image}
      style={styles.image}
      resizeMode="contain"
    />

    <Text
      numberOfLines={1}
      style={styles.name}
    >
      {item.name}
    </Text>

    <Text style={styles.quantity}>
      {item.quantity}
    </Text>

    <Text style={styles.price}>
      {item.price}
    </Text>

    {
      quantity === 0 ? (

        <TouchableOpacity
          style={styles.button}
          onPress={handleIncrease}
        >

          <Text
            style={styles.buttonText}
          >
            Add +
          </Text>

        </TouchableOpacity>

      ) : (

        <View
          style={styles.quantityContainer}
        >

          <TouchableOpacity
            onPress={handleDecrease}
          >

            <Text
              style={styles.actionText}
            >
              -
            </Text>

          </TouchableOpacity>

          <Text
            style={styles.countText}
          >
            {quantity}
          </Text>

          <TouchableOpacity
            onPress={handleIncrease}
          >

            <Text
              style={styles.actionText}
            >
              +
            </Text>

          </TouchableOpacity>

        </View>

      )
    }

  </View>


);
};

export default ProductsGridCard;

const styles = StyleSheet.create({

  card: {
   width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 10,
    margin: 6,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },

  image: {
    width: '100%',
    height: 90,
    alignSelf: 'center',
  },

  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginTop: 6,
  },

  quantity: {
    fontSize: 10,
    color: '#777',
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
  },

  button: {
    backgroundColor: '#000',
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  quantityContainer: {
  height: 32,

  borderWidth: 1,
  borderColor: '#000',

  borderRadius: 8,

  flexDirection: 'row',

  justifyContent: 'space-between',
  alignItems: 'center',

  paddingHorizontal: 12,

  marginTop: 8,
},

actionText: {
  fontSize: 18,
  fontWeight: '600',
  color: '#000',
},

countText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#000',
},

});