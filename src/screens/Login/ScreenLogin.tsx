import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { loginUser } from '../../services/auth';
import Loading from '../Loading/loading';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../theme/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import Logo from '../../../assets/graduation-cap.svg';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function Login() {
  const navigation = useNavigation<NavigationProp>();
  const { signIn } = useContext(AuthContext);
  const { theme } = useTheme();

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

  const styles = Styles(theme);

  const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

  const handleLogin = async () => {
  try {
    setLoading(true);
    setError('');
    setInputError(false);

    // ⏳ Executa API e delay juntos
    const [response] = await Promise.all([
      loginUser(usuario, password),
      delay(3000),
    ]);

    const { token, id, name } = response.data;

    // 🔑 Agora sim ativa a sessão
    await signIn(token, String(id), name);

  } catch (err: any) {
    setInputError(true);

    const message =
      err.response?.data?.error ?? 'Erro ao conectar ao servidor';

    setError(message);

    Toast.show({
      type: 'error',
      text1: 'Erro no login',
      text2: message,
      position: 'top',
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {navigation.canGoBack() && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={32}
                  color={theme.text}
                />
              </TouchableOpacity>
            )}

            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>TeoClass</Text>
                <View style={styles.logoWrap}>
                  <Logo width={70} height={70} color={theme.primary} />
                </View>
              </View>

              <View style={styles.form}>
                <Text style={styles.titleinputs}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    inputError && { borderColor: 'red', borderWidth: 2 },
                  ]}
                  placeholder="Nome de usuário ou email"
                  placeholderTextColor="#999"
                  value={usuario}
                  onChangeText={(text) => {
                    setUsuario(text);
                    setInputError(false);
                    setError('');
                  }}
                />

                <Text style={styles.titleinputs}>Senha</Text>
                <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    inputError && { borderColor: 'red', borderWidth: 2 },
                  ]}
                  placeholder="Insira sua senha"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setInputError(false);
                    setError('');
                  }}
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={22}
                      color={theme.olho}
                    />
                  </TouchableOpacity>
                </View>

                {error !== '' && (
                  <Text style={styles.error}>{error}</Text>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLogin}
                >
                  <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

                
              </View>
                <TouchableOpacity
                  style={styles.linkpassword}
                  onPress={() => navigation.navigate('Recover')}
                >
                  <Text
                    style={{
                      color: '#909090',
                      textDecorationLine: 'underline',
                    }}
                  >
                    Esqueci minha senha!
                  </Text>
                </TouchableOpacity>

              <View style={{ marginTop: 20, alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Cadastro')}
                >
                  <Text
                    style={{
                      color: theme.text,
                      fontSize: 14,
                      textDecorationLine: 'underline',
                    }}
                  >
                    Não tem conta? Criar agora
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {loading && <Loading />}
    </>
  );
}
