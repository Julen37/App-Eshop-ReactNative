import HomeHeader from '@/components/HomeHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductCard from '@/components/ProductCard';
import { AppColors } from '@/constants/theme';
import { useProductStore } from '@/store/productStore';
import { Product } from '@/type';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { 
  FlatList,
  ScrollView,
  StyleSheet, Text, 
  TouchableOpacity, 
  View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
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
      const reverseProducts = [...products].reverse(); // creer une copie inversée des produits
      setFeaturedProducts(reverseProducts as Product[]); // met a jour le state local featuredProducts
    }
  }, [products]); //selection de produits en vedette quand products change
  
  const navigateToCategory = (category: string) => {
    router.push({
      pathname: '/(tabs)/shop',
      params: {
        category:category
      },
    });
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <LoadingSpinner fullScreen/>
        </View>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    )
  }
  return (
    <View style={styles.wrapper}>
      <HomeHeader/>
      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false} // la barre de scroll
          contentContainerStyle={styles.scrollContainerView}
        >
          <View style={styles.categoriesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Catégories</Text>
            </View>
{/* scrollview categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {categories?.map((category) => (
                <TouchableOpacity 
                  style={styles.categoryButton}
                  key={category}
                  onPress={()=>navigateToCategory(category)}
                >
                  <AntDesign
                    name="tag"
                    size={16}
                    color={AppColors.primary[500]}
                  />
                  <Text style={styles.categoryText}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
{/* meilleures ventes */}
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Meilleures Ventes</Text>
              <TouchableOpacity 
              // onPress={navigateToAllProducts}
              >
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            <FlatList // obligation d'avoir data, key et render pour qu'elle fonctionne
              data={featuredProducts}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.featuredProductsContainer}
              renderItem={({ item }) => (
                <View style={styles.featuredProductContainer}>
                  <ProductCard product={item} compact/>
                </View>
              )}
            />
          </View>
          
        </ScrollView>
      </View>
    </View>
    )

}

const styles = StyleSheet.create({
  wrapper : {
    backgroundColor: AppColors.background.primary,
  },
  container : {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: AppColors.error,
    textAlign: 'center',
  },
  contentContainer: {
    // paddingHorizontal: 20,
    paddingLeft: 20,
  },
  scrollContainerView : {
    paddingBottom: 300,
  },
  categoryText: {
    marginLeft: 6,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: AppColors.text.primary,
    textTransform: 'capitalize',
  },
  categoriesSection : {
    marginTop: 10,
    marginBottom: 16,
  },
  categoryButton : {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.background.secondary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 5,
    minWidth: 100,
  },
  sectionHeader : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 20,
  },
  sectionTitle : {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: AppColors.primary[500]
  },
  featuredProductsContainer : {
    
  },
  featuredProductContainer : {

  },
  seeAllText : {

  },
  featuredSection : {

  }
});
