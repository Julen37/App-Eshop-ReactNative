import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import MainLayout from '@/components/MainLayout';
import EmptyState from '@/components/EmptyState';
import { AppColors } from '@/constants/theme';
import { Title } from '@/components/customText';
import CartItem from '@/components/CartItem';
import Button from '@/components/Button';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import axios from "axios";

const CartScreen = () => {
  const router = useRouter();

  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const subtotal = getTotalPrice();
  const shippingCost = subtotal > 100 ? 5.99 : 0;
  const total = subtotal + shippingCost;

  // Fonction asynchrone pour la passation de commande
  const handlePlaceOrder = async() => {
    // Vérifie si l’utilisateur est connecté
    if(!user) {
      Toast.show({
        type: "error",
        text1: "Connexion requise",
        text2: "Svp connectez vous pour passer commande",
        position: "bottom",
        visibilityTime: 2000,
      });
      // arrêt si non connecté
      return;
    }

  try {
    setLoading(true);

    // Préparation des données de commande pour insertion dans Supabase
    const orderData = {
      user_email: user?.email,
      total_price: total,
      items: items.map((item) => ({
        product_id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      payment_status: "En attente",
    };

    // Insertion de la commande dans la table "orders" de Supabase
    const {data, error} = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

      // Gestion erreur insertion
      if (error) {
        throw new Error(`Echec de sauvegarde de la commande: ${error.message}`);
      }
      
      // Préparation du payload à envoyer au serveur de paiement Stripe
      const payload= {
        price: total,
        email: user?.email,
      };

      // Envoi de la requête POST au serveur local qui gère le paiement (adresse à adapter avec ipconfig / ipv4)
      const response = await axios.post(
        "http://192.168.43.10:8000/checkout", //reseau perso
        // "http://aremplir:8000/checkout", //maison
        // "http://localhost:8000/checkout",
        payload,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      // console.log("response:", response);
      // Récupération des données de paiement Stripe dans la réponse
      const { paymentIntent, ephemeralKey, customer } = response.data;
      // console.log("res", paymentIntent, ephemeralKey, customer);
      if (!paymentIntent || !ephemeralKey || !customer) {
        throw new Error("Données Stripe requises manquantes depuis le serveur");
      } else {
        // Affichage de la confirmation commande
        Toast.show({
          type: "success",
          text1: "Commande passée",
          text2: "Commande passée avec succés",
          position: "bottom",
          visibilityTime: 2000,
        });
        // Navigation vers l’écran de paiement avec données Stripe et Id commande Supabase
        router.push({
          pathname: "/(tabs)/payment",
          params: {
            paymentIntent,
            ephemeralKey,
            customer,
            orderId:data.id, // Id de la commande pour suivi/maj
            total: total,
          },
        });
      }

  } catch (error) {
    // Gestion des erreurs générales avec notification toast
    Toast.show({
        type: "error",
        text1: "Commande échouée",
        text2: "Echec de la commande",
        position: "bottom",
        visibilityTime: 2000,
    });
    console.log("Erreur de la commande", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <MainLayout>
      {items?.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.headerView}>
            <View style={styles.header}>
              <Title>Produits du panier</Title>
              <Text style={styles.itemCount}>{items?.length} produits</Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => clearCart()}>
                <Text style={styles.resetText}>Vider le panier</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id.toString()}
            renderItem={({item}) => ( 
              <CartItem product={item.product} quantity={item.quantity}/>
            )}
            contentContainerStyle={styles.cartItemsContainer}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-total: </Text>
              <Text style={styles.summaryValue}>€{subtotal.toFixed(2)}</Text>
            </View>
            {shippingCost > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Frais de port: </Text>
                <Text style={styles.summaryValue}>€{shippingCost.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total: </Text>
              <Text style={styles.summaryValue}>€{total.toFixed(2)}</Text>
            </View>
            <Button
              title='Passer commande'
              fullWidth
              style={styles.checkoutButton}
              disabled = {!user || loading}
              onPress={handlePlaceOrder}
            />
            {!user && (
              <View style={styles.alertView}>
                <Text style={styles.alertText}>
                  Connectez-vous pour passer commande
                </Text>
                <Link href={"/(tabs)/login"}>
                  <Text style={styles.loginText}>Connexion</Text>
                </Link>
              </View>

            )}
          </View>
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