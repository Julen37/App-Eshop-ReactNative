import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppColors } from '@/constants/theme'
import Button from '@/components/Button'

const PaymentScreen = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Complétez votre paiement</Text>
        <Text style={styles.subtitle}>
            Veuillez confirmer vos informations de paiement pour finaliser l'achat
        </Text>
        <Text style={styles.totalPrice}>Total: €100</Text>
        <Button
            title='Confirmer votre paiement'
            onPress={() => {}}
            fullWidth
            style={styles.button}
        />
    </View>
  )
}

export default PaymentScreen

const styles = StyleSheet.create({
    container : {
        flex: 1,
        padding: 20,
        backgroundColor: AppColors.background.primary,
        justifyContent: "center",
    },
    title : {
        fontFamily: "Inter-Bold",
        fontSize: 24,
        color: AppColors.text.primary,
        textAlign: "center",
        marginBottom: 16,
    },
    subtitle : {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: AppColors.text.secondary,
        textAlign: "center",
        marginBottom: 32,
    },
    totalPrice : {
        fontFamily: "Inter-Bold",
        fontSize: 20,
        color: AppColors.text.primary,
        textAlign: 'center',
        marginBottom: 20,
    },
    button : {
        marginTop: 20,
    },
})