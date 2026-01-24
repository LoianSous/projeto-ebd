import { StyleSheet } from 'react-native';

export const Styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.container,
    },
    content: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingTop: 10,
    },

    // “bolhas” de fundo (sem libs extras)
    bgBubble1: {
      position: 'absolute',
      width: 260,
      height: 260,
      borderRadius: 260,
      backgroundColor: theme.primary,
      opacity: 0.08,
      top: -70,
      right: -90,
    },
    bgBubble2: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: 220,
      backgroundColor: theme.primary,
      opacity: 0.06,
      bottom: -80,
      left: -80,
    },

    header: {
      alignItems: 'center',
      marginTop: 10,
    },
    logoWrap: {
      width: 120,
      height: 120,
      borderRadius: 34,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.container,
      // sombra (Android/iOS)
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      marginBottom: 18,
      marginTop: 30,
    },
    title: {
      color: theme.text,
      fontSize: 30,
      textAlign: 'center',
      fontWeight: '700',
    },
    subtitle: {
      marginTop: 10,
      color: theme.text,
      opacity: 0.85,
      fontSize: 15,
      lineHeight: 21,
      textAlign: 'center',
      paddingHorizontal: 8,
    },

    cards: {
      marginTop: 18,
      gap: 10,
    },
    card: {
      backgroundColor: theme.container,
      borderRadius: 16,
      padding: 14,
      elevation: 1,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
    cardTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 6,
    },
    cardText: {
      color: theme.text,
      opacity: 0.8,
      fontSize: 14,
      lineHeight: 20,
    },

    actions: {
      marginTop: 50,
      paddingBottom: 18,
      gap: 12,
    },
    primaryButton: {
      backgroundColor: theme.primary, // destaque de “Entrar”
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: 'center',
      elevation: 2,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
    },
    secondaryButton: {
      backgroundColor: theme.container,
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.primary,
    },
    secondaryButtonText: {
      color: theme.primary,
      fontSize: 18,
      fontWeight: '700',
    },

    footerHint: {
      marginTop: 6,
      textAlign: 'center',
      color: theme.text,
      opacity: 0.65,
      fontSize: 12,
      lineHeight: 18,
    },
  });
