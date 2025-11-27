import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import MainLayout from '@/components/MainLayout';
import EmptyState from '@/components/EmptyState';
import { AppColors } from '@/constants/theme';
import { Title } from '@/components/customText';

const CartScreen = () => {
  const router = useRouter();

  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  return (
    <MainLayout>
      {items?.length > 0 ? (
        <View style={styles.header}>
          <Title>Produits du panier</Title>
          <Text style={styles.itemCount}>{items?.length} produits</Text>
        </View>
      ) : (
        <EmptyState
          type='cart'
          message='Votre panier est vide'
          actionLabel='Commencez vos achats'
          onAction={() => router.push("/(tabs)/shop")}
        />
      )}
    </MainLayout>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  container : {
    flex: 1,
    position: 'relative',
    // backgroundColor: AppColors.background.secondary,
  },
   resetText : {
    color: AppColors.error
  },
  headerView : {
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'flex-start'
  },
  header : {
    paddingBottom: 16,
    paddingTop: 7,
    backgroundColor: AppColors.background.primary,
  },
  itemCount : {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: AppColors.text.secondary,
    marginTop: 4,
  },
  cartItemsContainer : {
    paddingVertical: 16,
  },
  summaryContainer : {
    // position: 'absolute',
    // bottom: 200,
    // width: "100%",
    backgroundColor: AppColors.background.primary,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray[200],
  },
  summaryRow : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel : {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: AppColors.text.secondary
  },
  summaryValue : {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: AppColors.text.primary,
  },
  divider : {
    height: 1,
    backgroundColor: AppColors.gray[200],
    marginVertical: 12,
  },
  totalLabel : {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.text.primary,
  },
  totalValue : {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: AppColors.primary[600],
  },
  checkoutButton : {
    marginTop: 16,
  },
  alertView : {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText : {
    fontWeight: "500",
    textAlign: 'center',
    color: AppColors.error,
    marginRight: 3,
  },
  loginText : {
    fontWeight: "700",
    color: AppColors.primary[500]
  },
})