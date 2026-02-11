import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useTheme } from '../../theme/ThemeContext';
import { Feather } from '@expo/vector-icons';

type AulaCard = {
  id: string;
  date: string;
  title: string;
  turma: string;
  professor: string;
};

export default function ScreenAulas() {
  const { theme } = useTheme();
  const styles = Styles(theme);

  const mockAulas: AulaCard[] = useMemo(
    () => [
      {
        id: '1',
        date: '2023-11-01',
        title: 'Introdução à Teologia Sistemática',
        turma: 'Turma de Inverno 2023',
        professor: 'Prof. Ana Luísa',
      },
      {
        id: '2',
        date: '2023-11-03',
        title: 'Exegese e Hermenêutica Bíblica: O Estudo Aprofundado',
        turma: 'Grupo Avançado de Estudo',
        professor: 'Dr. Marcos Vinícius',
      },
      {
        id: '3',
        date: '2023-11-08',
        title: 'História da Igreja Primitiva',
        turma: 'Fundamentos da Fé',
        professor: 'Rev. João Carlos',
      },
      {
        id: '4',
        date: '2023-11-10',
        title: 'Ética Cristã e Sociedade Contemporânea',
        turma: 'Líderes de Ministério',
        professor: 'Pr. Sofia Mendes',
      },
    ],
    []
  );

  // só pra simular “atualizar”
  const [aulas, setAulas] = useState<AulaCard[]>(mockAulas);

  const handleRefresh = () => {
    // aqui você pode colocar animação/loader depois
    // por enquanto só reordena pra “parecer” que atualizou
    setAulas((prev) => [...prev].sort((a, b) => (a.date < b.date ? 1 : 0)));
  };

  const handleAdd = () => {
    // por enquanto só simula
    console.log('Adicionar nova aula (mock)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.headerWrap}>
        <View style={styles.headerSide} />

        <Text style={styles.headerTitle}>Aulas</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleRefresh}
            style={styles.iconBtn}
            hitSlop={10}
          >
            <Feather name="refresh-cw" size={20} color={theme.texttitle} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAdd}
            style={styles.iconBtn}
            hitSlop={10}
          >
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
        {aulas.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardDate}>{item.date}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>{item.turma}</Text>
            <Text style={styles.cardSub}>{item.professor}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
