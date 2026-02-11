import { api } from "./api";

export async function criarPessoa(payload: any) {
  const { data } = await api.post("/etad/persons/", payload);
  return data;
}
