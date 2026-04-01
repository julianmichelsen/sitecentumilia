'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Star, User, MoveUp, MoveDown } from 'lucide-react';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  order: number;
}

export default function AdminTestimonials() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    quote: '', author: '', role: '', rating: 5
  });

  const loadTestimonials = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  async function handleAdd() {
    if (!newTestimonial.quote || !newTestimonial.author) return;
    
    // Using simple client-side ID generation for initial state
    const testimonialToAdd = {
      ...newTestimonial,
      id: Date.now().toString(),
      order: testimonials.length + 1
    } as Testimonial;

    const updated = [...testimonials, testimonialToAdd];
    setTestimonials(updated);
    setNewTestimonial({ quote: '', author: '', role: '', rating: 5 });
    saveTestimonials(updated);
  }

  async function handleDelete(id: string) {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    saveTestimonials(updated);
  }

  async function move(index: number, direction: 'up' | 'down') {
    const updated = [...testimonials];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= updated.length) return;
    
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    const reordered = updated.map((t, i) => ({ ...t, order: i + 1 }));
    setTestimonials(reordered);
    saveTestimonials(reordered);
  }

  async function saveTestimonials(data: Testimonial[]) {
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage('Atualizado com sucesso');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Erro ao salvar');
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#BB61EC] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Depoimentos</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie as avaliações de seus clientes</p>
      </div>

      {message && <div className="px-4 py-3 bg-[#BB61EC]/10 border border-[#BB61EC]/30 text-[#BB61EC] rounded-xl text-sm">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adicionar Novo */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 h-fit space-y-4">
          <h2 className="text-lg font-semibold text-white">Novo Depoimento</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-400">Autor</label>
              <input value={newTestimonial.author} onChange={(e) => setNewTestimonial({...newTestimonial, author: e.target.value})}
                className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none mt-1" placeholder="Nome do cliente" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Cargo / Empresa</label>
              <input value={newTestimonial.role} onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                className="w-full h-11 px-4 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none mt-1" placeholder="Ex: Diretor de Marketing" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Depoimento</label>
              <textarea value={newTestimonial.quote} onChange={(e) => setNewTestimonial({...newTestimonial, quote: e.target.value})}
                className="w-full h-24 px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-white outline-none mt-1 resize-none" placeholder="O que o cliente disse..." />
            </div>
            <div>
              <label className="text-sm text-gray-400">Avaliação (1-5 estrelas)</label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                    className={`p-1 transition-colors ${newTestimonial.rating! >= star ? 'text-yellow-500' : 'text-gray-700 hover:text-gray-500'}`}>
                    <Star className={`w-6 h-6 ${newTestimonial.rating! >= star ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleAdd} disabled={!newTestimonial.author || !newTestimonial.quote}
              className="w-full h-11 bg-[#BB61EC] text-white font-bold rounded-xl disabled:opacity-50 mt-2">
              Adicionar Depoimento
            </button>
          </div>
        </div>

        {/* Lista de Depoimentos */}
        <div className="lg:col-span-2 space-y-4">
          {testimonials.length === 0 ? (
            <div className="bg-[#111] border border-[#222] rounded-2xl p-12 text-center text-gray-500">
              Nenhum depoimento cadastrado.
            </div>
          ) : (
            testimonials.map((t, index) => (
              <div key={t.id} className="bg-[#111] border border-[#222] rounded-xl p-6 group relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#333]">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-white font-bold">{t.author}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${t.rating >= s ? 'text-yellow-500 fill-current' : 'text-gray-800'}`} />)}
                  </div>
                </div>
                <p className="text-gray-300 text-sm italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#111] pl-2">
                  <button onClick={() => move(index, 'up')} className="p-1.5 text-gray-400 hover:text-white"><MoveUp className="w-4 h-4" /></button>
                  <button onClick={() => move(index, 'down')} className="p-1.5 text-gray-400 hover:text-white"><MoveDown className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg ml-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
