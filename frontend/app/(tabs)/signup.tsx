import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { AppColors } from '@/constants/theme'
import Wrapper from '@/components/Wrapper'
import { Foundation } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import TextInput from '@/components/TextInput'

const SignupScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");

    const router = useRouter();
    const { signup, isLoading, error } = useAuthStore();

    return (
        <Wrapper>
            <KeyboardAvoidingView
                style={styles.container}
            >
                <ScrollView style={styles.scrollContainer}>
                    <View>
                        <View>
                            <Foundation
                                name='shopping-cart'
                                size={40}
                                color={AppColors.primary[500]}
                            />
                        </View>
                        <Text style={styles.title}>Shopngo</Text>
                        <Text style={styles.subtitle}>Créez un nouveau compte</Text>
                    </View>
                    <View>
                        {error && <Text style={styles.errorText}>{error}</Text>}
                        <TextInput 
                            label='Email'
                            value={email}
                            onChangeText={setEmail}
                            placeholder='Entrez votre email'
                            keyboardType='email-address'
                            autoCapitalize='none'
                            autoCorrect={false}
                            error={emailError}
                        />
                        <TextInput 
                            label='Mot de passe'
                            value={password}
                            onChangeText={setPassword}
                            placeholder='Entrez votre mot de passe'
                            error={passwordError}
                            secureTextEntry
                        />
                        <TextInput 
                            label='Confirmez le mot de passe'
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder='Entrez votre mot de passe'
                            error={confirmError}
                            secureTextEntry
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Wrapper>
    )
}

export default SignupScreen

const styles = StyleSheet.create({
    container : {
    flex: 1,
    // backgroundColor: AppColors.background.primary,
  },
    scrollContainer : {
        flexGrow: 1,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header : {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer : {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: AppColors.primary[50],
        alignItems: "center",
        justifyContent: 'center',
        marginBottom: 16,
    },
    title : {
        fontFamily: 'Inter-Bold',
        fontSize: 28,
        color: AppColors.text.primary,
    },
    subtitle : {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        color: AppColors.text.secondary,
    },
    form : {
        width: "100%",
    },
    button : {
        marginTop: 16,
    },
    footer : {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24
    },
    footerText : {
        fontFamily: "Inter-Regular",
        fontSize: 14,
        color: AppColors.text.secondary,
    },
    link : {
        fontFamily: "Inter-SemiBold",
        fontSize: 14,
        color: AppColors.primary[500],
        marginLeft: 4,
    },
    errorText : {
        color: AppColors.error,
        fontFamily: "Inter-Regular",
        fontSize: 14,
        marginBottom: 16,
        textAlign: "center"
    },
})