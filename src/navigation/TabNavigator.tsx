import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { TabParamList } from '../types/types';
import { useTheme } from '../theme/ThemeContext';

import Usuario from '../screens/Usuario/ScreenUser';
import Perfil from '../screens/Perfil/ScreenPerfil';

// ✅ novas telas (criar abaixo)
import Aulas from '../screens/Aulas/ScreenAulas';
import Turmas from '../screens/Turmas/ScreenTurmas';
import Pessoas from '../screens/Pessoas/ScreenPessoas';

const Tab = createBottomTabNavigator<TabParamList>();
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const getIcon = (routeName: keyof TabParamList, focused: boolean): IconName => {
    switch (routeName) {
      case 'Usuario':
        return focused ? 'home-account' : 'home-account';

      case 'Aulas':
        // ícone de lista com check (igual ao da imagem)
        return focused ? 'format-list-checks' : 'format-list-checks';

      case 'Perfil':
        return focused ? 'account-circle' : 'account-circle-outline';

      case 'Turmas':
        // capelo (graduação) igual ao design
        return focused ? 'school' : 'school';

      case 'Pessoas':
        return focused ? 'account-group' : 'account-group-outline';

      default:
        return 'circle';
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: theme.buttonText,
        tabBarInactiveTintColor: theme.buttonText,

        tabBarStyle: {
          backgroundColor: theme.buttonBackground,
          borderTopWidth: 0,
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },

        tabBarIcon: ({ color, focused }) => {
          const iconName = getIcon(route.name, focused);

          return (
            <View
              style={{
                borderRadius: 24,
                width: 35,
                height: 35,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? theme.circlebar : 'transparent',
              }}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={24}
                color={focused ? theme.iconbar : color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Usuario" component={Usuario} options={{ title: 'Início' }} />
      <Tab.Screen name="Aulas" component={Aulas} options={{ title: 'Aulas' }} />
      <Tab.Screen name="Perfil" component={Perfil} options={{ title: 'Meu perfil' }} />
      <Tab.Screen name="Turmas" component={Turmas} options={{ title: 'Turmas' }} />
      <Tab.Screen name="Pessoas" component={Pessoas} options={{ title: 'Pessoas' }} />
    </Tab.Navigator>
  );
}
