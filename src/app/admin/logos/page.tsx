'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Upload, MoveUp, MoveDown } from 'lucide-react';

interface Logo {
  name: string;
  logo: string;
  order: number;
}

export default function AdminLogos() {
  const router = useRouter();
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [newLogo, setNewLogo] = useState({ name: '', logo: '' });
  const [uploading, setUploading] = useState(false);

  const loadLogos = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/logos');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setLogos(Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => {
    loadLogos();
  }, [loadLogos]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('directory', 'logos');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url || data.path) {
        setNewLogo({ ...newLogo, logo: data.url || data.path });
        setMessage('Logo enviada!');
      } else {
        setMessage(data.error || 'Falha no upload');
      }
    } catch (err) {
      alert('Erro no upload');
    } finally {
      setUploading(false);
    }
  }

  async function handleAdd() {
    if (!newLogo.name || !newLogo.logo) return;
    const updated = [...logos, { ...newLogo, order: logos.length + 1 }];
    setLogos(updated);
    setNewLogo({ name: '', logo: '' });
    saveLogos(updated);
  }

  async function handleDelete(index: number) {
    const updated = logos.filter((_, i) => i !== index);
    setLogos(updated);
    saveLogos(updated);
  }

  async function move(index: number, direction: 'up' | 'down') {
    const updated = [...logos];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= updated.length) return;
    
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    // Re-assign orders
    const ordered = updated.map((item, i) => ({ ...item, order: i + 1 }));
    setLogos(ordered);
    saveLogos(ordered);
  }

  async function saveLogos(data: Logo[]) {
    try {
      const res = await fetch('/api/admin/logos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage('Salvo com sucesso');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Erro ao salvar');
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#01FAA4] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Logos de Clientes</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie as marcas exibidas na home</p>
      </div>

      {message && <div className="px-4 py-3 bg-[#01FAA4]/10 border border-[#01FAA4]/30 text-[#01FAA4] rounded-xl text-sm">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adicionar Novo */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 h-fit space-y-4">
          <h2 className="text-lg font-semibold text-white">Adicionar Logo</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-400">Nome da Empresa</label>
              <input value={newLogo.name} onChange={(e) => setNewLogo({...newLogo, name: e.target.value})}
                className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white focus:border-[#01FAA4] outline-none mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Arquivo do Logo</label>
              <div className="mt-1 flex items-center gap-3">
                <label className="flex-1 h-11 border-2 border-dashed border-[#333] rounded-xl flex items-center justify-center cursor-pointer hover:border-[#01FAA4]/50 transition-colors group">
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                  <Upload className="w-4 h-4 text-gray-500 group-hover:text-[#01FAA4] mr-2" />
                  <span className="text-sm text-gray-500">{uploading ? 'Enviando...' : (newLogo.logo ? 'Imagem OK' : 'Upload')}</span>
                </label>
                {newLogo.logo && (
                   <div className="w-11 h-11 bg-white rounded-xl overflow-hidden p-1">
                      <img src={newLogo.logo} alt="Preview" className="w-full h-full object-contain" />
                   </div>
                )}
              </div>
            </div>
            <button onClick={handleAdd} disabled={!newLogo.name || !newLogo.logo}
              className="w-full h-11 bg-[#01FAA4] text-black font-bold rounded-xl disabled:opacity-50 mt-2">
              Adicionar à Lista
            </button>
          </div>
        </div>

        {/* Lista de Logos */}
        <div className="lg:col-span-2 space-y-3">
          {logos.length === 0 ? (
            <div className="bg-[#111] border border-[#222] rounded-2xl p-12 text-center text-gray-500">
              Nenhuma logo adicionada.
            </div>
          ) : (
            logos.map((logo, index) => (
              <div key={index} className="bg-[#111] border border-[#222] rounded-xl p-4 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 bg-white rounded-lg p-2 flex items-center justify-center overflow-hidden">
                    <img src={logo.logo} alt={logo.name} className="max-h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{logo.name}</p>
                    <p className="text-xs text-gray-500">Ordem: {logo.order}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => move(index, 'up')} className="p-2 text-gray-400 hover:text-white"><MoveUp className="w-4 h-4" /></button>
                  <button onClick={() => move(index, 'down')} className="p-2 text-gray-400 hover:text-white"><MoveDown className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(index)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg ml-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
