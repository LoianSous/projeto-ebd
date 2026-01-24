import { View, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Modal, Linking, Alert } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { deleteAccount } from '../../services/auth';
import { AuthContext } from '../../contexts/AuthContext';
import { themes, ThemeName } from '../../theme/themes';
import { Feather } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Configuracao">;

export default function Configuracao() {
  const [nomeSalvo, setNomeSalvo] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const { signOut } = useContext(AuthContext);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const { theme, setTheme, currentTheme } = useTheme();
  const styles = Styles(theme);

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
          color: theme.textinput,
          fontWeight: active ? '600' : '400',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const loadUserName = async () => {
      const storedName = await AsyncStorage.getItem("userName");
      setNomeSalvo(storedName);
    };

    loadUserName();
  }, []);

  const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

  const handleDeleteAccount = () => {
  Alert.alert(
    "Excluir conta",
    "Essa ação é permanente. Todos os seus dados e cartas serão excluídos.",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("autToken");
            if (!token) {
              Alert.alert("Erro", "Sessão inválida. Faça login novamente.");
              return;
            }

            // 🔥 Backend
            const response = await deleteAccount(token);

            // ✅ Mensagem vinda do backend
            Alert.alert("Sucesso", response.data.message);

            // ⏳ Tempo para leitura
            await delay(2500);

            // 🧹 Limpa dados
            await AsyncStorage.clear();

            // 🔄 Logout
            await signOut();

          } catch (error: any) {
            console.error("Erro ao excluir conta:", error);

            const message =
              error.response?.data?.message ??
              "Não foi possível excluir sua conta agora.";

            Alert.alert("Erro", message);
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
          onPress={() => navigation.goBack()}
        >
          <View style={styles.gear}>

            <MaterialCommunityIcons name="arrow-left" size={30} color={theme.arrow} />
          </View>
        </TouchableOpacity>
        <Text style={styles.textconf}>Configurações</Text>
        <View style={styles.header}>
          <View style={styles.profile}>
            <MaterialCommunityIcons
              name="account-heart-outline"
              size={50}
              color={theme.iconperfil}
            />


          </View>
          <View style={styles.header2}>
            <Text style={styles.textheader2}>{nomeSalvo}</Text>
          </View>

        </View>
        <View style={styles.boxconfs}>
          <TouchableOpacity
            style={styles.info}
            onPress={() => setShowPermissionsModal(true)}
          >
            <Text style={{color: theme.permissoes}}>Permissões</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowThemeModal(true)} style={styles.info}>
            <Text style={{color: theme.temas}}>Temas</Text>
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

              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'flex-end',
                }}
              >
                <View
                  style={{
                    backgroundColor: theme.container,
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
      color: theme.textinput,
    }}
  >
    🎨 Escolha o tema
  </Text>

  <TouchableOpacity
  onPress={() => setShowThemeModal(false)}
  hitSlop={10}
  style={{
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
  }}
>
  <Feather name="x" size={20} color={theme.textinput} />
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
      <Modal transparent animationType="fade" visible={showPermissionsModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '85%',
              borderRadius: 16,
              padding: 20,
              backgroundColor: theme.container,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
              🔐 Permissões e Privacidade
            </Text>

            <Text style={{ color: theme.textinput, marginBottom: 20 }}>
              Utilizamos seus dados apenas para criar e exibir suas cartas.
              Você pode consultar nossos termos ou excluir sua conta a qualquer momento.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() =>
                Linking.openURL(
                  "https://loiansous.github.io/cartasavontade-legal/politica-de-privacidade.html"
                )
              }
            >
              <Text style={styles.modalButtonText} >Política de Privacidade</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() =>
                Linking.openURL(
                  "https://loiansous.github.io/cartasavontade-legal/termos-de-uso.html"
                )
              }
            >
              <Text style={styles.modalButtonText}>Termos de Uso</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: "#FFE5E5" }
              ]}
              onPress={handleDeleteAccount}
            >
              <Text style={{ color: "#B41513", fontWeight: '600' }}>
                Excluir minha conta
              </Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => setShowPermissionsModal(false)}>
              <Text style={{ textAlign: 'center', marginTop: 15, color: "#999" }}>
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}