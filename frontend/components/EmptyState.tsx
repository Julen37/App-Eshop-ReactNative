import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppColors } from '@/constants/theme'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Button from './Button';

type EmptyStateType = "cart" | "search" | "favorites" | "orders" | "profile";
interface EmptyStateProps {
    type: EmptyStateType;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
}

const EmptyState:React.FC<EmptyStateProps> = ({
    type, message,
    actionLabel, onAction,
}) => {
    const size = 64;
    const color = AppColors.gray[400];
    const getIcon = () => {
        switch (type) {
            case "cart":
                return <AntDesign name='shopping-cart' size={size} color={color}/>
            case "search":
                return <Ionicons name='search' size={size} color={color}/>
            case "favorites":
                return <AntDesign name='heart' size={size} color={color}/>        
            default:
                return <AntDesign name='user' size={size} color={color}/>
        }
    };
    const getDefaultMessage = () => {
        switch (type) {
            case "cart":
                return "Votre panier est vide";
            case "search":
                return "Aucun produit trouvé";
            case "favorites":
                return "Votre liste est vide";
            default:
                return "Rien à voir ici"
        }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.iconContainer}>{getIcon()}</Text>
      <Text style={styles.message}>{message || getDefaultMessage()}</Text>
      {actionLabel && onAction && (
        <Button
            title={actionLabel}
            onPress={onAction}
            variant='primary'
            style={styles.button}
        />
      )}
    </View>
  )
}

export default EmptyState

const styles = StyleSheet.create({
     container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    iconContainer:{
        marginBottom: 16,
    },
    message:{
        fontSize: 18,
        color: AppColors.text.secondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        marginTop: 16,
    },
})