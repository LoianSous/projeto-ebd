import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useCallback, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';

import { getUserProfile } from '../../services/auth';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Configuracao'
>;

export default function Perfil() {
  const navigation = useNavigation<NavigationProp>();
  const { signOut } = useContext(AuthContext);
  const { theme } = useTheme();
  const styles = Styles(theme);

  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          setLoading(true);

          const token = await AsyncStorage.getItem('autToken');

          // 🔐 Se não tiver token, apenas desloga
          if (!token) {
            await signOut();
            return;
          }

          const res = await getUserProfile(token);
          setProfile(res.data);
        } catch (error) {
          console.log('Erro ao carregar perfil:', error);
        } finally {
          setLoading(false);
        }
      };

      loadProfile();
    }, [signOut])
  );

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              setProfile(null);
              await signOut(); // ✅ ÚNICA coisa necessária
            } catch (error) {
              console.log('Erro ao deslogar:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Configuracao')}
        >
          <View style={styles.gear}>
            <MaterialCommunityIcons name="cog" size={30} color={theme.gear} />
          </View>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.profile}>
            <MaterialCommunityIcons
              name="account-heart-outline"
              size={50}
              color={theme.iconperfil}
            />
          </View>

          {profile && (
            <Text style={styles.title}>
              {'Perfil!\n'}
              {profile.name}
            </Text>
          )}
        </View>

        {loading ? (
          <View style={styles.info}>
            <Text style={styles.titlemid}>Carregando perfil...</Text>
          </View>
        ) : (
          <>
            <View style={styles.info}>
              <Text style={styles.titlemid}>{profile?.email ?? ''}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.titlemid}>
                {`Data de criação: ${
                  profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('pt-BR')
                    : ''
                }`}
              </Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.titlemid}>
                {`Quantidade de cartas: ${profile?.letter_qty ?? 0}`}
              </Text>
            </View>
          </>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
