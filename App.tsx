import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, User, Monitor, Activity, 
  AlertTriangle, CheckCircle, ChevronRight, ChevronLeft, Save, 
  Wifi, BarChart3, FileText, Mail, Send, MessageSquare, Info,
  LayoutGrid, Users, Building2, ExternalLink
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.step]);

  const next = () => setState(s => ({ ...s, step: s.step + 1 }));
  const back = () => setState(s => ({ ...s, step: s.step - 1 }));

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
        sugestoes: state.sugestoes,
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;
      next();
    } catch (err) {
      console.error("Erro ao finalizar:", err);
      alert("Erro ao salvar os dados. Verifique sua conexão e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProfileValid = () => {
    const p = state.profile;
    return p.idade && p.sexo && p.formacao && p.cargoEfetivo && p.dataAdmissao && 
           p.cargoGsap && p.tempoGestaoGsap && p.regiaoGsap && p.quantidadeUbs && 
           p.internetAcesso && p.computadoresQtd && p.computadoresSuficiencia;
  };

  const progress = (state.step / 7) * 100;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center p-4 md:p-10 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="w-full max-w-5xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[3rem] overflow-hidden border border-slate-100 relative">
        
        {/* Decorative background blur */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px] -z-10"></div>

        {/* Progress Tracker */}
        <div className="h-2 w-full bg-slate-50 relative">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-1000 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Header Section */}
        <header className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-10 md:p-16 text-white relative">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">Pesquisa Acadêmica SES-DF 2025</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-[1.15] mb-6">
              Gestão da Informação na Atenção Primária à Saúde: <span className="text-indigo-300">Uso de Sistemas e Ferramentas Digitais</span>
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6 text-sm text-indigo-100/70 border-t border-white/10 pt-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Users size={20} className="text-indigo-300" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Pesquisadores Responsáveis</p>
                  <p className="font-bold text-xs">Letícia Dinegri, Marco A. F. Almeida, Matheus H. de Sousa, Yonara C. Ferreira</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Building2 size={20} className="text-indigo-300" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Instituição</p>
                  <p className="font-bold text-xs italic">FEPECS - Fundação de Ensino e Pesquisa em Ciências da Saúde</p>
                </div>
              </div>
            </div>
          </div>
          
          <Activity size={180} className="absolute right-0 bottom-0 text-white/5 -mb-10 -mr-10 rotate-12 pointer-events-none" />
        </header>

        <main className="p-8 md:p-20">
          
          {/* STEP 0: TCLE */}
          {state.step === Step.TCLE && (
            <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Termo de Consentimento Livre e Esclarecido</h2>
                  <p className="text-slate-400 text-sm font-medium">Por favor, leia atentamente as informações abaixo antes de prosseguir.</p>
                </div>
              </div>

              <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 text-slate-700 leading-relaxed text-sm space-y-6 shadow-inner custom-scrollbar overflow-y-auto max-h-[450px]">
                <p className="font-bold text-indigo-900 text-base">Prezado(a) Gestor(a),</p>
                <p>Você está sendo convidado(a) a participar da pesquisa intitulada <strong>"Gestão da Informação na Atenção Primária à Saúde: Uso de Sistemas e Ferramentas Digitais pelos Gestores do Distrito Federal"</strong>. </p>
                
                <div className="space-y-4">
                  <p><strong>Objetivo:</strong> Identificar e diagnosticar o ecossistema de sistemas de informação e ferramentas digitais utilizados no cotidiano da gestão das Unidades Básicas de Saúde (UBS) do DF.</p>
                  <p><strong>Procedimentos:</strong> Sua participação consiste em responder a este questionário digital estruturado em blocos (Perfil, Inventário, Avaliação, Produtividade e Barreiras). O tempo estimado é de 10 minutos.</p>
                  <p><strong>Riscos e Benefícios:</strong> Não há riscos físicos. O principal benefício é gerar dados que possam subsidiar melhorias na integração tecnológica da SES-DF. </p>
                  <p><strong>Confidencialidade:</strong> O anonimato é garantido. Os dados serão processados de forma estatística e agregada. Não haverá identificação individual em nenhum relatório ou publicação.</p>
                  <p><strong>Voluntariedade:</strong> A participação é voluntária. Você pode desistir a qualquer momento fechando o navegador, sem qualquer prejuízo.</p>
                </div>

                <div className="pt-8 border-t border-slate-200 text-xs text-slate-500 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-black uppercase tracking-widest text-indigo-900/40 mb-1">Contato Pesquisa</p>
                    <p>FEPECS / SES-DF</p>
                    <p>Setor de Áreas Isoladas Norte (SAIN)</p>
                  </div>
                  <div className="text-right md:text-left">
                    <p className="font-black uppercase tracking-widest text-indigo-900/40 mb-1">Ano Base</p>
                    <p>Ciclo 2024 - 2025</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="flex items-center gap-5 p-8 bg-indigo-50/50 rounded-[2rem] cursor-pointer border-2 border-transparent hover:border-indigo-200 transition-all group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={state.tcle} 
                      onChange={e => setState({...state, tcle: e.target.checked})} 
                      className="peer w-8 h-8 opacity-0 absolute"
                    />
                    <div className="w-8 h-8 border-2 border-indigo-200 rounded-lg bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                      <CheckCircle size={20} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-black text-indigo-900 leading-tight">
                      Li e concordo com os termos apresentados e aceito participar voluntariamente da pesquisa.
                    </span>
                  </div>
                </label>

                <button 
                  onClick={next} 
                  disabled={!state.tcle} 
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:translate-y-[-2px] active:translate-y-[0px] disabled:bg-slate-200 disabled:shadow-none transition-all flex justify-center items-center gap-4"
                >
                  Iniciar Diagnóstico <ChevronRight size={28} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: PROFILE */}
          {state.step === Step.PROFILE && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <User size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Bloco 1: Identificação do Gestor</h2>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Informações Profissionais e Estruturais</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-2 group">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">Idade (Anos)*</label>
                    <input type="number" placeholder="Digite sua idade" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700" value={state.profile.idade} onChange={e => updateProfile('idade', e.target.value)} />
                  </div>
                  
                  <div className="space-y-2 group">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">Sexo*</label>
                    <select className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700 appearance-none" value={state.profile.sexo} onChange={e => updateProfile('sexo', e.target.value)}>
                      <option value="">Selecione uma opção</option>
                      {SEXO_OPCOES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">Formação Acadêmica*</label>
                    <select className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700 appearance-none" value={state.profile.formacao} onChange={e => updateProfile('formacao', e.target.value)}>
                      <option value="">Selecione sua maior titulação</option>
                      {FORMACOES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">Cargo Efetivo na SES-DF*</label>
                    <select className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700 appearance-none" value={state.profile.cargoEfetivo} onChange={e => updateProfile('cargoEfetivo', e.target.value)}>
                      <option value="">Qual o seu cargo concursado?</option>
                      {CARGOS_EFETIVOS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2 group">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">Data de Admissão na SES*</label>
                    <input type="date" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700" value={state.profile.dataAdmissao} onChange={e => updateProfile('dataAdmissao', e.target.value)} />
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">Cargo Atual na GSAP*</label>
                    <select className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none" value={state.profile.cargoGsap} onChange={e => updateProfile('cargoGsap', e.target.value)}>
                      <option value="">Selecione sua função de gestão</option>
                      {CARGOS_GSAP.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">Tempo de Gestão nesta GSAP*</label>
                    <input type="text" placeholder="Ex: 1 ano e 4 meses" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700" value={state.profile.tempoGestaoGsap} onChange={e => updateProfile('tempoGestaoGsap', e.target.value)} />
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">Região de Saúde*</label>
                    <select className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none" value={state.profile.regiaoGsap} onChange={e => updateProfile('regiaoGsap', e.target.value)}>
                      <option value="">Onde atua?</option>
                      {REGIOES_SAUDE.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Infrastructure Section */}
              <div className="p-10 bg-indigo-50/30 rounded-[3rem] border border-indigo-100/50 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-100">
                    <Wifi size={24} className="text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-black text-indigo-900 uppercase tracking-widest">Infraestrutura e UBS</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 block">Número de UBS sob sua gestão:*</label>
                    <select className="w-full p-5 bg-white rounded-2xl border-2 border-indigo-100 focus:border-indigo-500 outline-none shadow-sm transition-all font-bold" value={state.profile.quantidadeUbs} onChange={e => updateProfile('quantidadeUbs', e.target.value)}>
                      <option value="">Selecione o quantitativo</option>
                      {UBS_VINCULADAS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 block">Qualidade da Internet:*</label>
                    <select className="w-full p-5 bg-white rounded-2xl border-2 border-indigo-100 focus:border-indigo-500 outline-none shadow-sm transition-all font-bold" value={state.profile.internetAcesso} onChange={e => updateProfile('internetAcesso', e.target.value)}>
                      <option value="">Avalie a conexão atual</option>
                      {INTERNET_OPCOES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 block">Disponibilidade de Computadores:*</label>
                    <select className="w-full p-5 bg-white rounded-2xl border-2 border-indigo-100 focus:border-indigo-500 outline-none shadow-sm transition-all font-bold" value={state.profile.computadoresQtd} onChange={e => updateProfile('computadoresQtd', e.target.value)}>
                      <option value="">Computadores na sala de gestão</option>
                      {PC_OPCOES.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 block">A quantidade é suficiente?*</label>
                    <select className="w-full p-5 bg-white rounded-2xl border-2 border-indigo-100 focus:border-indigo-500 outline-none shadow-sm transition-all font-bold" value={state.profile.computadoresSuficiencia} onChange={e => updateProfile('computadoresSuficiencia', e.target.value)}>
                      <option value="">Selecione uma opção</option>
                      {PC_SUFICIENCIA_OPCOES.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 pt-6">
                <button onClick={back} className="flex-1 py-5 border-2 border-slate-200 rounded-[1.5rem] font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Voltar</button>
                <button 
                  onClick={next} 
                  disabled={!isProfileValid()} 
                  className="flex-[2] py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:bg-slate-200 disabled:shadow-none"
                >
                  Prosseguir para Inventário
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SYSTEMS INVENTORY */}
          {state.step === Step.SYSTEMS && (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Monitor size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Bloco 2: Inventário Tecnológico</h2>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Selecione os sistemas que compõem sua rotina</p>
                </div>
              </div>

              <div className="bg-indigo-900 text-indigo-50 p-6 rounded-2xl flex items-center gap-4 shadow-lg shadow-indigo-100">
                <Info size={24} className="shrink-0" />
                <p className="text-sm font-bold leading-snug">Clique em todos os sistemas que você utiliza direta ou indiretamente para a gestão da unidade.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar p-2">
                {SISTEMAS_SES.map(sys => (
                  <button 
                    key={sys} 
                    onClick={() => toggleSystem(sys)} 
                    className={`p-5 text-[11px] font-black rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-4 h-28 group relative ${state.selectedSystems.includes(sys) ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl ring-4 ring-indigo-50 translate-y-[-2px]' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/20'}`}
                  >
                    <span className="leading-tight uppercase tracking-tight">{sys}</span>
                    <div className="self-end">
                      {state.selectedSystems.includes(sys) ? (
                        <CheckCircle size={24} className="text-white drop-shadow-md" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-indigo-300 transition-colors"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <button onClick={back} className="flex-1 py-5 border-2 border-slate-200 rounded-[1.5rem] font-black text-slate-500 uppercase tracking-widest text-xs">Voltar</button>
                <button 
                  onClick={next} 
                  disabled={state.selectedSystems.length === 0} 
                  className="flex-[2] py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-indigo-700 disabled:bg-slate-200 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-4"
                >
                  Continuar Avaliação ({state.selectedSystems.length} Selecionados) <ChevronRight size={24} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: EVALUATION */}
          {state.step === Step.EVALUATION && (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                  <Activity size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Bloco 3: Avaliação de Uso e Confiança</h2>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Métrica Likert de 1 a 5</p>
                </div>
              </div>

              <div className="space-y-10 max-h-[700px] overflow-y-auto pr-6 custom-scrollbar">
                {state.selectedSystems.map(sys => (
                  <div key={sys} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-200 space-y-10 relative overflow-hidden transition-all hover:bg-white hover:shadow-2xl hover:border-indigo-100 group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm">
                        <LayoutGrid size={24} />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{sys}</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <p className="text-xs font-black text-indigo-900/40 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Activity size={14}/> Frequência de Uso
                        </p>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(v => (
                            <button 
                              key={v} 
                              onClick={() => setState(s => ({ ...s, evaluations: { ...s.evaluations, [sys]: { ...(s.evaluations[sys] || { confianca: 3 }), freq: v } } }))} 
                              className={`flex-1 py-4 rounded-xl font-black border-2 transition-all ${state.evaluations[sys]?.freq === v ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-300 hover:border-indigo-200 hover:text-indigo-400'}`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                          <span>Uso Raro</span>
                          <span>Uso Diário</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <p className="text-xs font-black text-indigo-900/40 uppercase tracking-[0.2em] flex items-center gap-2">
                          <ShieldCheck size={14}/> Confiança nos Dados
                        </p>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(v => (
                            <button 
                              key={v} 
                              onClick={() => setState(s => ({ ...s, evaluations: { ...s.evaluations, [sys]: { ...(s.evaluations[sys] || { freq: 3 }), confianca: v } } }))} 
                              className={`flex-1 py-4 rounded-xl font-black border-2 transition-all ${state.evaluations[sys]?.confianca === v ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-300 hover:border-blue-200 hover:text-blue-400'}`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                          <span>Baixa</span>
                          <span>Alta</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <button onClick={back} className="flex-1 py-5 border-2 border-slate-200 rounded-[1.5rem] font-black text-slate-500 uppercase tracking-widest text-xs">Voltar</button>
                <button 
                  onClick={next} 
                  className="flex-[2] py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                  Confirmar Avaliações
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PROD INDICATORS */}
          {state.step === Step.PROD_INDICATORS && (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <BarChart3 size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Bloco 4: Ferramentas de Produtividade</h2>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Apoio à Gestão e Organização</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {FERRAMENTAS_PROD.map(tool => (
                  <div key={tool} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 space-y-6 group hover:bg-white hover:shadow-xl transition-all">
                    <p className="text-sm font-black text-indigo-900 uppercase tracking-widest">{tool}</p>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(v => (
                          <button 
                            key={v} 
                            onClick={() => setState(s => ({ ...s, produtividade: { ...s.produtividade, [tool]: v } }))} 
                            className={`flex-1 py-3 text-sm font-black rounded-xl border-2 transition-all ${state.produtividade[tool] === v ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-300 hover:border-indigo-100 hover:text-indigo-400'}`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-tighter px-1">
                        <span>Não Uso</span>
                        <span>Fundamental</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <button onClick={back} className="flex-1 py-5 border-2 border-slate-200 rounded-[1.5rem] font-black text-slate-500 uppercase tracking-widest text-xs">Voltar</button>
                <button 
                  onClick={next} 
                  className="flex-[2] py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                  Próximo Passo
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: BARRIERS */}
          {state.step === Step.BARRIERS && (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
                <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                  <AlertTriangle size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Bloco 5: Barreiras e Dificuldades</h2>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">O que impede a fluidez do trabalho?</p>
                </div>
              </div>

              <div className="space-y-6">
                {BARREIRAS_LIST.map(barreira => (
                  <div key={barreira} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-rose-200 transition-all hover:bg-white">
                    <p className="text-sm font-black text-slate-700 uppercase leading-tight md:max-w-md">{barreira}</p>
                    <div className="flex flex-col gap-3 min-w-[280px]">
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(v => (
                          <button 
                            key={v} 
                            onClick={() => setState(s => ({ ...s, barreiras: { ...s.barreiras, [barreira]: v } }))} 
                            className={`flex-1 py-4 rounded-xl font-black border-2 transition-all ${state.barreiras[barreira] === v ? 'bg-rose-600 border-rose-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-300 hover:border-rose-100'}`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                        <span>Irrelevante</span>
                        <span>Crítico</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-3 text-indigo-600 ml-2">
                  <MessageSquare size={22} />
                  <h4 className="font-black text-xs uppercase tracking-[0.2em]">Sugestões ou Novos Sistemas (Opcional)</h4>
                </div>
                <textarea 
                  className="w-full p-10 bg-slate-50 rounded-[3rem] border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all min-h-[200px] font-bold text-sm text-slate-600 shadow-inner"
                  placeholder="Ex: Gostaria que o e-SUS fosse integrado ao SISREG, pois hoje fazemos retrabalho de dados..."
                  value={state.sugestoes}
                  onChange={e => setState({...state, sugestoes: e.target.value})}
                ></textarea>
              </div>

              <div className="flex flex-col md:flex-row gap-6 pt-6">
                <button onClick={back} className="flex-1 py-5 border-2 border-slate-200 rounded-[1.5rem] font-black text-slate-500 uppercase tracking-widest text-xs">Voltar</button>
                <button 
                  onClick={next} 
                  className="flex-[2] py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-4"
                >
                  Revisar Diagnóstico <ChevronRight size={24} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: SUMMARY */}
          {state.step === Step.SUMMARY && (
            <div className="space-y-12 animate-in fade-in zoom-in duration-600 text-center py-10 max-w-3xl mx-auto">
              <div className="w-28 h-28 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-100 border border-indigo-100">
                <FileText size={56} strokeWidth={2.5} />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">Diagnóstico Completo!</h2>
                <p className="text-slate-500 font-medium text-lg">Confira o resumo das suas informações antes de submeter oficialmente à SES-DF.</p>
              </div>

              <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-10 shadow-inner">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600">
                    <Monitor size={24} />
                  </div>
                  <span className="text-3xl font-black text-indigo-900">{state.selectedSystems.length}</span>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Sistemas</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600">
                    <Activity size={24} />
                  </div>
                  <span className="text-3xl font-black text-indigo-900">{Object.keys(state.evaluations).length}</span>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Avaliações</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600">
                    <AlertTriangle size={24} />
                  </div>
                  <span className="text-3xl font-black text-indigo-900">{Object.keys(state.barreiras).length}</span>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Dificuldades</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="text-3xl font-black text-indigo-900">OK</span>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Consenso</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 pt-6">
                <button onClick={back} className="flex-1 py-5 border-2 border-slate-200 rounded-[1.5rem] font-black text-slate-500 uppercase tracking-widest text-xs">Revisar Blocos</button>
                <button 
                  onClick={handleFinish} 
                  disabled={isSubmitting} 
                  className="flex-[2] py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-2xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.03] active:scale-[0.98] transition-all flex justify-center items-center gap-6 disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Submeter Respostas <Save size={32} /></>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: SUCCESS */}
          {state.step === Step.SUCCESS && (
            <div className="text-center space-y-16 animate-in zoom-in duration-800 py-16 max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-200 rounded-full blur-[60px] opacity-40 scale-150 animate-pulse"></div>
                <div className="relative w-40 h-40 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl border-4 border-white">
                  <CheckCircle size={90} strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">Envio Concluído!</h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                  As informações foram armazenadas com segurança. Sua contribuição é peça-chave para o futuro digital da Saúde Pública no Distrito Federal.
                </p>
              </div>

              {!emailSent ? (
                <div className="bg-indigo-50/50 p-12 rounded-[4rem] border border-indigo-100 space-y-10 shadow-xl shadow-indigo-50/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Mail size={80} />
                  </div>
                  <div className="flex justify-center text-indigo-600 mb-6">
                    <Mail size={48} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-black text-indigo-900 text-2xl leading-tight tracking-tight">Deseja uma cópia do resumo?</h3>
                    <p className="text-sm text-indigo-700/60 font-bold uppercase tracking-[0.2em]">Enviaremos um PDF com suas avaliações.</p>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); setEmailSent(true); }} className="space-y-5">
                    <input 
                      type="email" 
                      required
                      placeholder="seu-email@saude.df.gov.br"
                      className="w-full p-6 rounded-[1.5rem] border-2 border-indigo-100 focus:border-indigo-600 focus:ring-8 focus:ring-indigo-100 outline-none transition-all font-black text-slate-700 text-center shadow-inner placeholder:text-slate-300"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                    <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-indigo-700 hover:shadow-2xl transition-all active:scale-95">
                      Solicitar Resumo Digital <Send size={24} />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-emerald-50 p-10 rounded-[3rem] border-2 border-emerald-100 text-emerald-800 font-black flex flex-col items-center gap-5 animate-in fade-in duration-500 shadow-xl shadow-emerald-50">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle size={32} className="text-emerald-600" />
                  </div>
                  <span className="text-xl">E-mail registrado com sucesso!</span>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-60">O resumo será enviado em até 24h.</p>
                </div>
              )}

              <div className="pt-10">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-12 py-4 bg-white border-2 border-slate-200 text-slate-400 rounded-full font-black text-sm uppercase tracking-[0.3em] hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center gap-3 mx-auto"
                > 
                  Sair do Sistema <ExternalLink size={18} />
                </button>
              </div>
            </div>
          )}

        </main>

        {/* Improved Footer */}
        <footer className="bg-slate-50/80 backdrop-blur-md p-8 text-center border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 px-16">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
              Secretaria de Saúde do DF
            </p>
            <div className="hidden md:block w-px h-4 bg-slate-200"></div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
              Diagnóstico de Ecossistema Tecnológico APS 2025
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             <p className="text-[9px] font-black text-slate-400 uppercase">Sistema Operante • SSL Secure</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;