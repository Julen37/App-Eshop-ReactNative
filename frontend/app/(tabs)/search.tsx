import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { AppColors } from '@/constants/theme'
import Wrapper from '@/components/Wrapper'
import { useProductStore } from '@/store/productStore'
import TextInput from '@/components/TextInput'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import ProductCard from '@/components/ProductCard'

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeOutRef = useRef<number | null>(null);
  const {
    filteredProducts,
    loading, fetchProducts,
    searchProductsRealTime, error
  } = useProductStore();

  useEffect(() => {
    if (filteredProducts?.length === 0) {
      fetchProducts();
    }
    //clear timeout on component unmount
    return() => {
      if (searchTimeOutRef.current) {
        clearTimeout(searchTimeOutRef.current);
      }
    };
  }, []);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (searchTimeOutRef.current) {
      clearTimeout(searchTimeOutRef.current);
    }
    if (text.length >= 3) {
      searchTimeOutRef.current = setTimeout(() => {
        searchProductsRealTime(text)
      }, 500);
    } else {
      searchProductsRealTime('')
    }
  };
  const handleClearSearch = () => {
    setSearchQuery("");
    searchProductsRealTime("");
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>Recherche de produits</Text>
        {/* searchbar */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                value={searchQuery}
                onChangeText={handleSearchChange}
                placeholder='Rechercher un produit'
                style={styles.searchInput}
                imputStyle={styles.searchInputStyle}
              />
              {searchQuery?.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClearSearch}
                >
                  <AntDesign
                    name='close'
                    size={16}
                    color={AppColors.gray[500]}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => searchProductsRealTime(searchQuery)}
            style={styles.searchButton}
          >
            <Ionicons
              name='search'
              size={24}
              color={AppColors.background.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  return (
    <Wrapper>
      {renderHeader()}
      {loading ? (
        <LoadingSpinner/>
      ) : error ? (
        <View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </View>
      ) : filteredProducts?.length === 0 && searchQuery ? (
        <EmptyState
          type='search'
          message='Pas de produits correspondant'
        />
      ) : (
        <FlatList
          data={searchQuery ? filteredProducts : []}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({item}) => (
            <View style={styles.productContainer}>
              <ProductCard
                product={item}
                customStyle={{width: '100%'}}
              />
            </View>
          )}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.columnWrapper}
          ListFooterComponent={<View style={styles.footer}/>}
          ListEmptyComponent={
            !searchQuery ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>Saisissez au moins 3 lettres afin de lancer la recherche</Text>
              </View>
            ) : null
          }
        />
      )}
    </Wrapper>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  header : {
    paddingBottom: 16,
    backgroundColor: AppColors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  title : {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: AppColors.text.primary,
    marginBottom: 16,
  },
  searchRow : {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
  },
  searchContainer : {
    flex: 1,
  },
  inputWrapper : {
    position: "relative",
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput : {
    marginBottom: 0,
    flex: 1,
  },
  searchInputStyle : {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 8,
    borderColor: 'transparent',
    paddingRight: 40,
  },
  clearButton : {
    position: 'absolute',
    right: 12,
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: AppColors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  searchButton : {
    backgroundColor: AppColors.primary[500],
    borderRadius: 8,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  productsGrid : {
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  columnWrapper : {
    justifyContent: 'space-between',
  },
  productContainer : {
    width: "48%",
    marginBottom: 16,
  },
  footer : {
    height: 100,
  },
  errorContainer : {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText : {
    color: AppColors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyStateContainer : {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText : {
    fontSize: 16,
    color: AppColors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
})