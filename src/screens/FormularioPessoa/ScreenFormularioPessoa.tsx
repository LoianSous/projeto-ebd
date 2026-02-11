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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Styles } from './style';
import { criarPessoa } from "../../services/pessoaService";

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

  // Agora estadoCivil armazena o VALUE do enum do backend
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

  // Agora cicloTeologia armazena o VALUE do enum do backend
  const [cicloTeologia, setCicloTeologia] = useState('');

  const [escolaridade, setEscolaridade] = useState('');
  const [profissao, setProfissao] = useState('');
  const [outrosCursos, setOutrosCursos] = useState('');

  // Campos obrigatórios do backend que não existiam
  const [details, setDetails] = useState('');
  const [gender, setGender] = useState('');

  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

  const [showEstadoCivilModal, setShowEstadoCivilModal] = useState(false);
  const [showCicloModal, setShowCicloModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

  // Enums (label -> value) alinhados ao backend
  const estadosCivis = [
    { label: "Solteiro(a)", value: "solteiro(a)" },
    { label: "Casado(a)", value: "casado(a)" },
    { label: "Divorciado(a)", value: "divorciado(a)" },
    { label: "Viúvo(a)", value: "viuvo(a)" },
    { label: "União Estável", value: "uniao_estavel" },
  ];

  const ciclos = [
    { label: "Ciclo 1", value: "ciclo_1," },
    { label: "Ciclo 2", value: "ciclo_2," },
    { label: "Ciclo 3", value: "ciclo_3," },
  ];

  const generos = [
    { label: "Masculino", value: "masculino" },
    { label: "Feminino", value: "feminino" },
  ];

  const getLabel = (list: {label: string; value: string}[], value: string) =>
    list.find(i => i.value === value)?.label ?? "";

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
      if (!nome || !cpf || !dataNascimento || !estadoCivil || !gender || !details || !naturalidade || !nacionalidade) {
        showToast("Preencha todos os campos da Etapa 1 (incluindo Gênero, Detalhes e Naturalidade).");
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

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const payload = {
      name: nome,
      dt_birth: dataNascimento,
      gender: gender,                    // obrigatório (enum)
      details: details.trim(),           // obrigatório (não pode vazio)
      phone: telefone,
      email,
      cpf: cpf.replace(/\D/g, ""),

      // backend espera "addres" (com typo)
      addres: logradouro,
      a_number: numero,
      a_setor: bairro,
      a_city: cidade,
      a_uf: estado,
      a_cep: cep,

      // obrigatório (não pode vazio)
      nature: naturalidade.trim(),
      nacionality: nacionalidade.trim(),

      // enum do backend
      m_status: estadoCivil,

      mother_name: mae,
      father_name: pai,

      // backend espera string
      church_member: igrejaMembro ? "sim" : "nao",
      c_since_member: membroDesde,
      c_role: igrejaCargo,

      // enum do backend
      course_cicle: cicloTeologia,

      other_courses: outrosCursos,
      school_level: escolaridade,
      job: profissao,
    };

    try {
      const response = await criarPessoa(payload);
      console.log("SUCESSO API:", response);
      Toast.show({ type: "success", text1: "Sucesso", text2: "Cadastro enviado!" });
      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Erro ao enviar",
        text2: err?.response?.data?.message ?? "Não foi possível cadastrar.",
      });
      console.log("STATUS:", err?.response?.status);
      console.log("DATA:", err?.response?.data);
      console.log("FULL ERROR:", err);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            paddingHorizontal: 16,
            paddingTop: 6,
            paddingBottom: 6,
            alignSelf: 'flex-start',
          }}
          hitSlop={10}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={30}
            color={theme.primary}
          />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Cadastro ETAD</Text>

          {/* ===================== BARRA PROGRESSO ===================== */}
          <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
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
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor={theme.textinput}
                value={nome}
                onChangeText={setNome}
              />

              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                placeholderTextColor={theme.textinput}
                keyboardType="numeric"
                value={cpf}
                onChangeText={formatCPF}
              />

              <Text style={styles.label}>Data de Nascimento</Text>
              <TouchableOpacity
                style={[styles.input, { justifyContent: 'center' }]}
                onPress={() => setShowBirthPicker(true)}
              >
                <Text style={{ color: theme.textinput }}>
                  {dataNascimento
                    ? dataNascimento.split('-').reverse().join('/')
                    : 'Qual a data de nascimento?'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Gênero</Text>
              <TouchableOpacity
                onPress={() => setShowGenderModal(true)}
                style={[styles.input, { justifyContent: 'center' }]}
              >
                <Text style={{ color: gender ? theme.texttitle : theme.textinput }}>
                  {gender ? getLabel(generos, gender) : "Selecione o gênero"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Detalhes</Text>
              <TextInput
                style={styles.input}
                placeholder="Observações / detalhes"
                placeholderTextColor={theme.textinput}
                value={details}
                onChangeText={setDetails}
              />

              <Text style={styles.label}>Estado Civil</Text>
              <TouchableOpacity
                onPress={() => setShowEstadoCivilModal(true)}
                style={[styles.input, { justifyContent: 'center' }]}
              >
                <Text style={{ color: estadoCivil ? theme.texttitle : theme.textinput }}>
                  {estadoCivil ? getLabel(estadosCivis, estadoCivil) : "Selecione o estado civil"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Naturalidade</Text>
              <TextInput
                style={styles.input}
                placeholder="Cidade de nascimento"
                placeholderTextColor={theme.textinput}
                value={naturalidade}
                onChangeText={setNaturalidade}
              />

              <Text style={styles.label}>Nacionalidade</Text>
              <TextInput
                style={styles.input}
                placeholder="Brasileira"
                placeholderTextColor={theme.textinput}
                value={nacionalidade}
                onChangeText={setNacionalidade}
              />
            </>
          )}

          {/* ===================== ETAPA 2 ===================== */}
          {step === 2 && (
            <>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                placeholderTextColor={theme.textinput}
                value={telefone}
                onChangeText={setTelefone}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@email.com"
                placeholderTextColor={theme.textinput}
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>Logradouro</Text>
              <TextInput
                style={styles.input}
                placeholder="Rua / Avenida"
                placeholderTextColor={theme.textinput}
                value={logradouro}
                onChangeText={setLogradouro}
              />

              <Text style={styles.label}>Bairro</Text>
              <TextInput
                style={styles.input}
                placeholder="Bairro"
                placeholderTextColor={theme.textinput}
                value={bairro}
                onChangeText={setBairro}
              />

              <Text style={styles.label}>Número</Text>
              <TextInput
                style={styles.input}
                placeholder="Número"
                placeholderTextColor={theme.textinput}
                value={numero}
                onChangeText={setNumero}
              />

              <Text style={styles.label}>Cidade</Text>
              <TextInput
                style={styles.input}
                placeholder="Cidade"
                placeholderTextColor={theme.textinput}
                value={cidade}
                onChangeText={setCidade}
              />

              <Text style={styles.label}>Estado</Text>
              <TextInput
                style={styles.input}
                placeholder="Estado (UF)"
                placeholderTextColor={theme.textinput}
                value={estado}
                onChangeText={setEstado}
              />

              <Text style={styles.label}>CEP</Text>
              <TextInput
                style={styles.input}
                placeholder="00000-000"
                placeholderTextColor={theme.textinput}
                value={cep}
                onChangeText={setCep}
              />
            </>
          )}

          {/* ===================== ETAPA 3 ===================== */}
          {step === 3 && (
            <>
              <Text style={styles.label}>Pai</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome do pai"
                placeholderTextColor={theme.textinput}
                value={pai}
                onChangeText={setPai}
              />

              <Text style={styles.label}>Mãe</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome da mãe"
                placeholderTextColor={theme.textinput}
                value={mae}
                onChangeText={setMae}
              />

              <View style={styles.switchRow}>
                <Text style={styles.label}>Membro da Igreja?</Text>
                <Switch value={igrejaMembro} onValueChange={setIgrejaMembro} />
              </View>

              <Text style={styles.label}>Membro desde</Text>
              <TouchableOpacity
                style={[styles.input, { justifyContent: 'center' }]}
                onPress={() => setShowMemberPicker(true)}
                activeOpacity={0.8}
              >
                <Text style={{ color: membroDesde ? theme.texttitle : theme.textinput }}>
                  {membroDesde ? membroDesde.split('-').reverse().join('/') : "Selecionar data"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Cargo na Igreja</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Líder, Obreiro..."
                placeholderTextColor={theme.textinput}
                value={igrejaCargo}
                onChangeText={setIgrejaCargo}
              />

              <Text style={styles.label}>Ciclo Teologia (Turma)</Text>
              <TouchableOpacity
                onPress={() => setShowCicloModal(true)}
                style={[styles.input, { justifyContent: 'center' }]}
              >
                <Text style={{ color: cicloTeologia ? theme.texttitle : theme.textinput }}>
                  {cicloTeologia ? getLabel(ciclos, cicloTeologia) : "Selecione o ciclo"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Escolaridade</Text>
              <TextInput
                style={styles.input}
                placeholder="Ensino Médio, Superior..."
                placeholderTextColor={theme.textinput}
                value={escolaridade}
                onChangeText={setEscolaridade}
              />

              <Text style={styles.label}>Profissão</Text>
              <TextInput
                style={styles.input}
                placeholder="Profissão"
                placeholderTextColor={theme.textinput}
                value={profissao}
                onChangeText={setProfissao}
              />

              <Text style={styles.label}>Outros Cursos</Text>
              <TextInput
                style={styles.input}
                placeholder="Cursos adicionais"
                placeholderTextColor={theme.textinput}
                value={outrosCursos}
                onChangeText={setOutrosCursos}
              />
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
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (validateStep()) setStep(step + 1);
                }}
              >
                <Text style={styles.buttonText}>Próximo</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Finalizar</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* MODAL ESTADO CIVIL */}
        <Modal visible={showEstadoCivilModal} transparent animationType="slide">
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}>
            <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: "60%" }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
                Selecione o estado civil
              </Text>

              <ScrollView>
                {estadosCivis.map(item => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => {
                      setEstadoCivil(item.value);
                      setShowEstadoCivilModal(false);
                    }}
                    style={{
                      padding: 14,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: item.value === estadoCivil ? theme.primary : "#E5E7EB",
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* MODAL CICLO */}
        <Modal visible={showCicloModal} transparent animationType="slide">
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}>
            <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: "60%" }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
                Selecione o ciclo
              </Text>

              <ScrollView>
                {ciclos.map(item => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => {
                      setCicloTeologia(item.value);
                      setShowCicloModal(false);
                    }}
                    style={{
                      padding: 14,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: item.value === cicloTeologia ? theme.primary : "#E5E7EB",
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* MODAL GÊNERO */}
        <Modal visible={showGenderModal} transparent animationType="slide">
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}>
            <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: "60%" }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
                Selecione o gênero
              </Text>

              <ScrollView>
                {generos.map(item => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => {
                      setGender(item.value);
                      setShowGenderModal(false);
                    }}
                    style={{
                      padding: 14,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: item.value === gender ? theme.primary : "#E5E7EB",
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>

      <DateTimePickerModal
        isVisible={showBirthPicker}
        mode="date"
        display="spinner"
        maximumDate={new Date()}
        onConfirm={handleConfirmBirth}
        onCancel={() => setShowBirthPicker(false)}
      />

      <DateTimePickerModal
        isVisible={showMemberPicker}
        mode="date"
        display="spinner"
        maximumDate={new Date()}
        onConfirm={handleConfirmMember}
        onCancel={() => setShowMemberPicker(false)}
      />

      <Toast />
    </>
  );
}
