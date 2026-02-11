import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useTheme } from '../../theme/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';

type PessoaCard = {
  id: string;
  name: string;
  role: string;
  city: string;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FormularioPessoa'
>;


export default function ScreenPessoas() {
  const { theme } = useTheme();
  const styles = Styles(theme);
  const navigation = useNavigation<NavigationProp>();


  const mockPessoas: PessoaCard[] = useMemo(
    () => [
      { id: '1', name: 'Ana Cristina Silva', role: 'Estudante', city: 'São Paulo' },
      { id: '2', name: 'João Pedro Santos', role: 'Membro', city: 'Rio de Janeiro' },
      { id: '3', name: 'Maria Eduarda Costa', role: 'Estudante', city: 'Belo Horizonte' },
      { id: '4', name: 'Carlos Alberto Sou...', role: 'Professor Auxiliar', city: 'Curitiba' },
      { id: '5', name: 'Sofia Fernanda Lima', role: 'Voluntária', city: 'Porto Alegre' },
    ],
    []
  );

  const [pessoas, setPessoas] = useState<PessoaCard[]>(mockPessoas);

  const handleRefresh = () => {
    // simula refresh (só reordena)
    setPessoas((prev) => [...prev].sort((a, b) => (a.name > b.name ? 1 : 0)));
  };

  const handleAdd = () => {
  navigation.navigate('FormularioPessoa');
};


  const handleEmail = (id: string) => {
    console.log('Email para pessoa:', id);
  };

  const handleMessage = (id: string) => {
    console.log('Mensagem para pessoa:', id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.headerWrap}>
        <View style={styles.headerSide} />

        <Text style={styles.headerTitle}>Pessoas</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleRefresh} style={styles.iconBtn} hitSlop={10}>
            <Feather name="refresh-cw" size={20} color={theme.texttitle} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleAdd} style={styles.iconBtn} hitSlop={10}>
            <Feather name="plus" size={22} color={theme.texttitle} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.headerDivider} />

      {/* LISTA */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {pessoas.map((p) => (
          <View key={p.id} style={styles.card}>
            <View style={styles.row}>
              {/* Avatar (círculo cinza) */}
              <View style={styles.avatar} />

              {/* Infos */}
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={styles.sub}>{p.role}</Text>
                <Text style={styles.sub}>{p.city}</Text>
              </View>

              {/* Ações */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleEmail(p.id)}
                  hitSlop={10}
                >
                  <Feather name="mail" size={22} color={theme.texttitle} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleMessage(p.id)}
                  hitSlop={10}
                >
                  <Feather name="message-square" size={22} color={theme.texttitle} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
