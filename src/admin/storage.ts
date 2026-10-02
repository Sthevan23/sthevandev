import type { Client, ClientInput } from "./types";

const STORAGE_KEY = "sthevan-admin-clients-v1";

function uid() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

export function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Client[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveClients(clients: Client[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function createClient(input: ClientInput): Client {
  const clients = loadClients();
  const client: Client = {
    ...input,
    id: uid(),
    createdAt: now(),
    updatedAt: now(),
  };
  clients.unshift(client);
  saveClients(clients);
  return client;
}

export function updateClient(id: string, input: ClientInput): Client | null {
  const clients = loadClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) return null;
  const updated: Client = {
    ...clients[index],
    ...input,
    id,
    updatedAt: now(),
  };
  clients[index] = updated;
  saveClients(clients);
  return updated;
}

export function deleteClient(id: string) {
  const clients = loadClients().filter((c) => c.id !== id);
  saveClients(clients);
}

export function exportClientsJson(clients: Client[]) {
  const blob = new Blob([JSON.stringify(clients, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `clientes-sthevan-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importClientsJson(json: string): Client[] {
  const parsed = JSON.parse(json) as Client[];
  if (!Array.isArray(parsed)) throw new Error("Arquivo inválido");
  const normalized = parsed.map((item) => ({
    id: item.id || uid(),
    clientName: String(item.clientName ?? ""),
    siteName: String(item.siteName ?? ""),
    url: String(item.url ?? ""),
    monthlyValue: Number(item.monthlyValue) || 0,
    status: (item.status as Client["status"]) || "ativo",
    startDate: String(item.startDate ?? ""),
    notes: String(item.notes ?? ""),
    createdAt: item.createdAt || now(),
    updatedAt: now(),
  }));
  saveClients(normalized);
  return normalized;
}
