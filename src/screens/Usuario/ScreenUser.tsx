import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import { useTheme } from '../../theme/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import Logo from '../../../assets/logotelas.svg';
import { themes, ThemeName } from '../../theme/themes';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
      backgroundColor: active
        ? theme.primary + '22'
        : theme.inputBackground,
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
  const navigation = useNavigation<NavigationProp>();
  const { theme, setTheme, currentTheme } = useTheme();
  const { userName } = useContext(AuthContext);

  const [nomeCarta, setNomeCarta] = useState('');
  const [error, setError] = useState('');
  const [showThemeModal, setShowThemeModal] = useState(false);

  const styles = Styles(theme);

  const validateForm = () => {
    if (!nomeCarta.trim()) {
      setError('O nome da carta é obrigatório.');
      return;
    }
    setError('');
    navigation.navigate('FormularioCarta', { letterTitle: nomeCarta });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* BOTÃO DE TEMA */}
        <TouchableOpacity
          onPress={() => setShowThemeModal(true)}
          style={{ position: 'absolute', top: 20, right: 20 }}
        >
          <Feather name="droplet" size={22} color={theme.icontemas} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Logo width={150} height={150} color={theme.primary} />

          {userName && (
            <Text style={styles.title}>
              {'Seja bem-vindo!\n'}
              {userName}
            </Text>
          )}
        </View>

        <View style={styles.form}>
          <Text style={styles.titleinputs}>Nome da carta</Text>
          <TextInput
            style={styles.input}
            placeholder="Escreva um nome para a sua carta!"
            placeholderTextColor={theme.textinput}
            value={nomeCarta}
            onChangeText={setNomeCarta}
          />
          {error !== '' && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={validateForm}>
            <Text style={styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>
        </View>
      </View>

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

        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: theme.text,
              padding: 20,
              paddingBottom: 30,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#999',
                alignSelf: 'center',
                marginBottom: 14,
              }}
            />

            <View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  }}
>
  <Text
    style={{
      fontSize: 20,
      fontWeight: '600',
      color: theme.titlemodalcolor,
    }}
  >
    🎨 Escolha o tema
  </Text>

  <TouchableOpacity
    onPress={() => setShowThemeModal(false)}
    hitSlop={10} // aumenta área de toque
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
