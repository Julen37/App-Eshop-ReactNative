import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { AppColors } from '@/constants/theme'
import Wrapper from '@/components/Wrapper'
import { Foundation } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import TextInput from '@/components/TextInput'
import Button from '@/components/Button'

const LoginScreen = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  const validateForm = () => {
    let isValid = true;
    // validation email
    if (!email.trim()) {
        setEmailError('Email obligatoire');
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) { //regex
        setEmailError('Adresse email invalide');
        isValid = false;
    } else {
        setEmailError("");
    }
    // validation mdp
    if (!password) {
        setPasswordError('Mot de passe obligatoire');
        isValid = false;
    } else if (password.length < 6) {
        setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
        isValid = false;
    } else {
        setPasswordError("");
    }
    return isValid
  }

  const handleLogin = async () => {
    if (validateForm()) {
        await login(email, password);
        router.push("/(tabs)/profile");
        setEmail("");
        setPassword("");
    }
  }

  return (
    <Wrapper>
      <KeyboardAvoidingView>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Foundation
                name='shopping-cart'
                size={40}
                color={AppColors.primary[500]}
              />
            </View>
            <Text style={styles.title}>Shopngo</Text>
            <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
          </View>
          <View style={styles.form}>
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
                        <Button
                            onPress={handleLogin}
                            title='Connexion'
                            fullWidth
                            loading={isLoading}
                            style={styles.button}
                        />
                    </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Wrapper>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: AppColors.background.primary,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title : {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  subtitle : {
    fontFamily: 'Inter-Regular',
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
    marginTop: 16,
  },
  footerText : {
    fontFamily: 'Inter-Regular',
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
    textAlign: 'center'
  },
})