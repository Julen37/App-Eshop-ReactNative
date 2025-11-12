import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/theme';

const Logo = () => {
    const router = useRouter(); // permet la navigation entre les differents écrans/pages
  return (
    <TouchableOpacity style={styles.logoView} onPress={() => router.push("/")}> 
    {/* TouchableOpacity est un conteneur qui rend son contenu cliquable + effet visuel d'opacité quand on appui dessus 
    reagit pareil sur ios et android comparé a button / tout le contenu devient cliquable donc attention 
    onPress pcq on est sur mobile, y a pas de onclick / prend le router pour aller sur la home page quand on clique dessus
    */}
        <MaterialIcons
            name="shopping-cart" 
            size={25}
            color={AppColors.primary[700]}
        /> {/* Une autre librairie d'icons */}
        <Text style={styles.logoText}>Shop&Go</Text>
    </TouchableOpacity>
  )
}

export default Logo

const styles = StyleSheet.create({
    logoView : {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText : {
        fontSize: 20,
        marginLeft: 2,
        fontFamily: 'Inter-Bold',
        color: AppColors.primary[700],
    }
})