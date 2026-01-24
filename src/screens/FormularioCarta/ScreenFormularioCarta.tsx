import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Linking, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLetter } from '../../services/auth';
import { createLetterPhoto } from '../../services/auth';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "../../services/supabase";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { generateShareId } from '../../services/generateShareId';
import Toast from 'react-native-toast-message';
import { Animated, Easing } from 'react-native';
import Loading from '../Loading/loading';
import { useTheme } from '../../theme/ThemeContext';
import { createPayment } from "../../services/paymentService";
import { getTemplates, Template } from "../../services/templateService";
import { AuthContext } from '../../contexts/AuthContext';
import Logo from '../../../assets/logotelas.svg';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "FormularioCarta">;

export default function FormularioCarta() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { letterTitle } = route.params as { letterTitle: string };
  const [belovedName, setBelovedName] = useState('');
  const [step, setStep] = useState(1);
  const [compliment, setCompliment] = useState('');
  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');
  const [specialMessages, setSpecialMessages] = useState('');
  const [timeTogether, setTimeTogether] = useState('');
  const [birthday, setBirthday] = useState('');
  const [favoriteColor, setFavoriteColor] = useState('');
  const [favoriteMovie, setFavoriteMovie] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [thingsTheyLike, setThingsTheyLike] = useState('');
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [signo, setSigno] = useState('');
  const [photos, setPhotos] = useState<{ id: number; uri: string; mime?: string; name?: string }[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSignoModal, setShowSignoModal] = useState(false);
  const { token, userId } = React.useContext(AuthContext);

  const styles = Styles(theme);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const totalSteps = 3;
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  const BAR_WIDTH = 200; // largura da linha animada em pixels
  const CIRCLE_SIZE = 24;
  const HORIZONTAL_PADDING = 20;

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await getTemplates();
        setTemplates(data);
      } catch (err) {
        console.log("Erro ao buscar templates:", err);
      }
    };

    loadTemplates();
  }, []);


  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: step - 1, // 0, 1, 2
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [step]);

  const showToast = (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Campos obrigatórios',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const showSuccessToast = (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Tudo certo ✅',
      text2: message,
      position: 'top',
      visibilityTime: 2000,
    });
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (
        !belovedName ||
        !fromName ||
        !toName ||
        !birthday ||
        !templateId
      ) {
        showToast("Preencha todos os campos da Etapa 1.");
        return false;
      }
    }

    if (currentStep === 2) {
      if (
        !compliment ||
        !specialMessages ||
        !thingsTheyLike ||
        !favoriteColor ||
        !signo
      ) {
        showToast("Preencha todos os campos da Etapa 2.");
        return false;
      }
    }

    if (currentStep === 3) {
      if (
        photos.length === 0 ||
        !favoriteMovie ||
        !favoriteFood ||
        !timeTogether
      ) {
        showToast("Preencha todos os campos da Etapa 3.");
        return false;
      }
    }

    return true;
  };

  const handleConfirm = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    setBirthday(formattedDate);
    setShowPicker(false);
  };

  const MAX_PHOTOS = 10;

  const pickImage = async () => {
    try {
      // 🔍 Verifica permissão atual
      const permission = await ImagePicker.getMediaLibraryPermissionsAsync();

      // ❌ Se não tiver permissão, tenta pedir
      if (!permission.granted) {
        const request = await ImagePicker.requestMediaLibraryPermissionsAsync();

        // ❌ Usuário negou (ou marcou "não perguntar novamente")
        if (!request.granted) {
          showToast("Ative o acesso à galeria nas configurações do app.");
          Linking.openSettings();
          return;
        }
      }

      // ✅ Permissão concedida → abre galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (result.canceled) return;

      const remainingSlots = MAX_PHOTOS - photos.length;

      if (remainingSlots <= 0) {
        showToast("Você já atingiu o limite de 10 fotos.");
        return;
      }

      const selectedAssets = result.assets.slice(0, remainingSlots);

      const newPhotos = selectedAssets.map((asset) => {
        const ext = asset.uri.split(".").pop() || "jpg";

        const mime =
          asset.mimeType ||
          (ext === "jpg" ? "image/jpeg" : `image/${ext}`);

        const name =
          asset.fileName ||
          `photo_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2)}.${ext}`;

        return {
          id: Date.now() + Math.random(),
          uri: asset.uri,
          mime,
          name,
        };
      });

      setPhotos((prev) => [...prev, ...newPhotos]);

    } catch (err) {
      console.log("Erro ao selecionar imagens:", err);
      showToast("Erro ao acessar a galeria.");
    }
  };

  const base64ToUint8Array = (base64: string) => {
    const binaryString = globalThis.atob
      ? globalThis.atob(base64)
      : atobPolyfill(base64);

    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  };

  const atobPolyfill = (input: string): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let str = input.replace(/=+$/, "");
    let output = "";
    let bc = 0,
      bs = 0,
      buffer;
    for (let i = 0; (buffer = str.charAt(i++));) {
      buffer = chars.indexOf(buffer);
      if (~buffer) {
        bs = (bs << 6) | buffer;
        if (++bc === 4) {
          output += String.fromCharCode((bs >> 16) & 255);
          output += String.fromCharCode((bs >> 8) & 255);
          output += String.fromCharCode(bs & 255);
          bc = 0;
          bs = 0;
        }
      }
    }
    return output;
  };

  const getFileExtension = (uriOrName: string) => {
    const last = uriOrName.split(".").pop()?.split("?")[0]?.toLowerCase();
    return last || "jpg";
  };

  const normalizeMimeType = (mime?: string, ext?: string) => {
    if (mime) return mime;
    if (!ext) ext = "jpg";
    if (ext === "jpg") ext = "jpeg";
    return `image/${ext}`;
  };

  const uploadImage = async (uri: string, mime?: string, name?: string) => {
    try {
      const ext = getFileExtension(name || uri);
      const mimeType = normalizeMimeType(mime, ext);

      const uniqueName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${ext}`;

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const uint8 = base64ToUint8Array(base64);

      console.log("Bytes gerados:", uint8.length, "mime:", mimeType);

      const { data, error } = await supabase.storage
        .from("letter-photos")
        .upload(uniqueName, uint8, {
          contentType: mimeType,
          upsert: false,
        });

      if (error) {
        console.log("Supabase upload error:", error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("letter-photos")
        .getPublicUrl(uniqueName);

      return urlData.publicUrl;

    } catch (err) {
      console.log("Erro uploadImage:", err);
      return null;
    }
  };

  const handleSubmit = async () => {
  try {
    setLoading(true);

    if (!token || !userId) {
      console.error("Usuário não autenticado.");
      showToast("Sessão expirada. Faça login novamente.");
      return;
    }

    await delay(3000);

    const shareId = generateShareId(12);
    const publicHost =
      process.env.EXPO_PUBLIC_WEB_URL || "http://192.168.1.7:3000";

    const fullShareUrl = `${publicHost}/letters/${shareId}`;

    // 1️⃣ Criar carta
    const response = await createLetter(
      {
        letter_title: letterTitle,
        beloved_name: belovedName,
        birthday,
        favorite_color: favoriteColor,
        compliment,
        from_name: fromName,
        to_name: toName,
        special_messages: specialMessages,
        time_together: timeTogether,
        favorite_movie: favoriteMovie,
        favorite_food: favoriteFood,
        zodiac_sign: signo,
        things_they_like: thingsTheyLike,
        template_id: templateId,
        user_id: userId,
        share_url: shareId,
      },
      token
    );

    const letterId = response.data.id;
    console.log("✅ Carta criada. ID:", letterId);

    // 2️⃣ Upload das fotos
    for (const photo of photos) {
      const uploadedUrl = await uploadImage(
        photo.uri,
        photo.mime,
        photo.name
      );

      if (!uploadedUrl) {
        console.warn("⚠️ Falha ao enviar foto:", photo.uri);
        continue;
      }

      await createLetterPhoto(
        {
          letter_id: letterId,
          photo_url: uploadedUrl,
        },
        token
      );
    }

    console.log("✅ Fotos enviadas com sucesso");

    // 3️⃣ Criar pagamento PIX
    const payment = await createPayment(
      {
        template_id: Number(templateId),
        letter_id: Number(letterId),
        method: "pix",
      },
      token
    );

    console.log("💰 Pagamento criado. ID:", payment.payment_id);

    // 4️⃣ Salvar dados temporários do pagamento
    await AsyncStorage.setItem("currentPaymentId", payment.payment_id);
    await AsyncStorage.setItem("currentLetterId", String(letterId));

    // 5️⃣ Navegar para tela de pagamento
    navigation.navigate("ScreenPagamentoPIX", {
      paymentId: payment.payment_id,
      qrCodeBase64: payment.qr_code_base64,
      pixCopyPaste: payment.qr_code,
      templateId: Number(templateId),
      letterId,
      shareLink: fullShareUrl,
      share_url: shareId,
    });

  } catch (error) {
    console.error("❌ Erro ao salvar carta:", error);
    showToast("Erro ao criar a carta. Tente novamente.");
  } finally {
    setLoading(false);
  }
};



  const templateImages: any = {
    1: require("../../../assets/template1.png"),
    2: require("../../../assets/template2.png"),
    3: require("../../../assets/template3.png"),
  };

  const removePhoto = (id: number) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const signos = [
  { label: "Áries", value: "aries", emoji: "♈" },
  { label: "Touro", value: "touro", emoji: "♉" },
  { label: "Gêmeos", value: "gemeos", emoji: "♊" },
  { label: "Câncer", value: "cancer", emoji: "♋" },
  { label: "Leão", value: "leao", emoji: "♌" },
  { label: "Virgem", value: "virgem", emoji: "♍" },
  { label: "Libra", value: "libra", emoji: "♎" },
  { label: "Escorpião", value: "escorpiao", emoji: "♏" },
  { label: "Sagitário", value: "sagitario", emoji: "♐" },
  { label: "Capricórnio", value: "capricornio", emoji: "♑" },
  { label: "Aquário", value: "aquario", emoji: "♒" },
  { label: "Peixes", value: "peixes", emoji: "♓" },
];

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={32} style={{ color: theme.primary }} />
        </TouchableOpacity>
        <ScrollView>
          <View style={styles.content}>

            <View style={styles.header}>
              <Logo width={160} height={160} color={theme.primary} />
              <Text style={styles.title}>Escreva sua carta!</Text>
            </View>

            <View style={styles.form}>

              {/* INDICADOR */}
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
                    backgroundColor: '#4CAF50',
                    borderRadius: 2,
                    width: progressAnim.interpolate({
                      inputRange: [0, totalSteps - 1],
                      outputRange: [0, 200],
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
                            ? '#4CAF50'
                            : isCurrent
                              ? '#B41513'
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

                  <Text style={styles.titleinputs}>Template</Text>
                  <TouchableOpacity
  onPress={() => setShowTemplateModal(true)}
  style={{
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 10,
  }}
>
  <Text style={{ color: selectedTemplate ? '#1E1E1E' : '#1E1E1E' }}>
    {selectedTemplate
      ? selectedTemplate.title
      : "Selecione um template"}
  </Text>
</TouchableOpacity>

                  {selectedTemplate && (
  <View
    style={{
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 20,
      marginTop: 20,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    }}
  >
    {/* Header */}
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#0F172A" }}>
          {selectedTemplate.title}
        </Text>

        <Text style={{ fontSize: 14, color: "#475569", marginTop: 6 }}>
          {selectedTemplate.description}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#EAF3FF",
          borderRadius: 16,
          paddingVertical: 10,
          paddingHorizontal: 14,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text style={{ fontSize: 12, color: "#1D4ED8" }}>Preço</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1D4ED8" }}>
          R$ {selectedTemplate.price.toFixed(2)}
        </Text>
      </View>
    </View>

    {/* Imagem local do template */}
    {templateId !== null && (
      <Image
        source={templateImages[templateId]}
        resizeMode="contain"
        style={{
          width: "100%",
          height: 180,
          borderRadius: 16,
          marginTop: 20,
          backgroundColor: "#F8FAFC",
        }}
      />
    )}
  </View>
)}


                  <Text style={styles.titleinputs}>Nome da (o) amada (o)</Text>
                  <TextInput style={styles.input} value={belovedName} placeholder='Nome da sua amada (o)' placeholderTextColor={theme.textinput} onChangeText={setBelovedName} />

                  <Text style={styles.titleinputs}>De:</Text>
                  <TextInput style={styles.input} value={fromName} placeholder='Quem envia a carta?' placeholderTextColor={theme.textinput} onChangeText={setFromName} />

                  <Text style={styles.titleinputs}>Para:</Text>
                  <TextInput style={styles.input} value={toName} placeholder='Quem recebera a carta?' placeholderTextColor={theme.textinput} onChangeText={setToName} />

                  <Text style={styles.titleinputs}>Data de aniversário</Text>
                  <TouchableOpacity
                    style={[styles.input, { justifyContent: 'center' }]}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={{ color: birthday ? theme.textinput : theme.textinput }}>
                      {birthday ? birthday.split('-').reverse().join('/') : 'Qual o aniversario dela(e)?'}
                    </Text>
                  </TouchableOpacity>

                  <DateTimePickerModal
                    isVisible={showPicker}
                    mode="date"
                    display='spinner'
                    onConfirm={handleConfirm}
                    onCancel={() => setShowPicker(false)}
                    maximumDate={new Date()} // impede datas futuras
                  />

                </>
              )}

              {/* ===================== ETAPA 2 ===================== */}
              {step === 2 && (
                <>
                  <Text style={styles.titleinputs}>Adjetivos para elogiar</Text>
                  <TextInput style={styles.input} value={compliment} placeholder='Escreva elogios' placeholderTextColor={theme.textinput} onChangeText={setCompliment} />

                  <Text style={styles.titleinputs}>Mensagens especiais</Text>
                  <TextInput style={styles.input} value={specialMessages} placeholder='Escreva uma mensagem' placeholderTextColor={theme.textinput} onChangeText={setSpecialMessages} />

                  <Text style={styles.titleinputs}>Coisas que ela(o) gosta</Text>
                  <TextInput style={styles.input} value={thingsTheyLike} placeholder='Do que ela(e) gosta?' placeholderTextColor={theme.textinput} onChangeText={setThingsTheyLike} />

                  <Text style={styles.titleinputs}>Cor preferida</Text>
                  <TextInput style={styles.input} value={favoriteColor} placeholder='Qual a cor preferida dela(e)?' placeholderTextColor={theme.textinput} onChangeText={setFavoriteColor} />

                  <Text style={styles.titleinputs}>Signo</Text>

<TouchableOpacity
  onPress={() => setShowSignoModal(true)}
  style={{
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  }}
>
  <Text style={{ color: signo ? "#0F172A" : "#9CA3AF" }}>
    {signo
      ? signos.find(s => s.value === signo)?.label
      : "Qual é o signo dela (e)?"}
  </Text>
</TouchableOpacity>

                </>
              )}

              {/* ===================== ETAPA 3 ===================== */}
              {step === 3 && (
                <>
                  <Text style={styles.titleinputs}>Tempo juntos</Text>
                  <TextInput style={styles.input} value={timeTogether} placeholder='Quanto tempo juntos?' placeholderTextColor={theme.textinput} onChangeText={setTimeTogether} />

                  <Text style={styles.titleinputs}>Adicionar fotos</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {photos.map(p => (
                      <View key={p.id} style={styles.photoWrapper}>
                        <Image source={{ uri: p.uri }} style={styles.photoBox} />

                        <TouchableOpacity
                          style={styles.removePhotoButton}
                          onPress={() => removePhoto(p.id)}
                          activeOpacity={0.8}
                        >
                          <MaterialCommunityIcons
                            name="close"
                            size={18}
                            color="#fff"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}

                    <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
                      <Text style={{ fontSize: 40, color: '#B41513' }}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.titleinputs}>Filme preferido</Text>
                  <TextInput style={styles.input} value={favoriteMovie} placeholder='Qual o filme preferido dela(e)?' placeholderTextColor={theme.textinput} onChangeText={setFavoriteMovie} />

                  <Text style={styles.titleinputs}>Comida preferida</Text>
                  <TextInput style={styles.input} value={favoriteFood} placeholder='Qual a comida preferida dela(e)?' placeholderTextColor={theme.textinput} onChangeText={setFavoriteFood} />

                </>
              )}

            </View>


            <View style={styles.buttonContainer}>
              {step > 1 && (
                <TouchableOpacity style={styles.button} onPress={() => setStep(step - 1)}>
                  <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
              )}

              {step < 3 ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    if (validateStep(step)) {
                      showSuccessToast(`Etapa ${step} preenchida corretamente`);
                      setStep(step + 1);
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Próximo</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    if (validateStep(3)) {
                      handleSubmit();
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Finalizar</Text>
                </TouchableOpacity>
              )}
            </View>

          </View>
        </ScrollView>
        <Modal visible={showTemplateModal} transparent animationType="slide">
  <View
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "flex-end",
    }}
  >
    <View
      style={{
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: "70%",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
        Escolha um template
      </Text>

      <ScrollView>
        {templates.map(template => (
          <TouchableOpacity
            key={template.id}
            onPress={() => {
              setTemplateId(template.id);
              setSelectedTemplate(template);
              setShowTemplateModal(false);
            }}
            style={{
              padding: 14,
              borderRadius: 14,
              borderWidth: 1,
              borderColor:
                template.id === templateId ? "#2563EB" : "#E5E7EB",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {template.title}
            </Text>

            <Text style={{ color: "#6B7280", marginTop: 4 }}>
              {template.description}
            </Text>

            <Text
              style={{
                marginTop: 6,
                fontWeight: "bold",
                color: "#2563EB",
              }}
            >
              R$ {template.price.toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  </View>
</Modal>

<Modal visible={showSignoModal} transparent animationType="slide">
  <View
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "flex-end",
    }}
  >
    <View
      style={{
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: "70%",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
        Escolha o signo dela (e)
      </Text>

      <ScrollView>
        {signos.map(item => (
          <TouchableOpacity
            key={item.value}
            onPress={() => {
              setSigno(item.value);
              setShowSignoModal(false);
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 14,
              borderRadius: 14,
              borderWidth: 1,
              borderColor:
                item.value === signo ? "#2563EB" : "#E5E7EB",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 22, marginRight: 12 }}>
              {item.emoji}
            </Text>

            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  </View>
</Modal>

      </SafeAreaView>
      {loading && <Loading />}
    </>
  );
}