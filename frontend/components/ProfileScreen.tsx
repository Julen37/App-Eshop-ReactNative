import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/theme';

const ProfileScreen: React.FC = () => {
    const { user } = useAuthStore();
    const router = useRouter();

  return (
    <View>
      <Text>ProfileScreen</Text>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container : {
        flex: 1,
        padding: 20,
        backgroundColor: AppColors.background.primary
    },
    label : {
        marginTop: 15,
        fontSize: 16,
        fontWeight: "bold"
    },
    input : {
        borderWidth: 1,
        borderColor: AppColors.gray[300],
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
    },
})