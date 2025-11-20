import { 
  Alert,
  Platform,
  StyleSheet, Text, 
  TouchableOpacity, 
  View } from 'react-native';
import Wrapper from '@/components/Wrapper';
import { AppColors } from '@/constants/theme';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/Button';
import { Feather, FontAwesome5, Foundation, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

// Composant écran Profil utilisateur
const ProfileScreen = () => {
// Extraction des fonctions et états depuis le store d'authentification personnalisé
const { user, logout, checkSession, isLoading } = useAuthStore();
const router = useRouter();

// useEffect déclenché à chaque changement de l'utilisateur (user)
useEffect(() => {
  // Si utilisateur non connecté, vérifie la session en cours (reconnexion automatique)
  if (!user) {
    checkSession();
  }
}, [user]);

const handleLogout = async () => {
    Alert.alert("Déconnexion", "Etes vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        onPress: async() => {
          try {
            await logout()
            Toast.show({
              type: "success",
              text1: "Déconnexion réussi",
              text2: "Vous avez été déconnecté",
              visibilityTime: 2000,
            });
          } catch (error) {
            console.error("Profil: Erreur pendant la déconnexion", error);
            Alert.alert("Erreur de déconnexion", "Une erreur est survenue");
          }
        },
      },
    ]);

  }

const menuItems = [
  {
    id:'cart',
    icon:(
      <Foundation
        name='shopping-cart'
        size={20}
        color={AppColors.primary[500]}
      />
    ),
    title: 'Mon panier',
    onPress: () => {
      router.push("/(tabs)/cart");
    }
  },
  {
    id:'orders',
    icon:(
      <FontAwesome5
        name='box-open'
        size={16}
        color={AppColors.primary[500]}
      />
    ),
    title: 'Mes commandes',
    onPress: () => {
      router.push("/(tabs)/orders");
    }
  },
  {
    id:'payment',
    icon:(
      <Foundation
        name='credit-card'
        size={20}
        color={AppColors.primary[500]}
      />
    ),
    title: 'Mes paiements',
    onPress: () => {
      
    }
  },
  {
    id:'address',
    icon:(
      <Foundation
        name='home'
        size={20}
        color={AppColors.primary[500]}
      />
    ),
    title: 'Adresse de livraison',
    onPress: () => {

    }
  },
  {
    id:'settings',
    icon:(
      <Ionicons
        name='settings'
        size={19}
        color={AppColors.primary[500]}
      />
    ),
    title: 'Paramètres',
    onPress: () => {

    }
  },
]

  return (
    <Wrapper>
      {user ? (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Mon Profil</Text>
          </View>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Feather
                name='user'
                size={40}
                color={AppColors.gray[400]}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <TouchableOpacity>
                <Text style={styles.editProfileText}>Modifier mon profil</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.menuContainer}>
            {menuItems?.map((item) => (
              <TouchableOpacity 
                key={item?.id}
                style={styles.menuItem}
                onPress={item?.onPress}
              >
                <View style={styles.menuItemLeft}>
                  {item?.icon}
                  <Text style={styles.menuItemTitle}>{item?.title}</Text>
                </View>
                <MaterialIcons
                  name='chevron-right'
                  size={24}
                  color={AppColors.gray[400]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View>
            <Button
              title='Déconnexion'
              onPress={handleLogout}
              variant='outline'
              fullWidth style={styles.logoutButton}
              textStyle={styles.logoutButtonText}
              disabled={isLoading}
            />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Bienvenue !</Text>
          <Text style={styles.message}>Connectez-vous ou inscrivez-vous pour accéder à votre profil</Text>
          <View style={styles.buttonContainer}>
            <Button title='Connectez-vous !' fullWidth
                    style={styles.loginButton}
                    textStyle={styles.buttonText}
                    onPress={() => router.push("/(tabs)/login")} 
            />
            <Button title='Inscription' fullWidth
                    variant='outline'
                    style={styles.signupButton}
                    textStyle={styles.signupButtonText}
                    onPress={() => router.push("/(tabs)/signup")}
            />
          </View>
        </View>
      )}
    </Wrapper>
  );
};

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingBottom: 16,
    backgroundColor: AppColors.background.primary,
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: AppColors.text.primary,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: "center",
    // backgroundColor: AppColors.background.primary,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileEmail: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.text.primary,
  },
  editProfileText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.primary[500],
  },
  menuContainer: {
    marginTop: 16,
    backgroundColor: AppColors.background.primary,
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: AppColors.text.primary,
    marginLeft: 12,
  },
  logoutContainer: {
    marginTop: 24,
    //paddingHorizontal: 16
  },
  logoutButton: {
    backgroundColor: "transparent",
    borderColor: AppColors.error,
  },
  logoutButtonText: {
    color: AppColors.error,
  },
  message: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: AppColors.text.secondary,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  loginButton: {
    backgroundColor: AppColors.primary[500]
  },
  buttonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.background.primary,
  },
  signupButton: {
    borderColor: AppColors.primary[500],
    backgroundColor: "transparent"
  },
  signupButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.primary[500],
  },
})