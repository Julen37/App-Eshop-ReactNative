import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { AppColors } from '@/constants/theme'

const Title = ({children} : {children: React.ReactNode }) => {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
    title : {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        color: AppColors.text.primary
    },
});

export { Title };