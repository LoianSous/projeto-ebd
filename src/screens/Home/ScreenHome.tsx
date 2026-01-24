import React from 'react';
import { View, Text, TouchableOpacity, ScrollView  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types/types';
import { useTheme } from '../../theme/ThemeContext';
import { Styles } from './style';
import Logo from '../../../assets/graduation-cap.svg';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const styles = Styles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={styles.content}>
        {/* Detalhes de fundo */}
        <View style={styles.bgBubble1} />
        <View style={styles.bgBubble2} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Logo width={70} height={70} color={theme.primary} />
          </View>

          <Text style={styles.title}>Bem-vindo(a) ao TeoClass</Text>
          <Text style={styles.subtitle}>
            Um lugar para organizar as aulas, acompanhar alunos e gerar relatórios — com propósito e clareza.
          </Text>
        </View>

        {/* Cards do que o app faz */}
        <View style={styles.cards}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📚 Aulas</Text>
            <Text style={styles.cardText}>Gerencie turmas, conteúdos e presença com facilidade.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>👥 Alunos</Text>
            <Text style={styles.cardText}>Cadastre, acompanhe progresso e mantenha tudo organizado.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Relatórios</Text>
            <Text style={styles.cardText}>Visualize dados e tenha relatórios prontos para decisões.</Text>
          </View>
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={styles.secondaryButtonText}>Criar conta</Text>
          </TouchableOpacity>

          <Text style={styles.footerHint}>
            “Tudo seja feito para edificação.” — (1 Co 14:26)
          </Text>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
