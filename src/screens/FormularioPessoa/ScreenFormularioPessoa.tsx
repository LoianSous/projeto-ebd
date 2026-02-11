import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Switch,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Styles } from './style';

const BAR_WIDTH = 200;
const HORIZONTAL_PADDING = 20;
const CIRCLE_SIZE = 24;

export default function FormularioPessoa() {

  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = Styles(theme);

  const totalSteps = 3;
  const [step, setStep] = useState(1);
  const progressAnim = useRef(new Animated.Value(0)).current;

  /* ===================== ESTADOS ===================== */

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [naturalidade, setNaturalidade] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');

  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');

  const [pai, setPai] = useState('');
  const [mae, setMae] = useState('');
  const [igrejaMembro, setIgrejaMembro] = useState(false);
  const [membroDesde, setMembroDesde] = useState('');
  const [igrejaCargo, setIgrejaCargo] = useState('');
  const [cicloTeologia, setCicloTeologia] = useState('');
  const [escolaridade, setEscolaridade] = useState('');
  const [profissao, setProfissao] = useState('');
  const [outrosCursos, setOutrosCursos] = useState('');

  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

  /* ===================== ANIMAÇÃO ===================== */

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: step - 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [step]);

  /* ===================== VALIDAÇÃO ===================== */

  const showToast = (msg: string) => {
    Toast.show({
      type: 'error',
      text1: 'Campos obrigatórios',
      text2: msg,
    });
  };

  const validateStep = () => {

    if (step === 1) {
      if (!nome || !cpf || !dataNascimento || !estadoCivil) {
        showToast("Preencha todos os campos da Etapa 1.");
        return false;
      }
    }

    if (step === 2) {
      if (!telefone || !email || !logradouro || !cidade || !estado) {
        showToast("Preencha todos os campos da Etapa 2.");
        return false;
      }
    }

    if (step === 3) {
      if (!cicloTeologia || !escolaridade) {
        showToast("Preencha Ciclo e Escolaridade.");
        return false;
      }
    }

    return true;
  };

  /* ===================== FORMATADORES ===================== */

  const formatCPF = (value: string) => {
    const numeric = value.replace(/\D/g, '');
    const formatted = numeric
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(formatted);
  };

  const handleConfirmBirth = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setDataNascimento(`${y}-${m}-${d}`);
    setShowBirthPicker(false);
  };

  const handleConfirmMember = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setMembroDesde(`${y}-${m}-${d}`);
    setShowMemberPicker(false);
  };

  const handleSubmit = () => {

    if (!validateStep()) return;

    const matriculaGerada = `ETAD-${Date.now()}`;

    const pessoaData = {
      matricula: matriculaGerada,
      nome,
      cpf,
      dataNascimento,
      estadoCivil,
      naturalidade,
      nacionalidade,
      telefone,
      email,
      logradouro,
      bairro,
      numero,
      cidade,
      estado,
      cep,
      pai,
      mae,
      igrejaMembro,
      membroDesde,
      igrejaCargo,
      cicloTeologia,
      escolaridade,
      profissao,
      outrosCursos
    };

    console.log("Pessoa criada:", pessoaData);

    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>

          <Text style={styles.title}>Cadastro ETAD</Text>

          {/* ===================== BARRA PROGRESSO ===================== */}
          <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
  {/* Linha de fundo */}
  <View
    style={{
      width: BAR_WIDTH,
      height: 4,
      backgroundColor: '#E0E0E0',
      marginHorizontal: HORIZONTAL_PADDING + CIRCLE_SIZE / 2,
      borderRadius: 2,
      position: 'relative',
    }}
  />

  {/* Linha animada */}
  <Animated.View
    style={{
      position: 'absolute',
      left: HORIZONTAL_PADDING + CIRCLE_SIZE / 2,
      height: 4,
      backgroundColor: theme.primary,
      borderRadius: 2,
      width: progressAnim.interpolate({
        inputRange: [0, totalSteps - 1],
        outputRange: [0, BAR_WIDTH],
      }),
    }}
  />

  {/* Bolinhas */}
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: HORIZONTAL_PADDING,
      marginTop: -15,
    }}
  >
    {[1, 2, 3].map((item) => {
      const isCompleted = step > item;
      const isCurrent = step === item;

      return (
        <View
          key={item}
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: isCompleted
              ? theme.primary
              : isCurrent
                ? theme.primary
                : '#FFFFFF',
            borderWidth: 2,
            borderColor: isCompleted || isCurrent ? '#FFE7E7' : '#CCCCCC',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: isCompleted || isCurrent ? '#FFFFFF' : '#999',
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            {item}
          </Text>
        </View>
      );
    })}
  </View>
