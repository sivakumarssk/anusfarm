import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import OnboardingScreen from './src/screens/OnboardingScreen/onboardingScreen';
import LoginScreen from './src/screens/LoginScreen'
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';
import { SubscriptionProvider,} from './src/context/SubscriptionContext';
import { useFonts } from '@expo-google-fonts/inter';
import { OrderHistoryProvider,} from './src/context/OrderHistoryContext';

export default function App() {

  const [fontsLoaded] = useFonts({
  'Inter-Regular': require('@expo-google-fonts/inter/400Regular'),
  'Inter-Medium': require('@expo-google-fonts/inter/500Medium'),
  'Inter-SemiBold': require('@expo-google-fonts/inter/600SemiBold'),
  'Inter-Bold': require('@expo-google-fonts/inter/700Bold'),
});

  return (

     <SubscriptionProvider>
    <CartProvider>
       <OrderHistoryProvider>

      <AppNavigator />
      </OrderHistoryProvider>

    </CartProvider>
    </SubscriptionProvider>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

