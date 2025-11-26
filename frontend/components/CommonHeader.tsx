import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AppColors } from '@/constants/theme'
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

interface Props {
    isFav?: boolean;
    showCart?: boolean;
    handleToggleFavorite?: () => void;
};

const CommonHeader = ({isFav, showCart, handleToggleFavorite}:Props) => {
    const router = useRouter();
    const handleGoBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/');
        }
    };

  return (
    <View style={styles.header}>
        {/* go back */}
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}> 
            <Feather
                name='arrow-left' size={24}
                color={AppColors.text.primary}
            />
        </TouchableOpacity>
        <View style={styles.buttonView}> 
            {/* fav heart */}
            <TouchableOpacity
                style={[
                    styles.favoriteButton,
                    isFav && styles.activeFavoriteButton
                ]}
                onPress={handleToggleFavorite}
            >
                <AntDesign
                    name='heart'
                    size={24}
                    color={
                        isFav ? AppColors.background.primary : AppColors.text.primary
                    }
                    fill={isFav ? AppColors.background.primary : "transparent"}
                />
            </TouchableOpacity>
            {/* cart */}
            <TouchableOpacity 
                style={[
                    styles.favoriteButton,
                    isFav && styles.activeFavoriteButton
                ]}
                onPress={()=> router.push("/(tabs)/cart")}
            >
                <MaterialCommunityIcons
                    name='cart-outline'
                    size={24}
                    color={
                        isFav ? AppColors.background.primary : AppColors.text.primary
                    }
                    fill={isFav ? AppColors.background.primary : "transparent"}
                />
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default CommonHeader

const styles = StyleSheet.create({
    header : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        zIndex: 10,
        marginTop: Platform.OS === "android" ? 35 : 0,
    },
    backButton : {
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.background.secondary,
    },
    favoriteButton : {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: AppColors.background.secondary,
    },
    activeFavoriteButton : {
        backgroundColor: AppColors.error,
    },
    buttonView : {
        flexDirection: 'row',
        gap: 7,
    },
})