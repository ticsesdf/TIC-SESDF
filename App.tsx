
import React, { useState } from 'react';
import { 
  ShieldCheck, User, Monitor, Activity, 
  AlertTriangle, CheckCircle, ChevronRight, ChevronLeft, Save, 
  Wifi, BarChart3, Zap, LayoutGrid, FileText, GraduationCap, Briefcase, Calendar, Users
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
import { analyzeSurveyRoutine } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<SurveyState>({
    step: Step.TCLE,
    tcle: false,
    profile: {
      idade: '',
      sexo: '',
      formacao: '',
      cargoEfetivo: '',
      dataAdmissao: '',
      cargoGsap: '',
      tempoGestaoGsap: '',
      regiaoGsap: '',
      quantidadeUbs: '',
      internetAcesso: '',
      computadoresQtd: '',
      computadoresSuficiencia: ''
    },
    selectedSystems: [],
    evaluations: {},
    produtividade: {},
    barreiras: {},
    sugestoes: ''
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

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
    setIsAnalyzing(true);
    const aiInsight = await analyzeSurveyRoutine(state);
    setInsight(aiInsight);
    setIsAnalyzing(false);
    next();
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
              Gestão da Informação na Atenção Primária à Saúde: Uso de Sistemas e Ferramentas Digitais pelos Gestores do Distrito Federal
            </h1>
            <div className="space-y-1">
              <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest opacity-80">
                Pesquisadores: Letícia Dinegri, Marco Antônio Ferreira Almeida, Matheus Henrique de Sousa, Yonara Cerqueira Ferreira
              </p>
              <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest opacity-80">
                Instituição: Fundação de Ensino e Pesquisa em Ciências da Saúde (FEPECS)
              </p>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/20">
            <div 
              className="h-full bg-yellow-400 transition-all duration-700 ease-out" 
              style={{ width: `${(state.step / 7) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-8 md:p-14">
          
          {/* STEP 0: TCLE */}
          {state.step === Step.TCLE && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-4 text-blue-600">
                <ShieldCheck size={32} strokeWidth={2.5} />
                <h2 className="text-2xl font-black">Termo de Consentimento Livre e Esclarecido (TCLE)</h2>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-slate-600 leading-relaxed text-sm md:text-base space-y-6 shadow-inner custom-scrollbar overflow-y-auto max-h-[400px]">
                <p>Você está convidado(a) a participar da pesquisa intitulada <strong>"Gestão da Informação na Atenção Primária à Saúde: Uso de Sistemas e Ferramentas Digitais pelos Gestores do Distrito Federal"</strong>, conduzida por pesquisadores da FEPECS.</p>
                <p><strong>Objetivo:</strong> O presente estudo tem como finalidade realizar um diagnóstico detalhado do ecossistema tecnológico da SES-DF, identificando gargalos, potencialidades e o nível de integração das ferramentas digitais na rotina da Atenção Primária.</p>
                <p><strong>Segurança e Privacidade:</strong> Garantimos que sua participação é estritamente anônima. Os dados coletados são criptografados de ponta a ponta, assegurando que nenhuma resposta possa ser vinculada à sua identidade ou à sua unidade de saúde específica. As informações serão tratadas de forma agregada para fins de análise estatística e científica.</p>
                <p><strong>Participação:</strong> A sua colaboração é voluntária e você pode interromper o preenchimento a qualquer momento, sem qualquer penalidade. O tempo estimado é de 15 minutos.</p>
                <p>Ao selecionar a opção "Li e concordo", você declara estar ciente dos objetivos e da proteção dos seus dados, consentindo com a sua utilização para este diagnóstico.</p>
              </div>
              <label className="flex items-center gap-4 p-6 bg-blue-50/50 rounded-2xl cursor-pointer border-2 border-transparent hover:border-blue-200 transition-all group">
                <input 
                  type="checkbox" 
                  checked={state.tcle} 
                  onChange={e => setState({...state, tcle: e.target.checked})} 
                  className="w-6 h-6 accent-blue-600 rounded" 
                />
                <span className="text-sm font-bold text-blue-900 group-hover:text-blue-700">Li e concordo em participar da pesquisa conforme os termos acima.</span>
              </label>
              <button 
                onClick={next} 
                disabled={!state.tcle} 
                className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex justify-center items-center gap-3"
              >
                Começar agora <ChevronRight size={22} />
              </button>
            </div>
          )}

          {/* STEP 1: PROFILE */}
          {state.step === Step.PROFILE && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex items-center gap-4 text-blue-600">
                <User size={32} strokeWidth={2.5} />
                <h2 className="text-2xl font-black">Bloco 1: Perfil do Gestor e da Unidade</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Idade */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Idade*</label>
                  <input 
                    type="number" 
                    className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Ex: 35"
                    value={state.profile.idade}
                    onChange={e => updateProfile('idade', e.target.value)}
                  />
                </div>

                {/* Sexo */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Sexo*</label>
                  <select 
                    className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={state.profile.sexo}
                    onChange={e => updateProfile('sexo', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {SEXO_OPCOES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                {/* Formação */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <GraduationCap size={14}/> Maior formação acadêmica*
                  </label>
                  <select 
                    className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={state.profile.formacao}
                    onChange={e => updateProfile('formacao', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {FORMACOES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {/* Cargo Efetivo */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Briefcase size={14}/> Qual Cargo efetivo na SES-DF*
                  </label>
                  <select 
                    className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={state.profile.cargoEfetivo}
                    onChange={e => updateProfile('cargoEfetivo', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {CARGOS_EFETIVOS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Data Admissão */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Calendar size={14}/> Data de admissão na SES-DF*
                  </label>
                  <input 
                    type="date" 
                    className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={state.profile.dataAdmissao}
                    onChange={e => updateProfile('dataAdmissao', e.target.value)}
                  />
                </div>

                {/* Cargo GSAP */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Qual seu cargo na GSAP*</label>
                  <select 
                    className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={state.profile.cargoGsap}
                    onChange={e => updateProfile('cargoGsap', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {CARGOS_GSAP.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Tempo Gestão GSAP */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Tempo de atuação como gestor(a) da atual GSAP*</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Ex: 2 anos e 3 meses"
                    value={state.profile.tempoGestaoGsap}
                    onChange={e => updateProfile('tempoGestaoGsap', e.target.value)}
                  />
                </div>

                {/* Região Saúde */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Região de Saúde da GSAP*</label>
                  <select 
                    className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={state.profile.regiaoGsap}
                    onChange={e => updateProfile('regiaoGsap', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {REGIOES_SAUDE.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Quantidade UBS */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Users size={14}/> Quantidade de UBS vinculada a GSAP?*
                  </label>
                  <select 
                    className="w-full p-4 bg-slate-50 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={state.profile.quantidadeUbs}
                    onChange={e => updateProfile('quantidadeUbs', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {UBS_VINCULADAS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Infraestrutura da Unidade */}
              <div className="p-8 bg-blue-50/30 rounded-[2rem] space-y-8 border border-blue-100">
                <h4 className="font-bold text-blue-900 flex items-center gap-2"><Wifi size={20}/> Infraestrutura Tecnológica</h4>
                
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700">Sua unidade possui acesso à internet para atividades administrativas?*</label>
                  <div className="grid grid-cols-1 gap-2">
                    {INTERNET_OPCOES.map(opt => (
                      <button 
                        key={opt} 
                        onClick={() => updateProfile('internetAcesso', opt)}
                        className={`text-left p-4 rounded-xl border-2 font-medium transition-all text-sm ${state.profile.internetAcesso === opt ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 leading-tight block">Quantos computadores funcionais disponíveis exclusivamente para uso administrativo?*</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PC_OPCOES.map(v => (
                        <button key={v} onClick={() => updateProfile('computadoresQtd', v)}
                                className={`py-3 rounded-xl font-bold border-2 transition-all text-xs ${state.profile.computadoresQtd === v ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>{v}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 leading-tight block">A quantidade de computadores é suficiente?*</label>
                    <div className="grid grid-cols-1 gap-2">
                      {PC_SUFICIENCIA_OPCOES.map(v => (
                        <button key={v} onClick={() => updateProfile('computadoresSuficiencia', v)}
                                className={`text-left px-4 py-2 rounded-xl font-bold border-2 transition-all text-[11px] ${state.profile.computadoresSuficiencia === v ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>{v}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={back} className="flex-1 py-5 border-2 border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 flex justify-center items-center gap-2"><ChevronLeft size={20}/> Voltar</button>
                <button 
                  onClick={next} 
                  disabled={!isProfileValid()} 
                  className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex justify-center items-center gap-2 disabled:bg-slate-200 disabled:text-slate-400"
                >
                  Prosseguir para Sistemas <ChevronRight size={20}/></button>
              </div>
            </div>
          )}

          {/* STEP 2: SYSTEMS INVENTORY */}
          {state.step === Step.SYSTEMS && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-4 text-blue-600">
                <Monitor size={32} strokeWidth={2.5} />
                <h2 className="text-2xl font-black">Bloco II: Inventário de Sistemas</h2>
              </div>
              <p className="text-slate-500 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">Selecione todos os sistemas que você utiliza no apoio à sua gestão.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar p-2">
                {SISTEMAS_SES.map(sys => (
                  <button 
                    key={sys}
                    onClick={() => toggleSystem(sys)}
                    className={`p-4 text-[10px] md:text-xs font-black rounded-2xl border-2 text-left transition-all leading-tight h-16 flex items-center justify-between ${state.selectedSystems.includes(sys) ? 'bg-blue-600 border-blue-600 text-white shadow-xl translate-y-[-2px]' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'}`}
                  >
                    <span>{sys}</span>
                    {state.selectedSystems.includes(sys) && <CheckCircle size={14} />}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={back} className="flex-1 py-5 border-2 border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 flex justify-center items-center gap-2"><ChevronLeft size={20}/> Voltar</button>
                <button onClick={next} disabled={state.selectedSystems.length === 0} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex justify-center items-center gap-2">Continuar ({state.selectedSystems.length}) <ChevronRight size={20}/></button>
              </div>
            </div>
          )}

          {/* STEP 3: DYNAMIC EVALUATION */}
          {state.step === Step.EVALUATION && (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-4 text-blue-600">
                <Activity size={32} strokeWidth={2.5} />
                <h2 className="text-2xl font-black">Avaliação de Performance</h2>
              </div>
              
              <div className="space-y-10 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                {state.selectedSystems.map(sys => (
                  <div key={sys} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 space-y-8 relative">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-blue-700 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        {sys}
                      </h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Frequência de Uso (1-5):</p>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(v => (
                            <button key={v} onClick={() => {
                              setState(s => ({ ...s, evaluations: { ...s.evaluations, [sys]: { ...(s.evaluations[sys] || { confianca: 3 }), freq: v } } }));
                            }} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${state.evaluations[sys]?.freq === v ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-300'}`}>{v}</button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Confiança nos Dados (1-5):</p>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(v => (
                            <button key={v} onClick={() => {
                              setState(s => ({ ...s, evaluations: { ...s.evaluations, [sys]: { ...(s.evaluations[sys] || { freq: 3 }), confianca: v } } }));
                            }} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${state.evaluations[sys]?.confianca === v ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-300'}`}>{v}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={back} className="flex-1 py-5 border-2 border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 flex justify-center items-center gap-2"><ChevronLeft size={20}/> Voltar</button>
                <button onClick={next} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex justify-center items-center gap-2">Próximo <ChevronRight size={20}/></button>
              </div>
            </div>
          )}

          {/* STEP 4: PROD & INDICATORS */}
          {state.step === Step.PROD_INDICATORS && (
            <div className="space-y-10 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-4 text-blue-600">
                <BarChart3 size={32} strokeWidth={2.5} />
                <h2 className="text-2xl font-black">Rotinas e Produtividade</h2>
              </div>

              <div className="space-y-8">
                <h4 className="font-bold text-slate-700">Frequência de uso das ferramentas acessórias:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FERRAMENTAS_PROD.map(tool => (
                    <div key={tool} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <p className="text-sm font-black text-blue-900">{tool}</p>
                      <div className="flex gap-1 w-1/2">
                        {[1,2,3,4,5].map(v => (
                          <button key={v} onClick={() => {
                            setState(s => ({ ...s, produtividade: { ...s.produtividade, [tool]: v } }));
                          }} className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${state.produtividade[tool] === v ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>{v}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={back} className="flex-1 py-5 border-2 border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 flex justify-center items-center gap-2"><ChevronLeft size={20}/> Voltar</button>
                <button onClick={next} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex justify-center items-center gap-2">Próximo <ChevronRight size={20}/></button>
              </div>
            </div>
          )}

          {/* STEP 5: BARRIERS */}
          {state.step === Step.BARRIERS && (
            <div className="space-y-10 animate-in slide-in-from-right duration-500">
              <div className="flex items-center gap-4 text-rose-600">
                <AlertTriangle size={32} strokeWidth={2.5} />
                <h2 className="text-2xl font-black">Desafios e Barreiras</h2>
              </div>

              <div className="space-y-8">
                <p className="text-slate-500 font-medium">Qual o impacto destes problemas na sua rotina (1 = Nenhum, 5 = Crítico)?</p>
                {BARREIRAS_LIST.map(barreira => (
                  <div key={barreira} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-sm font-bold text-slate-700 flex-1">{barreira}</p>
                    <div className="flex gap-2 w-full md:w-auto">
                      {[1,2,3,4,5].map(v => (
                        <button key={v} onClick={() => {
                          setState(s => ({ ...s, barreiras: { ...s.barreiras, [barreira]: v } }));
                        }} className={`flex-1 md:w-12 py-3 rounded-xl font-bold border-2 transition-all ${state.barreiras[barreira] === v ? 'bg-rose-600 border-rose-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-300'}`}>{v}</button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Alguma sugestão de melhoria ou observação?</label>
                  <textarea 
                    className="w-full p-6 bg-slate-50 rounded-[2rem] border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 h-32 outline-none"
                    placeholder="Compartilhe sua visão..."
                    value={state.sugestoes}
                    onChange={e => setState({...state, sugestoes: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={back} className="flex-1 py-5 border-2 border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 flex justify-center items-center gap-2"><ChevronLeft size={20}/> Voltar</button>
                <button onClick={next} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex justify-center items-center gap-2">Revisar Diagnóstico <ChevronRight size={20}/></button>
              </div>
            </div>
          )}

          {/* STEP 6: SUMMARY */}
          {state.step === Step.SUMMARY && (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="flex items-center gap-4 text-indigo-600">
                <FileText size={32} strokeWidth={2.5} />
                <h2 className="text-2xl font-black">Resumo do Diagnóstico</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-2">
                  <h4 className="text-xs font-black text-indigo-500 uppercase">Contexto</h4>
                  <p className="font-bold text-slate-800">{state.profile.cargoGsap} em {state.profile.regiaoGsap}</p>
                  <p className="text-sm text-slate-500">UBSs Vinculadas: {state.profile.quantidadeUbs}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-2">
                  <h4 className="text-xs font-black text-indigo-500 uppercase">Ecossistema</h4>
                  <p className="font-bold text-slate-800">{state.selectedSystems.length} Sistemas</p>
                  <p className="text-sm text-slate-500">Acesso Internet: {state.profile.internetAcesso.substring(0, 30)}...</p>
                </div>
              </div>

              <div className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2"><LayoutGrid size={18}/> Sistemas Avaliados:</h4>
                <div className="flex flex-wrap gap-2">
                  {state.selectedSystems.map(s => (
                    <span key={s} className="px-4 py-2 bg-white border border-indigo-200 rounded-full text-[10px] font-black text-indigo-700 uppercase">
                      {s} (C: {state.evaluations[s]?.confianca || '-'})
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={back} className="flex-1 py-5 border-2 border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 flex justify-center items-center gap-2"><ChevronLeft size={20}/> Ajustar</button>
                <button 
                  onClick={handleFinish} 
                  disabled={isAnalyzing}
                  className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex justify-center items-center gap-3"
                >
                  {isAnalyzing ? 'Processando...' : 'Submeter e Concluir'} <Save size={22} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: SUCCESS */}
          {state.step === Step.SUCCESS && (
            <div className="text-center space-y-8 animate-in zoom-in duration-700 py-10">
              <div className="flex justify-center relative">
                <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full transform scale-150"></div>
                <div className="relative p-8 bg-green-500 text-white rounded-full shadow-2xl">
                  <CheckCircle size={70} strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">Muito Obrigado!</h2>
                <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">Sua participação foi registrada. Estes dados são vitais para o planejamento da saúde digital no DF.</p>
              </div>

              {insight && (
                <div className="max-w-xl mx-auto p-8 bg-blue-50 border border-blue-100 rounded-[2.5rem] text-left space-y-4 shadow-sm">
                  <h4 className="flex items-center gap-2 font-black text-blue-900 uppercase tracking-widest text-xs">
                    <Zap size={20} className="text-blue-600 fill-blue-600" /> 
                    Insight Estratégico (IA):
                  </h4>
                  <p className="text-blue-800 italic leading-relaxed font-medium">
                    "{insight}"
                  </p>
                </div>
              )}

              <button 
                onClick={() => window.location.reload()} 
                className="inline-flex py-4 px-12 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold items-center gap-2 transition-all shadow-xl"
              >
                Novo Diagnóstico
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Protocolo FEPECS: 2025.08.12 • SES-DF | Versão Residência</p>
        </div>
      </div>
    </div>
  );
};

export default App;
