import { StyleSheet, Text, 
        View, ActivityIndicator } from 'react-native';
import React from 'react';
import { AppColors } from '@/constants/theme';

interface LoadingSpinnerProps {
    size?: "small" | "large";
    color?: string;
    text?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size= "small",
    color = AppColors.primary[500],
    text = "Loading..",
    fullScreen= false,
}) => {
// si fullscreen est true, on retourne un spinner dans une view stylée
    if (fullScreen) {
        return (
          <View style={styles.fullScreen}>
            <ActivityIndicator size={size} color={color}/>
            {text && <Text style={styles.text}>{text}</Text>}
          </View>
        );
    }
// sinon on retourne le spinner dans une view container
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color}/>
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    )
}

export default LoadingSpinner

const styles = StyleSheet.create({
    container : {
        padding: 16,
        alignContent: 'center',
        justifyContent: 'center',
    },
    fullScreen : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.background.primary,
    },
    text : {
        marginTop: 8,
        fontSize: 14,
        color: AppColors.text.primary,
    }
})