import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { AppColors } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { useRouter } from 'expo-router';

interface Order {
    id: number;
    total_price: number;
    payment_status: string;
    created_at: string;
    items: {
        product_id: number;
        title: string;
        price: number;
        quantity: number;
        image: string;
    }[];
}

interface Props {
    order: Order;
    onDelete: (id: number) => void;
    email: string | undefined;
    onViewDetails: (order:Order) => void;
}

const OrderItem = ({order, onDelete, email, onViewDetails}: Props) => {
    // Vérifie si la commande est déjà payée (status exact "success")
    const isPaid = order?.payment_status === "success";

    // États pour le bouton de paiement 
    const [loading, setLoading] = useState(false);      // Affiche le spinner pendant l'API
    const [disable, setDisable] = useState(false);      // Désactive le bouton pendant le traitement
    const router = useRouter();

    // Initialise le paiement Stripe via l'API backend
    const handlePayNow = async () => {
        setLoading(true);
        setDisable(true);
        // Payload envoyé au backend pour créer l'intention de paiement
        const payload = {
            price: order?.total_price,
            email: email,
        };
        try {
            // Appel API vers le backend pour créer l'intention Stripe
            const response = await axios.post(`${BASE_URL}`, // enlever /checkout sinon ca fait doublon avec base_url
                payload, {
                    headers: { "Content-Type": "application/json" },
                }
            );
            const { paymentIntent, ephemeralKey, customer } = response.data;
            // console.log(paymentIntent, ephemeralKey, customer);
             // Demande confirmation avant redirection vers l'écran de paiement
            if (response?.data) {
                Alert.alert("Payer maintenant", `Initiation du paiement pour la commande #${order?.id}`, [
                    {text: "Annuler"},
                    {text: "Payer", onPress: () => {
                        // Redirige vers l'écran de paiement avec tous les params Stripe
                        router.push({
                            pathname: "/(tabs)/payment",
                            params: {
                                paymentIntent, ephemeralKey,
                                customer,
                                orderId: order?.id,
                                total: order?.total_price,
                            }
                        });
                    }},
                ]);
            };
            
        } catch (error) {
            console.error("Erreur dans l'action de vouloir payer la commande:", error);
            Alert.alert("Error", "Echec lors de l'action de payer. Essayez encore.");
        } finally {
            // Remet le bouton dans son état normal
            setLoading(false);
            setDisable(false);
        }
    };

    // Demande confirmation avant suppression de la commande
    const handleDelete = () => {
        Alert.alert(
            "Supprimer la commande",
            `Etes-vous sûr de vouloir supprimer la commande #${order?.id} ?`,
            [{
                text: "Annuler",
                style: "cancel",
            },
            {
                text: "Supprimer",
                style: "destructive",
                onPress: () => onDelete(order?.id),
            }]
        );
    };

  return (
    <View style={styles.orderView}>
        {/* Conteneur principal de l'article de commande */}
        <View style={styles.orderItem}>
            {/* Identifiant de la commande */}
            <Text style={styles.orderId}>Commande #{order?.id}</Text>
            {/* Montant total */}
            <Text>Total: €{order?.total_price.toFixed(2)}</Text>
            {/* Statut avec couleur conditionnelle (vert/rouge) */}
            <Text style={[
                styles.orderStatus,
                {color: isPaid ? AppColors.success : AppColors.error}
            ]}>
                Statut: {isPaid ? "Paiement effectué" : "En attente"}
            </Text>
            {/* Date de création formatée */}
            <Text style={styles.orderDate}>
                Passé le: {new Date(order.created_at).toLocaleDateString()}
            </Text>
            {/* Zone des boutons d'action */}
            <View style={styles.buttonContainer}>
                {/* Bouton "Détails" (toujours visible) */}
                <TouchableOpacity
                    onPress={() => onViewDetails(order)}
                    style={styles.viewDetailsButton}
                >
                    <Text style={styles.viewDetailsText}>Détails</Text>
                </TouchableOpacity>
                {/* Bouton "Payer" (SEULEMENT si non payé) */}
                {!isPaid && (
                    <TouchableOpacity
                        disabled={disable}
                        onPress={handlePayNow}
                        style={styles.payNowButton}
                    >
                        {/*Spinner pendant l'appel API */}
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                color={AppColors.background.primary}
                            />
                        ) : (
                            <Text style={styles.payNowText}>Payer</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
        {/* Image du premier article (conditionnelle) */}
        {order?.items[0]?.image && (
            <Image 
                source={{ uri: order?.items[0]?.image }}
                style={styles.image}
            />
        )}
        {/* Bouton supprimer (icône corbeille en bas à droite) */}
        <TouchableOpacity
            onPress={handleDelete} 
            style={styles.deleteButton}
        >
            <Feather
                name='trash-2'
                color={AppColors.error}
                size={20}
            />
        </TouchableOpacity>
    </View>
  )
}

export default OrderItem

const styles = StyleSheet.create({
    orderView : {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        backgroundColor: AppColors.background.primary,
        padding: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
        borderColor: AppColors.gray[200],
    },
    orderItem :{
        flex: 1,
    },
    orderId : {
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        color: AppColors.text.primary,
        marginBottom: 4,
    },
    orderTotal : {
        fontFamily: "Inter-Medium",
        fontSize: 16,
        color: AppColors.text.primary,
        marginBottom: 4,
    },
    orderStatus : {
        fontFamily: "Inter-Regular",
        fontSize: 14,
        color: AppColors.text.secondary,
        marginBottom: 4
    },
    orderDate : {
        fontFamily: "Inter-Regular",
        fontSize: 12,
        color: AppColors.text.secondary
    },
    image : {
        width: 80,
        height: 80,
        resizeMode: "contain",
        marginLeft: 12,
    },
    deleteButton : {
        padding: 8,
        marginLeft: 12,
    },
    payNowButton : {
        marginTop: 8, 
        backgroundColor: AppColors.primary[500],
        paddingVertical: 6,
        width: 80,
        borderRadius: 4,
        alignSelf: 'flex-start',
        // justifyContent: 'center',
        alignItems: 'center'
    },
    payNowText : {
        fontFamily: 'Inter-Medium',
        color: AppColors.background.primary,
        fontSize: 14,
    },
    buttonContainer : {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "flex-start",
        gap: 12,
        marginTop: 8,
    },
    viewDetailsText : {
        fontFamily: "Inter-Medium",
        color: "#fff",
        fontSize: 14,
    },
    viewDetailsButton : {
        backgroundColor: AppColors.primary[600],
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
})