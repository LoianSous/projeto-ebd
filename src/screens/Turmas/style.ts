import { StyleSheet } from 'react-native';

export const Styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
    headerSide: {
      width: 70,
    },
    headerTitle: {
      color: theme.texttitle,
      fontSize: 22,
      fontWeight: '700',
    },
    headerActions: {
      width: 70,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 10,
    },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    headerDivider: {
      height: 1,
      backgroundColor: '#00000022',
    },

    /* LISTA */
    scrollContent: {
      padding: 16,
      paddingBottom: 24,
    },

    /* CARD */
    card: {
      backgroundColor: '#fff',
      borderRadius: 14,
      padding: 18,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
      borderWidth: 1,
      borderColor: '#00000010',
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    cardLeft: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: '#1F1F1F',
      marginBottom: 10,
    },
    cardSub: {
      fontSize: 16,
      color: '#3A3A3A',
      marginTop: 4,
    },
  });
