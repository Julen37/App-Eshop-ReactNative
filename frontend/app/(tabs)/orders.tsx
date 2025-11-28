import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Wrapper from '@/components/Wrapper';

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

  return (
    <Wrapper>
        <Text>Mes commandes</Text>
    </Wrapper>
  )
}

export default OrdersScreen

const styles = StyleSheet.create({})