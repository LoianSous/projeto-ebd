import { StyleSheet } from 'react-native';

export const Styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.container,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    marginTop: 30,
  },
  content: {
    flex: 1,
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 28,
    color: theme.text,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '400',
  },
  header: {
    alignItems: 'center',
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
  logo: {
    width: 144,
    height: 144,
    marginBottom: 20,
  },
  form: {
    paddingHorizontal: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: theme.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#ccc',
    color: theme.text,
  },
  inputError: {
  borderWidth: 1.5,
  borderColor: '#B41513',
},
  titleinputs: {
    color: theme.text,
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: theme.buttonBackground,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonContainer: {
    paddingHorizontal: 100,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: theme.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  modalOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999, // 🔥 importante
},
modalContainer: {
  width: '85%',
  backgroundColor: theme.fundoconfirmarsenha,
  borderRadius: 10,
  padding: 20,
},

modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
  color: theme.textmodalsenha,
},

modalText: {
  marginBottom: 15,
  color: theme.textmodalsenha,
},

cancelText: {
  textAlign: 'center',
  marginTop: 10,
  color: '#B41513',
},
inputWrapper: {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  marginBottom: 15, // 👈 AQUI sim
},
eyeButton: {
  position: 'absolute',
  right: 12,
  height: '100%',        // 🔥 acompanha o input
  justifyContent: 'center',
},
termsContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 20,
  paddingHorizontal: 30,
},

termsText: {
  flex: 1,
  marginLeft: 10,
  fontSize: 14,
  color: theme.text,
},

link: {
  color: '#B41513',
  textDecorationLine: 'underline',
},


});