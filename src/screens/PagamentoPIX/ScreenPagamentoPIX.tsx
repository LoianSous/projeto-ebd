import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  AppState,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";

import { getPaymentStatus, createPayment } from "../../services/paymentService";

type PaymentStatus = "pending" | "approved" | "rejected" | "expired";

export default function ScreenPagamentoPIX({ route, navigation }: any) {
  const {
    paymentId,
    templateId,
    letterId,
    qrCodeBase64,
    pixCopyPaste,
    shareLink,
    share_url,
  } = route.params;

  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [loading, setLoading] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState(paymentId);
  const [currentQrCode, setCurrentQrCode] = useState(qrCodeBase64);
  const [pixCode, setPixCode] = useState(pixCopyPaste);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔁 Restaurar pagamento pendente (caso o app feche)
  useEffect(() => {
    const restorePayment = async () => {
      const savedPaymentId = await AsyncStorage.getItem("currentPaymentId");
      if (savedPaymentId) {
        setCurrentPaymentId(savedPaymentId);
      }
    };
    restorePayment();
  }, []);

  const handleGoHome = () => {
  navigation.reset({
    index: 0,
    routes: [{ name: "MainTabs" }],
  });
};


  // 🔍 Consulta única de status
  const checkPaymentOnce = async () => {
    if (!currentPaymentId) return;

    try {
      const res = await getPaymentStatus(currentPaymentId);
      setStatus(res.status);

      if (res.status === "approved") {
        await AsyncStorage.removeItem("currentPaymentId");
        await AsyncStorage.removeItem("currentLetterId");
      }
    } catch (err) {
      console.log("Erro ao consultar status:", err);
    }
  };

  // 🔁 Polling automático
  useEffect(() => {
    if (!currentPaymentId) return;

    const checkPayment = async () => {
      try {
        const res = await getPaymentStatus(currentPaymentId);
        setStatus(res.status);

        if (res.status === "approved") {
          await AsyncStorage.removeItem("currentPaymentId");
          await AsyncStorage.removeItem("currentLetterId");
          clearInterval(intervalRef.current!);
        }

        if (res.status === "rejected" || res.status === "expired") {
          clearInterval(intervalRef.current!);
        }
      } catch (err) {
        console.log("Erro no polling:", err);
      }
    };

    checkPayment();
    intervalRef.current = setInterval(checkPayment, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentPaymentId]);

  // 🔄 Quando o usuário volta do banco
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkPaymentOnce();
      }
    });

    return () => subscription.remove();
  }, [currentPaymentId]);

  // 🔁 Gerar novo Pix (SOMENTE se rejeitado ou expirado)
  const handleRetryPayment = async () => {
    if (status === "pending") return;

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("autToken");
      if (!token || !letterId) return;

      const res = await createPayment(
        {
          letter_id: letterId,
          template_id: templateId,
          method: "pix",
        },
        token
      );

      setCurrentPaymentId(res.payment_id);
      setCurrentQrCode(res.qr_code_base64);
      setPixCode(res.qr_code);
      setStatus("pending");

      await AsyncStorage.setItem("currentPaymentId", res.payment_id);
    } catch (err) {
      console.log("Erro ao gerar novo Pix:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPix = async () => {
    if (!pixCode) return;
    await Clipboard.setStringAsync(pixCode);
    alert("Código PIX copiado!");
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Finalize o pagamento
      </Text>

      {/* ⏳ PENDENTE */}
      {status === "pending" && currentQrCode && (
        <>
          <Image
            source={{ uri: `data:image/png;base64,${currentQrCode}` }}
            style={{ width: 250, height: 250 }}
          />

          <Text style={{ textAlign: "center", color: "#555" }}>
            Após o pagamento, a confirmação pode levar até 1 minuto.
            Se já pagou, toque em “Já paguei”.
          </Text>

          {pixCode && (
            <>
              <View
                style={{
                  backgroundColor: "#f1f5f9",
                  padding: 12,
                  borderRadius: 8,
                  width: "100%",
                }}
              >
                <Text selectable style={{ fontSize: 12 }}>
                  {pixCode}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleCopyPix}
                style={{
                  backgroundColor: "#16a34a",
                  padding: 12,
                  borderRadius: 8,
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  📋 Copiar código PIX
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            onPress={checkPaymentOnce}
            style={{
              backgroundColor: "#0f172a",
              padding: 12,
              borderRadius: 8,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Já paguei
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
      onPress={handleGoHome}
      style={{
        marginTop: 12,
        padding: 14,
        borderRadius: 12,
        width: "80%",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#cbd5e1",
      }}
    >
      <Text style={{ fontSize: 16, color: "#0f172a" }}>
        ⬅️ Voltar para o início
      </Text>
    </TouchableOpacity>

          <ActivityIndicator />
        </>
      )}

      {/* ✅ APROVADO */}
      {status === "approved" && (
        <>
          <Text style={{ color: "green", fontSize: 18 }}>
            ✅ Pagamento confirmado!
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.replace("Conclusao", { shareLink, share_url })
            }
            style={{
              backgroundColor: "#16a34a",
              padding: 16,
              borderRadius: 12,
              width: "80%",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>
              Ver minha carta
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* ❌ REJEITADO / EXPIRADO */}
      {status === "expired" && (
  <>
    <Text style={{ color: "#dc2626", fontSize: 18, fontWeight: "bold" }}>
      ⏰ PIX expirado
    </Text>

    <Text style={{ textAlign: "center", color: "#555" }}>
      O prazo de 15 minutos para pagamento expirou.
      Gere um novo PIX para continuar.
    </Text>

    <TouchableOpacity
      onPress={handleRetryPayment}
      disabled={loading}
      style={{
        backgroundColor: "#2563eb",
        padding: 16,
        borderRadius: 12,
        width: "80%",
        alignItems: "center",
        opacity: loading ? 0.6 : 1,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 16 }}>
        🔁 Gerar novo PIX
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={handleGoHome}
      style={{
        marginTop: 12,
        padding: 14,
        borderRadius: 12,
        width: "80%",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#cbd5e1",
      }}
    >
      <Text style={{ fontSize: 16, color: "#0f172a" }}>
        ⬅️ Voltar para o início
      </Text>
    </TouchableOpacity>
  </>
)}
    </ScrollView>
  );
}
