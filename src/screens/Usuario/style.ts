import { StyleSheet } from 'react-native';

export const Styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.container,
    },

    /* HEADER */
    headerWrap: {
      backgroundColor: theme.background,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flexShrink: 1,
    },
    headerIconBox: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: theme.buttonBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      color: theme.texttitle,
      fontSize: 18,
      fontWeight: '600',
      flexShrink: 1,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    headerBtn: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.inputBackground,
    },
    headerDivider: {
      height: 1,
      backgroundColor: '#00000022',
    },

    /* SCROLL */
    scrollContent: {
      padding: 16,
      paddingBottom: 24,
      backgroundColor: theme.background,
    },

    /* CARD DO GRÁFICO */
    chartCard: {
      backgroundColor: '#fff',
      borderRadius: 14,
      padding: 14,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
      marginBottom: 18,
    },
    chartImage: {
      width: '100%',
      height: 260,
    },

    /* BOTÕES */
    actions: {
      gap: 14,
    },
    actionButton: {
      backgroundColor: theme.buttonBackground,
      borderRadius: 14,
      paddingVertical: 18,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    actionText: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: '700',
    },

    /* MODAL (tema) */
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalSheet: {
      padding: 20,
      paddingBottom: 30,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    modalHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#999',
      alignSelf: 'center',
      marginBottom: 14,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
    },
  });
