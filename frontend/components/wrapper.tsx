import { 
    StyleSheet, Text, 
    View, Platform } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/theme';

// sert de conteneur sûr/sécurisé pour l'affichage de contenu
const wrapper = ({ children } : {children: React.ReactNode}) => { 
// le typage react.reactNode sert a typer la props du children, 
// represente tous ce que react peut return, 
// ca garantie que ca va accepter tous ce qui va etre mit
// rend le typage large / laxiste
  return (
    <SafeAreaView style={styles.safeView}> {/* SafeAreaView prend en compte les zone a eviter sur les differents mobile */}
        <View style={styles.container}> {/* View est la vue principale contenant le contenu enfant */}
            {children} {/* children affiche dynamiquement ce que le wrapper enveloppera */}
        </View> 
    </SafeAreaView>
  )
}

export default wrapper

const styles = StyleSheet.create({
    safeView : {
        flex: 1,
        backgroundColor: AppColors.background.primary, // les couleurs qu'on a mit dans theme.ts
        marginTop: Platform.OS === 'android' ? 30 : 0, // precise la plateforme, si c'est android on met margintop 30 sinon 0 pcq ios le fait automatiquement
    },
    container : {
        flex: 1,
        backgroundColor: AppColors.background.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
    }
})