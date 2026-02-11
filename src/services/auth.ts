import { api } from './api';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Ligue isso pra forçar login fake SEM tentar backend.
 * (deixe false quando tiver backend)
 */
const USE_FAKE_LOGIN = true;

/**
 * Mesmo "shape" de resposta que o axios retorna (o seu Login usa response.data.token/id/name)
 */
type FakeLoginResponse = {
  data: {
    token: string;
    id: number;
    name: string;
  };
};

export async function loginUser(identifier: string, password: string) {
  // ✅ 1) Se quiser sempre fake:
  if (USE_FAKE_LOGIN) {
    await delay(600);

    if (!identifier?.trim() || !password?.trim()) {
      const err: any = new Error('Credenciais inválidas');
      err.response = { data: { error: 'Informe email/usuário e senha.' } };
      throw err;
    }

    const name =
      identifier.includes('@')
        ? identifier.split('@')[0]
        : identifier;

    const fakeResponse: FakeLoginResponse = {
      data: {
        token: `fake-token-${Date.now()}`,
        id: 1,
        name: name || 'Usuário',
      },
    };

    return fakeResponse;
  }

  // ✅ 2) Se não estiver forçando fake, tenta backend e se falhar cai no fake
  try {
    return await api.post('/login', {
      identifier: identifier,
      password: password,
    });
  } catch (e) {
    // fallback fake (útil enquanto backend não existe)
    await delay(600);

    if (!identifier?.trim() || !password?.trim()) {
      const err: any = new Error('Credenciais inválidas');
      err.response = { data: { error: 'Informe email/usuário e senha.' } };
      throw err;
    }

    const name =
      identifier.includes('@')
        ? identifier.split('@')[0]
        : identifier;

    const fakeResponse: FakeLoginResponse = {
      data: {
        token: `fake-token-${Date.now()}`,
        id: 1,
        name: name || 'Usuário',
      },
    };

    return fakeResponse;
  }
}

export async function deleteAccount(token: string) {
  return api.delete("/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function registerUser(
  name: string,
  username: string,
  email: string,
  password: string,
  termsAccepted: boolean,
  privacyPolicyAccepted: boolean
) {
  return api.post("/register/request", {
    name,
    username,
    email,
    password,
    termsAccepted,
    privacyPolicyAccepted
  });
}


export const confirmEmailCode = (email: string, code: string) => {
  return api.post('/register/confirm', {
    email,
    code,
  });
};

export async function recoverRequest(email: string) {
  return api.post("/recover-request", {
    email
  });
}

export async function recoverVerify(email: string, code: string) {
  return api.post("/recover-verify", {
    email,
    code
  });
}

export async function resetPassword(email: string, newPassword: string) {
  return api.post("/reset-password", {
    email,
    newPassword,
  });
}

export async function createLetter(data: any, token: string) {
  return api.post("/letters", data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function createLetterPhoto(data: any, token: string) {
  return api.post("/letter-photo", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getUserLetters(token: string) {
  const res = await api.get("/letters/me", {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
}

export async function getUserProfile(token: string) {
  return api.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

// Buscar carta específica
export const getLetterById = async (id: number, token: string) => {
  const response = await api.get(`/letters/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Deletar carta
export const deleteLetter = async (id: number, token: string) => {
  const response = await api.delete(`/letters/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

