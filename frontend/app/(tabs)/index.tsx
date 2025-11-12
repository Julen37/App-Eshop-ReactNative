import HomeHeader from '@/components/HomeHeader';
import { 
  StyleSheet, Text, 
  View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
      <View>
        <HomeHeader/>
      </View>
  )
}

const styles = StyleSheet.create({
  
});
