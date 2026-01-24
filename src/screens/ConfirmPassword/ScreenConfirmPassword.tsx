import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Styles } from "./style";
import { useTheme } from "../../theme/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import Logo from '../../../assets/logotelas.svg';

export default function ConfirmPassword() {
  const { signIn } = useContext(AuthContext);
  const { theme } = useTheme();
  const styles = Styles(theme);

  const handleGoHome = async () => {
    try {
      const token = await AsyncStorage.getItem("autToken");
      const userId = await AsyncStorage.getItem("userId");
      const userName = await AsyncStorage.getItem("userName");

      if (!token || !userId) {
        console.log("❌ Token ou userId não encontrados");
        return;
      }

      await signIn(token, userId, userName ?? undefined);
      // 🚀 Navigator muda sozinho
    } catch (err) {
      console.log("Erro ao autenticar:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Logo width={160} height={160} color={theme.primary} />
          <Text style={styles.title}>Conta criada!</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.title2}>Cadastrado com sucesso!</Text>

          <TouchableOpacity style={styles.button} onPress={handleGoHome}>
            <Text style={styles.buttonText}>Início</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
