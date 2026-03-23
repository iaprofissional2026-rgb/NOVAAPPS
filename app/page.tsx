'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User, Product } from '@/lib/types';
import Image from 'next/image';
import PhoneInput from 'react-phone-number-input';
import { Search, Plus, User as UserIcon, MessageSquare, ArrowLeft, Send, Image as ImageIcon, Trash2, ShieldCheck, ShoppingBag, Check, Copy, Star, Package, Edit, Eye, ChevronRight, ChevronDown, CheckCircle, AlertCircle, Info, Heart, ShoppingCart, Flag, Shield, Lock, Moon, Sun, Sparkles, Zap, Palette, CreditCard, Loader2 } from 'lucide-react';


// --- Components ---

const Splash = ({ onComplete, platformSettings }: { onComplete: () => void, platformSettings: any }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
          <ShoppingBag size={48} className="text-text" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter text-text">{platformSettings.app_name}</h1>
        <p className="text-text/60 mt-2 font-medium">Compre e venda rápido</p>
      </motion.div>
    </motion.div>
  );
};

const Login = ({ onLogin, onAdmin, onDbError, dbError, showToast, theme, setTheme }: { onLogin: (user: User) => void, onAdmin: () => void, onDbError: (table: string) => void, dbError: string | null, showToast: (msg: string, type?: 'success' | 'error' | 'info') => void, theme: string, setTheme: (t: string) => void }) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminKey, setAdminKey] = useState('');

  const handleAdminCheck = () => {
    if (adminKey === '@mizaelkauany13122024mk.+#"21()') {
      onAdmin();
    } else {
      showToast('Chave incorreta', 'error');
      setAdminKey('');
      setShowAdminInput(false);
    }
  };

  const handleEnter = async () => {
    if (!name || !whatsapp) return;
    setLoading(true);
    
    // In a real app, we'd use Supabase Auth or a custom table.
    // For this demo, we'll check if user exists in 'users' table or create them.
    try {
      // Check if Supabase is configured
      const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                          !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      if (isConfigured) {
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('whatsapp', whatsapp)
          .limit(1)
          .maybeSingle();

        if (existingUser) {
          // Se o usuário já existe pelo WhatsApp, logamos ele.
          // Isso evita que o mesmo número acesse gratuitamente criando novas contas.
          onLogin(existingUser);
          return;
        }

        // Removemos a verificação de nome duplicado para permitir que usuários 
        // com nomes iguais mas números diferentes se cadastrem, 
        // já que o WhatsApp é o identificador único real.

        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ name: name.trim(), whatsapp, is_seller: false }])
          .select()
          .single();
        
        if (newUser) {
          onLogin(newUser);
          return;
        }
        
        if (fetchError || insertError) {
          const err = fetchError || insertError;
          if (err) {
            console.error('Supabase error:', JSON.stringify(err, null, 2));
            if (err.message.includes('relation "users" does not exist') || err.code === 'PGRST205' || err.code === '42703') {
              onDbError('database');
            }
          }
          throw new Error('Database error');
        }
      } else {
        throw new Error('Supabase not configured');
      }
    } catch (err) {
      console.warn('Using fallback login due to:', err);
      // Fallback for demo if DB is not ready
      onLogin({ 
        id: 'demo-' + Math.random().toString(36).substr(2, 9), 
        name, 
        whatsapp, 
        pix_key: '',
        is_seller: false, 
        created_at: new Date().toISOString() 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Theme Switcher */}
      <div className="absolute top-8 right-8 z-20">
        <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
      </div>

      {/* Minimalist Floating Notification Cart */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-8 right-8 z-20"
      >
        <div className="relative group">
          <div className="w-14 h-14 bg-card border border-border rounded-2xl flex items-center justify-center text-primary shadow-2xl cursor-pointer hover:border-primary/30 transition-all">
            <ShoppingCart size={24} />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-card">
              2
            </div>
          </div>
          
          {/* Personalized Notification Preview */}
          <div className="absolute top-full right-0 mt-4 w-72 bg-card border border-border rounded-3xl p-5 shadow-2xl opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all z-50">
            <h4 className="text-xs font-black uppercase tracking-widest text-text/50 mb-4">Alertas Recentes</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-text">Nova Mensagem</p>
                  <p className="text-[10px] text-text/60 truncate">&quot;Olá, o produto ainda está disponível?&quot;</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-danger/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart size={16} className="text-danger" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-text">Baixa de Preço!</p>
                  <p className="text-[10px] text-text/60 truncate">O item que você salvou baixou 15%</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] text-text/60 text-center italic">Entre para ver todos os detalhes</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <ShoppingBag size={40} className="text-primary" />
          </div>
          <h2 className="text-3xl font-black tracking-tight flex items-center justify-center gap-2 text-text">
            Bem vindo(a)
            <Lock size={18} className="text-text/40" />
          </h2>
          <p className="text-text/60 mt-2 font-medium">Entre para começar a negociar</p>
        </div>

        {dbError && (
          <div className="bg-danger/10 border border-danger/20 p-5 rounded-3xl mb-8 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-danger/20 text-danger rounded-2xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-lg font-bold text-danger leading-tight">Banco de Dados não Configurado</p>
                <p className="text-xs text-text/60 mt-1">As tabelas necessárias não foram encontradas no Supabase.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAdminInput(true)}
                className="flex-1 bg-danger text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-danger/20 active:scale-95 transition-transform"
              >
                Configurar (SQL)
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="bg-text/10 text-text px-6 rounded-2xl text-sm font-bold active:scale-95 transition-transform border border-border"
              >
                Recarregar
              </button>
            </div>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text/60 mb-1 block">Nome</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-text"
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text/60 mb-1 block">WhatsApp</label>
            <PhoneInput
              international
              defaultCountry="BR"
              value={whatsapp?.startsWith('+') ? whatsapp : ''}
              onChange={(value) => setWhatsapp(value || '')}
              className="w-full bg-card border border-border rounded-xl p-4 focus-within:ring-2 focus-within:ring-primary transition-all phone-input-custom text-text"
              placeholder="(00) 00000-0000"
            />
          </div>
          <button 
            onClick={handleEnter}
            disabled={loading || !name || !whatsapp}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 mt-4"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="flex items-center justify-center gap-2 mt-6 py-3 px-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl animate-pulse">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Plataforma 100% Segura & Verificada</span>
          </div>
        </div>

        <div className="flex flex-col items-center mt-12 gap-4">
          <div className="flex items-center gap-1.5 text-[9px] text-text/40 uppercase font-bold tracking-[0.2em]">
            <Lock size={10} />
            Conexão Criptografada de Ponta a Ponta
          </div>
          
          {showAdminInput ? (
            <div className="flex gap-2 items-center">
                <input 
                  type="password" 
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Chave Admin"
                  className="bg-card border border-border rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-text"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminCheck()}
                />
              <button 
                onClick={handleAdminCheck}
                className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded font-bold uppercase"
              >
                OK
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAdminInput(true)}
              className="text-[10px] text-text/30 hover:text-text/50 transition-colors uppercase font-bold tracking-widest"
            >
              Painel Administrativo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SafetyBanner = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-primary/10 border border-primary/20 rounded-3xl p-4 mb-8 flex items-center gap-4"
  >
    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
      <ShieldCheck size={24} />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-black text-text">Compra Segura Garantida</h4>
      <p className="text-[10px] text-text/60">Vendedores verificados e sistema de proteção contra golpes ativo.</p>
    </div>
    <button className="text-[10px] font-black text-primary uppercase tracking-widest">Saiba mais</button>
  </motion.div>
);

const ReportModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  type, 
  reason, 
  setReason, 
  details, 
  setDetails, 
  isSubmitting 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSubmit: () => void, 
  type: 'user' | 'product',
  reason: string,
  setReason: (r: string) => void,
  details: string,
  setDetails: (d: string) => void,
  isSubmitting: boolean
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-card w-full max-w-md rounded-[2.5rem] border border-border p-8 relative z-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-danger/10 rounded-2xl flex items-center justify-center text-danger">
              <Flag size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black">Denunciar {type === 'user' ? 'Usuário' : 'Produto'}</h3>
              <p className="text-xs text-text/50">Ajude-nos a manter a comunidade segura.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-text/50 uppercase tracking-widest mb-2 block">Motivo</label>
              <select 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-background border border-border rounded-2xl p-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-danger/50"
              >
                <option value="">Selecione um motivo</option>
                <option value="Golpe / Fraude">Golpe / Fraude</option>
                <option value="Produto Falso">Produto Falso</option>
                <option value="Comportamento Inadequado">Comportamento Inadequado</option>
                <option value="Spam">Spam</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-text/50 uppercase tracking-widest mb-2 block">Detalhes (Opcional)</label>
              <textarea 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Descreva o que aconteceu..."
                className="w-full bg-background border border-border rounded-2xl p-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-danger/50 min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={onClose}
                className="flex-1 bg-text/5 py-4 rounded-2xl font-bold text-sm hover:bg-text/10 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={onSubmit}
                disabled={!reason || isSubmitting}
                className="flex-[2] bg-danger text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-danger/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-border border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Denúncia'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ProductCard = ({ product, onClick, featured = false, isFavorite = false, onToggleFavorite }: { product: Product, onClick: () => void, featured?: boolean, isFavorite?: boolean, onToggleFavorite?: (e: React.MouseEvent) => void }) => (

  <motion.div 
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`bg-card rounded-[2rem] overflow-hidden card-shadow border border-border cursor-pointer group relative ${featured ? 'w-72 flex-shrink-0' : ''}`}
  >
    <div className={`${featured ? 'h-48' : 'aspect-square'} relative overflow-hidden`}>
      <Image 
        src={product.image_url || `https://picsum.photos/seed/${product.id}/400/400`} 
        alt={product.name}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {product.seller_role === 'admin' && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 bg-[length:200%_auto] animate-shimmer text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg border border-yellow-200/50 z-20">
          Gold Admin
        </div>
      )}

      {onToggleFavorite && (
        <button 
          onClick={onToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${isFavorite ? 'bg-danger text-white' : 'bg-black/50 text-white hover:bg-black/70'}`}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      )}

      {product.rating_avg && product.rating_avg >= 4.5 && (
        <div className={`absolute top-3 ${onToggleFavorite ? 'left-3' : 'right-3'} bg-primary/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter`}>
          Destaque
        </div>
      )}
      {(!product.rating_count || product.rating_count === 0) && (
        <div className={`absolute top-3 ${onToggleFavorite ? 'left-12' : 'left-3'} bg-white/90 backdrop-blur-md text-black text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter`}>
          Novo
        </div>
      )}
    </div>
    <div className="p-5">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-bold text-lg truncate leading-tight flex-1 text-text">{product.name}</h3>
        {product.seller_is_verified && (
          <div className="text-primary flex-shrink-0" title="Vendedor Verificado">
            <CheckCircle size={16} fill="currentColor" className="text-text" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-primary font-black text-xl">
          R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        {product.rating_count && product.rating_count > 0 && (
          <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-lg">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-black">{product.rating_avg?.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const ThemeSwitcher = ({ currentTheme, onThemeChange }: { currentTheme: string, onThemeChange: (theme: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const themes = [
    { id: 'dark', name: 'Escuro', icon: <Moon size={14} />, color: 'bg-zinc-900 border-zinc-800 text-zinc-100' },
    { id: 'light', name: 'Claro', icon: <Sun size={14} />, color: 'bg-zinc-100 border-zinc-200 text-zinc-900' },
    { id: 'female', name: 'Feminino', icon: <Sparkles size={14} />, color: 'bg-pink-100 border-pink-200 text-pink-600' },
    { id: 'male', name: 'Masculino', icon: <Zap size={14} />, color: 'bg-blue-100 border-blue-200 text-blue-600' },
  ];

  const activeTheme = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-card/80 backdrop-blur-md border border-border rounded-full text-text hover:bg-text/5 transition-all shadow-lg"
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${activeTheme.color}`}>
          {activeTheme.icon}
        </div>
        <span className="text-xs font-semibold hidden sm:block">{activeTheme.name}</span>
        <ChevronDown size={14} className={`text-text/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-3 w-56 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
          >
            <div className="px-3 py-2 mb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text/50">Aparência</p>
            </div>
            <div className="space-y-1">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => { onThemeChange(theme.id); setIsOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    currentTheme === theme.id 
                      ? 'bg-primary/15 text-primary' 
                      : 'hover:bg-text/5 text-text/60 hover:text-text'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border shadow-sm ${theme.color}`}>
                    {theme.icon}
                  </div>
                  <span className={`text-sm font-medium ${currentTheme === theme.id ? 'font-semibold' : ''}`}>
                    {theme.name}
                  </span>
                  {currentTheme === theme.id && (
                    <motion.div layoutId="active-theme-check" className="ml-auto">
                      <Check size={16} className="text-primary" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'login' | 'home' | 'details' | 'sell' | 'add' | 'profile' | 'admin' | 'edit' | 'chat'>('splash');
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app-theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const handleStartChat = async (product: Product) => {
    if (!user) {
      setScreen('login');
      return;
    }
    if (user.id === product.seller_id) {
      showToast('Você não pode iniciar um chat com você mesmo.', 'info');
      return;
    }

    try {
      // Check if chat already exists
      const { data: existingChat, error: fetchError } = await supabase
        .from('chats')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', product.seller_id)
        .eq('product_id', product.id)
        .maybeSingle();

      if (existingChat) {
        setActiveChatId(existingChat.id);
        setScreen('chat');
        return;
      }

      // Create new chat
      const { data: newChat, error: createError } = await supabase
        .from('chats')
        .insert([{
          buyer_id: user.id,
          seller_id: product.seller_id,
          product_id: product.id
        }])
        .select()
        .single();

      if (newChat) {
        setActiveChatId(newChat.id);
        setScreen('chat');
      } else {
        console.error('Error creating chat:', createError);
        showToast('Erro ao iniciar chat.', 'error');
      }
    } catch (err) {
      console.error('Unexpected error starting chat:', err);
    }
  };
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment') === 'success') {
      showToast('Pagamento realizado com sucesso!', 'success');
      // Remove query string to avoid showing toast again on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (query.get('payment') === 'cancel') {
      showToast('Pagamento cancelado.', 'error');
      // Remove query string
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const showConfirm = (message: string, onConfirm: () => void) => {
    setConfirmModal({ message, onConfirm });
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [adminCode, setAdminCode] = useState('');

  const categories = [
    { name: 'Todos', icon: <Package size={18} /> },
    { name: 'Eletrônicos', icon: <ShieldCheck size={18} /> },
    { name: 'Moda', icon: <UserIcon size={18} /> },
    { name: 'Casa', icon: <ShoppingBag size={18} /> },
    { name: 'Veículos', icon: <Plus size={18} /> },
    { name: 'Esportes', icon: <Star size={18} /> },
    { name: 'Outros', icon: <MessageSquare size={18} /> }
  ];

  // Form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Outros');
  const [newProductImage, setNewProductImage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isCopyingPixCode, setIsCopyingPixCode] = useState(false);
  const [isCopyingSellerPix, setIsCopyingSellerPix] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);

  // Chat states
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Admin states
  const [couponCode, setCouponCode] = useState('');
  const [couponValue, setCouponValue] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({ name: '', whatsapp: '', pix_key: '', is_seller: false, role: 'user' });

  // Profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editPix, setEditPix] = useState('');
  const [dbError, setDbError] = useState<string | null>(null);
  const [platformSettings, setPlatformSettings] = useState({ pix_key: '80097004952', activation_fee: '10', app_name: 'VendaJá' });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [adminChats, setAdminChats] = useState<any[]>([]);
  const [userChats, setUserChats] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedAdminChatMessages, setSelectedAdminChatMessages] = useState<any[]>([]);
  const [showAdminChatModal, setShowAdminChatModal] = useState(false);
  const [isLoadingAdminMessages, setIsLoadingAdminMessages] = useState(false);
  const [adminUserSearch, setAdminUserSearch] = useState('');
  const [adminProductSearch, setAdminProductSearch] = useState('');
  const [adminChatSearch, setAdminChatSearch] = useState('');
  const [adminReviewSearch, setAdminReviewSearch] = useState('');
  const [adminCouponSearch, setAdminCouponSearch] = useState('');

  // Review states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);

  // Report states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Golpe / Fraude');
  const [reportDetails, setReportDetails] = useState('');
  const [reportingType, setReportingType] = useState<'product' | 'user'>('product');
  const [reportingId, setReportingId] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [allReports, setAllReports] = useState<any[]>([]);
  const [adminReportSearch, setAdminReportSearch] = useState('');

  const fetchProducts = async () => {
    try {
      let { data, error } = await supabase
        .from('products')
        .select('*, users(name, whatsapp, pix_key, avatar_url, rating_avg, rating_count, is_verified, is_banned, role)')
        .order('created_at', { ascending: false });
      
      // Fallback if 'role' or other new columns are missing
      if (error && error.code === '42703') {
        const fallback = await supabase
          .from('products')
          .select('*, users(name, whatsapp, pix_key, avatar_url)')
          .order('created_at', { ascending: false });
        
        if (!fallback.error) {
          data = fallback.data;
          error = null; // Clear the error since fallback worked
        } else {
          error = fallback.error;
        }
      }

      if (data) {
        setProducts(data.map(p => ({
          ...p,
          seller_name: p.users?.name,
          seller_whatsapp: p.users?.whatsapp,
          seller_pix_key: p.users?.pix_key,
          seller_avatar_url: p.users?.avatar_url,
          seller_rating_avg: p.users?.rating_avg,
          seller_rating_count: p.users?.rating_count,
          seller_is_verified: p.users?.is_verified,
          seller_is_banned: p.users?.is_banned,
          seller_role: p.users?.role
        })));
        setDbError(null);
      } else if (error) {
        console.error('Error fetching products:', JSON.stringify(error, null, 2));
        const errorMessage = error.message || '';
        if (errorMessage.includes('relation "products" does not exist') || errorMessage.includes('relation "users" does not exist') || error.code === 'PGRST205' || error.code === '42703') {
          setDbError('database');
        }
        setProducts([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching products:', err);
      setProducts([]);
    }
  };

  const fetchAllReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, buyer:users!buyer_id(name), products(name)')
        .order('created_at', { ascending: false });
      if (data) setAllReviews(data);
    } catch (err) {
      console.error('Error fetching all reviews:', err);
    }
  };

  const fetchAllReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*, reporter:users!reports_reporter_id_fkey(name), reported_user:users!reports_reported_user_id_fkey(name), reported_product:products(name)')
        .order('created_at', { ascending: false });
      if (data) setAllReports(data);
    } catch (err) {
      console.error('Error fetching all reports:', err);
    }
  };

  // Fetch products
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.from('settings').select('*');
        if (data && !error) {
          setPlatformSettings(prev => {
            const settingsObj = { ...prev };
            data.forEach(s => {
              if (s.id === 'pix_key') settingsObj.pix_key = s.value;
              if (s.id === 'activation_fee') settingsObj.activation_fee = s.value;
              if (s.id === 'app_name') settingsObj.app_name = s.value;
            });
            return settingsObj;
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();

    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('product_id')
          .eq('user_id', user.id);
        if (data) setFavorites(data.map(f => f.product_id));
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };
    fetchFavorites();

    if (screen === 'home' || screen === 'admin') {
      fetchProducts();
    }

    if (screen === 'details' && selectedProduct) {
      const fetchReviews = async () => {
        try {
          const { data, error } = await supabase
            .from('reviews')
            .select('*, buyer:users!buyer_id(name)')
            .eq('product_id', selectedProduct.id)
            .order('created_at', { ascending: false });
          if (data) setProductReviews(data);
        } catch (err) {
          console.error('Error fetching reviews:', err);
        }
      };
      fetchReviews();
    }

    if (screen === 'admin') {
      const fetchUsers = async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error('Error fetching users:', JSON.stringify(error, null, 2));
            const errorMessage = error.message || '';
            if (errorMessage.includes('relation "users" does not exist') || error.code === 'PGRST205' || error.code === '42703') {
              setDbError('database');
            }
          }
          if (data) setAllUsers(data);
        } catch (err) {
          console.error('Error fetching users:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
        }
      };
      const fetchCoupons = async () => {
        try {
          const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error('Error fetching coupons:', JSON.stringify(error, null, 2));
            const errorMessage = error.message || '';
            if (error.code === 'PGRST116' || error.code === 'PGRST205' || errorMessage.includes('relation "coupons" does not exist')) {
              console.warn('Coupons table not found. Please run the SQL setup in the Admin panel.');
              setDbError('database');
              setCoupons([]);
            } else {
              showToast(`Erro ao carregar cupons: ${errorMessage}`, 'error');
            }
          }
          if (data) setCoupons(data);
        } catch (err) {
          console.error('Unexpected error fetching coupons:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
        }
      };
      const fetchAdminChats = async () => {
        try {
          const { data, error } = await supabase
            .from('chats')
            .select('*, buyer:users!buyer_id(name), seller:users!seller_id(name), products(name)')
            .order('created_at', { ascending: false });
          if (data) setAdminChats(data);
        } catch (err) {
          console.error('Error fetching admin chats:', err);
        }
      };
      const fetchUserChats = async () => {
        if (!user) return;
        try {
          const { data, error } = await supabase
            .from('chats')
            .select('*, buyer:users!buyer_id(name), seller:users!seller_id(name), products(*)')
            .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
            .order('created_at', { ascending: false });
          if (data) setUserChats(data);
        } catch (err) {
          console.error('Error fetching user chats:', err);
        }
      };
      fetchUsers();
      fetchCoupons();
      fetchAdminChats();
      fetchUserChats();
      fetchAllReviews();
      fetchAllReports();
    }
  }, [screen, selectedProduct, user]);

  // Chat Real-time Subscription
  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', activeChatId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat:${activeChatId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `chat_id=eq.${activeChatId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChatId]);

  // Notification Permission & Global Subscriptions
  useEffect(() => {
    if (!user) return;

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const showPushNotification = (title: string, body: string, icon?: string, type: 'message' | 'price' = 'message') => {
      const newNotification = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        body,
        icon,
        type,
        created_at: new Date().toISOString(),
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: icon || '/favicon.ico',
        });
      }
    };

    // Global Message Subscription for Notifications
    const messageChannel = supabase
      .channel('global_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, async (payload) => {
        const newMessage = payload.new;
        if (newMessage.sender_id !== user.id) {
          const { data: chat } = await supabase
            .from('chats')
            .select('buyer_id, seller_id, products(name, image_url)')
            .eq('id', newMessage.chat_id)
            .single();

          if (chat && (chat.buyer_id === user.id || chat.seller_id === user.id)) {
            if (activeChatId !== newMessage.chat_id) {
              const productName = (chat.products as any)?.name || 'Chat';
              const productImage = (chat.products as any)?.image_url;
              showPushNotification(
                `Nova mensagem em ${productName}`,
                newMessage.text,
                productImage,
                'message'
              );
              showToast(`Nova mensagem em ${productName}`, 'info');
            }
          }
        }
      })
      .subscribe();

    // Price Drop Subscription
    const priceChannel = supabase
      .channel('price_drops')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'products',
      }, (payload) => {
        const oldProduct = payload.old;
        const newProduct = payload.new;
        
        if (favorites.includes(newProduct.id) && newProduct.price < oldProduct.price) {
          showPushNotification(
            `Baixa de Preço!`,
            `${newProduct.name} agora está por R$ ${newProduct.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            newProduct.image_url,
            'price'
          );
          showToast(`O preço de ${newProduct.name} baixou!`, 'success');
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(priceChannel);
    };
  }, [user, activeChatId, favorites]);

  const handleToggleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!user) {
      setScreen('login');
      return;
    }

    const isFav = favorites.includes(productId);
    
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== productId));
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
    } else {
      setFavorites(prev => [...prev, productId]);
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, product_id: productId });
      showToast('Produto salvo nos favoritos!', 'success');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (value: string | number) => {
    if (value === undefined || value === null || value === '') return '';
    
    let stringValue = '';
    if (typeof value === 'number') {
      stringValue = Math.round(value * 100).toString();
    } else {
      stringValue = value.replace(/\D/g, '');
    }
    
    if (!stringValue) return '';
    const cents = parseInt(stringValue, 10);
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const parseCurrency = (value: string | number) => {
    if (typeof value === 'number') return value;
    const cleanValue = value.replace(/\D/g, '');
    const parsed = parseFloat(cleanValue) / 100;
    return isNaN(parsed) ? 0 : parsed;
  };

  const handlePublishProduct = async () => {
    if (!user || !newProductName || !newProductPrice) return;
    setIsPublishing(true);

    const imageUrl = newProductImage || `https://picsum.photos/seed/${Math.random()}/800/800`;

    if (user.id.startsWith('demo-')) {
      const newProduct = {
        id: 'demo-prod-' + Math.random().toString(36).substr(2, 9),
        seller_id: user.id,
        name: newProductName,
        price: parseCurrency(newProductPrice),
        description: newProductDesc,
        category: newProductCategory,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        seller_name: user.name,
        seller_whatsapp: user.whatsapp,
        seller_pix_key: user.pix_key,
        seller_avatar_url: user.avatar_url
      };
      setProducts([newProduct, ...products]);
      setScreen('home');
      setNewProductName('');
      setNewProductPrice('');
      setNewProductDesc('');
      setNewProductCategory('Outros');
      setNewProductImage(null);
      setIsPublishing(false);
      return;
    }

    try {
      const productData = {
        seller_id: user.id,
        name: newProductName,
        price: parseCurrency(newProductPrice),
        description: newProductDesc,
        category: newProductCategory,
        image_url: imageUrl
      };

      let { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error && error.message.includes("column 'category' of relation 'products' does not exist")) {
        // Fallback for missing category column
        const { category, ...dataWithoutCategory } = productData;
        const retry = await supabase
          .from('products')
          .insert([dataWithoutCategory])
          .select()
          .single();
        data = retry.data;
        error = retry.error;
      }

      if (error) {
        console.error('Supabase error publishing product:', JSON.stringify(error, null, 2));
        if (error.message.includes('relation "products" does not exist') || error.code === 'PGRST205') {
          showToast('Erro: A tabela "products" não foi encontrada. Use o script de configuração no Painel Admin.', 'error');
        } else {
          showToast(`Erro ao publicar produto: ${error.message}`, 'error');
        }
        return;
      }

      if (data) {
        const productWithSeller = {
          ...data,
          seller_name: user.name,
          seller_whatsapp: user.whatsapp,
          seller_pix_key: user.pix_key,
          seller_avatar_url: user.avatar_url
        };
        setProducts([productWithSeller, ...products]);
        setScreen('home');
        // Reset form
        setNewProductName('');
        setNewProductPrice('');
        setNewProductDesc('');
        setNewProductCategory('Outros');
        setNewProductImage(null);
        showToast('Produto publicado com sucesso!', 'success');
      }
    } catch (err) {
      console.error('Error publishing product:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
      showToast('Erro inesperado ao publicar produto.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!user || !selectedProduct || !newProductName || !newProductPrice) return;
    setIsPublishing(true);

    const imageUrl = newProductImage || selectedProduct.image_url;

    if (user.id.startsWith('demo-')) {
      const updatedProduct = {
        ...selectedProduct,
        name: newProductName,
        price: parseCurrency(newProductPrice),
        description: newProductDesc,
        category: newProductCategory,
        image_url: imageUrl
      };
      setProducts(products.map(p => p.id === selectedProduct.id ? updatedProduct : p));
      setSelectedProduct(updatedProduct);
      setScreen(isAdmin ? 'admin' : 'details');
      setIsPublishing(false);
      return;
    }

    try {
      const updateData = {
        name: newProductName,
        price: parseCurrency(newProductPrice),
        description: newProductDesc,
        category: newProductCategory,
        image_url: imageUrl
      };

      let { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', selectedProduct.id);

      if (error && error.message.includes("column 'category' of relation 'products' does not exist")) {
        // Fallback for missing category column
        const { category, ...dataWithoutCategory } = updateData;
        const retry = await supabase
          .from('products')
          .update(dataWithoutCategory)
          .eq('id', selectedProduct.id);
        error = retry.error;
      }

      if (!error) {
        const updatedProduct = {
          ...selectedProduct,
          name: newProductName,
          price: parseCurrency(newProductPrice),
          description: newProductDesc,
          category: newProductCategory,
          image_url: imageUrl
        };
        setProducts(products.map(p => p.id === selectedProduct.id ? updatedProduct : p));
        setSelectedProduct(updatedProduct);
        setScreen(isAdmin ? 'admin' : 'details');
        showToast('Produto atualizado com sucesso!', 'success');
      } else {
        showToast('Erro ao atualizar produto: ' + error.message, 'error');
      }
    } catch (err) {
      console.error('Error updating product:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
      showToast('Erro inesperado ao atualizar produto.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUpdatePlatformSettings = async (key: string, value: string) => {
    if (!isSupabaseConfigured()) {
      showToast('O Supabase não está configurado.', 'error');
      return;
    }
    setIsSavingSettings(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ id: key, value: value, updated_at: new Date().toISOString() });
      
      if (error) throw error;
      
      setPlatformSettings(prev => ({ ...prev, [key]: value }));
      showToast('Configuração atualizada com sucesso!', 'success');
    } catch (err) {
      console.error('Error updating settings:', err);
      const message = err instanceof Error ? err.message : 'Erro inesperado';
      if (message.includes('Failed to fetch')) {
        showToast('Erro de conexão com o Supabase.', 'error');
      } else {
        showToast('Erro ao atualizar configuração: ' + message, 'error');
      }
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .single();
      
      if (error) {
        console.error('Error applying coupon:', JSON.stringify(error, null, 2));
        const errorMessage = error.message || 'Erro desconhecido';
        if (errorMessage.includes('relation "coupons" does not exist') || error.code === 'PGRST205') {
          showToast('Erro: A tabela "coupons" não foi encontrada no banco de dados. Por favor, contate o administrador.', 'error');
        } else {
          showToast(`Cupom inválido ou expirado. (${errorMessage})`, 'error');
        }
        setCouponDiscount(0);
        setIsCouponApplied(false);
        return;
      }

      if (data) {
        if (typeof data.value !== 'number') {
          console.error('Invalid coupon value:', JSON.stringify(data.value, null, 2));
          showToast('Erro: O valor do cupom é inválido no banco de dados.', 'error');
          return;
        }
        setCouponDiscount(data.value);
        setIsCouponApplied(true);
        showToast(`Cupom aplicado! Desconto de ${formatCurrency(data.value)}`, 'success');
      } else {
        showToast('Cupom não encontrado.', 'info');
        setCouponDiscount(0);
        setIsCouponApplied(false);
      }
    } catch (err) {
      console.error('Error applying coupon:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
      showToast('Erro ao aplicar cupom.', 'error');
    }
  };

  const handleActivateSeller = async () => {
    if (!user) return;
    
    // Proceed with activation
    if (user.id.startsWith('demo-')) {
      setUser({ ...user, is_seller: true });
      setCouponDiscount(0);
      setIsCouponApplied(false);
      setCouponCode('');
      setScreen('add');
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ is_seller: true })
        .eq('id', user.id);

      if (!error) {
        setUser({ ...user, is_seller: true });
        setCouponDiscount(0);
        setIsCouponApplied(false);
        setCouponCode('');
        setScreen('add');
      } else {
        showToast('Erro ao ativar conta: ' + error.message, 'error');
        console.error('Supabase error activating seller:', error);
      }
    } catch (err) {
      console.error('Error activating seller:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
      showToast('Erro inesperado ao ativar conta.', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    showConfirm('Tem certeza que deseja excluir este produto?', async () => {
      try {
        if (id.startsWith('demo-')) {
          setProducts(products.filter(p => p.id !== id));
          setAdminChats(adminChats.filter(c => c.product_id !== id));
          showToast('Produto excluído com sucesso (Demo)!', 'success');
          return;
        }

        // Excluir mensagens dos chats relacionados ao produto
        const { data: chats } = await supabase.from('chats').select('id').eq('product_id', id);
        if (chats && chats.length > 0) {
          const chatIds = chats.map(c => c.id);
          await supabase.from('messages').delete().in('chat_id', chatIds);
        }
        
        // Excluir chats relacionados ao produto
        await supabase.from('chats').delete().eq('product_id', id);
        
        // Excluir avaliações relacionadas ao produto
        await supabase.from('reviews').delete().eq('product_id', id);

        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (!error) {
          setProducts(products.filter(p => p.id !== id));
          setAdminChats(adminChats.filter(c => c.product_id !== id));
          showToast('Produto excluído com sucesso!', 'success');
        } else {
          console.error('Error deleting product:', error);
          showToast('Erro ao excluir produto: ' + error.message, 'error');
        }
      } catch (err) {
        console.error('Error deleting product:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
        showToast('Erro inesperado ao excluir produto.', 'error');
      }
    });
  };

  const handleCreateCoupon = async () => {
    console.log('Attempting to create coupon:', { code: couponCode, value: couponValue });
    
    if (!couponCode || !couponValue) {
      showToast('Por favor, preencha o código e o valor do cupom.', 'info');
      return;
    }
    
    if (!isSupabaseConfigured()) {
      showToast('O Supabase não está configurado. Configure as variáveis de ambiente.', 'error');
      return;
    }
    
    setIsCreatingCoupon(true);
    try {
      const payload = { 
        code: couponCode.toUpperCase().trim(), 
        value: parseCurrency(couponValue) 
      };
      console.log('Sending payload to Supabase:', payload);

      const { data, error } = await supabase
        .from('coupons')
        .insert([payload])
        .select()
        .single();
      
      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error creating coupon:', JSON.stringify(error, null, 2));
        if (error.message.includes('relation "coupons" does not exist') || error.code === 'PGRST205') {
          showToast('Erro: A tabela "coupons" não foi encontrada. Use o script de configuração no Painel Admin.', 'error');
        } else if (error.code === '42501') {
          showToast('Erro de permissão (RLS). Verifique as políticas de segurança da tabela "coupons" no Supabase.', 'error');
        } else {
          showToast(`Erro ao criar cupom: ${error.message || 'Erro desconhecido'}`, 'error');
        }
      } else if (data) {
        setCoupons(prev => [data, ...prev]);
        setCouponCode('');
        setCouponValue('');
        showToast('Cupom criado com sucesso!', 'success');
      } else {
        // Fallback if no data and no error (unlikely)
        console.warn('No data returned from coupon creation');
        // Try to fetch all coupons again to be sure
        const { data: allCoupons } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
        if (allCoupons) setCoupons(allCoupons);
        setCouponCode('');
        setCouponValue('');
      }
    } catch (err) {
      console.error('Unexpected error creating coupon:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
      showToast('Erro inesperado ao criar cupom. Verifique o console.', 'error');
    } finally {
      setIsCreatingCoupon(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    showConfirm('Tem certeza que deseja excluir este cupom?', async () => {
      try {
        if (id.startsWith('demo-')) {
          setCoupons(coupons.filter(c => c.id !== id));
          showToast('Cupom excluído com sucesso (Demo)!', 'success');
          return;
        }

        const { error } = await supabase
          .from('coupons')
          .delete()
          .eq('id', id);
        
        if (!error) {
          setCoupons(coupons.filter(c => c.id !== id));
          showToast('Cupom excluído com sucesso!', 'success');
        } else {
          console.error('Error deleting coupon:', JSON.stringify(error, null, 2));
          showToast(`Erro ao excluir cupom: ${error.message || 'Erro desconhecido'}`, 'error');
        }
      } catch (err) {
        console.error('Unexpected error deleting coupon:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
        showToast('Erro inesperado ao excluir cupom.', 'error');
      }
    });
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);

    if (user.id.startsWith('demo-')) {
      setUser({ ...user, name: editName, whatsapp: editWhatsapp, pix_key: editPix, avatar_url: editAvatarUrl });
      setIsEditingProfile(false);
      setIsSavingProfile(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      showToast('O Supabase não está configurado.', 'error');
      setIsSavingProfile(false);
      return;
    }

    try {
      // Check if new name is taken by another user
      if (editName.trim().toLowerCase() !== user.name.trim().toLowerCase()) {
        const { data: existingNameUser } = await supabase
          .from('users')
          .select('id')
          .ilike('name', editName.trim())
          .neq('id', user.id)
          .limit(1)
          .maybeSingle();
          
        if (existingNameUser) {
          showToast(`O nome "${editName.trim()}" já está em uso. Por favor, escolha outro nome.`, 'info');
          setIsSavingProfile(false);
          return;
        }
      }

      // Check if new whatsapp is taken by another user
      if (editWhatsapp !== user.whatsapp) {
        const { data: existingWhatsappUser } = await supabase
          .from('users')
          .select('id')
          .eq('whatsapp', editWhatsapp)
          .neq('id', user.id)
          .limit(1)
          .maybeSingle();
          
        if (existingWhatsappUser) {
          showToast(`O número de WhatsApp já está em uso por outro usuário.`, 'info');
          setIsSavingProfile(false);
          return;
        }
      }

      const { error } = await supabase
        .from('users')
        .update({ name: editName, whatsapp: editWhatsapp, pix_key: editPix, avatar_url: editAvatarUrl })
        .eq('id', user.id);
      
      if (!error) {
        setUser({ ...user, name: editName, whatsapp: editWhatsapp, pix_key: editPix, avatar_url: editAvatarUrl });
        setProducts(products.map(p => p.seller_id === user.id ? {
          ...p,
          seller_name: editName,
          seller_whatsapp: editWhatsapp,
          seller_pix_key: editPix,
          seller_avatar_url: editAvatarUrl
        } : p));
        setIsEditingProfile(false);
      } else {
        showToast('Erro ao salvar perfil: ' + error.message, 'error');
      }
    } catch (err) {
      console.error('Error updating profile:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
      showToast('Erro inesperado ao salvar perfil.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !selectedProduct || !newMessage || !activeChatId) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          chat_id: activeChatId,
          sender_id: user.id,
          text: newMessage
        }]);
      
      if (!error) {
        setNewMessage('');
      } else {
        console.error('Supabase error sending message:', error);
        showToast('Erro ao enviar mensagem.', 'error');
      }
    } catch (err) {
      console.error('Error sending message:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    showConfirm('Tem certeza que deseja excluir este usuário?', async () => {
      try {
        if (id.startsWith('demo-')) {
          setAllUsers(allUsers.filter(u => u.id !== id));
          setProducts(products.filter(p => p.seller_id !== id));
          setAdminChats(adminChats.filter(c => c.buyer_id !== id && c.seller_id !== id));
          showToast('Usuário excluído com sucesso (Demo)!', 'success');
          return;
        }

        // Excluir mensagens do usuário
        await supabase.from('messages').delete().eq('sender_id', id);
        
        // Excluir chats onde o usuário é comprador ou vendedor
        const { data: chats } = await supabase.from('chats').select('id').or(`buyer_id.eq.${id},seller_id.eq.${id}`);
        if (chats && chats.length > 0) {
          const chatIds = chats.map(c => c.id);
          await supabase.from('messages').delete().in('chat_id', chatIds);
          await supabase.from('chats').delete().in('id', chatIds);
        }
        
        // Excluir avaliações onde o usuário é comprador ou vendedor
        await supabase.from('reviews').delete().or(`buyer_id.eq.${id},seller_id.eq.${id}`);
        
        // Excluir produtos do usuário (e seus chats/mensagens/avaliações)
        const { data: userProducts } = await supabase.from('products').select('id').eq('seller_id', id);
        if (userProducts && userProducts.length > 0) {
          for (const p of userProducts) {
            const { data: pChats } = await supabase.from('chats').select('id').eq('product_id', p.id);
            if (pChats && pChats.length > 0) {
              const pChatIds = pChats.map(c => c.id);
              await supabase.from('messages').delete().in('chat_id', pChatIds);
              await supabase.from('chats').delete().in('id', pChatIds);
            }
            await supabase.from('reviews').delete().eq('product_id', p.id);
          }
          await supabase.from('products').delete().eq('seller_id', id);
        }

        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', id);
        
        if (!error) {
          setAllUsers(allUsers.filter(u => u.id !== id));
          setProducts(products.filter(p => p.seller_id !== id));
          setAdminChats(adminChats.filter(c => c.buyer_id !== id && c.seller_id !== id));
          showToast('Usuário excluído com sucesso!', 'success');
        } else {
          console.error('Error deleting user:', error);
          showToast('Erro ao excluir usuário: ' + error.message, 'error');
        }
      } catch (err) {
        console.error('Error deleting user:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
        showToast('Erro inesperado ao excluir usuário.', 'error');
      }
    });
  };

  const handleToggleSeller = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_seller: !currentStatus })
        .eq('id', id);
      
      if (!error) {
        setAllUsers(allUsers.map(u => u.id === id ? { ...u, is_seller: !currentStatus } : u));
      }
    } catch (err) {
      console.error('Error toggling seller status:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !selectedProduct) return;
    setIsSubmittingReview(true);
    try {
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .insert([{
          buyer_id: user.id,
          seller_id: selectedProduct.seller_id,
          product_id: selectedProduct.id,
          rating: reviewRating,
          comment: reviewComment
        }])
        .select('*, buyer:users!buyer_id(name)')
        .single();

      if (reviewError) throw reviewError;

      const newProductRatingCount = (selectedProduct.rating_count || 0) + 1;
      const newProductRatingAvg = ((selectedProduct.rating_avg || 0) * (selectedProduct.rating_count || 0) + reviewRating) / newProductRatingCount;
      
      const { error: productUpdateError } = await supabase
        .from('products')
        .update({ rating_avg: newProductRatingAvg, rating_count: newProductRatingCount })
        .eq('id', selectedProduct.id);

      if (productUpdateError && productUpdateError.code !== '42703') {
        console.error('Error updating product ratings:', productUpdateError);
      }

      const { data: sellerData, error: sellerFetchError } = await supabase.from('users').select('rating_avg, rating_count').eq('id', selectedProduct.seller_id).single();
      
      if (sellerData) {
        const newSellerRatingCount = (sellerData.rating_count || 0) + 1;
        const newSellerRatingAvg = ((sellerData.rating_avg || 0) * (sellerData.rating_count || 0) + reviewRating) / newSellerRatingCount;
        const { error: sellerUpdateError } = await supabase
          .from('users')
          .update({ rating_avg: newSellerRatingAvg, rating_count: newSellerRatingCount })
          .eq('id', selectedProduct.seller_id);
          
        if (sellerUpdateError && sellerUpdateError.code !== '42703') {
          console.error('Error updating seller ratings:', sellerUpdateError);
        }
      } else if (sellerFetchError && sellerFetchError.code !== '42703') {
        console.error('Error fetching seller ratings:', sellerFetchError);
      }

      setProductReviews([reviewData, ...productReviews]);
      setSelectedProduct({ ...selectedProduct, rating_avg: newProductRatingAvg, rating_count: newProductRatingCount });
      setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, rating_avg: newProductRatingAvg, rating_count: newProductRatingCount } : p));
      
      setShowReviewModal(false);
      setReviewRating(5);
      setReviewComment('');
      showToast('Avaliação enviada com sucesso!', 'success');
    } catch (err) {
      console.error('Error submitting review:', err);
      showToast('Erro ao enviar avaliação. Se a tabela não existir, configure o banco de dados no painel admin.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleUpdateSettings = async () => {
    if (!isSupabaseConfigured()) {
      showToast('O Supabase não está configurado. Configure as variáveis de ambiente no Vercel ou no AI Studio.', 'error');
      return;
    }
    setIsSavingSettings(true);
    try {
      const updates = [
        { id: 'pix_key', value: platformSettings.pix_key },
        { id: 'activation_fee', value: platformSettings.activation_fee.toString() },
        { id: 'app_name', value: platformSettings.app_name }
      ];
      
      const { error } = await supabase
        .from('settings')
        .upsert(updates);
      
      if (!error) {
        showToast('Configurações salvas com sucesso!', 'success');
      } else {
        if (error.message.includes('Failed to fetch')) {
          showToast('Erro de conexão: Não foi possível alcançar o Supabase. Verifique sua conexão e a URL do Supabase.', 'error');
        } else {
          showToast('Erro ao salvar configurações: ' + error.message, 'error');
        }
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      const message = err instanceof Error ? err.message : 'Erro inesperado';
      if (message.includes('Failed to fetch')) {
        showToast('Erro de conexão: Não foi possível alcançar o Supabase. Verifique se a URL está correta.', 'error');
      } else {
        showToast('Erro inesperado ao salvar configurações.', 'error');
      }
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleUpdateUserAdmin = async () => {
    if (!editingUser) return;
    if (!isSupabaseConfigured()) {
      showToast('O Supabase não está configurado.', 'error');
      return;
    }
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          name: editingUser.name, 
          whatsapp: editingUser.whatsapp, 
          pix_key: editingUser.pix_key,
          role: editingUser.role
        })
        .eq('id', editingUser.id);
      
      if (!error) {
        setAllUsers(allUsers.map(u => u.id === editingUser.id ? editingUser : u));
        setProducts(products.map(p => p.seller_id === editingUser.id ? {
          ...p,
          seller_name: editingUser.name,
          seller_whatsapp: editingUser.whatsapp,
          seller_pix_key: editingUser.pix_key,
          seller_role: editingUser.role
        } : p));
        setEditingUser(null);
        showToast('Usuário atualizado com sucesso', 'success');
      } else {
        if (error.message.includes('Failed to fetch')) {
          showToast('Erro de conexão com o Supabase.', 'error');
        } else {
          showToast('Erro ao atualizar usuário: ' + error.message, 'error');
        }
        console.error(error);
      }
    } catch (err) {
      console.error('Error updating user as admin:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
      showToast('Erro inesperado ao atualizar usuário', 'error');
    }
  };

  const handleAddUserAdmin = async () => {
    if (!newUser.name || !newUser.whatsapp) {
      showToast('Nome e WhatsApp são obrigatórios', 'error');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: newUser.name,
          whatsapp: newUser.whatsapp,
          pix_key: newUser.pix_key,
          is_seller: newUser.is_seller || false,
          role: newUser.role || 'user'
        }])
        .select()
        .single();
      
      if (error) {
        showToast('Erro ao adicionar usuário: ' + error.message, 'error');
        console.error(error);
      } else if (data) {
        setAllUsers([data, ...allUsers]);
        setShowAddUserModal(false);
        setNewUser({ name: '', whatsapp: '', pix_key: '', is_seller: false, role: 'user' });
        showToast('Usuário adicionado com sucesso', 'success');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      showToast('Erro inesperado ao adicionar usuário', 'error');
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    showConfirm('Tem certeza que deseja excluir este chat? Todas as mensagens serão removidas.', async () => {
      try {
        if (chatId.startsWith('demo-')) {
          setAdminChats(adminChats.filter(c => c.id !== chatId));
          setUserChats(userChats.filter(c => c.id !== chatId));
          showToast('Chat excluído com sucesso (Demo)!', 'success');
          return;
        }

        // Delete messages first
        await supabase.from('messages').delete().eq('chat_id', chatId);
        // Delete chat
        const { error } = await supabase.from('chats').delete().eq('id', chatId);
        if (!error) {
          setAdminChats(adminChats.filter(c => c.id !== chatId));
          setUserChats(userChats.filter(c => c.id !== chatId));
          showToast('Chat excluído com sucesso!', 'success');
        } else {
          showToast('Erro ao excluir chat: ' + error.message, 'error');
        }
      } catch (err) {
        console.error('Error deleting chat:', err);
        showToast('Erro inesperado ao excluir chat.', 'error');
      }
    });
  };

  const handleDeleteReview = async (reviewId: string) => {
    showConfirm('Tem certeza que deseja excluir esta avaliação?', async () => {
      try {
        if (reviewId.startsWith('demo-')) {
          setAllReviews(allReviews.filter(r => r.id !== reviewId));
          setProductReviews(productReviews.filter(r => r.id !== reviewId));
          showToast('Avaliação excluída com sucesso (Demo)!', 'success');
          return;
        }

        const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
        if (!error) {
          setAllReviews(allReviews.filter(r => r.id !== reviewId));
          setProductReviews(productReviews.filter(r => r.id !== reviewId));
          showToast('Avaliação excluída com sucesso!', 'success');
        } else {
          showToast('Erro ao excluir avaliação: ' + error.message, 'error');
        }
      } catch (err) {
        console.error('Error deleting review:', err);
        showToast('Erro inesperado ao excluir avaliação.', 'error');
      }
    });
  };

  const handleUpdateProductAdmin = async () => {
    if (!editingProduct) return;
    try {
      const updateData = { 
        name: editingProduct.name, 
        price: parseCurrency(editingProduct.price), 
        description: editingProduct.description,
        image_url: editingProduct.image_url,
        category: editingProduct.category
      };

      let { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', editingProduct.id);
      
      if (error && error.message.includes("column 'category' of relation 'products' does not exist")) {
        // Fallback for missing category column
        const { category, ...dataWithoutCategory } = updateData;
        const retry = await supabase
          .from('products')
          .update(dataWithoutCategory)
          .eq('id', editingProduct.id);
        error = retry.error;
      }

      if (!error) {
        setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, price: parseCurrency(editingProduct.price) } : p));
        setEditingProduct(null);
        showToast('Produto atualizado com sucesso!', 'success');
      } else {
        showToast('Erro ao atualizar produto: ' + error.message, 'error');
      }
    } catch (err) {
      console.error('Error updating product as admin:', err instanceof Error ? { message: err.message, stack: err.stack } : err);
      showToast('Erro inesperado ao atualizar produto.', 'error');
    }
  };

  const handleReport = async () => {
    if (!user || !reportingId) return;
    setIsSubmittingReport(true);
    try {
      const { error } = await supabase
        .from('reports')
        .insert([{
          reporter_id: user.id,
          reported_user_id: reportingType === 'user' ? reportingId : null,
          reported_product_id: reportingType === 'product' ? reportingId : null,
          reason: reportReason,
          details: reportDetails,
          status: 'pending'
        }]);

      if (!error) {
        showToast('Denúncia enviada com sucesso. Nossa equipe irá analisar.', 'success');
        setShowReportModal(false);
        setReportDetails('');
      } else {
        if (error.message.includes('relation "reports" does not exist') || error.code === 'PGRST205') {
          showToast('Sistema de denúncias não configurado no banco de dados.', 'error');
        } else {
          showToast('Erro ao enviar denúncia: ' + error.message, 'error');
        }
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      showToast('Erro inesperado ao enviar denúncia.', 'error');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  if (screen === 'splash') return <Splash onComplete={() => setScreen('login')} platformSettings={platformSettings} />;
  if (screen === 'login' && !user) return <Login onLogin={(u) => { 
    if (u.is_banned) {
      showToast('Sua conta foi suspensa por violação dos termos de uso.', 'error');
      return;
    }
    setUser(u); 
    setScreen('home'); 
  }} onAdmin={() => { 
    setIsAdmin(true); 
    setUser({ id: 'demo-admin', name: 'Administrador', whatsapp: '+5511999999999', is_seller: true, role: 'admin', created_at: new Date().toISOString() });
    setScreen('admin'); 
  }} onDbError={setDbError} dbError={dbError} showToast={showToast} theme={theme} setTheme={setTheme} />;

  return (
    <div className="min-h-screen bg-background pb-24">
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="p-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 px-2">
              <div>
                <h1 
                  className="text-3xl font-black tracking-tighter text-text flex items-center gap-2 cursor-pointer select-none"
                  onClick={(e) => {
                    // Hidden access: Triple click on the logo area if user is admin
                    if (isAdmin && e.detail === 3) {
                      setScreen('admin');
                    }
                  }}
                >
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ShoppingBag size={18} className="text-text" />
                  </div>
                  {platformSettings.app_name}
                </h1>
                <p className="text-[10px] text-text/50 uppercase font-black tracking-[0.2em] mt-1">Marketplace Premium</p>
              </div>
              <div className="flex items-center gap-3">
                <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
                
                {dbError && isAdmin && (
                  <button onClick={() => setScreen('admin')} className="p-2 bg-danger/20 text-danger rounded-full border border-danger/20 flex items-center gap-2 px-3">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-bold uppercase">Configurar</span>
                  </button>
                )}
                
                {/* Notification Cart */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-text/60 hover:text-primary hover:border-primary/30 transition-all relative"
                  >
                    <ShoppingCart size={20} />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-card">
                        {notifications.filter(n => !n.read).length}
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute top-full right-0 mt-4 w-80 bg-card border border-border rounded-[2rem] p-6 shadow-2xl z-50"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="text-xs font-black uppercase tracking-widest text-text/50">Notificações</h4>
                          <button 
                            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                            className="text-[10px] text-primary font-bold uppercase"
                          >
                            Ler todas
                          </button>
                        </div>
                        
                        <div className="space-y-4 max-h-96 overflow-y-auto no-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="text-center py-8">
                              <ShoppingCart size={32} className="text-text/20 mx-auto mb-3" />
                              <p className="text-xs text-text/40">Nenhuma notificação por aqui.</p>
                            </div>
                          ) : (
                            notifications.map(notif => (
                              <div key={notif.id} className={`flex gap-3 p-3 rounded-2xl transition-colors ${notif.read ? 'bg-text/[0.02]' : 'bg-text/5 border border-border'}`}>
                                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 relative">
                                  {notif.icon ? (
                                    <Image src={notif.icon} alt="" fill className="object-cover" referrerPolicy="no-referrer" />
                                  ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                      {notif.type === 'message' ? <MessageSquare size={16} className="text-primary" /> : <Heart size={16} className="text-danger" />}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-text leading-tight mb-1">{notif.title}</p>
                                  <p className="text-[10px] text-text/60 line-clamp-2">{notif.body}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={() => setScreen('profile')}
                  className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-text/60 hover:text-text hover:border-border transition-all relative overflow-hidden"
                >
                  {user?.avatar_url ? (
                    <Image src={user.avatar_url} alt="Perfil" fill className="object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text/50" size={20} />
              <input 
                type="text" 
                placeholder="Buscar produtos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-text"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-6 mb-2 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat.name 
                      ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-105' 
                      : 'bg-card text-text/50 border border-border hover:border-border'
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>

            <SafetyBanner />

            {/* Featured Section */}
            {products.length > 0 && selectedCategory === 'Todos' && !searchQuery && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black tracking-tight">Destaques da Semana</h3>
                  <button className="text-primary text-xs font-bold uppercase tracking-widest">Ver tudo</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {products.slice(0, 5).map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      featured={true}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={(e) => handleToggleFavorite(e, product.id)}
                      onClick={() => { setSelectedProduct(product); setScreen('details'); }} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Banner */}
            <div className="bg-gradient-to-br from-primary via-emerald-500 to-teal-600 rounded-[2.5rem] p-8 mb-10 relative overflow-hidden shadow-2xl shadow-primary/20">
              <div className="relative z-10 max-w-[60%]">
                <h2 className="text-3xl font-black text-white leading-none mb-2">Compre e venda rápido</h2>
                <p className="text-white/90 text-sm font-medium">A maior comunidade de desapego do Brasil</p>
                <button 
                  onClick={() => setScreen((user?.is_seller || isAdmin) ? 'add' : 'sell')}
                  className="mt-6 bg-white text-primary px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  Começar agora
                </button>
              </div>
              <ShoppingBag className="absolute -right-8 -bottom-8 text-white/10 rotate-12" size={200} />
            </div>

            {/* Product List Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black tracking-tight">
                {searchQuery ? `Resultados para "${searchQuery}"` : selectedCategory === 'Todos' ? 'Explorar Tudo' : selectedCategory}
              </h3>
              <span className="text-text/50 text-xs font-bold">{filteredProducts.length} itens</span>
            </div>

            {/* Product List */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-2 gap-5"
            >
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <ProductCard 
                    product={product} 
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={(e) => handleToggleFavorite(e, product.id)}
                    onClick={() => { setSelectedProduct(product); setScreen('details'); }} 
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Floating Action Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              onClick={() => setScreen((user?.is_seller || isAdmin) ? 'add' : 'sell')}
              className="fixed bottom-8 right-8 bg-primary text-white flex items-center gap-3 px-8 py-5 rounded-full font-black shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all z-40 group"
            >
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20 group-hover:opacity-40" />
              <Plus size={24} className="relative z-10" />
              <span className="relative z-10 uppercase tracking-widest text-xs">Vender agora</span>
            </motion.button>
          </motion.div>
        )}

        {screen === 'details' && selectedProduct && (
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -50 }}
            className="relative"
          >
            <button 
              onClick={() => setScreen('home')}
              className="absolute top-6 left-6 z-10 p-3 bg-black/50 backdrop-blur-md rounded-full text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="w-full aspect-square relative">
              <Image 
                src={selectedProduct.image_url} 
                alt={selectedProduct.name}
                fill
                className="object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6 -mt-8 bg-background rounded-t-[40px] relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold">{selectedProduct.name}</h2>
                <button 
                  onClick={(e) => handleToggleFavorite(e, selectedProduct.id)}
                  className={`p-3 rounded-2xl backdrop-blur-md transition-all ${favorites.includes(selectedProduct.id) ? 'bg-danger text-white' : 'bg-text/5 text-text/60 border border-border'}`}
                >
                  <Heart size={24} fill={favorites.includes(selectedProduct.id) ? "currentColor" : "none"} />
                </button>
              </div>
              <p className="text-primary text-3xl font-black mb-6">
                R$ {selectedProduct.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <div className="mb-8">
                <h3 className="text-text/60 uppercase text-xs font-bold tracking-widest mb-2">Descrição</h3>
                <p className="text-text/80 leading-relaxed">{selectedProduct.description}</p>
              </div>

              <div className="mb-8 bg-card border border-border p-4 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary relative overflow-hidden">
                  {selectedProduct.seller_avatar_url ? (
                    <Image src={selectedProduct.seller_avatar_url} alt={selectedProduct.seller_name || 'Vendedor'} fill className="object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text/50 uppercase font-bold tracking-widest mb-1">Vendedor</p>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg leading-none">{selectedProduct.seller_name || 'Usuário'}</p>
                    {selectedProduct.seller_is_verified && (
                      <div className="text-primary" title="Vendedor Verificado">
                        <CheckCircle size={14} fill="currentColor" className="text-text" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Star size={12} className="text-yellow-500" fill="currentColor" />
                    <span className="text-xs font-bold text-yellow-500">
                      {selectedProduct.seller_rating_avg ? selectedProduct.seller_rating_avg.toFixed(1) : 'Novo'}
                    </span>
                    <span className="text-xs text-text/50">
                      ({selectedProduct.seller_rating_count || 0} avaliações)
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setReportingType('user');
                    setReportingId(selectedProduct.seller_id);
                    setShowReportModal(true);
                  }}
                  className="p-3 bg-text/5 text-text/50 hover:text-danger hover:bg-danger/10 rounded-2xl transition-all border border-border"
                  title="Denunciar Vendedor"
                >
                  <Flag size={18} />
                </button>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => handleStartChat(selectedProduct)}
                  className="w-full bg-text/5 text-text font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-border"
                >
                  <MessageSquare size={20} />
                  Chat Interno
                </button>
                <button 
                  onClick={() => window.open(`https://wa.me/${selectedProduct.seller_whatsapp?.replace(/\D/g, '')}`, '_blank')}
                  className="w-full bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  WhatsApp
                </button>
                <button 
                  onClick={() => setShowPixModal(true)}
                  className="w-full bg-secondary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  Comprar
                </button>
                {user && user.id !== selectedProduct.seller_id && (
                  <button 
                    onClick={() => {
                      setReportingType('product');
                      setReportingId(selectedProduct.id);
                      setShowReportModal(true);
                    }}
                    className="w-full bg-danger/5 text-danger font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-danger/10"
                  >
                    <Flag size={20} />
                    Denunciar Produto
                  </button>
                )}
                {user && user.id === selectedProduct.seller_id && (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        setNewProductName(selectedProduct.name);
                        setNewProductPrice(formatCurrency(selectedProduct.price));
                        setNewProductDesc(selectedProduct.description);
                        setNewProductCategory(selectedProduct.category || 'Outros');
                        setNewProductImage(selectedProduct.image_url);
                        setScreen('edit');
                      }}
                      className="flex-1 bg-text/5 text-text font-bold py-4 rounded-2xl border border-border flex items-center justify-center gap-2"
                    >
                      <Edit size={20} />
                      Editar
                    </button>
                    <button 
                      onClick={async () => {
                        await handleDeleteProduct(selectedProduct.id);
                        setScreen('home');
                      }}
                      className="flex-1 bg-danger/10 text-danger font-bold py-4 rounded-2xl border border-danger/20 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={20} />
                      Excluir
                    </button>
                  </div>
                )}
                {user && user.id !== selectedProduct.seller_id && (
                  <button 
                    onClick={() => setShowReviewModal(true)}
                    className="w-full bg-text/5 text-text font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-border"
                  >
                    <Check size={20} />
                    Marcar como comprado
                  </button>
                )}
              </div>

              {/* Reviews List */}
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  Avaliações <span className="text-text/50 text-sm font-normal">({productReviews.length})</span>
                </h3>
                {productReviews.length === 0 ? (
                  <p className="text-text/50 text-center py-8 bg-card rounded-2xl border border-border">Nenhuma avaliação ainda.</p>
                ) : (
                  <div className="space-y-4">
                    {productReviews.map(review => (
                      <div key={review.id} className="bg-card p-4 rounded-2xl border border-border">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-sm">{review.buyer?.name || 'Usuário'}</p>
                          <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} size={12} fill={star <= review.rating ? "currentColor" : "none"} className={star <= review.rating ? "" : "text-text/40"} />
                            ))}
                          </div>
                        </div>
                        {review.comment && <p className="text-text/60 text-sm mt-2">{review.comment}</p>}
                        <p className="text-[10px] text-text/40 mt-2">{new Date(review.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Review Modal */}
            <AnimatePresence>
              {showReviewModal && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-card w-full max-w-sm rounded-3xl p-8 border border-border text-center"
                  >
                    <h3 className="text-2xl font-bold mb-2">Avaliar Compra</h3>
                    <p className="text-text/60 text-sm mb-6">Como foi sua experiência com {selectedProduct.seller_name}?</p>
                    
                    <div className="flex justify-center gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`p-2 transition-transform hover:scale-110 ${star <= reviewRating ? 'text-yellow-500' : 'text-text/40'}`}
                        >
                          <Star size={32} fill={star <= reviewRating ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Deixe um comentário (opcional)"
                      className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-6 min-h-[100px]"
                    />

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowReviewModal(false)}
                        className="flex-1 bg-text/5 py-4 rounded-2xl font-bold"
                        disabled={isSubmittingReview}
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleSubmitReview}
                        className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold"
                        disabled={isSubmittingReview}
                      >
                        {isSubmittingReview ? 'Enviando...' : 'Enviar'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pix Modal */}
            <AnimatePresence>
              {showPixModal && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-card w-full max-w-sm rounded-3xl p-8 border border-border text-center"
                  >
                    <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Pagamento Seguro</h3>
                    <p className="text-text/60 text-sm mb-6">Para poder pagar e liberar o produto, é preciso entrar em contato com o administrador.</p>
                    
                    <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-8 text-left">
                      <p className="text-sm text-text/80 mb-3 text-center">
                        Clique no botão abaixo para falar com o administrador via WhatsApp:
                      </p>
                      <button 
                        onClick={() => window.open(`https://wa.me/5542988715181`, '_blank')}
                        className="w-full bg-[#25D366] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                      >
                        <Send size={18} />
                        Falar com Administrador
                      </button>
                    </div>

                    <button 
                      onClick={() => setShowPixModal(false)}
                      className="w-full bg-text/5 py-4 rounded-2xl font-bold"
                    >
                      Fechar
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {screen === 'sell' && (
          <motion.div 
            key="sell"
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="p-6 flex flex-col items-center justify-center min-h-screen text-center"
          >
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Seja um Vendedor</h2>
            <p className="text-text/60 mb-8">Para começar a vender seus produtos e alcançar milhares de compradores, ative sua conta de vendedor.</p>
            
            <div className="bg-card p-6 rounded-3xl w-full max-w-sm border border-border mb-8">
              <p className="text-text/60 text-sm mb-1">Taxa de ativação</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <p className={`text-4xl font-black ${isCouponApplied ? 'text-text/50 line-through text-2xl' : 'text-text'}`}>
                  R$ {Number(platformSettings.activation_fee).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                {isCouponApplied && (
                  <p className="text-4xl font-black text-primary">
                    {formatCurrency(Math.max(0, Number(platformSettings.activation_fee) - couponDiscount))}
                  </p>
                )}
              </div>
              
              <div className="space-y-4 mb-6">
                {Math.max(0, Number(platformSettings.activation_fee) - couponDiscount) > 0 && (
                  <>
                    <div className="bg-white p-4 rounded-2xl mb-4 flex items-center justify-center">
                      <Image 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`00020101021126580014BR.GOV.BCB.PIX0136${platformSettings.pix_key}52040000530398654041.005802BR5913${platformSettings.app_name.toUpperCase().substring(0, 13)} PLAT6009SAO PAULO62070503***6304ABCD`)}`}
                        alt="QR Code Pix"
                        width={180}
                        height={180}
                        className="rounded-lg"
                        unoptimized
                      />
                    </div>
                    <div className="bg-background p-4 rounded-2xl border border-border">
                      <p className="text-[10px] text-text/50 uppercase font-bold mb-2">Pix Copia e Cola</p>
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-text/60 font-mono break-all flex-1 line-clamp-2 text-left">
                          00020101021126580014BR.GOV.BCB.PIX0136{platformSettings.pix_key}52040000530398654041.005802BR5913{platformSettings.app_name.toUpperCase().substring(0, 13)} PLAT6009SAO PAULO62070503***6304ABCD
                        </p>
                        <button 
                          onClick={async () => {
                            const pixCode = `00020101021126580014BR.GOV.BCB.PIX0136${platformSettings.pix_key}52040000530398654041.005802BR5913${platformSettings.app_name.toUpperCase().substring(0, 13)} PLAT6009SAO PAULO62070503***6304ABCD`;
                            await navigator.clipboard.writeText(pixCode);
                            setIsCopyingPixCode(true);
                            setTimeout(() => setIsCopyingPixCode(false), 2000);
                          }}
                          className="p-3 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-all"
                        >
                          {isCopyingPixCode ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                      {isCopyingPixCode && (
                        <p className="text-[10px] text-primary font-bold mt-2 text-center animate-pulse">Código copiado com sucesso!</p>
                      )}
                    </div>
                  </>
                )}
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Cupom de desconto" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full bg-background border border-border rounded-xl p-3 text-center focus:outline-none focus:ring-2 focus:ring-primary uppercase font-bold"
                  />
                  {isCouponApplied && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                      <Check size={18} />
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleApplyCoupon}
                  className="w-full bg-text/5 hover:bg-text/10 text-text py-2 rounded-xl text-sm font-bold transition-all"
                >
                  {isCouponApplied ? 'Cupom Aplicado' : 'Aplicar cupom'}
                </button>
              </div>
            </div>

            <button 
              onClick={handleActivateSeller}
              className="w-full max-w-sm bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              {Math.max(0, Number(platformSettings.activation_fee) - couponDiscount) === 0 ? 'Ativar Gratuitamente' : 'Confirmar Pagamento'}
            </button>
            <button onClick={() => setScreen('home')} className="mt-6 text-text/50 font-medium">Voltar</button>
          </motion.div>
        )}

        {screen === 'chat' && activeChatId && selectedProduct && (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex flex-col h-screen bg-background"
          >
            <div className="p-4 bg-card border-bottom border-border flex items-center gap-4">
              <button onClick={() => setScreen('details')} className="p-2 bg-text/5 rounded-full"><ArrowLeft size={20}/></button>
              <div className="flex-1">
                <h3 className="font-bold truncate">{selectedProduct.name}</h3>
                <p className="text-xs text-text/50">Conversando com {user?.id === selectedProduct.seller_id ? 'Comprador' : selectedProduct.seller_name}</p>
              </div>
            </div>

            <div className="bg-danger/10 border-y border-danger/20 p-3 flex items-center gap-3">
              <AlertCircle size={16} className="text-danger flex-shrink-0" />
              <p className="text-[10px] text-danger font-medium leading-tight">
                Atenção: Nunca compartilhe senhas ou códigos de verificação. Negocie apenas dentro da plataforma para sua segurança.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-text/50">
                  <MessageSquare size={48} className="mb-4 opacity-20" />
                  <p>Inicie a conversa!</p>
                  <p className="text-xs">Seja educado e evite compartilhar dados sensíveis.</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender_id === user?.id ? 'bg-primary text-white rounded-tr-none' : 'bg-card text-text rounded-tl-none border border-border'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-[10px] opacity-50 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-card border-t border-border">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-primary text-white rounded-xl disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {screen === 'edit' && selectedProduct && (
          <motion.div 
            key="edit"
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-6 pb-24"
          >
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setScreen(isAdmin ? 'admin' : 'details')} className="p-2 bg-card rounded-full"><ArrowLeft size={20}/></button>
              <h2 className="text-2xl font-bold">Editar Produto</h2>
            </div>

            <div className="space-y-6">
              <label className="w-full aspect-video bg-card border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-text/50 cursor-pointer hover:border-primary/50 transition-all relative overflow-hidden block">
                {newProductImage ? (
                  <Image src={newProductImage} alt="Preview" fill className="object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <>
                    <ImageIcon size={48} className="mb-2" />
                    <span className="font-medium">Alterar imagem</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const img = new window.Image();
                      img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 800;
                        const MAX_HEIGHT = 800;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                          if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                          }
                        } else {
                          if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                          }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                        setNewProductImage(dataUrl);
                      };
                      img.src = event.target?.result as string;
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text/50 uppercase mb-2 block">Nome do Produto</label>
                  <input 
                    type="text" 
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary" 
                    placeholder="Ex: iPhone 15 Pro Max"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text/50 uppercase mb-2 block">Preço</label>
                  <input 
                    type="text" 
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(formatCurrency(e.target.value))}
                    className="w-full bg-card border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary" 
                    placeholder="R$ 0,00"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text/50 uppercase mb-2 block">Categoria</label>
                  <select 
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  >
                    {categories.filter(c => c.name !== 'Todos').map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-text/50 uppercase mb-2 block">Descrição</label>
                  <textarea 
                    rows={4} 
                    value={newProductDesc}
                    onChange={(e) => setNewProductDesc(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary" 
                    placeholder="Conte mais sobre o produto..."
                  ></textarea>
                </div>

                <button 
                  onClick={handleUpdateProduct}
                  disabled={isPublishing}
                  className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Salvando...
                    </>
                  ) : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {screen === 'add' && (
          <motion.div 
            key="add"
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-6"
          >
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setScreen('home')} className="p-2 bg-card rounded-full"><ArrowLeft size={20}/></button>
              <h2 className="text-2xl font-bold">Anunciar Produto</h2>
            </div>

            <div className="space-y-6">
              <label className="w-full aspect-video bg-card border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-text/50 cursor-pointer hover:border-primary/50 transition-all relative overflow-hidden block">
                {newProductImage ? (
                  <Image src={newProductImage} alt="Preview" fill className="object-cover" />
                ) : (
                  <>
                    <ImageIcon size={48} className="mb-2" />
                    <span className="font-medium">Upload imagem</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const img = new window.Image();
                      img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 800;
                        const MAX_HEIGHT = 800;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                          if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                          }
                        } else {
                          if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                          }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                        setNewProductImage(dataUrl);
                      };
                      img.src = event.target?.result as string;
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>

              <div>
                <label className="text-sm font-medium text-text/60 mb-1 block">Nome do produto</label>
                <input 
                  type="text" 
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Ex: iPhone 13 Pro" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text/60 mb-1 block">Preço (R$)</label>
                <input 
                  type="text" 
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(formatCurrency(e.target.value))}
                  className="w-full bg-card border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="R$ 0,00" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text/60 mb-1 block">Categoria</label>
                <select 
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary text-text"
                >
                  {categories.filter(c => c.name !== 'Todos').map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-text/60 mb-1 block">Descrição</label>
                <textarea 
                  rows={4} 
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Conte mais sobre o produto..."
                ></textarea>
              </div>

              <button 
                onClick={handlePublishProduct}
                disabled={isPublishing || !newProductName || !newProductPrice}
                className="w-full bg-primary disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Publicando...
                  </>
                ) : 'Publicar produto'}
              </button>
            </div>
          </motion.div>
        )}

        {screen === 'profile' && user && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="p-6"
          >
            <div className="flex items-center gap-4 mb-12">
              <button onClick={() => setScreen('home')} className="p-2 bg-card rounded-full"><ArrowLeft size={20}/></button>
              <h2 className="text-2xl font-bold">Meu Perfil</h2>
            </div>

            <div className="flex flex-col items-center mb-12">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4 relative overflow-hidden">
                {isEditingProfile ? (
                  <>
                    {editAvatarUrl ? (
                      <Image src={editAvatarUrl} alt="Avatar" fill className="object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon size={48} />
                    )}
                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold text-text">Alterar</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const img = new window.Image();
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              const MAX_WIDTH = 200;
                              const MAX_HEIGHT = 200;
                              let width = img.width;
                              let height = img.height;

                              if (width > height) {
                                if (width > MAX_WIDTH) {
                                  height *= MAX_WIDTH / width;
                                  width = MAX_WIDTH;
                                }
                              } else {
                                if (height > MAX_HEIGHT) {
                                  width *= MAX_HEIGHT / height;
                                  height = MAX_HEIGHT;
                                }
                              }
                              canvas.width = width;
                              canvas.height = height;
                              const ctx = canvas.getContext('2d');
                              ctx?.drawImage(img, 0, 0, width, height);
                              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                              setEditAvatarUrl(dataUrl);
                            };
                            img.src = event.target?.result as string;
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </>
                ) : (
                  user.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.name} fill className="object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon size={48} />
                  )
                )}
              </div>
              {isEditingProfile ? (
                <div className="w-full space-y-4">
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl p-3 text-center font-bold text-xl"
                  />
                  <PhoneInput
                    international
                    defaultCountry="BR"
                    value={editWhatsapp?.startsWith('+') ? editWhatsapp : ''}
                    onChange={(value) => setEditWhatsapp(value || '')}
                    className="w-full bg-card border border-border rounded-xl p-3 focus-within:ring-1 focus-within:ring-primary transition-all phone-input-custom"
                    placeholder="WhatsApp"
                  />
                  <input 
                    type="text" 
                    value={editPix}
                    onChange={(e) => setEditPix(e.target.value)}
                    placeholder="Sua chave Pix"
                    className="w-full bg-card border border-border rounded-xl p-3 text-center"
                  />
                  <div className="flex gap-2">
                    <button 
                      disabled={isSavingProfile}
                      onClick={() => setIsEditingProfile(false)} 
                      className="flex-1 bg-text/5 py-3 rounded-xl font-bold disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button 
                      disabled={isSavingProfile}
                      onClick={handleUpdateProfile} 
                      className="flex-1 bg-primary py-3 rounded-xl font-bold text-white disabled:opacity-50"
                    >
                      {isSavingProfile ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold">{user.name}</h3>
                  {user.role === 'admin' && (
                    <div className="mt-2 bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 bg-[length:200%_auto] animate-shimmer text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg border border-yellow-200/50 inline-block">
                      Gold Admin
                    </div>
                  )}
                  <p className="text-text/60">{user.whatsapp}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star size={16} className="text-yellow-500" fill="currentColor" />
                    <span className="font-bold text-yellow-500">
                      {user.rating_avg ? user.rating_avg.toFixed(1) : 'Novo'}
                    </span>
                    <span className="text-text/50 text-sm">
                      ({user.rating_count || 0} avaliações)
                    </span>
                  </div>
                  {user.is_seller && <span className="mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-widest">Vendedor Ativo</span>}
                </>
              )}
            </div>

            <div className="space-y-4">
              {!isEditingProfile && (
                <>
                  <div className="bg-card p-4 rounded-2xl border border-border">
                    <label className="text-xs font-bold text-text/50 uppercase mb-1 block">Chave Pix</label>
                    <p className="font-medium">{user.pix_key || 'Não cadastrada'}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditName(user.name);
                      setEditWhatsapp(user.whatsapp);
                      setEditAvatarUrl(user.avatar_url || '');
                      setEditPix(user.pix_key || '');
                      setIsEditingProfile(true);
                    }} 
                    className="w-full bg-text/5 text-text font-bold py-4 rounded-2xl"
                  >
                    Editar dados
                  </button>
                </>
              )}

              {user.is_seller && !isEditingProfile && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    Meus Produtos <span className="text-text/50 text-sm font-normal">({products.filter(p => p.seller_id === user.id).length})</span>
                  </h3>
                  <div className="space-y-4">
                    {products.filter(p => p.seller_id === user.id).length === 0 ? (
                      <p className="text-text/50 text-center py-8 bg-card rounded-2xl border border-border">Você ainda não anunciou nenhum produto.</p>
                    ) : (
                      products.filter(p => p.seller_id === user.id).map(product => (
                        <div key={product.id} className="bg-card p-4 rounded-2xl border border-border flex items-center gap-4">
                          <div className="w-16 h-16 relative rounded-xl overflow-hidden flex-shrink-0">
                            <Image src={product.image_url} alt={product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold truncate">{product.name}</h4>
                            <p className="text-primary font-bold">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setSelectedProduct(product);
                                setScreen('details');
                              }}
                              className="p-2 bg-text/5 rounded-xl text-text/60 hover:text-text"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 bg-text/5 rounded-xl text-danger hover:bg-danger/10"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {!isEditingProfile && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    Produtos Salvos <span className="text-text/50 text-sm font-normal">({favorites.length})</span>
                  </h3>
                  <div className="space-y-4">
                    {favorites.length === 0 ? (
                      <p className="text-text/50 text-center py-8 bg-card rounded-2xl border border-border">Você ainda não salvou nenhum produto.</p>
                    ) : (
                      products.filter(p => favorites.includes(p.id)).map(product => (
                        <div key={product.id} className="bg-card p-4 rounded-2xl border border-border flex items-center gap-4">
                          <div className="w-16 h-16 relative rounded-xl overflow-hidden flex-shrink-0">
                            <Image src={product.image_url} alt={product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold truncate">{product.name}</h4>
                            <p className="text-primary font-bold">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setSelectedProduct(product);
                                setScreen('details');
                              }}
                              className="p-2 bg-text/5 rounded-xl text-text/60 hover:text-text"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={(e) => handleToggleFavorite(e, product.id)}
                              className="p-2 bg-danger/10 rounded-xl text-danger"
                            >
                              <Heart size={18} fill="currentColor" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {!isEditingProfile && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    Minhas Conversas <span className="text-text/50 text-sm font-normal">({userChats.length})</span>
                  </h3>
                  <div className="space-y-4">
                    {userChats.length === 0 ? (
                      <p className="text-text/50 text-center py-8 bg-card rounded-2xl border border-border">Nenhuma conversa ativa.</p>
                    ) : (
                      userChats.map(chat => (
                        <div key={chat.id} className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setSelectedProduct(chat.products);
                              setActiveChatId(chat.id);
                              setScreen('chat');
                            }}
                            className="flex-1 bg-card p-4 rounded-2xl border border-border flex items-center gap-4 hover:bg-text/5 transition-all text-left"
                          >
                            <div className="w-12 h-12 relative rounded-full overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
                              {chat.products?.image_url ? (
                                <Image src={chat.products.image_url} alt="Chat" fill className="object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <MessageSquare size={20} className="text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold truncate">{chat.products?.name || 'Produto Removido'}</h4>
                              <p className="text-xs text-text/50 truncate">
                                {user.id === chat.seller_id ? `Comprador: ${chat.buyer?.name}` : `Vendedor: ${chat.seller?.name}`}
                              </p>
                            </div>
                            <ChevronRight size={20} className="text-text/40" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(chat.id);
                            }}
                            className="p-4 bg-danger/10 text-danger rounded-2xl border border-danger/20 hover:bg-danger/20 transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <button 
                onClick={() => { setUser(null); setScreen('login'); }}
                className="w-full text-danger font-bold py-8 mt-4"
              >
                Sair da conta
              </button>
            </div>

            {/* Secret Admin Trigger Area */}
            <div className="mt-20 flex justify-center">
              <input 
                type="password" 
                placeholder="..." 
                className="bg-transparent border-none text-transparent w-12 text-center focus:outline-none"
                onChange={(e) => {
                  if (e.target.value === '@mizaelkauany13122024mk.+#"21()') {
                    setIsAdmin(true);
                    setScreen('admin');
                  }
                }}
              />
            </div>
          </motion.div>
        )}

        {screen === 'admin' && (
          <motion.div 
            key="admin"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setScreen('home')} className="p-2 bg-card rounded-full"><ArrowLeft size={20}/></button>
                <h2 className="text-2xl font-bold">Painel Admin</h2>
              </div>
              <ShieldCheck className="text-primary" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-card p-4 rounded-2xl border border-border">
                <p className="text-text/60 text-xs font-bold uppercase">Produtos</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <div className="bg-card p-4 rounded-2xl border border-border">
                <p className="text-text/60 text-xs font-bold uppercase">Usuários</p>
                <p className="text-2xl font-bold">{allUsers.length}</p>
              </div>
            </div>

            <section className="mb-8">
              <div className="bg-card p-6 rounded-3xl border border-border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Shield size={20} className="text-primary" />
                  Configurações da Plataforma
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-text/50 uppercase font-bold mb-2 block">Chave Pix do Administrador</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        defaultValue={platformSettings.pix_key}
                        onBlur={(e) => handleUpdatePlatformSettings('pix_key', e.target.value)}
                        placeholder="Sua chave Pix"
                        className="flex-1 bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <p className="text-[10px] text-text/50 mt-1">Esta chave será usada para receber as taxas de ativação de vendedores.</p>
                  </div>

                  <div>
                    <label className="text-xs text-text/50 uppercase font-bold mb-2 block">Taxa de Ativação (R$)</label>
                    <input 
                      type="number" 
                      defaultValue={platformSettings.activation_fee}
                      onBlur={(e) => handleUpdatePlatformSettings('activation_fee', e.target.value)}
                      placeholder="Ex: 10"
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-text/50 uppercase font-bold mb-2 block">Nome do Aplicativo</label>
                    <input 
                      type="text" 
                      defaultValue={platformSettings.app_name}
                      onBlur={(e) => handleUpdatePlatformSettings('app_name', e.target.value)}
                      placeholder="Ex: VendaJá"
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl">
                <h3 className="text-primary font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck size={18} />
                  Configuração do Banco de Dados
                </h3>
                <p className="text-xs text-text/60 mb-4">
                  Se você estiver vendo erros de &quot;Table not found&quot;, execute o script SQL abaixo no Editor SQL do seu projeto Supabase.
                </p>
                <div className="bg-black/50 p-3 rounded-xl font-mono text-[10px] text-gray-300 overflow-x-auto max-h-40 relative group">
                  <pre>{`-- Copie e cole no SQL Editor do Supabase
create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  whatsapp text not null unique,
  pix_key text,
  avatar_url text,
  is_seller boolean default false,
  rating_avg numeric default 0,
  rating_count integer default 0,
  role text default 'user',
  created_at timestamp with time zone default now()
);

-- Se a tabela já existir, adicione as colunas e a restrição unique
alter table public.users add column if not exists avatar_url text;
alter table public.users add column if not exists rating_avg numeric default 0;
alter table public.users add column if not exists rating_count integer default 0;
alter table public.users add column if not exists role text default 'user';
alter table public.users add constraint users_whatsapp_key unique (whatsapp);

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.users(id) on delete cascade,
  name text not null,
  price numeric not null,
  description text,
  image_url text,
  category text default 'Outros',
  rating_avg numeric default 0,
  rating_count integer default 0,
  created_at timestamp with time zone default now()
);

-- Se a tabela já existir, adicione as colunas
alter table public.products add column if not exists category text default 'Outros';
alter table public.products add column if not exists rating_avg numeric default 0;
alter table public.products add column if not exists rating_count integer default 0;

create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references public.users(id) on delete cascade,
  seller_id uuid references public.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  value numeric not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.chats (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references public.users(id) on delete cascade,
  seller_id uuid references public.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamp with time zone default now()
);

create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references public.chats(id) on delete cascade,
  sender_id uuid references public.users(id) on delete cascade,
  text text not null,
  image_url text,
  created_at timestamp with time zone default now()
);

create table if not exists public.settings (
  id text primary key,
  value text not null,
  updated_at timestamp with time zone default now()
);

-- Inserir configurações iniciais
insert into public.settings (id, value) values ('pix_key', '80097004952') on conflict (id) do nothing;
insert into public.settings (id, value) values ('activation_fee', '10') on conflict (id) do nothing;
insert into public.settings (id, value) values ('app_name', 'VendaJá') on conflict (id) do nothing;

-- Habilitar RLS (Opcional)
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.settings enable row level security;

-- Políticas básicas (Permitir tudo para desenvolvimento)
create policy "Allow all users" on public.users for all using (true);
create policy "Allow all products" on public.products for all using (true);
create policy "Allow all reviews" on public.reviews for all using (true);
create policy "Allow all coupons" on public.coupons for all using (true);
create policy "Allow all chats" on public.chats for all using (true);
create policy "Allow all messages" on public.messages for all using (true);
create policy "Allow all settings" on public.settings for all using (true);`}</pre>
                  <button 
                    onClick={() => {
                      const sql = `-- Script de Configuração
create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  whatsapp text not null unique,
  pix_key text,
  avatar_url text,
  is_seller boolean default false,
  rating_avg numeric default 0,
  rating_count integer default 0,
  role text default 'user',
  created_at timestamp with time zone default now()
);

-- Se a tabela já existir, adicione as colunas e a restrição unique
alter table public.users add column if not exists avatar_url text;
alter table public.users add column if not exists rating_avg numeric default 0;
alter table public.users add column if not exists rating_count integer default 0;
alter table public.users add column if not exists role text default 'user';
alter table public.users add constraint users_whatsapp_key unique (whatsapp);

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.users(id) on delete cascade,
  name text not null,
  price numeric not null,
  description text,
  image_url text,
  category text default 'Outros',
  rating_avg numeric default 0,
  rating_count integer default 0,
  created_at timestamp with time zone default now()
);

-- Se a tabela já existir, adicione as colunas
alter table public.products add column if not exists category text default 'Outros';
alter table public.products add column if not exists rating_avg numeric default 0;
alter table public.products add column if not exists rating_count integer default 0;

create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references public.users(id) on delete cascade,
  seller_id uuid references public.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  value numeric not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.chats (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references public.users(id) on delete cascade,
  seller_id uuid references public.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamp with time zone default now()
);

create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references public.chats(id) on delete cascade,
  sender_id uuid references public.users(id) on delete cascade,
  text text not null,
  image_url text,
  created_at timestamp with time zone default now()
);

create table if not exists public.settings (
  id text primary key,
  value text not null,
  updated_at timestamp with time zone default now()
);

create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- Habilitar RLS
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.settings enable row level security;
alter table public.favorites enable row level security;

-- Políticas básicas
create policy "Allow all users" on public.users for all using (true);
create policy "Allow all products" on public.products for all using (true);
create policy "Allow all reviews" on public.reviews for all using (true);
create policy "Allow all coupons" on public.coupons for all using (true);
create policy "Allow all chats" on public.chats for all using (true);
create policy "Allow all messages" on public.messages for all using (true);
create policy "Allow all settings" on public.settings for all using (true);
create policy "Allow all favorites" on public.favorites for all using (true);

-- Habilitar réplica completa para detectar mudanças de preço
alter table public.products replica identity full;`;
                      navigator.clipboard.writeText(sql);
                      showToast('Script SQL copiado!', 'success');
                    }}
                    className="absolute top-2 right-2 p-2 bg-primary/20 text-primary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* Admin Chat Modal */}
            <AnimatePresence>
              {showAdminChatModal && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-card w-full max-w-lg rounded-3xl border border-border flex flex-col max-h-[80vh]"
                  >
                    <div className="p-6 border-b border-border flex justify-between items-center">
                      <h3 className="text-xl font-bold">Histórico de Mensagens</h3>
                      <button onClick={() => setShowAdminChatModal(false)} className="p-2 hover:bg-text/5 rounded-full"><Plus size={24} className="rotate-45" /></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {isLoadingAdminMessages ? (
                        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                      ) : selectedAdminChatMessages.length === 0 ? (
                        <p className="text-center text-text/50 py-12">Nenhuma mensagem neste chat.</p>
                      ) : (
                        selectedAdminChatMessages.map((msg, idx) => (
                          <div key={idx} className="bg-background p-4 rounded-2xl border border-border">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                {msg.sender_id === user?.id ? 'Você' : 'Usuário'}
                              </p>
                              <p className="text-[10px] text-text/40">
                                {new Date(msg.created_at).toLocaleString()}
                              </p>
                            </div>
                            <p className="text-sm text-text/80">{msg.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary" />
                  Configurações Globais
                </h3>
                <div className="bg-card p-4 rounded-2xl border border-border space-y-4">
                  <div>
                    <label className="text-[10px] text-text/50 uppercase font-bold mb-1 block">Nome do Aplicativo</label>
                    <input 
                      type="text" 
                      value={platformSettings.app_name}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, app_name: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm"
                      placeholder="Ex: VendaJá"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text/50 uppercase font-bold mb-1 block">Chave Pix da Plataforma</label>
                    <input 
                      type="text" 
                      value={platformSettings.pix_key}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, pix_key: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm"
                      placeholder="Chave Pix"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text/50 uppercase font-bold mb-1 block">Taxa de Ativação (R$)</label>
                    <input 
                      type="number" 
                      value={platformSettings.activation_fee}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, activation_fee: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl p-3 text-sm"
                      placeholder="Valor em R$"
                    />
                  </div>
                  <button 
                    onClick={handleUpdateSettings}
                    disabled={isSavingSettings}
                    className="w-full bg-primary text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSavingSettings ? 'Salvando...' : 'Salvar Configurações'}
                  </button>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Gerenciar Usuários</h3>
                  <div className="flex gap-2">
                    <div className="relative w-48">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={14} />
                      <input 
                        type="text" 
                        placeholder="Buscar usuário..." 
                        value={adminUserSearch}
                        onChange={(e) => setAdminUserSearch(e.target.value)}
                        className="w-full bg-card border border-border rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <button 
                      onClick={() => setShowAddUserModal(true)}
                      className="bg-primary text-white p-2 rounded-xl flex items-center justify-center"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {allUsers.filter(u => u.name.toLowerCase().includes(adminUserSearch.toLowerCase()) || u.whatsapp.includes(adminUserSearch)).map(u => (
                    <div key={u.id} className="bg-card p-4 rounded-2xl border border-border">
                      {editingUser?.id === u.id ? (
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            value={editingUser.name}
                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm"
                            placeholder="Nome"
                          />
                          <PhoneInput
                            international
                            defaultCountry="BR"
                            value={editingUser.whatsapp?.startsWith('+') ? editingUser.whatsapp : ''}
                            onChange={(value) => setEditingUser({ ...editingUser, whatsapp: value || '' })}
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm focus-within:ring-1 focus-within:ring-primary transition-all phone-input-custom"
                            placeholder="WhatsApp"
                          />
                          <input 
                            type="text" 
                            value={editingUser.pix_key || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, pix_key: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm"
                            placeholder="Chave Pix"
                          />
                          <select
                            value={editingUser.role || 'user'}
                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'admin' | 'user' })}
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="user">Usuário Comum</option>
                            <option value="admin">Administrador</option>
                          </select>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingUser(null)} className="flex-1 bg-text/5 py-2 rounded-lg text-xs font-bold">Cancelar</button>
                            <button onClick={handleUpdateUserAdmin} className="flex-1 bg-primary py-2 rounded-lg text-xs font-bold text-white">Salvar</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold">{u.name}</p>
                              {u.role === 'admin' && (
                                <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Admin</span>
                              )}
                            </div>
                            <p className="text-xs text-text/50">{u.whatsapp}</p>
                            <p className="text-[10px] text-text/40 mt-1">Pix: {u.pix_key || 'N/A'}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setEditingUser(u)}
                              className="p-1 text-primary hover:bg-primary/10 rounded"
                            >
                              <UserIcon size={14} />
                            </button>
                            <button 
                              onClick={() => handleToggleSeller(u.id, u.is_seller)}
                              className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.is_seller ? 'bg-primary/20 text-primary' : 'bg-text/5 text-text/50'}`}
                            >
                              {u.is_seller ? 'Vendedor' : 'Comum'}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1 text-danger hover:bg-danger/10 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add User Modal */}
                <AnimatePresence>
                  {showAddUserModal && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-6"
                    >
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-card w-full max-w-sm rounded-3xl p-8 border border-border"
                      >
                        <h3 className="text-xl font-bold mb-6">Adicionar Usuário</h3>
                        
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="text-xs text-text/50 uppercase font-bold mb-1 block">Nome</label>
                            <input 
                              type="text" 
                              value={newUser.name}
                              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                              className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Nome completo"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-text/50 uppercase font-bold mb-1 block">WhatsApp</label>
                            <PhoneInput
                              international
                              defaultCountry="BR"
                              value={newUser.whatsapp?.startsWith('+') ? newUser.whatsapp : ''}
                              onChange={(value) => setNewUser({ ...newUser, whatsapp: value || '' })}
                              className="w-full bg-background border border-border rounded-xl p-3 text-sm focus-within:ring-1 focus-within:ring-primary transition-all phone-input-custom"
                              placeholder="(00) 00000-0000"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-text/50 uppercase font-bold mb-1 block">Chave Pix (Opcional)</label>
                            <input 
                              type="text" 
                              value={newUser.pix_key || ''}
                              onChange={(e) => setNewUser({ ...newUser, pix_key: e.target.value })}
                              className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Chave Pix"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-text/50 uppercase font-bold mb-1 block">Tipo de Usuário</label>
                            <select
                              value={newUser.role || 'user'}
                              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' })}
                              className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              <option value="user">Usuário Comum</option>
                              <option value="admin">Administrador</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <input 
                              type="checkbox" 
                              id="is_seller"
                              checked={newUser.is_seller || false}
                              onChange={(e) => setNewUser({ ...newUser, is_seller: e.target.checked })}
                              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                            />
                            <label htmlFor="is_seller" className="text-sm">É vendedor?</label>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={() => {
                              setShowAddUserModal(false);
                              setNewUser({ name: '', whatsapp: '', pix_key: '', is_seller: false, role: 'user' });
                            }}
                            className="flex-1 bg-text/5 py-3 rounded-xl font-bold"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={handleAddUserAdmin}
                            className="flex-1 bg-primary text-white py-3 rounded-xl font-bold"
                          >
                            Adicionar
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Plus size={18} className="text-primary"/> Gerenciar Cupons
                  </h3>
                  <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={14} />
                    <input 
                      type="text" 
                      placeholder="Buscar cupom..." 
                      value={adminCouponSearch}
                      onChange={(e) => setAdminCouponSearch(e.target.value)}
                      className="w-full bg-card border border-border rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="bg-card p-4 rounded-2xl border border-border space-y-4 mb-4">
                  <input 
                    type="text" 
                    placeholder="Código" 
                    value={couponCode}
                    onChange={(e) => {
                      console.log('Coupon code changed:', e.target.value);
                      setCouponCode(e.target.value);
                    }}
                    className="w-full bg-background border border-border rounded-xl p-3" 
                  />
                  <input 
                    type="text" 
                    placeholder="Valor (R$)" 
                    value={couponValue}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value);
                      console.log('Coupon value changed:', { raw: e.target.value, formatted });
                      setCouponValue(formatted);
                    }}
                    className="w-full bg-background border border-border rounded-xl p-3" 
                  />
                  <button 
                    onClick={() => {
                      console.log('Create coupon button clicked');
                      handleCreateCoupon();
                    }}
                    disabled={isCreatingCoupon}
                    className="w-full bg-primary text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCreatingCoupon ? (
                      <>
                        <div className="w-4 h-4 border-2 border-border border-t-white rounded-full animate-spin" />
                        Criando...
                      </>
                    ) : (
                      'Criar'
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {coupons.filter(c => c.code.toLowerCase().includes(adminCouponSearch.toLowerCase())).length === 0 ? (
                      <div className="text-center py-8 bg-card rounded-2xl border border-border text-text/50 italic text-sm">
                        Nenhum cupom encontrado.
                      </div>
                    ) : (
                      coupons.filter(c => c.code.toLowerCase().includes(adminCouponSearch.toLowerCase())).map(c => (
                        <motion.div 
                          key={c.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-card p-4 rounded-2xl border border-border flex items-center justify-between overflow-hidden"
                        >
                          <div>
                            <p className="font-bold text-sm">{c.code}</p>
                            <p className="text-primary text-xs">Desconto: {formatCurrency(c.value)}</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteCoupon(c.id)}
                            className="p-2 text-danger hover:bg-danger/10 rounded-full transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Gerenciar Produtos</h3>
                  <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={14} />
                    <input 
                      type="text" 
                      placeholder="Buscar produto..." 
                      value={adminProductSearch}
                      onChange={(e) => setAdminProductSearch(e.target.value)}
                      className="w-full bg-card border border-border rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  {products.filter(p => p.name.toLowerCase().includes(adminProductSearch.toLowerCase())).map(p => (
                    <div key={p.id} className="bg-card p-4 rounded-2xl border border-border">
                      {editingProduct?.id === p.id ? (
                        <div className="space-y-3">
                          <label className="w-full h-32 bg-background border border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden block">
                            {editingProduct.image_url ? (
                              <Image src={editingProduct.image_url} alt="Preview" fill className="object-cover" />
                            ) : (
                              <span className="text-xs text-text/50">Alterar Imagem</span>
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const img = new window.Image();
                                  img.onload = () => {
                                    const canvas = document.createElement('canvas');
                                    const MAX_WIDTH = 800;
                                    const MAX_HEIGHT = 800;
                                    let width = img.width;
                                    let height = img.height;

                                    if (width > height) {
                                      if (width > MAX_WIDTH) {
                                        height *= MAX_WIDTH / width;
                                        width = MAX_WIDTH;
                                      }
                                    } else {
                                      if (height > MAX_HEIGHT) {
                                        width *= MAX_HEIGHT / height;
                                        height = MAX_HEIGHT;
                                      }
                                    }

                                    canvas.width = width;
                                    canvas.height = height;
                                    const ctx = canvas.getContext('2d');
                                    ctx?.drawImage(img, 0, 0, width, height);
                                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                                    setEditingProduct({ ...editingProduct, image_url: dataUrl });
                                  };
                                  img.src = event.target?.result as string;
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          <input 
                            type="text" 
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm"
                            placeholder="Nome do Produto"
                          />
                          <input 
                            type="text" 
                            value={formatCurrency(editingProduct.price)}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value as any })}
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm"
                            placeholder="Preço"
                          />
                          <select 
                            value={editingProduct.category || 'Outros'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm text-text"
                          >
                            {categories.filter(c => c.name !== 'Todos').map(cat => (
                              <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                          <textarea 
                            value={editingProduct.description}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm"
                            placeholder="Descrição"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => setEditingProduct(null)} className="flex-1 bg-text/5 py-2 rounded-lg text-xs font-bold">Cancelar</button>
                            <button onClick={handleUpdateProductAdmin} className="flex-1 bg-primary py-2 rounded-lg text-xs font-bold text-white">Salvar</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                              <Image 
                                src={p.image_url} 
                                alt={p.name}
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{p.name}</p>
                              <p className="text-primary text-xs">R$ {p.price}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={async () => {
                                try {
                                  const { error } = await supabase
                                    .from('users')
                                    .update({ is_verified: !p.seller_is_verified })
                                    .eq('id', p.seller_id);
                                  
                                  if (error) throw error;
                                  showToast(`Vendedor ${!p.seller_is_verified ? 'verificado' : 'desverificado'} com sucesso!`, 'success');
                                  fetchProducts(); // Refresh
                                } catch (err) {
                                  console.error('Error verifying seller:', err);
                                  showToast('Erro ao atualizar status do vendedor.', 'error');
                                }
                              }}
                              className={`p-2 rounded-full transition-all ${p.seller_is_verified ? 'text-primary bg-primary/10' : 'text-text/50 hover:bg-text/10'}`}
                              title={p.seller_is_verified ? "Vendedor Verificado" : "Verificar Vendedor"}
                            >
                              <ShieldCheck size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedProduct(p);
                                setNewProductName(p.name);
                                setNewProductPrice(formatCurrency(p.price));
                                setNewProductDesc(p.description);
                                setNewProductCategory(p.category || 'Outros');
                                setNewProductImage(p.image_url);
                                setScreen('edit');
                              }}
                              className="p-2 text-primary hover:bg-primary/10 rounded-full transition-all"
                              title="Painel de Edição"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => setEditingProduct(p)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-full transition-all"
                              title="Edição Rápida"
                            >
                              <ImageIcon size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-2 text-danger hover:bg-danger/10 rounded-full transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Gerenciar Avaliações</h3>
                  <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={14} />
                    <input 
                      type="text" 
                      placeholder="Buscar avaliação..." 
                      value={adminReviewSearch}
                      onChange={(e) => setAdminReviewSearch(e.target.value)}
                      className="w-full bg-card border border-border rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  {allReviews.filter(r => 
                    r.buyer?.name.toLowerCase().includes(adminReviewSearch.toLowerCase()) ||
                    r.products?.name.toLowerCase().includes(adminReviewSearch.toLowerCase()) ||
                    r.comment?.toLowerCase().includes(adminReviewSearch.toLowerCase())
                  ).length === 0 ? (
                    <div className="text-center py-8 bg-card rounded-2xl border border-border text-text/50 italic text-sm">
                      Nenhuma avaliação encontrada.
                    </div>
                  ) : (
                    allReviews.filter(r => 
                      r.buyer?.name.toLowerCase().includes(adminReviewSearch.toLowerCase()) ||
                      r.products?.name.toLowerCase().includes(adminReviewSearch.toLowerCase()) ||
                      r.comment?.toLowerCase().includes(adminReviewSearch.toLowerCase())
                    ).map(review => (
                      <div key={review.id} className="bg-card p-4 rounded-2xl border border-border">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-sm">{review.buyer?.name || 'Usuário'}</p>
                            <p className="text-[10px] text-primary uppercase font-bold tracking-wider">{review.products?.name || 'Produto Removido'}</p>
                          </div>
                          <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} size={10} fill={star <= review.rating ? "currentColor" : "none"} className={star <= review.rating ? "" : "text-text/40"} />
                            ))}
                          </div>
                        </div>
                        {review.comment && <p className="text-text/60 text-xs mt-1">{review.comment}</p>}
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-[10px] text-text/40">{new Date(review.created_at).toLocaleDateString('pt-BR')}</p>
                          <button 
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-1 text-danger hover:bg-danger/10 rounded transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Monitorar Chats</h3>
                  <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={14} />
                    <input 
                      type="text" 
                      placeholder="Buscar chat..." 
                      value={adminChatSearch}
                      onChange={(e) => setAdminChatSearch(e.target.value)}
                      className="w-full bg-card border border-border rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  {adminChats.filter(c => 
                    c.products?.name.toLowerCase().includes(adminChatSearch.toLowerCase()) ||
                    c.buyer?.name.toLowerCase().includes(adminChatSearch.toLowerCase()) ||
                    c.seller?.name.toLowerCase().includes(adminChatSearch.toLowerCase())
                  ).length === 0 ? (
                    <div className="text-center py-8 bg-card rounded-2xl border border-border text-text/50 italic text-sm">
                      Nenhum chat encontrado.
                    </div>
                  ) : (
                    adminChats.filter(c => 
                      c.products?.name.toLowerCase().includes(adminChatSearch.toLowerCase()) ||
                      c.buyer?.name.toLowerCase().includes(adminChatSearch.toLowerCase()) ||
                      c.seller?.name.toLowerCase().includes(adminChatSearch.toLowerCase())
                    ).map(chat => (
                      <div key={chat.id} className="bg-card p-4 rounded-2xl border border-border">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-bold text-primary uppercase tracking-wider">
                            {chat.products?.name || 'Produto Removido'}
                          </p>
                          <p className="text-[10px] text-text/50">
                            {new Date(chat.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <p className="text-text/80"><span className="text-text/50">Comprador:</span> {chat.buyer?.name}</p>
                            <p className="text-text/80"><span className="text-text/50">Vendedor:</span> {chat.seller?.name}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={async () => {
                                setIsLoadingAdminMessages(true);
                                setShowAdminChatModal(true);
                                try {
                                  const { data: msgs } = await supabase
                                    .from('messages')
                                    .select('*')
                                    .eq('chat_id', chat.id)
                                    .order('created_at', { ascending: true });
                                  if (msgs) {
                                    setSelectedAdminChatMessages(msgs);
                                  }
                                } catch (err) {
                                  console.error('Error fetching admin messages:', err);
                                } finally {
                                  setIsLoadingAdminMessages(false);
                                }
                              }}
                              className="p-2 bg-text/5 rounded-xl text-primary hover:bg-text/10 transition-all"
                            >
                              <MessageSquare size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteChat(chat.id)}
                              className="p-2 bg-text/5 rounded-xl text-danger hover:bg-danger/10 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Gerenciar Denúncias</h3>
                  <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={14} />
                    <input 
                      type="text" 
                      placeholder="Buscar denúncia..." 
                      value={adminReportSearch}
                      onChange={(e) => setAdminReportSearch(e.target.value)}
                      className="w-full bg-card border border-border rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  {allReports.filter(r => 
                    r.reason.toLowerCase().includes(adminReportSearch.toLowerCase()) ||
                    r.reporter?.name.toLowerCase().includes(adminReportSearch.toLowerCase()) ||
                    r.reported_user?.name?.toLowerCase().includes(adminReportSearch.toLowerCase()) ||
                    r.reported_product?.name?.toLowerCase().includes(adminReportSearch.toLowerCase())
                  ).length === 0 ? (
                    <div className="text-center py-8 bg-card rounded-2xl border border-border text-text/50 italic text-sm">
                      Nenhuma denúncia encontrada.
                    </div>
                  ) : (
                    allReports.filter(r => 
                      r.reason.toLowerCase().includes(adminReportSearch.toLowerCase()) ||
                      r.reporter?.name.toLowerCase().includes(adminReportSearch.toLowerCase()) ||
                      r.reported_user?.name?.toLowerCase().includes(adminReportSearch.toLowerCase()) ||
                      r.reported_product?.name?.toLowerCase().includes(adminReportSearch.toLowerCase())
                    ).map(report => (
                      <div key={report.id} className="bg-card p-4 rounded-2xl border border-border">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-sm text-danger">{report.reason}</p>
                            <p className="text-[10px] text-text/50 uppercase font-black tracking-widest">
                              Por: {report.reporter?.name || 'Usuário'}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                            report.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                            report.status === 'resolved' ? 'bg-success/10 text-success' :
                            'bg-danger/10 text-danger'
                          }`}>
                            {report.status}
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-background rounded-xl border border-border">
                          <p className="text-xs text-text/60"><span className="text-text/40">Alvo:</span> {report.reported_user?.name || report.reported_product?.name || 'N/A'}</p>
                          {report.details && <p className="text-xs text-text/80 mt-2 italic">&quot;{report.details}&quot;</p>}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <p className="text-[10px] text-text/40">{new Date(report.created_at).toLocaleDateString('pt-BR')}</p>
                          <div className="flex gap-2">
                            {report.reported_user_id && (
                              <button 
                                onClick={async () => {
                                  try {
                                    const { error } = await supabase
                                      .from('users')
                                      .update({ is_banned: true })
                                      .eq('id', report.reported_user_id);
                                    if (error) throw error;
                                    
                                    await supabase
                                      .from('reports')
                                      .update({ status: 'resolved' })
                                      .eq('id', report.id);
                                      
                                    showToast('Usuário banido com sucesso!', 'success');
                                    fetchAllReports();
                                  } catch (err) {
                                    console.error('Error banning user:', err);
                                    showToast('Erro ao banir usuário.', 'error');
                                  }
                                }}
                                className="px-3 py-1 bg-danger text-white text-[10px] font-bold rounded-lg hover:bg-danger/90 transition-all"
                              >
                                Banir Usuário
                              </button>
                            )}
                            {report.reported_product_id && (
                              <button 
                                onClick={async () => {
                                  try {
                                    const { error } = await supabase
                                      .from('products')
                                      .update({ is_banned: true })
                                      .eq('id', report.reported_product_id);
                                    if (error) throw error;
                                    
                                    await supabase
                                      .from('reports')
                                      .update({ status: 'resolved' })
                                      .eq('id', report.id);
                                      
                                    showToast('Produto removido com sucesso!', 'success');
                                    fetchAllReports();
                                    fetchProducts();
                                  } catch (err) {
                                    console.error('Error banning product:', err);
                                    showToast('Erro ao remover produto.', 'error');
                                  }
                                }}
                                className="px-3 py-1 bg-danger text-white text-[10px] font-bold rounded-lg hover:bg-danger/90 transition-all"
                              >
                                Banir Produto
                              </button>
                            )}
                            <button 
                              onClick={async () => {
                                try {
                                  await supabase
                                    .from('reports')
                                    .update({ status: 'resolved' })
                                    .eq('id', report.id);
                                  showToast('Denúncia marcada como resolvida.', 'success');
                                  fetchAllReports();
                                } catch (err) {
                                  console.error('Error resolving report:', err);
                                }
                              }}
                              className="px-3 py-1 bg-text/5 text-text/60 text-[10px] font-bold rounded-lg hover:bg-text/10 transition-all"
                            >
                              Resolver
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              toast.type === 'success' ? 'bg-success/10 border-success/20 text-success' :
              toast.type === 'error' ? 'bg-danger/10 border-danger/20 text-danger' :
              'bg-primary/10 border-primary/20 text-primary'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={20} /> : toast.type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ReportModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReport}
        type={reportingType}
        reason={reportReason}
        setReason={setReportReason}
        details={reportDetails}
        setDetails={setReportDetails}
        isSubmitting={isSubmittingReport}
      />

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#121212] border border-border p-8 rounded-[32px] max-w-sm w-full shadow-2xl"
            >
              <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center text-danger mb-6 mx-auto">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Confirmar Exclusão</h3>
              <p className="text-text/60 text-center mb-8">{confirmModal.message}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 py-4 rounded-2xl bg-text/5 font-bold hover:bg-text/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal(null);
                  }}
                  className="flex-1 py-4 rounded-2xl bg-danger text-white font-bold hover:bg-danger/90 transition-all shadow-lg shadow-danger/20"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
