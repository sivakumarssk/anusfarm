
import React from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';


type Props = {
  type: 'credit' | 'debit' | 'subscription';
  title: string;
  subtitle: string;
  amount: string;
  date: string;
};
const TransactionCard = ({type,title,subtitle,amount,date,}: Props) => {
  const isCredit = type === 'credit';
  const isSubscription = type === 'subscription';



  return (

    <View style={styles.container}>
      <View style={[
          styles.iconContainer,
          {
            backgroundColor:
              isCredit? '#E8F5E9': isSubscription? '#E3F2FD':'#FDECEC'
          }]}>
        <Image source={ isCredit ? require('../../assets/icons/wallet.png') :
   isSubscription ? require('../../assets/icons/wallet.png') : require('../../assets/icons/cart.png')
}
          style={{width:20, height:20, tintColor:isCredit?'#16A34A':isSubscription?
             '#1976D2' : '#D32F2F'}} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View>
        <Text style={[styles.amount,{
 color:isCredit?'#16A34A':isSubscription?'#1976D2':'#000'
}]}> { isCredit ? '+' : '-'}₹{amount}</Text>
        <Text style={styles.date}>{date} </Text>
      </View>
    </View>
  );
};
export default TransactionCard;



const styles = StyleSheet.create({

  container: {
 flexDirection:'row',
 alignItems:'center',
paddingVertical:12,
borderBottomWidth:1,
 borderBottomColor:'#F0F0F0',
  },
  iconContainer: {
    width:40,
    height:40,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
  },
  info: {
    flex:1,
    marginLeft:12,
  },
 title: {
  fontSize: 14,
  fontFamily: 'Inter-SemiBold',
  color: '#000',
},
  subtitle: {
  fontSize: 11,
  fontFamily: 'Inter-Regular',
  color: '#888',
  marginTop: 2,
},
 amount: {
  fontSize: 15,
  fontFamily: 'Inter-Bold',
  textAlign: 'right',
},
  date: {
  fontSize: 10,
  fontFamily: 'Inter-Regular',
  color: '#888',
  marginTop: 2,
},
});