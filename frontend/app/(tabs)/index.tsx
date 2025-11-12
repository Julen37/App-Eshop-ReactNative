import HomeHeader from '@/components/HomeHeader';
import { useState } from 'react';
import { 
  StyleSheet, Text, 
  View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  return (
      <View>
        <HomeHeader/>
      </View>
  )
}

const styles = StyleSheet.create({
  
});
