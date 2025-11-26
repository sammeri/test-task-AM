import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function getItemCount(): Promise<number> {
  const { data } = await axios.get(`${API_BASE}/items/count`);
  return data.count;
}

export async function getItemByOffset(offset: number) {
  const { data } = await axios.get(`${API_BASE}/items?limit=1&offset=${offset}`);
  return data[0];
}

export async function getItemById(id: number) {
  const res = await fetch(`${API_BASE}/items/${id}`);

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json();
}

export async function getItemBySinceId(sinceId: number) {
  const { data } = await axios.get(`${API_BASE}/items?limit=1&sinceId=${sinceId}`);
  return data[0];
}
