import { api } from "./api";

export type Template = {
  id: number;
  name: string;
  title: string;
  description: string;
  preview_image_url: string;
  price: number;
};

export async function getTemplates(): Promise<Template[]> {
  const res = await api.get("/templates");
  return res.data;
}
