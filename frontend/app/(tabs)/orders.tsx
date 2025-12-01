import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Wrapper from '@/components/Wrapper';
import TitleHeader from '@/components/TitleHeader';
import { AppColors } from '@/constants/theme';
import EmptyState from '@/components/EmptyState';
import { Title } from '@/components/customText';
import OrderItem from '@/components/OrderItem';
import Toast from 'react-native-toast-message';
import Loader from '@/components/Loader';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from '@expo/vector-icons';

// Interface TypeScript pour typer une commande
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

// Composant modal qui affiche le détail d’une commande
const OrderDetailsModal = ({
    visible, order, onClose
}: {
    visible: boolean;
    order:Order|null;
    onClose: () => void;
}) => {
    // Valeurs animées pour l’animation d’apparition / disparition du modal
    const translateY = useSharedValue(300);
    const opacity = useSharedValue(0);
    // Gère l’animation du modal quand la prop `visible` change
    React.useEffect(() => {
        if (visible) {
            // Fait remonter le modal avec un effet ressort
            translateY.value = withSpring(0, {damping: 15, stiffness: 100});
            // Fait apparaître le contenu en fondu
            opacity.value = withTiming(1, {duration: 200});
        } else {
            // Fait redescendre le modal en bas de l’écran
            translateY.value = withSpring(300, {duration: 200});
            // Fait disparaître le contenu en fondu
            opacity.value = withTiming(0, {duration: 200});
        }
    }, [visible]);

    // Style animé appliqué au container du modal
    const animateModalStyle = useAnimatedStyle(() =>({
        transform: [{ translateY: translateY.value}],
        opacity: opacity.value,
    }));

    // Si aucune commande sélectionnée, ne rien rendre
    if (!order) return null;

    return (
        <Modal
            animationType='none'
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            {/* Fond semi-transparent derrière le modal */}
            <View style={styles.modalOverlay}>
                {/* Contenu du modal avec animation */}
                <Animated.View style={[styles.modalContent, animateModalStyle]}>
                    {/* Fond en dégradé pour le modal */}
                    <LinearGradient
                        colors={[AppColors.primary[50], AppColors.primary[100]]}
                        style={styles.modalGradient}
                    >
                        {/* En-tête du modal : titre + bouton fermer */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Commande #{order.id} Détails</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Feather
                                    name='x'
                                    size={24}
                                    color={AppColors.text.primary}
                                />
                            </TouchableOpacity>
                        </View>
                        {/* Corps du modal : infos générales de la commande */}
                        <View style={styles.modalBody}>
                            <Text style={styles.modalText}>
                                Total: ${order?.total_price.toFixed(2)}
                            </Text>
                            <Text style={styles.modalText}>
                                Statut: {" "}
                                {order.payment_status === "success"
                                    ? "Paiement effectué"
                                    : "En attente"
                                }
                            </Text>
                            <Text style={styles.modalText}>
                                Passée le: {new Date(order.created_at).toLocaleDateString()}
                            </Text>
                            {/* Liste des articles de la commande */}
                            <Text style={styles.modalText}>Articles: </Text>
                            <FlatList
                                data={order.items}
                                keyExtractor={(item) => item?.product_id.toString()}
                                renderItem={({item}) => (
                                    <View style={styles.itemContainer}>
                                        <Image
                                            source={{ uri: item?.image}}
                                            style={styles.itemImage}
                                        />
                                        {/* Détails de l’article */}
                                        <View style={styles.itemDetails}>
                                            <Text style={styles.itemsTitle}>{item.title}</Text>
                                            <Text style={styles.itemText}>Prix: €{item.price.toFixed(2)}</Text>
                                            <Text style={styles.itemText}>Quantité: {item.quantity}</Text>
                                            <Text style={styles.itemText}>Sous-total: €{(item.price * item.quantity).toFixed(2)}</Text>
                                        </View>
                                    </View>
                                )}
                                style={styles.itemList}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                        {/* Bouton de fermeture du modal */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </Animated.View>
            </View>
        </Modal>
    )

}


// Écran principal listant les commandes de l’utilisateur
const OrdersScreen = () => {
    const { user } = useAuthStore();                                                // Récupère l’utilisateur connecté depuis le store global
    const router = useRouter();
    const [ orders, setOrders ] = useState<Order[]>([]);                            // Liste des commandes de l’utilisateur
    const [ loading, setLoading ] = useState(true);                                 // Indicateur de chargement
    const [ error, setError ] = useState<string | null>(null);                      // Message d’erreur éventuel
    const [ showModal, setShowModal ] = useState(false);                            // Contrôle la visibilité du modal de détails
    const [ refreshing, setRefreshing ] = useState(false);                          // Indicateur de rafraîchissement de la liste
    const [ selectedOrder, setSelectedOrder ] = useState<Order | null>(null);       // Commande sélectionnée pour le modal
  
    // Récupère les commandes de l’utilisateur connecté depuis Supabase
    const fetchOrders = async () => {
        if (!user) {
            // Si pas d’utilisateur, message d’erreur et on arrête
            setError("Connectez-vous pour voir vos commandes");
            setLoading(false);
            return;
        }
        try {
            setLoading(true)
            // Récupère l’utilisateur depuis Supabase (optionnel si tu utilises déjà `user`)
            const {data: {user:supabaseUser},} = await supabase.auth.getUser();
            // console.log(supabaseUser?.email);
            
            // Requête pour récupérer les commandes associées à l’email utilisateur
            const {data, error} = await supabase
                .from("orders")
                .select("id, total_price, payment_status, created_at, items, user_email")
                .eq("user_email", user.email)
                .order("created_at", {ascending: false});

            if (error) {
                // Si la requête échoue, on lève une erreur
                throw new Error(`Failed to fetch orders: ${error.message}`)
            }

            // Met à jour l’état avec les commandes récupérées (ou tableau vide)
            setOrders(data || []);

        } catch (error: any) {
            console.error("Error fetching orders:", error);
            // Stocke le message d’erreur pour affichage à l’écran
            setError(error.message || "Echec dans le chargement de vos commandes");
        } finally {
            // Dans tous les cas, on stoppe l’indicateur de chargement
            setLoading(false);
        }
    };
    // console.log(orders);

    // Quand l’écran prend le focus, on recharge la liste des commandes
    useFocusEffect(
        useCallback(() => {
        fetchOrders();
    }, [user, router]));

    // Supprime une commande par son id
    const handleDeleteOrder = async (orderId:number) => {
        try {
            if (!user) {
                throw new Error('User non connecté');
            }
            //Verifie que la commande existe
            const { data: order, error: fetchError } = await supabase
                .from("orders")
                .select("id, user_email")
                .eq("id", orderId)
                .single();

            if (fetchError || !orders) {
                throw new Error('Commande non trouvée');
            };

            // Supprime la commande dans la table `orders`
            const { error } = await supabase
                .from("orders")
                .delete()
                .eq("id", orderId);
            
            if (error) {
                throw new Error(`Echec de suppresion de commande: ${error?.message}`)
            };
            // Recharge la liste après suppression
            fetchOrders();
            // Affiche une notification de succès
            Toast.show({
                type: "success",
                text1: "Commande supprimée",
                text2: `La commande #${orderId} a été supprimé`,
                position: "bottom",
                visibilityTime: 2000,
            });
        } catch (error) {
            console.error("Erreur dans la suppression de commande:", error);
            // Affiche une alerte en cas d’erreur
            Alert.alert("Error", "Echec lors de la suppression. Essayez encore.");
        };
    };

    // Ouvre le modal pour afficher le détail d’une commande
    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };
    // console.log(setSelectedOrder, setShowModal);

    // Ferme le modal et réinitialise la commande sélectionnée
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    if (loading) {
        return <Loader />
    }

    // Si une erreur existe, on affiche un état d’erreur simple
    if (error) {
        return (
            <Wrapper>
                <TitleHeader title="Mes commandes"/>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Erreur</Text>
                </View>
            </Wrapper>
        )
    }

  return (
    <Wrapper>
        <Title>Mes commandes</Title>
        {orders?.length > 0 ? (
            <FlatList data={orders} 
                contentContainerStyle={{marginTop: 10, paddingBottom: 100}}
                keyExtractor={(item) => item.items.toString()}
                refreshing={refreshing}
                onRefresh={() => {
                    fetchOrders()
                }}
                renderItem={({item}) => (
                    <OrderItem 
                        order={item}
                        email={user?.email} 
                        onDelete={handleDeleteOrder}
                        onViewDetails={handleViewDetails}
                    />
                )}
                showsHorizontalScrollIndicator={false}
            />
        ) : (
            <EmptyState
                type='cart'
                message="Vous n'avez pas de commandes"
                actionLabel='Commencez le shopping'
                onAction={() => router.push("/(tabs)/shop")}
            />
        )}
        <OrderDetailsModal 
            visible={showModal}
            order={selectedOrder}
            onClose={handleCloseModal}
        />
    </Wrapper>
  )
}

export default OrdersScreen

const styles = StyleSheet.create({
    errorContainer : {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText : {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: AppColors.error,
        textAlign: "center",
    },
    listContainer : {
        paddingVertical: 16,
    },
    modalSectionTitle : {
        fontFamily: 'Inter-Bold',
        fontSize: 17,
        color: AppColors.text.primary,
        marginTop: 12,
        marginBottom: 10,
    },
    modalText : {
        fontFamily: "Inter-Regular",
        fontSize: 15,
        color: AppColors.text.primary,
        marginBottom: 10,
    },
    modalBody : {
        marginBottom: 16, 
    },
    modalTitle : {
        fontFamily: "Inter-Bold",
        fontSize: 20,
        color: AppColors.text.primary
    },
    modalHeader : {
        flexDirection: "row",
        justifyContent:'space-between',
        alignItems: "center",
        marginBottom: 16,
    },
    modalGradient : {
        padding: 20,
    },
    modalContent : {
        width: "92%",
        // maxHeight: "85%",
        borderRadius: 16,
        overflow: "hidden",
    },
    modalOverlay : {
        alignItems: "center"
    },
    closeButtonText : {
        fontFamily: "Inter-Meduim",
        color: "#fff",
        fontSize: 15,
    },
    closeButton : {
        backgroundColor: AppColors.primary[500],
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    itemsTitle : {
        fontFamily: "Inter-medium",
        fontSize: 15,
        color: AppColors.text.primary,
        marginBottom: 6,
    },
    itemDetails : {
        flex: 1,
    },
    itemImage : {
        width: 70,
        height: 70,
        resizeMode: "contain",
        marginRight: 12,
        borderRadius: 8,
    },
    itemContainer : {
        paddingBottom: 12,
        backgroundColor: AppColors.background.primary + "80",
        borderRadius: 8,
        padding: 8,
        marginBottom: 4,
    },
    itemList : {
        maxHeight: 320,
    },
    itemText : {
        fontFamily: "Inter-Regular",
        fontSize: 13,
        color: AppColors.text.secondary,
        marginBottom: 4,
    }
})