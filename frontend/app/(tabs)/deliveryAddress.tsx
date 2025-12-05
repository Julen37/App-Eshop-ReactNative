import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppColors } from '@/constants/theme'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase'
import Button from '@/components/Button'

// Composant React Native pour gérer l'ajout d'une adresse de livraison à une commande existante.
const DeliveryAddressScreen: React.FC = () => {

    // Récupération des informations d'utilisateur depuis le store d'authentification.
    const { user } = useAuthStore();
    const router = useRouter();

    // États locaux pour gérer :
    // - address : l'adresse saisie par l'utilisateur
    // - loading : l'état de chargement des requêtes asynchrones
    // - orderId : l'identifiant de la dernière commande de l'utilisateur
    const [ address, setAddress ] = useState<string>('');
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ orderId, setOrderId ] = useState<string | null>(null);

    // useEffect exécuté au montage du composant ou chaque fois que 'user' change.
    // Il récupère la dernière commande de l'utilisateur connecté.
    useEffect(() => {
        const fetchLastOrder = async () => {
            // Si aucun utilisateur n'est connecté, on quitte la fonction.
            if (!user) return;
            setLoading(true);
            
            const { data, error } = await supabase
                .from("orders")
                .select("id")
                .eq("user_email", user.email)
                // Trie par date de création décroissante.
                .order("created_at", {ascending: false})
                // On ne récupère qu'une seule commande.
                .limit(1)
                // Résultat attendu : un seul objet (et non un tableau).
                .single();
            setLoading(false);
            console.log('Debug:', {data, error}); //pour voir ce qu'il se passe

            // Gestion des erreurs ou mise à jour du state selon la réponse.
            if (error) {
                console.log('Error:', error);
                Alert.alert("Erreur", "Impossible de récupérer votre commande"); // a regler ca s'affiche h24 dès qu'il y a un changement?
            } else if (data) {
                console.log('OrderId:', data.id);
                // On mémorise l'ID de la commande trouvée.
                setOrderId(data.id);
            } else {
                console.log('Info: Aucune commande trouvée');
            }
        };
        fetchLastOrder();
    }, [user]);

    // Fonction déclenchée lors du clic sur le bouton "Ajouter l'adresse"
    const handleAddAddress = async () => {
        console.log('User:', user?.id, 'OrderId:', orderId); // verification

        // Vérifie s'il y a bien une commande active pour cet utilisateur.
        if (!user || !orderId) {
            Alert.alert("Erreur", "Aucune commande récente trouvée pour l'ajout d'adresse");
            return;
        }

        // Vérifie que le champ adresse n'est pas vide ou composé uniquement d'espaces.
        if (!address.trim()) {
            Alert.alert("Validation", "L'adresse ne peut pas être vide");
            return;
        }
        setLoading(true);

        // Mise à jour de toutes les commandes avec la nouvelle adresse de livraison.
        const { error } = await supabase
            .from("orders")
            .update({delivery_address: address})
            .eq("id", orderId);
        setLoading(false);

        // Gestion de la réponse de la base de données.
        if (error) {
            Alert.alert("Erreur", "Impossible d'ajouter l'adresse");
        } else {
            Alert.alert("Succés", "Adresse ajouté avec succés");
            router.back(); // Retour à la page précédente.
        };
    };

    // Interface utilisateur avec champ de saisie et bouton d'action.
    return (
        <View style={styles.container}>
            <Text style={styles.containerTitle}>Ajouter une adresse de livraison</Text>
            <TextInput
                style={styles.input}
                placeholder='Entrez votre adresse'
                value={address}
                onChangeText={setAddress}
                multiline
                editable={!loading}
            />
            <Button
                onPress={handleAddAddress}
                title={loading ? "Chargement.." : "Ajouter l'adresse"}
                fullWidth
                style={styles.button}
            />
        </View>
    );
};

export default DeliveryAddressScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20,
        backgroundColor: AppColors.background.primary,
    },
    containerTitle: {
        fontFamily: "Inter-Regular",
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        height: 100,
        borderColor: AppColors.gray[300],
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        padding: 10,
        textAlignVertical: 'top',
    }, 
    button: {
    marginTop: 16,
  },
})