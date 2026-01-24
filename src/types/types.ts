// src/types/types.ts

/* =========================
   STACK PRINCIPAL
========================= */
export type RootStackParamList = {
  /* 🔓 Público */
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  ConfirmPassword: undefined;
  Recover: undefined;
  Code: undefined;
  Alter: undefined;

  /* 🔐 Privado */
  MainTabs: {
    screen?: keyof TabParamList;
  } | undefined;

  FormularioCarta: {
    letterTitle: string;
  };

  ScreenPagamentoPIX: {
    paymentId: string;
    qrCodeBase64: string;
    pixCopyPaste: string;
    templateId: number;
    letterId: number;
    shareLink: string;
    share_url: string;
  };

  Conclusao: {
    shareLink: string;
    share_url: string;
  };

  Configuracao: undefined;

  EditarCartas: {
    letterId: number;
    shareLink: string;
    share_url: string;
  };
};


/* =========================
   TABS
========================= */
export type TabParamList = {
  Usuario: undefined;
  MinhasCartas: undefined;
  Perfil: undefined;
};
