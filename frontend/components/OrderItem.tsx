import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { AppColors } from '@/constants/theme';

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
}

const OrderItem = ({order, onDelete, email}: Props) => {
    const isPaid = order?.payment_status === "success";
    const [loading, setLoading] = useState(false);

    const handlePayNow = () => {

    }

  return (
    <View style={styles.orderView}>
        <View style={styles.orderItem}>
            <Text style={styles.orderId}>Commande #{order?.id}</Text>
            <Text>Total: €{order?.total_price.toFixed(2)}</Text>
            <Text style={[styles.orderStatus,
                {color: isPaid ? AppColors.success : AppColors.error}
            ]}>
                Statut: {isPaid ? "Paiement effectué" : "En attente"}
            </Text>
            <Text style={styles.orderDate}>
                Passé le: {new Date(order.created_at).toLocaleDateString()}
            </Text>
            {!isPaid && (
                <TouchableOpacity
                    onPress={handlePayNow}
                    style={styles.payNowText}
                >
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