import HomeHeader from '@/components/HomeHeader';
import { useProductStore } from '@/store/productStore';
import { Product } from '@/type';
import { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, 
  View } from 'react-native';

export default function HomeScreen() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]); //state local pour stocker les produits vedette
  
  const { 
    products, categories, 
    fetchProducts, fetchCategories,
    loading, error,
  } = useProductStore(); // extraction des données et methodes depuis le store zustand
  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []); // chargement des produtis et categories a l'ouverture de l'ecran

  useEffect(() => {
    if (products.length > 0) {
      const reverseProducts = [...products].reverse();
      setFeaturedProducts(reverseProducts as Product[]);
    }
  }, [products]); //selection de produits en vedette quand products change

  return (
      <View>
        <HomeHeader/>
      </View>
  )
}

const styles = StyleSheet.create({
  
});
