import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useContext } from 'react';

import { AuthContext } from '../contexts/AuthContext';

/* 🔓 públicas */
import Home from '../screens/Home/ScreenHome';
import Login from '../screens/Login/ScreenLogin';
import Cadastro from '../screens/Cadastro/ScreenCadastro';
import ConfirmPassword from '../screens/ConfirmPassword/ScreenConfirmPassword';
import Recover from '../screens/recoverpassword/ScreenRecoverPassword';
import Code from '../screens/recoverpassword/ScreenCode';
import Alter from '../screens/recoverpassword/ScreenAlter';

/* 🔐 privadas */
import TabNavigator from './TabNavigator';
import FormularioPessoa from '../screens/FormularioPessoa/ScreenFormularioPessoa';
import EditarCartas from '../screens/EditarCartas/ScreenEditarCartas';
import Conclusao from '../screens/Conclusao/ScreenConclusao';
import Configuracao from '../screens/Configuracao/ScreenConfiguracao';
import ScreenPagamentoPIX from '../screens/PagamentoPIX/ScreenPagamentoPIX';

const Stack = createNativeStackNavigator();

export default function Navigator() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthenticated ? (
          /* 🔐 STACK PRIVADO */
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="FormularioPessoa" component={FormularioPessoa} />
            <Stack.Screen name="EditarCartas" component={EditarCartas} />
            <Stack.Screen name="Conclusao" component={Conclusao} />
            <Stack.Screen name="Configuracao" component={Configuracao} />
            <Stack.Screen name="ScreenPagamentoPIX" component={ScreenPagamentoPIX} />
          </Stack.Navigator>
        ) : (
          /* 🔓 STACK PÚBLICO */
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
            <Stack.Screen name="ConfirmPassword" component={ConfirmPassword} />
            <Stack.Screen name="Recover" component={Recover} />
            <Stack.Screen name="Code" component={Code} />
            <Stack.Screen name="Alter" component={Alter} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
