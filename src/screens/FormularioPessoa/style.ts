import { StyleSheet } from 'react-native';

export const Styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    content: {
      paddingHorizontal: 24,
      paddingBottom: 60,
    },

    title: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.texttitle,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 20,
    },

    /* LABEL */
    label: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.texttitle,
      marginBottom: 6,
      marginTop: 14,
    },

    /* INPUT */
    input: {
      width: '100%',
      height: 52,
      backgroundColor: theme.container, // 🔥 antes era inputBackground
      borderRadius: 14,
      paddingHorizontal: 16,
      fontSize: 15,
      color: theme.texttitle,
      borderWidth: 1,
      borderColor: theme.primary + '20', // 🔥 borda suave baseada no tema
      marginBottom: 8,
    },

    /* BOTÃO */
    button: {
      backgroundColor: theme.primary, // 🔥 agora botão principal de verdade
      paddingVertical: 14,
      paddingHorizontal: 40,
      borderRadius: 30,
      marginTop: 16,
      minWidth: 200,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.primary,
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 4,
    },

    buttonText: {
      color: '#FFFFFF', // 🔥 contraste melhor
      fontSize: 16,
      fontWeight: '600',
    },

    /* BARRA PROGRESSO */
    progressWrapper: {
      alignItems: 'center',
      marginVertical: 20,
    },

    progressBackground: {
      height: 4,
      backgroundColor: theme.inputBackground,
      borderRadius: 2,
      width: '100%',
      position: 'absolute',
    },

    progressFill: {
      height: 4,
      backgroundColor: theme.primary,
      borderRadius: 2,
    },

    /* SWITCH */
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 14,
    },
  });
