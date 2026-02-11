// src/types/types.ts

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
  MainTabs:
    | {
        screen?: keyof TabParamList;
      }
    | undefined;

 FormularioPessoa: undefined;


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
  Usuario: undefined; // Início
  Aulas: undefined;
  Perfil: undefined; // Meu perfil
  Turmas: undefined;
  Pessoas: undefined;
};
