import { api } from "./api";

type CreatePaymentPayload = {
  template_id: number;
  letter_id: number;        // ✅ OBRIGATÓRIO (ID da carta)
  method: "pix";
};

export type CreatePaymentResponse = {
  payment_id: string;       // id interno do pagamento
  qr_code: string;
  qr_code_base64: string;
  status: "pending" | "approved" | "rejected" | "expired";
};

/**
 * Cria um pagamento PIX para uma carta específica
 */
export async function createPayment(
  payload: CreatePaymentPayload,
  token: string
): Promise<CreatePaymentResponse> {

  console.log("📤 Payload enviado para /payments:", payload);

  const response = await api.post("/payments", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

/**
 * Consulta status do pagamento
 */
export async function getPaymentStatus(paymentId: string) {
  const response = await api.get(`/payments/${paymentId}/status`);
  return response.data;
}
