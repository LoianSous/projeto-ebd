import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { registerUser } from '../../services/auth';
import Loading from '../Loading/loading';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../theme/ThemeContext';
import { confirmEmailCode } from '../../services/auth';
import Checkbox from 'expo-checkbox';
import { loginUser } from '../../services/auth';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from '../../../assets/graduation-cap.svg';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Cadastro">;

export default function Cadastro() {
  const navigation = useNavigation<NavigationProp>();
  const { signIn } = useContext(AuthContext);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  type FieldError = 'usuario' | 'email' | 'password' | 'confirmpassword' | null;

  const [fieldError, setFieldError] = useState<FieldError>(null);

  const styles = Styles(theme);

  const showSuccessToast = (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Tudo certo ✅',
      text2: message,
      position: 'top',
      visibilityTime: 2000,
    });
  };

  const showErrorToast = (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Ops 😕',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  };


  const validateForm = async () => {
    setError("");
    setFieldError(null);
    setLoading(true);

    try {
      // 🔹 Validações locais
      if (!usuario.trim()) {
        setFieldError("usuario");
        throw new Error("O nome é obrigatório");
      }

      if (!email.trim()) {
        setFieldError("email");
        throw new Error("O email é obrigatório");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFieldError("email");
        throw new Error("Formato de email inválido");
      }

      if (!password) {
        setFieldError("password");
        throw new Error("A senha é obrigatória");
      }

      if (password.length < 6) {
        setFieldError("password");
        throw new Error("A senha deve ter no mínimo 6 caracteres");
      }

      if (!confirmpassword) {
        setFieldError("confirmpassword");
        throw new Error("É necessário confirmar a senha");
      }

      if (password !== confirmpassword) {
        setFieldError("confirmpassword");
        throw new Error("As senhas não coincidem");
      }

      if (!acceptedTerms) {
        showErrorToast(
          "Você precisa aceitar os Termos de Uso e a Política de Privacidade"
        );
        setLoading(false);
        return;
      }


      // 🔹 Chamada da API
      await registerUser(
        usuario,
        usuario,
        email,
        password,
        acceptedTerms,
        acceptedTerms
      );

      // 🔹 Sucesso
      setShowCodeModal(true);
      showSuccessToast("Enviamos um código para seu email 📧");

    } catch (e: any) {
      console.log("REGISTER ERROR:", e);
  console.log("RESPONSE:", e?.response);
  console.log("MESSAGE:", e?.message);
      const message =
        e.response?.data?.error || e.message || "Erro de conexão com o servidor";

      setError(message);

      // 🔥 Detecta erro vindo do backend
      const lower = message.toLowerCase();
      if (lower.includes("email")) setFieldError("email");
      else if (lower.includes("usuário")) setFieldError("usuario");

      showErrorToast(message);

    } finally {
      setLoading(false);
    }
  };



  const confirmCode = async () => {
  if (!verificationCode.trim()) {
    setError("Digite o código enviado ao email");
    return;
  }

  setLoading(true);
  setError("");

  try {
    // 1️⃣ Confirma o código no backend
    await confirmEmailCode(email, verificationCode);

    // 2️⃣ Login automático após confirmação
    const loginResponse = await loginUser(email, password);
    const { token, id, name } = loginResponse.data;

    if (!token || !id) {
      throw new Error("Dados de autenticação incompletos");
    }

    // ✅ 3️⃣ SALVA DADOS PARA A TELA ConfirmPassword
    await AsyncStorage.setItem("autToken", token);
    await AsyncStorage.setItem("userId", String(id));

    if (name) {
      await AsyncStorage.setItem("userName", name);
    }

    // 4️⃣ Feedback visual
    Toast.show({
      type: "success",
      text1: "Conta criada ✅",
      text2: "Bem-vindo ao app!",
      position: "top",
    });

    // 5️⃣ Fecha modal e vai para tela visual
    setShowCodeModal(false);
    navigation.replace("ConfirmPassword");

  } catch (e: any) {
    const message =
      e.response?.data?.error || "Erro ao confirmar código";

    setError(message);

    Toast.show({
      type: "error",
      text1: "Erro ❌",
      text2: message,
      position: "top",
    });

  } finally {
    setLoading(false);
  }
};


  return (

    <>
      {showCodeModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Verifique seu email</Text>

            <Text style={styles.modalText}>
              Digite o código que enviamos para {email}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Código de verificação"
              placeholderTextColor={theme.textinput}
              keyboardType="numeric"
              value={verificationCode}
              onChangeText={setVerificationCode}
            />

            {error !== '' && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity style={styles.button} onPress={confirmCode}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowCodeModal(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>


          <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name="arrow-left" size={32} color={theme.arrow} />
            </TouchableOpacity>
            <View style={styles.content}>

              <View style={styles.header}>
                <View style={styles.logoWrap}>
                  <Logo width={70} height={70} color={theme.primary} />
                </View>
                <Text style={styles.title}>Crie sua conta!</Text>
              </View>

              <View style={styles.form}>
                <Text style={styles.titleinputs}>Nome</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldError === "usuario" && styles.inputError
                  ]}
                  placeholder="Seu nome"
                  placeholderTextColor="#999"
                  value={usuario}
                  onChangeText={(text) => {
                    setUsuario(text);
                    setError("");
                    setFieldError(null);
                  }}
                />

                <Text style={styles.titleinputs}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldError === "email" && styles.inputError
                  ]}
                  placeholder="seuemail@email.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError("");
                    setFieldError(null);
                  }}
                />

                <Text style={styles.titleinputs}>Senha</Text>
                <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    fieldError === "password" && styles.inputError
                  ]}
                  placeholder="****************"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError("");
                    setFieldError(null);
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

                <Text style={styles.titleinputs}>Confirmar senha</Text>
                <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    fieldError === "confirmpassword" && styles.inputError
                  ]}
                  placeholder="****************"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmpassword}
                  onChangeText={(text) => {
                    setconfirmPassword(text);
                    setError("");
                    setFieldError(null);
                  }}
                />
                <TouchableOpacity
    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
    style={styles.eyeButton}
  >
    <MaterialCommunityIcons
      name={showConfirmPassword ? 'eye-off' : 'eye'}
      size={22}
      color={theme.olho}
    />
  </TouchableOpacity>
</View>

                {error !== '' && <Text style={styles.error}>{error}</Text>}
              </View>

              <View style={styles.termsContainer}>
                <Checkbox
                  value={acceptedTerms}
                  onValueChange={setAcceptedTerms}
                  color={acceptedTerms ? '#B41513' : undefined}
                />

                <Text style={styles.termsText}>
                  Eu li e aceito os{" "}
                  <Text
                    style={styles.link}
                    onPress={() =>
                      Linking.openURL(
                        'https://loiansous.github.io/cartasavontade-legal/termos-de-uso.html'
                      )
                    }
                  >
                    Termos de Uso
                  </Text>
                  {" "}e a{" "}
                  <Text
                    style={styles.link}
                    onPress={() =>
                      Linking.openURL(
                        'https://loiansous.github.io/cartasavontade-legal/politica-de-privacidade.html'
                      )
                    }
                  >
                    Política de Privacidade
                  </Text>
                  .
                </Text>
              </View>



              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    !acceptedTerms && { opacity: 0.5 }
                  ]}
                  disabled={!acceptedTerms}
                  onPress={validateForm}
                >
                  <Text style={styles.buttonText}>Cadastrar-se</Text>
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