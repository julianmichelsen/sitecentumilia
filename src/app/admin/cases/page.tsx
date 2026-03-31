'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Pencil, Trash2, Save, X, ArrowLeft, Briefcase } from 'lucide-react';

interface CaseData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  client: string;
  segment: string;
  location: string;
  period: string;
  services: string;
  challenge: string;
  strategy: string;
  results: string;
  metrics: string;
  content: string;
}

const emptyCaseData: CaseData = {
  slug: '', title: '', excerpt: '', date: new Date().toISOString().split('T')[0],
  coverImage: '', client: '', segment: '', location: '', period: '',
  services: '', challenge: '', strategy: '', results: '', metrics: '', content: '',
};

export default function AdminCases() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CaseData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCases();
    if (searchParams.get('new') === 'true') {
      setEditing({ ...emptyCaseData });
    }
  }, [searchParams]);

  async function loadCases() {
    try {
      const res = await fetch('/api/admin/cases');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setCases(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.slug || !editing.title) {
      setMessage('Slug e título são obrigatórios');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        setMessage('Case salvo com sucesso!');
        setEditing(null);
        loadCases();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Erro ao salvar');
      }
    } catch (err) { setMessage('Erro de conexão'); }
    finally { setSaving(false); }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Tem certeza que deseja deletar o case "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/admin/cases?slug=${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Case deletado');
        loadCases();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) { setMessage('Erro ao deletar'); }
  }

  function handleEdit(caseData: CaseData) {
    setEditing({ ...caseData });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#01FAA4]/30 border-t-[#01FAA4] rounded-full animate-spin" />
      </div>
    );
  }

  if (editing) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setEditing(null)} className="p-2 text-gray-400 hover:text-white hover:bg-[#222] rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">{editing.slug ? 'Editar Case' : 'Novo Case'}</h1>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#01FAA4] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(1,250,164,0.3)] transition-all disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-xl text-sm ${message.includes('sucesso') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
            {message}
          </div>
        )}

        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Slug (URL)</label>
              <input value={editing.slug} onChange={(e) => setEditing({...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all"
                placeholder="meu-case" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Título</label>
              <input value={editing.title} onChange={(e) => setEditing({...editing, title: e.target.value})}
                className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all"
                placeholder="Nome do Case" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Cliente</label>
              <input value={editing.client || ''} onChange={(e) => setEditing({...editing, client: e.target.value})}
                className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all"
                placeholder="Nome do cliente" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Segmento</label>
              <input value={editing.segment || ''} onChange={(e) => setEditing({...editing, segment: e.target.value})}
                className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all"
                placeholder="Ex: Tecnologia / E-commerce" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Data</label>
              <input type="date" value={editing.date} onChange={(e) => setEditing({...editing, date: e.target.value})}
                className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#01FAA4] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Período</label>
              <input value={editing.period || ''} onChange={(e) => setEditing({...editing, period: e.target.value})}
                className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all"
                placeholder="Ex: 2024" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Localização</label>
              <input value={editing.location || ''} onChange={(e) => setEditing({...editing, location: e.target.value})}
                className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all"
                placeholder="Ex: Brasil" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Imagem de Capa (caminho)</label>
              <input value={editing.coverImage || ''} onChange={(e) => setEditing({...editing, coverImage: e.target.value})}
                className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all"
                placeholder="/cases/imagem.png" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Resumo (Excerpt)</label>
            <textarea value={editing.excerpt} onChange={(e) => setEditing({...editing, excerpt: e.target.value})}
              className="w-full h-20 px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all resize-none"
              placeholder="Breve descrição do case" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Serviços</label>
            <input value={editing.services || ''} onChange={(e) => setEditing({...editing, services: e.target.value})}
              className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all"
              placeholder="Tráfego Pago, Web Design, SEO" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Desafio</label>
            <textarea value={editing.challenge || ''} onChange={(e) => setEditing({...editing, challenge: e.target.value})}
              className="w-full h-20 px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all resize-none"
              placeholder="Qual era o desafio do cliente?" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Estratégia</label>
            <textarea value={editing.strategy || ''} onChange={(e) => setEditing({...editing, strategy: e.target.value})}
              className="w-full h-20 px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all resize-none"
              placeholder="Qual foi a estratégia utilizada?" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Resultados</label>
            <input value={editing.results || ''} onChange={(e) => setEditing({...editing, results: e.target.value})}
              className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all"
              placeholder="Ex: +200% de leads em 3 meses" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Métricas</label>
            <input value={editing.metrics || ''} onChange={(e) => setEditing({...editing, metrics: e.target.value})}
              className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all"
              placeholder="ROAS 4.5x | +300 Leads | CPC -40%" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Conteúdo (Markdown)</label>
            <textarea value={editing.content || ''} onChange={(e) => setEditing({...editing, content: e.target.value})}
              className="w-full h-48 px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#01FAA4] transition-all resize-y font-mono text-sm"
              placeholder="Conteúdo detalhado do case em Markdown..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Cases de Sucesso</h1>
          <p className="text-gray-500 text-sm mt-1">{cases.length} cases cadastrados</p>
        </div>
        <button onClick={() => setEditing({ ...emptyCaseData })}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#01FAA4] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(1,250,164,0.3)] transition-all">
          <Plus className="w-4 h-4" /> Novo Case
        </button>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm ${message.includes('sucesso') || message.includes('deletado') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="space-y-3">
        {cases.length === 0 ? (
          <div className="bg-[#111] border border-[#222] rounded-2xl p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Nenhum case cadastrado ainda</p>
            <button onClick={() => setEditing({ ...emptyCaseData })}
              className="text-[#01FAA4] hover:text-white transition-colors text-sm font-medium">
              + Criar primeiro case
            </button>
          </div>
        ) : (
          cases.map((c) => (
            <div key={c.slug} className="bg-[#111] border border-[#222] rounded-xl p-5 flex items-center justify-between hover:border-[#333] transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-semibold truncate">{c.title}</h3>
                  {c.segment && <span className="text-xs px-2 py-0.5 bg-[#1a1a1a] text-gray-400 rounded-full whitespace-nowrap">{c.segment}</span>}
                </div>
                <p className="text-gray-500 text-sm truncate">{c.excerpt}</p>
              </div>
              <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(c)} className="p-2 text-gray-400 hover:text-[#01FAA4] hover:bg-[#01FAA4]/10 rounded-lg transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(c.slug)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
