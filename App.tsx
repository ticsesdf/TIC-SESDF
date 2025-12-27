import React, { useState } from 'react';
import { 
  ShieldCheck, User, Monitor, Activity, 
  AlertTriangle, CheckCircle, ChevronRight, ChevronLeft, Save, 
  Wifi, BarChart3, LayoutGrid, FileText, Mail, Send
} from 'lucide-react';
import { Step, SurveyState, ProfileData } from './types';
import { 
  SISTEMAS_SES, 
  FERRAMENTAS_PROD, 
  BARREIRAS_LIST, 
  REGIOES_SAUDE, 
  SEXO_OPCOES,
  FORMACOES,
  CARGOS_EFETIVOS,
  CARGOS_GSAP,
  UBS_VINCULADAS,
  INTERNET_OPCOES,
  PC_OPCOES,
  PC_SUFICIENCIA_OPCOES
} from './constants';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [state, setState] = useState<SurveyState>({
    step: Step.TCLE,
    tcle: false,
    profile: {
      idade: '', sexo: '', formacao: '', cargoEfetivo: '',
      dataAdmissao: '', cargoGsap: '', tempoGestaoGsap: '',
      regiaoGsap: '', quantidadeUbs: '', internetAcesso: '',
      computadoresQtd: '', computadoresSuficiencia: ''
    },
    selectedSystems: [],
    evaluations: {},
    produtividade: {},
    barreiras: {},
    sugestoes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const next = () => { window.scrollTo(0,0); setState(s => ({ ...s, step: s.step + 1 })); };
  const back = () => { window.scrollTo(0,0); setState(s => ({ ...s, step: s.step - 1 })); };

  const updateProfile = (field: keyof ProfileData, value: string) => {
    setState(s => ({ ...s, profile: { ...s.profile, [field]: value } }));
  };

  const toggleSystem = (sys: string) => {
    setState(s => {
      const selected = s.selectedSystems.includes(sys)
        ? s.selectedSystems.filter(x => x !== sys)
        : [...s.selectedSystems, sys];
      return { ...s, selectedSystems: selected };
    });
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('surveys').insert([{
        ...state.profile,
        selected_systems: state.selectedSystems,
        evaluations: state.evaluations,
        produtividade: state.produtividade,
        barreiras: state.barreiras,
        sugestoes: state.sugestoes
      }]);

      if (error) throw error;
      next();
    } catch (err) {
      console.error("Erro ao finalizar:", err);
      alert("Houve um erro ao salvar seus dados. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setEmailSent(true);
      // Aqui integraria com um serviço de email se necessário
    }
  };

  const isProfileValid = () => {
    const p = state.profile;
    return p.idade && p.sexo && p.formacao && p.cargoEfetivo && p.dataAdmissao && 
           p.cargoGsap && p.tempoGestaoGsap && p.regiaoGsap && p.quantidadeUbs && 
           p.internetAcesso && p.computadoresQtd && p.computadoresSuficiencia;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-xl md:text-2xl font-black tracking-tight leading-tight mb-4">
              Gestão da Informação na Atenção Primária à Saúde: Uso de Sistemas e Ferramentas Digitais
            </h1>
            <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest opacity-80">
              Fundação de Ensino e Pesquisa em Ciências da Saúde (FEPECS) • SES-DF
            </p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/20">
            <div 
              className="h-full bg-yellow-400 transition-all duration-700 ease-out" 
              style={{ width: `${(state.step / 7) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-8 md:p-14">
          
          {state.step === Step.TCLE && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-4 text-blue-600">
                <ShieldCheck size={32} strokeWidth={2.5} />
                <h2 className="text-2xl font-black">Consentimento (TCLE)</h2>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-slate-600 leading-relaxed text-sm space-y-4 shadow-inner custom-scrollbar overflow-y-auto max-h-[300px]">
                <p>Você está sendo convidado a participar de um diagnóstico sobre o ecossistema tecnológico da SES-DF.</p>
                <p><strong>Privacidade:</strong> Suas respostas são anônimas e serão tratadas de forma agregada para fins acadêmicos e de gestão.</p>
              </div>
              <label className="flex items-center gap-4 p-6 bg-blue-50/50 rounded-2xl cursor-pointer border-2 border-transparent hover:border-blue-200 transition-all group">
                <input type="checkbox" checked={state.tcle} onChange={e => setState({...state, tcle: e.target.checked})} className="w-6 h-6 accent-blue-600 rounded" />
                <span className="text-sm font-bold text-blue-900">Li e concordo em participar da pesquisa.</span>
              </label>
              <button onClick={next} disabled={!state.tcle} className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-bold text-lg shadow-xl hover:bg-blue-700 disabled:bg-slate-200 transition-all flex justify-center items-center gap-3">
                Começar agora <ChevronRight size={22} />
              </button>
            </div>
          )}

          {state.step === Step.PROFILE && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex items-center gap-4 text-blue-600">
                <User size={32} strokeWidth={2.5} />
                <h2 className="text-2xl font-black">Bloco 1: Perfil</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs de perfil omitidos aqui para brevidade, mas mantidos na lógica real do arquivo */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Idade*</label>
                  <input type="number" className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={state.profile.idade} onChange={e => updateProfile('idade', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Sexo*</label>
                  <select className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={state.profile.sexo} onChange={e => updateProfile('sexo', e.target.value)}>
                    <option value="">Selecione...</option>
                    {SEXO_OPCOES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Formação*</label>
                  <select className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={state.profile.formacao} onChange={e => updateProfile('formacao', e.target.value)}>
                    <option value="">Selecione...</option>
                    {FORMACOES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Cargo Efetivo*</label>
                  <select className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={state.profile.cargoEfetivo} onChange={e => updateProfile('cargoEfetivo', e.target.value)}>
                    <option value="">Selecione...</option>
                    {CARGOS_EFETIVOS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Cargo na GSAP*</label>
                  <select className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={state.profile.cargoGsap} onChange={e => updateProfile('cargoGsap', e.target.value)}>
                    <option value="">Selecione...</option>
                    {CARGOS_GSAP.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Região*</label>
                  <select className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={state.profile.regiaoGsap} onChange={e => updateProfile('regiaoGsap', e.target.value)}>
                    <option value="">Selecione...</option>
                    {REGIOES_SAUDE.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                {/* Adicionando campos faltantes para validação */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Data Admissão*</label>
                  <input type="date" className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={state.profile.dataAdmissao} onChange={e => updateProfile('dataAdmissao', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Tempo na GSAP*</label>
                  <input type="text" className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={state.profile.tempoGestaoGsap} onChange={e => updateProfile('tempoGestaoGsap', e.target.value)} />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black uppercase text-slate-400">UBS Vinculadas*</label>
                   <select className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={state.profile.quantidadeUbs} onChange={e => updateProfile('quantidadeUbs', e.target.value)}>
                    <option value="">Selecione...</option>
                    {UBS_VINCULADAS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-6 bg-blue-50/50 rounded-2xl space-y-6">
                <h4 className="font-bold text-blue-900 flex items-center gap-2"><Wifi size={18}/> Infraestrutura</h4>
                <div className="space-y-4">
                  <label className="text-sm font-bold">Acesso à internet?*</label>
                  <select className="w-full p-4 bg-white rounded-xl ring-1 ring-slate-200 outline-none" value={state.profile.internetAcesso} onChange={e => updateProfile('internetAcesso', e.target.value)}>
                    <option value="">Selecione...</option>
                    {INTERNET_OPCOES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-xs font-bold">Qtd Computadores?*</label>
                    <select className="w-full p-4 bg-white rounded-xl ring-1 ring-slate-200 outline-none" value={state.profile.computadoresQtd} onChange={e => updateProfile('computadoresQtd', e.target.value)}>
                      <option value="">Selecione...</option>
                      {PC_OPCOES.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold">É suficiente?*</label>
                    <select className="w-full p-4 bg-white rounded-xl ring-1 ring-slate-200 outline-none" value={state.profile.computadoresSuficiencia} onChange={e => updateProfile('computadoresSuficiencia', e.target.value)}>
                      <option value="">Selecione...</option>
                      {PC_SUFICIENCIA_OPCOES.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={back} className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 flex justify-center items-center gap-2">Voltar</button>
                <button onClick={next} disabled={!isProfileValid()} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-200">Prosseguir</button>
              </div>
            </div>
          )}

          {state.step === Step.SYSTEMS && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-4 text-blue-600">
                <Monitor size={32} strokeWidth={2.5} />
                <h2 className="text-2xl font-black">Bloco II: Inventário</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-2">
                {SISTEMAS_SES.map(sys => (
                  <button key={sys} onClick={() => toggleSystem(sys)} className={`p-4 text-[10px] font-black rounded-xl border-2 text-left transition-all flex items-center justify-between ${state.selectedSystems.includes(sys) ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500'}`}>
                    <span>{sys}</span>
                    {state.selectedSystems.includes(sys) && <CheckCircle size={14} />}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={back} className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold">Voltar</button>
                <button onClick={next} disabled={state.selectedSystems.length === 0} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold">Continuar ({state.selectedSystems.length})</button>
              </div>
            </div>
          )}

          {state.step === Step.EVALUATION && (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-4 text-blue-600">
                <Activity size={32} strokeWidth={2.5} />
                <h2 className="text-2xl font-black">Avaliação</h2>
              </div>
              <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                {state.selectedSystems.map(sys => (
                  <div key={sys} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                    <h3 className="text-sm font-black text-blue-700 uppercase">{sys}</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Frequência de Uso:</p>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(v => (
                            <button key={v} onClick={() => setState(s => ({ ...s, evaluations: { ...s.evaluations, [sys]: { ...(s.evaluations[sys] || { confianca: 3 }), freq: v } } }))} className={`flex-1 py-2 rounded-lg font-bold border-2 ${state.evaluations[sys]?.freq === v ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-300'}`}>{v}</button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Confiança nos Dados:</p>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(v => (
                            <button key={v} onClick={() => setState(s => ({ ...s, evaluations: { ...s.evaluations, [sys]: { ...(s.evaluations[sys] || { freq: 3 }), confianca: v } } }))} className={`flex-1 py-2 rounded-lg font-bold border-2 ${state.evaluations[sys]?.confianca === v ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-300'}`}>{v}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={back} className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold">Voltar</button>
                <button onClick={next} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold">Próximo</button>
              </div>
            </div>
          )}

          {state.step === Step.PROD_INDICATORS && (
            <div className="space-y-10 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-4 text-blue-600">
                <BarChart3 size={32} strokeWidth={2.5} />
                <h2 className="text-2xl font-black">Ferramentas de Apoio</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FERRAMENTAS_PROD.map(tool => (
                  <div key={tool} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-blue-900">{tool}</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(v => (
                        <button key={v} onClick={() => setState(s => ({ ...s, produtividade: { ...s.produtividade, [tool]: v } }))} className={`w-8 h-8 text-[10px] font-bold rounded-lg border ${state.produtividade[tool] === v ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>{v}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={back} className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold">Voltar</button>
                <button onClick={next} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold">Próximo</button>
              </div>
            </div>
          )}

          {state.step === Step.BARRIERS && (
            <div className="space-y-10 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-4 text-rose-600">
                <AlertTriangle size={32} strokeWidth={2.5} />
                <h2 className="text-2xl font-black">Dificuldades</h2>
              </div>
              <div className="space-y-4">
                {BARREIRAS_LIST.map(barreira => (
                  <div key={barreira} className="p-5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-xs font-bold text-slate-700">{barreira}</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(v => (
                        <button key={v} onClick={() => setState(s => ({ ...s, barreiras: { ...s.barreiras, [barreira]: v } }))} className={`w-10 py-2 rounded-lg font-bold border-2 ${state.barreiras[barreira] === v ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-slate-100 text-slate-300'}`}>{v}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={back} className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold">Voltar</button>
                <button onClick={next} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold">Finalizar</button>
              </div>
            </div>
          )}

          {state.step === Step.SUMMARY && (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500 text-center">
              <div className="flex justify-center text-indigo-600"><FileText size={48} /></div>
              <h2 className="text-2xl font-black">Tudo pronto!</h2>
              <p className="text-slate-600 max-w-md mx-auto">Suas respostas serão submetidas agora para o banco de dados da SES-DF.</p>
              <div className="flex gap-4">
                <button onClick={back} className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold">Ajustar</button>
                <button onClick={handleFinish} disabled={isSubmitting} className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg flex justify-center items-center gap-3 disabled:bg-slate-300">
                  {isSubmitting ? 'Enviando...' : 'Confirmar e Enviar'} <Save size={20} />
                </button>
              </div>
            </div>
          )}

          {state.step === Step.SUCCESS && (
            <div className="text-center space-y-10 animate-in zoom-in duration-700 py-6">
              <div className="flex justify-center"><CheckCircle size={80} className="text-green-500" /></div>
              <div>
                <h2 className="text-3xl font-black text-slate-800">Respostas Enviadas!</h2>
                <p className="text-slate-500 mt-2">Obrigado por contribuir com a gestão da saúde do DF.</p>
              </div>

              {!emailSent ? (
                <div className="max-w-md mx-auto bg-blue-50 p-8 rounded-[2rem] border border-blue-100 space-y-6">
                  <div className="flex justify-center text-blue-600"><Mail size={32} /></div>
                  <h3 className="font-bold text-blue-900 leading-tight">Gostaria que o resumo das suas respostas fosse encaminhado por e-mail?</h3>
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <input 
                      type="email" 
                      required
                      placeholder="seu@email.com"
                      className="w-full p-4 rounded-xl border-none ring-2 ring-blue-200 focus:ring-blue-500 outline-none"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                    <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                      Solicitar Resumo <Send size={18} />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="max-w-md mx-auto bg-green-50 p-6 rounded-2xl border border-green-100 text-green-800 font-bold flex items-center gap-3 justify-center">
                  <CheckCircle size={20} /> Solicitação recebida!
                </div>
              )}

              <button onClick={() => window.location.reload()} className="text-slate-400 font-bold hover:text-slate-600 transition-colors"> Sair do sistema </button>
            </div>
          )}

        </div>

        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SES-DF | Diagnóstico Digital 2025</p>
        </div>
      </div>
    </div>
  );
};

export default App;