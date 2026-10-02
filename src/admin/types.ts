export type ClientStatus = "ativo" | "pausado" | "cancelado";

export type Client = {
  id: string;
  clientName: string;
  siteName: string;
  url: string;
  monthlyValue: number;
  status: ClientStatus;
  startDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type ClientInput = Omit<
  Client,
  "id" | "createdAt" | "updatedAt"
>;
