import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useTheme } from '../../theme/ThemeContext';
import { Feather } from '@expo/vector-icons';

type TurmaCard = {
  id: string;
  title: string;
  students: number;
  period: string;
};

export default function ScreenTurmas() {
  const { theme } = useTheme();
  const styles = Styles(theme);

  const mockTurmas: TurmaCard[] = useMemo(
    () => [
      {
        id: '1',
        title: 'Grupo A - Introdução',
        students: 25,
        period: 'Outubro - Dezembro 2023',
      },
      {
        id: '2',
        title: 'Teologia Sistemática II',
        students: 18,
        period: 'Setembro - Novembro 2023',
      },
      {
        id: '3',
        title: 'Liderança Cristã',
        students: 12,
        period: 'Agosto - Outubro 2023',
      },
      {
        id: '4',
        title: 'História da Igreja Moderna',
        students: 20,
        period: 'Julho - Setembro 2023',
      },
      {
        id: '5',
        title: 'Escatologia Bíblica',
        students: 15,
        period: 'Maio - Julho 2023',
      },
    ],
    []
  );

  const [turmas, setTurmas] = useState<TurmaCard[]>(mockTurmas);

  const handleRefresh = () => {
    // simula refresh (reordena)
    setTurmas((prev) => [...prev].sort((a, b) => (a.students < b.students ? 1 : 0)));
  };

  const handleAdd = () => {
    console.log('Adicionar turma (mock)');
  };

  const handleOpenTurma = (id: string) => {
    console.log('Abrir turma:', id);
    // futuramente: navigation.navigate("DetalheTurma", { id })
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.headerWrap}>
        <View style={styles.headerSide} />

        <Text style={styles.headerTitle}>Turmas</Text>

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
        {turmas.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            style={styles.card}
            onPress={() => handleOpenTurma(item.id)}
          >
            <View style={styles.cardRow}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.students} alunos</Text>
                <Text style={styles.cardSub}>{item.period}</Text>
              </View>

              <Feather name="chevron-right" size={26} color="#3A3A3A" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
