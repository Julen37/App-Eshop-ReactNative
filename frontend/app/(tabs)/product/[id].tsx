import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import CommonHeader from '@/components/CommonHeader';
import { AppColors } from '@/constants/theme';
import { Product } from '@/type';
import { getProduct } from '@/lib/api';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import Rating from '@/components/Rating';
import { AntDesign } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoriteStore';

// Récupération de la largeur de l’écran pour les styles responsifs
const {width} = Dimensions.get("window");

// Définition du composant principal de la fiche produit
const SingleProductScreen = () => {

    const {id} = useLocalSearchParams<{ id: string}>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const idNum = Number(id);
    const {addItem} = useCartStore();
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    
    const router = useRouter();
    
    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const data = await getProduct(idNum);
                setProduct(data);
            } catch (error) {
                setError('Failed to fetch product data');
                console.log('Error fetching product data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
        if (id) {
            fetchProductData();
        }
    }, [id]);
    // console.log('Product data:', product);
    
    if (loading) {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <LoadingSpinner fullScreen/>
            </View>
        );
    };
    if (error || !product) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || 'Produit introuvable'}</Text>
                <Button
                    title='Retour'
                    onPress={() => router.back()}
                    style={styles.errorButton}
                    />
            </View>
        );
    };

    const isFav = isFavorite(product?.id);

    const handleAddToCart = () => {
        addItem(product, quantity);
        Toast.show({
            type: 'success',
            text1: `Produit ${product?.title} ajouté au panier`,
            text2: "Voir le panier pour finaliser votre achat",
            visibilityTime: 2000,
        });
    };

    const handleToggleFavorite = () => {
        if (product) {
            toggleFavorite(product);
        };
    };

  return (
    <View style={styles.headerContainerStyle}>
      <CommonHeader isFav={isFav} handleToggleFavorite={handleToggleFavorite}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
            <Image
                source={{uri: product?.image}}
                style={styles.productImage}
                resizeMode='contain'
            />
        </View>
        <View style={styles.productInfo}>
            <Text style={styles.category}>
                {product?.category?.charAt(0).toUpperCase() + product?.category?.slice(1)}
            </Text>
            <Text style={styles.title}>{product?.title}</Text>
            <View style={styles.ratingContainer}>
                <Rating
                    rating={product?.rating?.rate}
                    count={product?.rating?.count}
                />
            </View>
            <Text style={styles.price}>€{product?.price.toFixed(2)}</Text>
            <View style={styles.divider}/>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>{product?.description}</Text>
            <View style={styles.quantityContainer}>
                <Text style={styles.quantityTitle}>Quantité</Text>
                <View style={styles.quantityControls}>
                    <TouchableOpacity 
                        onPress={() => {
                            if (quantity > 1) {
                                setQuantity((prev) => prev-1)
                            }
                        }}
                        disabled={quantity <= 1}
                        style={styles.quantityButton}
                    >
                        <AntDesign
                            name='minus'
                            size={20}
                            color={AppColors.primary[600]}
                        />
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{quantity}</Text>
                    <TouchableOpacity 
                        onPress={() => {
                            setQuantity((prev) => prev+1)
                        }}
                        style={styles.quantityButton}
                    >
                        <AntDesign
                            name='plus'
                            size={20}
                            color={AppColors.primary[600]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.totalPrice}>Total: €{(product?.price * quantity).toFixed(2)}</Text>
        <Button
            title='Ajouter au panier'
            onPress={handleAddToCart}
            style={styles.addToCartButton}
        />
      </View>
    </View>
  )
}

export default SingleProductScreen

const styles = StyleSheet.create({
    addToCartButton : {
        width: "50%",
    },
    totalPrice : {
        fontFamily: "Inter-Bold",
        fontSize: 18,
        color: AppColors.text.primary,
    },
    headerContainerStyle: {
        paddingTop : 30,
        backgroundColor: AppColors.background.primary,
    },
    errorButton : {
        marginTop: 8,
    },
    errorText : {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: AppColors.error,
        textAlign: 'center',
        marginBottom: 16,
    },
    errorContainer : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24, 
    },
    footer : {
        position: 'absolute',
        bottom: 85, //normalement 50
        left: 0,
        right: 0,
        backgroundColor: AppColors.background.primary,
        borderTopWidth: 1,
        borderTopColor: AppColors.gray[200],
        paddingHorizontal: 24,
        paddingVertical: 16,
        paddingBottom: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    quantityValue : {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: AppColors.text.primary,
        paddingHorizontal: 16,
    },
    quantityButton : {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: AppColors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityControls : {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityTitle : {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: AppColors.text.primary,
    },
    quantityContainer : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 55,
    },
    description : {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: AppColors.text.secondary,
        lineHeight: 24,
        marginBottom: 24,
    }, 
    descriptionTitle : {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    divider : {
        height: 1,
        backgroundColor: AppColors.gray[200],
        // marginVertical: 16,
        marginBottom: 16
    },
    price : {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        color: AppColors.primary[600],
        marginBottom: 16,
    },
    ratingContainer : {
        marginBottom: 16,
    },
    title : {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    category : {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: AppColors.text.secondary,
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    productInfo : {
        paddingHorizontal: 24,
        paddingBottom: 120,
        paddingTop: 10,
        backgroundColor: AppColors.background.secondary,
    },
    productImage : {
        width: "80%",
        height: "80%",
    },
    imageContainer : {
        width: width,
        height: width, 
        alignItems: "center",
        justifyContent: 'center'   
    },
    container : {
        flex: 1,
        backgroundColor: AppColors.background.primary,
        position: "relative",
    },
})