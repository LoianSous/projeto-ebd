import { useEffect, useState } from "react";
import { getPaymentStatus } from "../services/paymentService";

export function usePaymentStatus(payment_id: string) {
  const [status, setStatus] = useState<
  "pending" | "approved" | "rejected" | "expired"
>("pending");

  useEffect(() => {
    if (!payment_id) return;

    const interval = setInterval(async () => {
      try {
        const res = await getPaymentStatus(payment_id);
        setStatus(res.status);

        if (res.status === "approved" || res.status === "expired") {
  clearInterval(interval);
}
      } catch (err) {
        console.error("Erro ao consultar status", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [payment_id]);

  return status;
}
