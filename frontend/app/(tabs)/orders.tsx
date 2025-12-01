import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
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

const OrdersScreen = () => {
    const { user } = useAuthStore();
    const router = useRouter();
    const [ orders, setOrders ] = useState<Order[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    const fetchOrders = async () => {
        if (!user) {
            setError("Connectez-vous pour voir vos commandes");
            setLoading(false);
            return;
        }
        try {
            setLoading(true)
            const {data: {user:supabaseUser},} = await supabase.auth.getUser();
            // console.log(supabaseUser?.email);
            
            const {data, error} = await supabase
                .from("orders")
                .select("id, total_price, payment_status, created_at, items, user_email")
                .eq("user_email", user.email)
                .order("created_at", {ascending: false});

            if (error) {
                throw new Error(`Failed to fetch orders: ${error.message}`)
            }

            setOrders(data || []);

        } catch (error: any) {
            console.error("Error fetching orders:", error);
            setError(error.message || "Echec dans le chargement de vos commandes");
        } finally {
            setLoading(false);
        }
    };
    // console.log(orders);

    useEffect(() => {
        fetchOrders();
    }, [user]);

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

            // réalise le delete
            const { error } = await supabase
                .from("orders")
                .delete()
                .eq("id", orderId);
            
            if (error) {
                throw new Error(`Echec de suppresion de commande: ${error?.message}`)
            };
            fetchOrders();
            Toast.show({
                type: "success",
                text1: "Commande supprimée",
                text2: `La commande #${orderId} a été supprimé`,
                position: "bottom",
                visibilityTime: 2000,
            });
        } catch (error) {
            console.error("Erreur dans la suppression de commande:", error);
            Alert.alert("Error", "Echec lors de la suppression. Essayez encore.");
        };
    };

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
                renderItem={({item}) => (
                    <OrderItem 
                        order={item}
                        email={user?.email} 
                        onDelete={handleDeleteOrder}
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
        maxHeight: "85%",
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