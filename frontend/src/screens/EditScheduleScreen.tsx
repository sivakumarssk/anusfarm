import React, { useState } from 'react';
import DateSelector from '../components/DateSelector';
import { Ionicons } from '@expo/vector-icons';


import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

const EditScheduleScreen = () => {

   const [selectedDate, setSelectedDate] =
  useState<Date>(new Date());

  const [showPauseModal, setShowPauseModal] =
  useState(false);

  const [showSkipModal, setShowSkipModal] = useState(false);

  const navigation = useNavigation();

  const route = useRoute<any>();

  const { order } = route.params;

  const product =
    order.items?.[0];

  return (
    

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

  <TouchableOpacity
    onPress={() =>
      navigation.goBack()
    }
    style={{
    marginTop: 10,
    }}
  >
     <Ionicons
        name="arrow-back"
        size={20}
        color="#000"
      />
  </TouchableOpacity>

  <Text style={styles.title}>
    Edit Schedule
  </Text>

<View style={styles.iconContainer}>


 <TouchableOpacity>
<Image
source={require('../../assets/icons/notification.png')}
style={styles.icon}
resizeMode='contain'
/>
</TouchableOpacity>
<TouchableOpacity>
<Image
source={require('../../assets/icons/wallet.png')}
style={styles.icon}
resizeMode='contain'
/>
</TouchableOpacity><TouchableOpacity>
<Image
source={require('../../assets/icons/cart.png')}
style={styles.icon}
resizeMode='contain'
/>
</TouchableOpacity>
</View>




</View>

      <Text style={styles.month}>
        May 2026
      </Text>

   <DateSelector
  selectedDate={selectedDate}
  onSelectDate={setSelectedDate}
/>

      <View style={styles.card}>
     
     <View style={{
       backgroundColor:'#F5F5F5',
       height:140,
       width:100,
       justifyContent:'center',
       alignItems:'center',
       borderRadius:20,
     }}>
         <Image
          source={product.image}
          style={styles.image}
        />
        </View>
        

        <View
          style={{ flex: 1,
            marginLeft:10,
           }}
        >

          <Text style={styles.name}>
            {product.name}
          </Text>

          <Text style={styles.info}>
            {product.unit} | Qty {product.quantity}
          </Text>

          <Text style={styles.price}>
            ₹{product.price}
          </Text>

          <Text style={styles.schedule}>
            Scheduled {order.deliveryDate}
          </Text>

          <View
            style={styles.buttonRow}
          >

            <TouchableOpacity
  style={styles.button}
  onPress={() => {
  setShowPauseModal(true);
}}
>
              <Text
                style={styles.buttonText}
              >
                Pause
              </Text>
            </TouchableOpacity>

           <TouchableOpacity
  style={styles.button}
  onPress={() => {
    setShowSkipModal(true);
  }}
>
              <Text
                style={styles.buttonText}
              >
                Skip
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </View>

      <Modal
  visible={showPauseModal}
  transparent
  animationType="fade"
>

 <TouchableOpacity
  style={{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  }}
  activeOpacity={1}
  onPress={() =>
    setShowPauseModal(false)
  }
>

   <TouchableOpacity
  activeOpacity={1}
  onPress={() => {}}
  style={{
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  }}
>

      <Text
        style={{
          fontSize: 22,
          fontWeight: '500',
          textAlign: 'center',
        }}
      >
        Your schedule for {'\n'}
        {product.name}
        {' '}is Paused.
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: '#444',
          textAlign: 'center',
          marginTop: 24,
          lineHeight: 24,
        }}
      >
        If you want to schedule again
        {'\n'}
        please click continue
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: '#000',
          height: 48,
          width: 140,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
        }}
        onPress={() =>
          setShowPauseModal(false)
        }
      >

        <Text
          style={{
            color: '#FFF',
            fontWeight: '600',
          }}
        >
          Continue
        </Text>

      </TouchableOpacity>

   </TouchableOpacity>
</TouchableOpacity>

</Modal>

<Modal
  visible={showSkipModal}
  transparent
  animationType="fade"
>

<TouchableOpacity
  style={{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  }}
  activeOpacity={1}
  onPress={() =>
    setShowSkipModal(false)
  }
>

    <TouchableOpacity
  activeOpacity={1}
  onPress={() => {}}
  style={{
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    justifyContent:'center',
    alignItems: 'center',
  }}
>

      <Text
        style={{
          fontSize: 22,
          fontWeight: '500',
          textAlign: 'center',
        }}
      >
        Your schedule for {'\n'}
        {product.name}
        {' '}is skipped on {selectedDate.toLocaleDateString()}.
      </Text>
   </TouchableOpacity>
</TouchableOpacity>

</Modal>


    </SafeAreaView>

  );
};

export default EditScheduleScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },

  back: {
    fontSize: 22,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
    marginLeft:10,
    marginRight:90
  },

  month: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 2,
    fontSize: 18,
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',

    backgroundColor: '#FFF',

    borderRadius: 16,

    borderWidth: 1,
    borderColor: '#E8E8E8',

    padding: 12,

    shadowColor: '#000',
    marginTop:20,

shadowOffset: {
  width: 0,
  height: 2,
},

shadowOpacity: 0.08,

shadowRadius: 8,

elevation: 3,
  },

  image: {
    width: 80,
    height: 100,
    borderRadius: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: '500',
  },

  info: {
    fontSize: 12,
    color: '#777',
    marginTop: 3,
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 5,
  },

  schedule: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },

  button: {
    flex: 1,

    backgroundColor: '#000',

    height: 36,

    borderRadius: 8,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 8,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },

  header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
},

 icon: {
    width: 20,
    height: 20,
    marginLeft: 12,
  },

   iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

});