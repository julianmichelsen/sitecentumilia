'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Phone, Mail, MapPin, Instagram, Linkedin, Globe, MessageCircle } from 'lucide-react';

interface Config {
  siteName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  instagram: string;
  linkedin: string;
}

export default function AdminConfig() {
  const router = useRouter();
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const res = await fetch('/api/admin/config');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setConfig(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setMessage('Configurações salvas com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#01FAA4] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações do Site</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie as informações básicas e contatos da Centumilia</p>
      </div>

      {message && <div className="px-4 py-3 bg-[#01FAA4]/10 border border-[#01FAA4]/30 text-[#01FAA4] rounded-xl text-sm">{message}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4" /> Geral
              </h2>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Nome do Site</label>
                <input value={config?.siteName} onChange={(e) => setConfig({...config!, siteName: e.target.value})}
                  className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none focus:border-[#01FAA4]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Tagline / Slogan</label>
                <input value={config?.tagline} onChange={(e) => setConfig({...config!, tagline: e.target.value})}
                  className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none focus:border-[#01FAA4]" />
              </div>
            </div>

            {/* Contato */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Canais de Contato
              </h2>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Telefone para Exibição</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input value={config?.phone} onChange={(e) => setConfig({...config!, phone: e.target.value})}
                    className="w-full h-11 pl-11 pr-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none focus:border-[#01FAA4]" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">WhatsApp (Apenas números com DDD)</label>
                <input value={config?.whatsapp} onChange={(e) => setConfig({...config!, whatsapp: e.target.value})}
                  className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none focus:border-[#01FAA4]" placeholder="5554999..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input value={config?.email} onChange={(e) => setConfig({...config!, email: e.target.value})}
                    className="w-full h-11 pl-11 pr-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none focus:border-[#01FAA4]" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Localização</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input value={config?.location} onChange={(e) => setConfig({...config!, location: e.target.value})}
                    className="w-full h-11 pl-11 pr-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none focus:border-[#01FAA4]" />
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Instagram className="w-4 h-4" /> Redes Sociais
              </h2>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Instagram URL</label>
                <input value={config?.instagram} onChange={(e) => setConfig({...config!, instagram: e.target.value})}
                  className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none focus:border-[#01FAA4]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-500">LinkedIn URL</label>
                <input value={config?.linkedin} onChange={(e) => setConfig({...config!, linkedin: e.target.value})}
                  className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none focus:border-[#01FAA4]" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#01FAA4] text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(1,250,164,0.3)] transition-all disabled:opacity-50">
            <Save className="w-5 h-5" />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
