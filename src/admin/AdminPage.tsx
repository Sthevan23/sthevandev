import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  LogOut,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
  Wallet,
  CalendarRange,
  CircleDot,
} from "lucide-react";
import { isAuthenticated, login, logout } from "./auth";
import { formatBRL, formatDate } from "./format";
import {
  createClient,
  deleteClient,
  exportClientsJson,
  importClientsJson,
  loadClients,
  updateClient,
} from "./storage";
import type { Client, ClientInput, ClientStatus } from "./types";
import "./admin.css";

const emptyForm: ClientInput = {
  clientName: "",
  siteName: "",
  url: "",
  monthlyValue: 0,
  status: "ativo",
  startDate: new Date().toISOString().slice(0, 10),
  notes: "",
};

type FilterStatus = "todos" | ClientStatus;

export function AdminPage() {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("todos");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ClientInput>(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authed) setClients(loadClients());
  }, [authed]);

  const stats = useMemo(() => {
    const active = clients.filter((c) => c.status === "ativo");
    const mrr = active.reduce((sum, c) => sum + (c.monthlyValue || 0), 0);
    return {
      total: clients.length,
      active: active.length,
      mrr,
      yearly: mrr * 12,
    };
  }, [clients]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      if (filter !== "todos" && c.status !== filter) return false;
      if (!q) return true;
      return (
        c.clientName.toLowerCase().includes(q) ||
        c.siteName.toLowerCase().includes(q) ||
        c.url.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q)
      );
    });
  }, [clients, query, filter]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (login(password)) {
      setAuthed(true);
      setLoginError("");
      setPassword("");
    } else {
      setLoginError("Senha incorreta.");
    }
  }

  function handleLogout() {
    logout();
    setAuthed(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(client: Client) {
    setEditingId(client.id);
    setForm({
      clientName: client.clientName,
      siteName: client.siteName,
      url: client.url,
      monthlyValue: client.monthlyValue,
      status: client.status,
      startDate: client.startDate.slice(0, 10),
      notes: client.notes,
    });
    setFormOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientName.trim() || !form.siteName.trim()) return;

    const payload: ClientInput = {
      ...form,
      clientName: form.clientName.trim(),
      siteName: form.siteName.trim(),
      url: form.url.trim(),
      notes: form.notes.trim(),
      monthlyValue: Number(form.monthlyValue) || 0,
    };

    if (editingId) {
      updateClient(editingId, payload);
    } else {
      createClient(payload);
    }
    setClients(loadClients());
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Remover "${name}"?`)) return;
    deleteClient(id);
    setClients(loadClients());
  }

  function handleExport() {
    exportClientsJson(clients);
  }

  async function handleImport(file: File) {
    try {
      const text = await file.text();
      const imported = importClientsJson(text);
      setClients(imported);
    } catch {
      alert("Não foi possível importar o arquivo. Use um JSON válido.");
    }
  }

  if (!authed) {
    return (
      <div className="adm">
        <div className="adm-login">
          <Link to="/" className="adm-back">
            <ArrowLeft size={16} />
            Voltar ao site
          </Link>
          <div className="adm-login-card">
            <p className="adm-eyebrow">Sthevan Dev</p>
            <h1>Painel admin</h1>
            <p className="adm-login-sub">
              Gerencie clientes e valores mensais dos sites.
            </p>
            <form onSubmit={handleLogin} className="adm-login-form">
              <label>
                Senha
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  placeholder="Digite a senha"
                />
              </label>
              {loginError && <p className="adm-error">{loginError}</p>}
              <button type="submit" className="adm-btn adm-btn-primary">
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-top-left">
          <Link to="/" className="adm-back">
            <ArrowLeft size={16} />
            Site
          </Link>
          <div>
            <p className="adm-eyebrow">Sthevan Dev</p>
            <h1>Clientes & mensalidades</h1>
          </div>
        </div>
        <div className="adm-top-actions">
          <button type="button" className="adm-btn" onClick={handleExport}>
            <Download size={16} />
            Exportar
          </button>
          <button
            type="button"
            className="adm-btn"
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={16} />
            Importar
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImport(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className="adm-btn adm-btn-primary"
            onClick={openCreate}
          >
            <Plus size={16} />
            Novo cliente
          </button>
          <button type="button" className="adm-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <section className="adm-stats">
        <article className="adm-stat">
          <Users size={18} />
          <div>
            <span>Clientes</span>
            <strong>{stats.total}</strong>
          </div>
        </article>
        <article className="adm-stat">
          <CircleDot size={18} />
          <div>
            <span>Ativos</span>
            <strong>{stats.active}</strong>
          </div>
        </article>
        <article className="adm-stat adm-stat-accent">
          <Wallet size={18} />
          <div>
            <span>Receita mensal</span>
            <strong>{formatBRL(stats.mrr)}</strong>
          </div>
        </article>
        <article className="adm-stat">
          <CalendarRange size={18} />
          <div>
            <span>Projeção anual</span>
            <strong>{formatBRL(stats.yearly)}</strong>
          </div>
        </article>
      </section>

      <section className="adm-toolbar">
        <label className="adm-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cliente, site ou URL…"
          />
        </label>
        <div className="adm-filters">
          {(["todos", "ativo", "pausado", "cancelado"] as FilterStatus[]).map(
            (s) => (
              <button
                key={s}
                type="button"
                className={`adm-chip${filter === s ? " is-active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ),
          )}
        </div>
      </section>

      <section className="adm-table-wrap">
        {filtered.length === 0 ? (
          <div className="adm-empty">
            <p>Nenhum cliente encontrado.</p>
            <button
              type="button"
              className="adm-btn adm-btn-primary"
              onClick={openCreate}
            >
              <Plus size={16} />
              Adicionar primeiro cliente
            </button>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Site</th>
                <th>Valor mensal</th>
                <th>Status</th>
                <th>Desde</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.clientName}</strong>
                    {c.notes ? <span className="adm-notes">{c.notes}</span> : null}
                  </td>
                  <td>
                    <div className="adm-site">
                      <span>{c.siteName}</span>
                      {c.url ? (
                        <a href={c.url} target="_blank" rel="noreferrer">
                          {c.url.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span className="adm-muted">sem URL</span>
                      )}
                    </div>
                  </td>
                  <td className="adm-money">{formatBRL(c.monthlyValue)}</td>
                  <td>
                    <span className={`adm-status adm-status-${c.status}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>{formatDate(c.startDate)}</td>
                  <td className="adm-row-actions">
                    <button
                      type="button"
                      className="adm-icon-btn"
                      aria-label="Editar"
                      onClick={() => openEdit(c)}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className="adm-icon-btn adm-icon-danger"
                      aria-label="Excluir"
                      onClick={() => handleDelete(c.id, c.clientName)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {formOpen && (
        <div
          className="adm-modal-backdrop"
          onClick={() => setFormOpen(false)}
          role="presentation"
        >
          <div
            className="adm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="adm-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="adm-modal-title">
              {editingId ? "Editar cliente" : "Novo cliente"}
            </h2>
            <form onSubmit={handleSubmit} className="adm-form">
              <label>
                Nome do cliente
                <input
                  required
                  value={form.clientName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, clientName: e.target.value }))
                  }
                  placeholder="Ex: João Silva"
                />
              </label>
              <label>
                Nome do site
                <input
                  required
                  value={form.siteName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, siteName: e.target.value }))
                  }
                  placeholder="Ex: Aurora Confeitaria"
                />
              </label>
              <label>
                URL
                <input
                  value={form.url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, url: e.target.value }))
                  }
                  placeholder="https://"
                />
              </label>
              <div className="adm-form-row">
                <label>
                  Valor mensal (R$)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.monthlyValue}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        monthlyValue: Number(e.target.value),
                      }))
                    }
                  />
                </label>
                <label>
                  Status
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        status: e.target.value as ClientStatus,
                      }))
                    }
                  >
                    <option value="ativo">Ativo</option>
                    <option value="pausado">Pausado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </label>
              </div>
              <label>
                Data de início
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                />
              </label>
              <label>
                Observações
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="Plano, domínio, hospedagem…"
                />
              </label>
              <div className="adm-form-actions">
                <button
                  type="button"
                  className="adm-btn"
                  onClick={() => setFormOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="adm-btn adm-btn-primary">
                  {editingId ? "Salvar" : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
