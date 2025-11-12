import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppColors } from '@/constants/theme'
import Logo from './Logo'

const HomeHeader = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View>
            <Logo/>
        </View>
    </SafeAreaView>
  )
}

export default HomeHeader

const styles = StyleSheet.create({
    container : {
        backgroundColor: AppColors.background.primary,
        marginTop: Platform.OS === 'android' ? 35 : 0,
    },
    header : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})