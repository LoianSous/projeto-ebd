import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useTheme } from '../../theme/ThemeContext';
import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../contexts/AuthContext';
import { themes, ThemeName } from '../../theme/themes';

type ThemeOptionProps = {
  label: string;
  name: ThemeName;
  active: boolean;
  onPress: () => void;
  theme: any;
};

const ThemeOption = ({
  label,
  name,
  active,
  onPress,
  theme,
}: ThemeOptionProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: 14,
      marginBottom: 10,
      backgroundColor: active ? theme.primary + '22' : theme.inputBackground,
      borderWidth: active ? 1.5 : 0,
      borderColor: theme.primary,
    }}
  >
    <View
      style={{
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: themes[name].preview,
        marginRight: 12,
      }}
    />
    <Text
      style={{
        fontSize: 16,
        color: theme.textmodalcolor,
        fontWeight: active ? '600' : '400',
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function Usuario() {
  const { theme, setTheme, currentTheme } = useTheme();
  const { userName, signOut } = useContext(AuthContext);

  const [showThemeModal, setShowThemeModal] = useState(false);

  const styles = Styles(theme);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.headerWrap}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconBox}>
            <MaterialCommunityIcons
              name="cellphone"
              size={22}
              color={theme.iconbar}
            />
          </View>

          <Text style={styles.headerTitle}>
            Olá! {userName ?? 'Usuário'}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setShowThemeModal(true)}
            style={styles.headerBtn}
            hitSlop={10}
          >
            <Feather name="droplet" size={20} color={theme.icontemas} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerBtn} hitSlop={10}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={22}
              color={theme.texttitle}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* LINHA SEPARADORA */}
      <View style={styles.headerDivider} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CARD DO GRÁFICO */}
        <View style={styles.chartCard}>
          <Image
            source={require('../../../assets/grafico.png')}
            style={styles.chartImage}
            resizeMode="contain"
          />
        </View>

        {/* BOTÕES */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.9}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={24}
              color={theme.buttonText}
            />
            <Text style={styles.actionText}>Gerar Relatórios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.9}>
            <MaterialCommunityIcons
              name="archive-outline"
              size={24}
              color={theme.buttonText}
            />
            <Text style={styles.actionText}>Arquivados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.9}>
            <MaterialCommunityIcons
              name="account-plus-outline"
              size={24}
              color={theme.buttonText}
            />
            <Text style={styles.actionText}>Obter Ajuda</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.9}
            onPress={signOut}
          >
            <MaterialCommunityIcons
              name="logout"
              size={24}
              color={theme.buttonText}
            />
            <Text style={styles.actionText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL DE TEMA – BOTTOM SHEET */}
      <Modal
        transparent
        animationType="slide"
        visible={showThemeModal}
        onRequestClose={() => setShowThemeModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowThemeModal(false)}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.text }]}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.titlemodalcolor }]}>
                🎨 Escolha o tema
              </Text>

              <TouchableOpacity
                onPress={() => setShowThemeModal(false)}
                hitSlop={10}
              >
                <Feather name="x" size={22} color={theme.textinput} />
              </TouchableOpacity>
            </View>

            <ThemeOption
              label="Romântico"
              name="light"
              active={currentTheme === 'light'}
              theme={theme}
              onPress={() => {
                setTheme('light');
                setShowThemeModal(false);
              }}
            />

            <ThemeOption
              label="Escuro"
              name="dark"
              active={currentTheme === 'dark'}
              theme={theme}
              onPress={() => {
                setTheme('dark');
                setShowThemeModal(false);
              }}
            />

            <ThemeOption
              label="Elegante"
              name="elegant"
              active={currentTheme === 'elegant'}
              theme={theme}
              onPress={() => {
                setTheme('elegant');
                setShowThemeModal(false);
              }}
            />

            <ThemeOption
              label="Jovem"
              name="young"
              active={currentTheme === 'young'}
              theme={theme}
              onPress={() => {
                setTheme('young');
                setShowThemeModal(false);
              }}
            />

            <ThemeOption
              label="Futurista"
              name="futuristic"
              active={currentTheme === 'futuristic'}
              theme={theme}
              onPress={() => {
                setTheme('futuristic');
                setShowThemeModal(false);
              }}
            />

            <ThemeOption
              label="Minimalista"
              name="minimal"
              active={currentTheme === 'minimal'}
              theme={theme}
              onPress={() => {
                setTheme('minimal');
                setShowThemeModal(false);
              }}
            />

            <ThemeOption
              label="Clássico"
              name="classic"
              active={currentTheme === 'classic'}
              theme={theme}
              onPress={() => {
                setTheme('classic');
                setShowThemeModal(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