</View>
          {/* ===================== ETAPA 1 ===================== */}
          {step === 1 && (
            <>
              <Text style={styles.label}>Nome</Text>
              <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor={theme.textinput} value={nome} onChangeText={setNome} />

              <Text style={styles.label}>CPF</Text>
              <TextInput style={styles.input} placeholder="000.000.000-00" placeholderTextColor={theme.textinput} keyboardType="numeric" value={cpf} onChangeText={formatCPF} />

              <Text style={styles.label}>Data de Nascimento</Text>
              <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowBirthPicker(true)}>
                <Text style={{ color: dataNascimento ? theme.texttitle : theme.textinput }}>
                  {dataNascimento ? dataNascimento.split('-').reverse().join('/') : "Selecionar data"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Estado Civil</Text>
              <TextInput style={styles.input} placeholder="Ex: Solteiro(a)" placeholderTextColor={theme.textinput} value={estadoCivil} onChangeText={setEstadoCivil} />

              <Text style={styles.label}>Naturalidade</Text>
              <TextInput style={styles.input} placeholder="Cidade de nascimento" placeholderTextColor={theme.textinput} value={naturalidade} onChangeText={setNaturalidade} />

              <Text style={styles.label}>Nacionalidade</Text>
              <TextInput style={styles.input} placeholder="Brasileira" placeholderTextColor={theme.textinput} value={nacionalidade} onChangeText={setNacionalidade} />
            </>
          )}

          {/* ===================== ETAPA 2 ===================== */}
          {step === 2 && (
            <>
              <Text style={styles.label}>Telefone</Text>
              <TextInput style={styles.input} placeholder="(00) 00000-0000" placeholderTextColor={theme.textinput} value={telefone} onChangeText={setTelefone} />

              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="email@email.com" placeholderTextColor={theme.textinput} value={email} onChangeText={setEmail} />

              <Text style={styles.label}>Logradouro</Text>
              <TextInput style={styles.input} placeholder="Rua / Avenida" placeholderTextColor={theme.textinput} value={logradouro} onChangeText={setLogradouro} />

              <Text style={styles.label}>Bairro</Text>
              <TextInput style={styles.input} placeholder="Bairro" placeholderTextColor={theme.textinput} value={bairro} onChangeText={setBairro} />

              <Text style={styles.label}>Número</Text>
              <TextInput style={styles.input} placeholder="Número" placeholderTextColor={theme.textinput} value={numero} onChangeText={setNumero} />

              <Text style={styles.label}>Cidade</Text>
              <TextInput style={styles.input} placeholder="Cidade" placeholderTextColor={theme.textinput} value={cidade} onChangeText={setCidade} />

              <Text style={styles.label}>Estado</Text>
              <TextInput style={styles.input} placeholder="Estado (UF)" placeholderTextColor={theme.textinput} value={estado} onChangeText={setEstado} />

              <Text style={styles.label}>CEP</Text>
              <TextInput style={styles.input} placeholder="00000-000" placeholderTextColor={theme.textinput} value={cep} onChangeText={setCep} />
            </>
          )}

          {/* ===================== ETAPA 3 ===================== */}
          {step === 3 && (
            <>
              <Text style={styles.label}>Pai</Text>
              <TextInput style={styles.input} placeholder="Nome do pai" placeholderTextColor={theme.textinput} value={pai} onChangeText={setPai} />

              <Text style={styles.label}>Mãe</Text>
              <TextInput style={styles.input} placeholder="Nome da mãe" placeholderTextColor={theme.textinput} value={mae} onChangeText={setMae} />

              <View style={styles.switchRow}>
                <Text style={styles.label}>Membro da Igreja?</Text>
                <Switch value={igrejaMembro} onValueChange={setIgrejaMembro} />
              </View>

              <Text style={styles.label}>Membro desde</Text>
              <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowMemberPicker(true)}>
                <Text style={{ color: membroDesde ? theme.texttitle : theme.textinput }}>
                  {membroDesde ? membroDesde.split('-').reverse().join('/') : "Selecionar data"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Cargo na Igreja</Text>
              <TextInput style={styles.input} placeholder="Ex: Líder, Obreiro..." placeholderTextColor={theme.textinput} value={igrejaCargo} onChangeText={setIgrejaCargo} />

              <Text style={styles.label}>Ciclo Teologia (Turma)</Text>
              <TextInput style={styles.input} placeholder="Ex: Ciclo 1" placeholderTextColor={theme.textinput} value={cicloTeologia} onChangeText={setCicloTeologia} />

              <Text style={styles.label}>Escolaridade</Text>
              <TextInput style={styles.input} placeholder="Ensino Médio, Superior..." placeholderTextColor={theme.textinput} value={escolaridade} onChangeText={setEscolaridade} />

              <Text style={styles.label}>Profissão</Text>
              <TextInput style={styles.input} placeholder="Profissão" placeholderTextColor={theme.textinput} value={profissao} onChangeText={setProfissao} />

              <Text style={styles.label}>Outros Cursos</Text>
              <TextInput style={styles.input} placeholder="Cursos adicionais" placeholderTextColor={theme.textinput} value={outrosCursos} onChangeText={setOutrosCursos} />
            </>
          )}

          {/* BOTÕES */}
          <View style={{ marginTop: 30 }}>
            {step > 1 && (
              <TouchableOpacity style={styles.button} onPress={() => setStep(step - 1)}>
                <Text style={styles.buttonText}>Voltar</Text>
              </TouchableOpacity>
            )}

            {step < 3 ? (
              <TouchableOpacity style={styles.button} onPress={() => {
                if (validateStep()) setStep(step + 1);
              }}>
                <Text style={styles.buttonText}>Próximo</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Finalizar</Text>
              </TouchableOpacity>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>

      <DateTimePickerModal
        isVisible={showBirthPicker}
        mode="date"
        maximumDate={new Date()}
        onConfirm={handleConfirmBirth}
        onCancel={() => setShowBirthPicker(false)}
      />

      <DateTimePickerModal
        isVisible={showMemberPicker}
        mode="date"
        maximumDate={new Date()}
        onConfirm={handleConfirmMember}
        onCancel={() => setShowMemberPicker(false)}
      />

      <Toast />
    </>
  );
}
