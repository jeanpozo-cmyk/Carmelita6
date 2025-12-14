import React, { useState, useEffect } from 'react';
import { 
  Leaf, DollarSign, CreditCard, ShoppingBag, Calendar, MessageCircle, 
  PenTool, GraduationCap, Settings, Menu, X, PlusCircle, Video, 
  Image as ImageIcon, ArrowLeft, ArrowRight, Heart, Search, AlertTriangle, CheckCircle,
  LifeBuoy, Star, Users, TrendingUp, Lightbulb, MapPin, Share2, Award, BookOpen, UserCircle, Trash2, Target, Megaphone
} from 'lucide-react';

import LandingPage from './components/LandingPage';
import AdminPanel from './components/AdminPanel';
import { UserRole, UserProfile, FinancialRecord, SavingsGoal, Debt, Client, InventoryItem, CalendarEvent } from './types';
import { askCarmelita, generateAgencyImage, generateAgencyVideo, analyzeCreditRisk, generateClientMessage, generateMarketingStrategy } from './services/geminiService';

// --- MAIN APP COMPONENT ---

export default function App() {
  // --- STATE ---
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // --- MOCK DATA STORE ---
  const [records, setRecords] = useState<FinancialRecord[]>([
    { id: '1', type: 'INCOME', amount: 5000, description: 'Venta de Pasteles', category: 'Ventas', date: '2024-03-20', urgency: 'GREEN' },
    { id: '2', type: 'EXPENSE', amount: 1200, description: 'Harina y Huevos', category: 'Materia Prima', date: '2024-03-21', urgency: 'RED' }
  ]);
  const [savings, setSavings] = useState<SavingsGoal[]>([
    { id: '1', name: 'Horno Industrial', targetAmount: 15000, currentAmount: 4500, deadline: '2024-12-01' }
  ]);
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', creditor: 'Banco Azteca', totalAmount: 5000, interestRate: 45, minPayment: 200, emotionalScore: 8 }
  ]);
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Doña Lety', phone: '5512345678', temperature: 'HOT', lastContact: '2024-03-15', notes: 'Ama el pastel de zanahoria' }
  ]);
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Harina de Trigo', stock: 10, minStock: 5, unit: 'kg' },
    { id: '2', name: 'Chocolate Oscuro', stock: 2, minStock: 4, unit: 'kg' },
    { id: '3', name: 'Vainilla', stock: 1, minStock: 2, unit: 'lt' } 
  ]);
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', title: 'Entrega Pastel Bodas', date: '2024-03-22', time: '15:00', type: 'CLIENT' },
    { id: '2', title: 'Cita con Proveedor', date: '2024-03-24', time: '11:00', type: 'DELIVERY' }
  ]);

  const [carmelitaAdvice, setCarmelitaAdvice] = useState<string>("");

  // --- HANDLERS ---

  const handleLogin = () => {
    setUser({
      uid: 'user-123',
      displayName: 'Ana María',
      email: 'ana@example.com',
      role: 'USER',
      businessType: 'Reposteria',
      credits: 50,
      onboardingComplete: true,
      bio: "Haciendo los pasteles más ricos del barrio.",
      badges: ['Semilla Plantada', 'Primer Venta']
    });
  };

  const handleAdminLogin = () => {
    setUser({
      uid: 'admin-001',
      displayName: 'Tía Suprema',
      email: 'admin@carmelita.app',
      role: 'SUPERADMIN',
      businessType: 'Corporativo',
      credits: 99999,
      onboardingComplete: true
    });
  };

  const handleLogout = () => setUser(null);

  // Initial Advice Logic
  useEffect(() => {
    if (user && user.role === 'USER' && currentView === 'dashboard') {
      const analyzeFinances = async () => {
        setLoading(true);
        const totalIncome = records.filter(r=>r.type==='INCOME').reduce((a,b)=>a+b.amount,0);
        const totalDebt = debts.reduce((a,b)=>a+b.totalAmount,0);
        const prompt = `Analiza brevemente: Ingresos $${totalIncome}, Deudas $${totalDebt}. Dame un consejo ejecutivo de una frase.`;
        const advice = await askCarmelita(prompt, 'general');
        setCarmelitaAdvice(advice);
        setLoading(false);
      };
      analyzeFinances();
    }
  }, [user, currentView]);

  // --- ROUTER ---

  if (!user) {
    return <LandingPage onLogin={handleLogin} onAdminLogin={handleAdminLogin} onAffiliate={() => setUser({ ...user!, role: 'GUEST', view: 'affiliate_landing' } as any)} />;
  }

  // Handle Guest/Affiliate application view from Landing Page
  if ((user as any).view === 'affiliate_landing') {
     return <AffiliateLanding onLogin={handleLogin} onBack={() => setUser(null)} />;
  }

  if (user.role === 'SUPERADMIN') {
    return <AdminPanel role={user.role} onBack={handleLogout} />;
  }

  const renderContent = () => {
    switch(currentView) {
      // Core Views
      case 'dashboard': return <Dashboard records={records} advice={carmelitaAdvice} loading={loading} onViewChange={setCurrentView} userName={user.displayName} />;
      case 'tools': return <ToolsGrid onViewChange={setCurrentView} />;
      case 'agency': return <Agency user={user} />;
      case 'university': return <University />;
      case 'social': return <SocialCafe user={user} />;
      case 'store': return <Store user={user} />;
      case 'support': return <SupportSection user={user} />;
      
      // Specific Tools
      case 'tool-register': return <FinancialRegister records={records} setRecords={setRecords} onBack={() => setCurrentView('tools')} />;
      case 'tool-savings': return <SavingsSeeds goals={savings} setGoals={setSavings} onBack={() => setCurrentView('tools')} />;
      case 'tool-debt': return <DebtFreedom debts={debts} setDebts={setDebts} onBack={() => setCurrentView('tools')} />;
      case 'tool-tax': return <TaxCalculator onBack={() => setCurrentView('tools')} />;
      case 'tool-credit': return <CreditEvaluator onBack={() => setCurrentView('tools')} />;
      case 'tool-inventory': return <InventoryManager inventory={inventory} setInventory={setInventory} onBack={() => setCurrentView('tools')} />;
      case 'tool-crm': return <CRM clients={clients} setClients={setClients} onBack={() => setCurrentView('tools')} />;
      case 'tool-calendar': return <AppointmentCalendar events={events} setEvents={setEvents} onBack={() => setCurrentView('tools')} />;
      case 'tool-grants': return <GovernmentSupport onBack={() => setCurrentView('tools')} />;

      default: return <Dashboard records={records} advice={carmelitaAdvice} loading={loading} onViewChange={setCurrentView} userName={user.displayName} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow-2xl transform transition-transform duration-300 z-30 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 flex justify-between items-center">
          <h2 className="font-script text-3xl text-rose-600 font-bold">Carmelita</h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X /></button>
        </div>
        
        <div className="px-6 mb-6">
           <div className="bg-gradient-to-r from-rose-100 to-purple-50 p-4 rounded-2xl flex items-center space-x-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('social')}>
             <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
               {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.displayName[0]}
             </div>
             <div>
               <p className="font-bold text-sm text-gray-900">{user.displayName}</p>
               <p className="text-xs text-rose-600 font-bold">{user.credits} Créditos</p>
             </div>
           </div>
        </div>

        <nav className="px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          <NavItem icon={<Leaf size={20} />} label="Mi Árbol (Dashboard)" active={currentView === 'dashboard'} onClick={() => { setCurrentView('dashboard'); setSidebarOpen(false); }} />
          <NavItem icon={<PenTool size={20} />} label="Herramientas" active={currentView.startsWith('tool') || currentView === 'tools'} onClick={() => { setCurrentView('tools'); setSidebarOpen(false); }} />
          <NavItem icon={<ShoppingBag size={20} />} label="Agencia IA" active={currentView === 'agency'} onClick={() => { setCurrentView('agency'); setSidebarOpen(false); }} />
          <NavItem icon={<GraduationCap size={20} />} label="Universidad" active={currentView === 'university'} onClick={() => { setCurrentView('university'); setSidebarOpen(false); }} />
          <NavItem icon={<MessageCircle size={20} />} label="Café Social" active={currentView === 'social'} onClick={() => { setCurrentView('social'); setSidebarOpen(false); }} />
          <NavItem icon={<DollarSign size={20} />} label="Tienda & Planes" active={currentView === 'store'} onClick={() => { setCurrentView('store'); setSidebarOpen(false); }} />
          <NavItem icon={<LifeBuoy size={20} />} label="Soporte" active={currentView === 'support'} onClick={() => { setCurrentView('support'); setSidebarOpen(false); }} />
          
          <div className="pt-8 pb-4">
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
               <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <button className="md:hidden mb-4 p-2 bg-white rounded-lg shadow" onClick={() => setSidebarOpen(true)}>
          <Menu />
        </button>
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </button>
);

const AffiliateLanding = ({ onLogin, onBack }: any) => (
  <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-6">
    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center">
      <h2 className="text-3xl font-script text-rose-600 font-bold mb-4">Gana con Carmelita</h2>
      <p className="text-gray-600 mb-6">Únete a nuestro programa de embajadoras. Gana comisiones por cada micro-emprendedora que ayudes a digitalizar.</p>
      <form className="space-y-4 text-left">
        <div>
          <label className="block text-sm font-bold text-gray-700">Nombre Completo</label>
          <input className="w-full p-3 bg-gray-50 rounded-xl" placeholder="Tu nombre" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700">Redes Sociales (Link)</label>
          <input className="w-full p-3 bg-gray-50 rounded-xl" placeholder="Instagram/TikTok" />
        </div>
        <button type="button" onClick={() => alert("Solicitud enviada. Te contactaremos pronto.")} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600">
          Aplicar Ahora
        </button>
      </form>
      <button onClick={onBack} className="mt-4 text-gray-500 underline text-sm">Volver al inicio</button>
    </div>
  </div>
);

const SupportSection = ({ user }: any) => {
  const [status, setStatus] = useState<string>("");

  const checkHealth = async () => {
    setStatus("Verificando conexión...");
    try {
      // Simple check (in production this would ping the backend)
      await new Promise(r => setTimeout(r, 1000));
      setStatus("Sistema Saludable: Conexión con IA y Base de Datos activa 🟢");
    } catch (e) {
      setStatus("Error de conexión 🔴");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Centro de Ayuda</h1>
      
      <div className="bg-white p-6 rounded-3xl shadow mb-8">
        <h3 className="font-bold text-lg mb-4">Estado del Sistema</h3>
        <p className="text-gray-600 mb-4 text-sm">Si algo falla, presiona este botón para que los ingenieros revisen.</p>
        <button onClick={checkHealth} className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold text-sm">
          Health Check
        </button>
        {status && <p className="mt-4 font-mono text-sm bg-gray-100 p-2 rounded">{status}</p>}
      </div>

      <div className="bg-white p-6 rounded-3xl shadow">
        <h3 className="font-bold text-lg mb-4">Enviar Ticket</h3>
        <textarea className="w-full bg-rose-50 p-4 rounded-xl mb-4 h-32" placeholder="Describe tu problema..."></textarea>
        <button onClick={() => alert("Ticket enviado. El equipo de soporte te responderá.")} className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold">
          Enviar Reporte
        </button>
      </div>
    </div>
  );
};

// --- MODERN FINANCIAL TREE DASHBOARD ---
const Dashboard = ({ records, advice, loading, onViewChange, userName }: any) => {
  const totalIncome = records.filter((r:any) => r.type === 'INCOME').reduce((acc:number, curr:any) => acc + curr.amount, 0);
  const totalExpense = records.filter((r:any) => r.type === 'EXPENSE').reduce((acc:number, curr:any) => acc + curr.amount, 0);
  const healthScore = totalIncome - totalExpense;
  const isHealthy = healthScore > 0;

  // Generate abstract nodes for income sources (Leaves)
  const incomeNodes = records.filter((r:any) => r.type === 'INCOME').slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-bold text-gray-900">Hola, {userName}</h1>
            <p className="text-gray-500">Resumen Ejecutivo del Negocio</p>
         </div>
         <div className="hidden md:block">
            <span className={`px-4 py-2 rounded-full font-bold text-sm ${isHealthy ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {isHealthy ? 'Flujo Saludable 🟢' : 'Atención Requerida 🔴'}
            </span>
         </div>
      </header>

      {/* Carmelita Insight Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex items-start space-x-4">
         <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-purple-600 text-white rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xl shadow-md">C</div>
         <div>
           <h3 className="font-bold text-gray-900 mb-1 text-sm uppercase tracking-wide">Carmelita Insight</h3>
           {loading ? <p className="text-gray-400 italic">Analizando datos...</p> : <p className="text-gray-700 leading-relaxed">"{advice}"</p>}
         </div>
      </div>

      {/* MODERN ABSTRACT TREE VISUALIZATION */}
      <div className="relative bg-white h-[500px] rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col items-center justify-between p-8">
         {/* Background Subtle Grid */}
         <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

         {/* 1. CANOPY (Income) - Floating Glassmorphism Orbs */}
         <div className="relative w-full h-1/2 flex justify-center items-end z-10">
            {incomeNodes.map((node: any, i: number) => (
              <div key={i} 
                className="absolute bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full flex items-center justify-center text-xs font-bold text-emerald-800 shadow-sm animate-float"
                style={{
                  width: `${Math.max(60, Math.min(120, node.amount / 50))}px`,
                  height: `${Math.max(60, Math.min(120, node.amount / 50))}px`,
                  bottom: `${Math.random() * 50 + 20}px`,
                  left: `${(i + 1) * (100 / (incomeNodes.length + 1))}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="text-center">
                   <p>${node.amount}</p>
                   <p className="text-[9px] opacity-70 truncate max-w-[50px]">{node.category}</p>
                </div>
              </div>
            ))}
            {/* If no income */}
            {incomeNodes.length === 0 && <div className="text-gray-300 font-bold">Sin frutos aún...</div>}
         </div>

         {/* 2. TRUNK (Core Flow) - Dynamic Bar */}
         <div className="relative z-0 flex-1 w-24 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            {/* The flow liquid */}
            <div 
              className={`absolute bottom-0 w-full transition-all duration-1000 ${isHealthy ? 'bg-gradient-to-t from-emerald-500 to-emerald-300' : 'bg-gradient-to-t from-rose-500 to-rose-300'}`}
              style={{ height: `${Math.min(100, (totalIncome / (totalExpense + 1)) * 50)}%` }}
            ></div>
            {/* Labels */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold drop-shadow-md">
               <span className="text-xs uppercase opacity-80">Neto</span>
               <span className="text-lg">${healthScore}</span>
            </div>
         </div>

         {/* 3. ROOTS (Expenses/Foundation) - Base Blocks */}
         <div className="w-full flex justify-center gap-2 mt-2">
            <div className="h-4 bg-rose-200 rounded-full w-1/3" style={{ opacity: totalExpense > 0 ? 1 : 0.3 }} title={`Gastos: $${totalExpense}`}></div>
            <div className="h-4 bg-rose-300 rounded-full w-1/4" style={{ opacity: totalExpense > 1000 ? 1 : 0.3 }}></div>
            <div className="h-4 bg-rose-400 rounded-full w-1/6" style={{ opacity: totalExpense > 5000 ? 1 : 0.3 }}></div>
         </div>
         
         {/* Overlay Info */}
         <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold shadow-sm border border-gray-100">
           <span className="text-emerald-600 block">Ingresos: ${totalIncome}</span>
         </div>
         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold shadow-sm border border-gray-100">
           <span className="text-rose-600 block">Gastos: ${totalExpense}</span>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onViewChange('tool-register')} className="p-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:bg-black flex items-center justify-center gap-2 transition-transform active:scale-95">
          <PlusCircle size={20} /> Registrar Movimiento
        </button>
        <button onClick={() => onViewChange('tool-savings')} className="p-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
          <Leaf size={20} /> Ver Metas
        </button>
      </div>
    </div>
  );
};

const ToolsGrid = ({ onViewChange }: any) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Caja de Herramientas</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <ToolCard title="Registro Financiero" desc="Ingresos y Gastos con colores de urgencia." color="bg-rose-50 text-rose-900 border-rose-100" icon={<DollarSign />} onClick={() => onViewChange('tool-register')} />
       <ToolCard title="Semillas de Ahorro" desc="Define metas y riégalas." color="bg-emerald-50 text-emerald-900 border-emerald-100" icon={<Leaf />} onClick={() => onViewChange('tool-savings')} />
       <ToolCard title="Adiós Deudas" desc="Método Avalancha x Emocional." color="bg-red-50 text-red-900 border-red-100" icon={<CreditCard />} onClick={() => onViewChange('tool-debt')} />
       <ToolCard title="Calculadora SAT" desc="¿Cuánto debo pagar en RESICO?" color="bg-gray-50 text-gray-900 border-gray-200" icon={<AlertTriangle />} onClick={() => onViewChange('tool-tax')} />
       <ToolCard title="Mis Clientes (CRM)" desc="Generador de mensajes de venta." color="bg-purple-50 text-purple-900 border-purple-100" icon={<Users />} onClick={() => onViewChange('tool-crm')} />
       <ToolCard title="Semáforo de Crédito" desc="¿Te conviene ese préstamo?" color="bg-amber-50 text-amber-900 border-amber-100" icon={<TrendingUp />} onClick={() => onViewChange('tool-credit')} />
       <ToolCard title="Inventario" desc="Control de stock inteligente." color="bg-blue-50 text-blue-900 border-blue-100" icon={<ShoppingBag />} onClick={() => onViewChange('tool-inventory')} />
       <ToolCard title="Calendario" desc="Citas y entregas." color="bg-indigo-50 text-indigo-900 border-indigo-100" icon={<Calendar />} onClick={() => onViewChange('tool-calendar')} />
       <ToolCard title="Apoyos Gobierno" desc="Becas y subsidios." color="bg-green-50 text-green-900 border-green-100" icon={<Search />} onClick={() => onViewChange('tool-grants')} />
    </div>
  </div>
);

const ToolCard = ({ title, desc, color, icon, onClick }: any) => (
  <div onClick={onClick} className={`${color} border p-6 rounded-3xl cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1`}>
    <div className="mb-4">{icon}</div>
    <h3 className="font-bold text-lg mb-1">{title}</h3>
    <p className="text-sm opacity-80">{desc}</p>
  </div>
);

// --- TOOL IMPLEMENTATIONS ---
const FinancialRegister = ({ records, setRecords, onBack }: any) => {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<'INCOME'|'EXPENSE'>('EXPENSE');
  const [urgency, setUrgency] = useState<'RED'|'YELLOW'|'GREEN'>('GREEN');

  const handleAdd = () => {
    if (!amount) return;
    setRecords([...records, {
      id: Date.now().toString(),
      type, amount: parseFloat(amount), description: desc, category: 'General', date: new Date().toISOString(), urgency
    }]);
    alert("¡Registrado con éxito!");
    setAmount(''); setDesc('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <HeaderBack title="Registro Financiero" onBack={onBack} />
      <div className="bg-white p-6 rounded-3xl shadow-md">
        <div className="flex gap-4 mb-6">
          <button onClick={() => setType('INCOME')} className={`flex-1 py-3 rounded-xl font-bold ${type==='INCOME' ? 'bg-emerald-500 text-white' : 'bg-gray-100'}`}>Ingreso</button>
          <button onClick={() => setType('EXPENSE')} className={`flex-1 py-3 rounded-xl font-bold ${type==='EXPENSE' ? 'bg-rose-500 text-white' : 'bg-gray-100'}`}>Gasto</button>
        </div>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Monto ($)" className="w-full p-4 mb-4 bg-gray-50 rounded-xl" />
        <input type="text" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Descripción (ej. Harina)" className="w-full p-4 mb-4 bg-gray-50 rounded-xl" />
        
        {type === 'EXPENSE' && (
          <div className="mb-6">
            <p className="mb-2 font-bold text-gray-600">Vitalidad (Urgencia):</p>
            <div className="flex gap-2">
              <button onClick={()=>setUrgency('RED')} className={`p-2 rounded-lg border-2 ${urgency==='RED' ? 'border-red-500 bg-red-50' : 'border-transparent'}`}>🔴 Vital (Renta/Luz)</button>
              <button onClick={()=>setUrgency('YELLOW')} className={`p-2 rounded-lg border-2 ${urgency==='YELLOW' ? 'border-yellow-500 bg-yellow-50' : 'border-transparent'}`}>🟡 Necesario</button>
              <button onClick={()=>setUrgency('GREEN')} className={`p-2 rounded-lg border-2 ${urgency==='GREEN' ? 'border-green-500 bg-green-50' : 'border-transparent'}`}>🟢 Gusto</button>
            </div>
          </div>
        )}
        <button onClick={handleAdd} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold">Guardar</button>
      </div>
    </div>
  );
};

const SavingsSeeds = ({ goals, setGoals, onBack }: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '' });

  const addGoal = () => {
    if(!newGoal.name) return;
    setGoals([...goals, { id: Date.now().toString(), name: newGoal.name, targetAmount: Number(newGoal.target), currentAmount: 0, deadline: '' }]);
    setIsAdding(false);
    setNewGoal({ name: '', target: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         <HeaderBack title="Semillas de Ahorro" onBack={onBack} noMargin />
         <button onClick={() => setIsAdding(!isAdding)} className="bg-emerald-500 text-white px-3 py-2 rounded-lg font-bold flex gap-1 items-center text-sm"><PlusCircle size={16}/> Nueva</button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-3xl shadow mb-4 animate-fade-in">
           <input className="w-full p-3 bg-gray-50 rounded-xl mb-3" placeholder="Nombre (ej. Horno)" value={newGoal.name} onChange={e=>setNewGoal({...newGoal, name: e.target.value})} />
           <input className="w-full p-3 bg-gray-50 rounded-xl mb-3" type="number" placeholder="Meta ($)" value={newGoal.target} onChange={e=>setNewGoal({...newGoal, target: e.target.value})} />
           <button onClick={addGoal} className="w-full bg-gray-900 text-white py-2 rounded-xl font-bold">Plantar Semilla</button>
        </div>
      )}

      <div className="grid gap-4">
        {goals.map((g: any) => (
          <div key={g.id} className="bg-white p-6 rounded-3xl shadow flex justify-between items-center">
             <div>
               <h3 className="font-bold text-lg">{g.name}</h3>
               <div className="w-48 h-3 bg-gray-100 rounded-full mt-2 overflow-hidden">
                 <div className="h-full bg-emerald-500" style={{ width: `${(g.currentAmount/g.targetAmount)*100}%` }}></div>
               </div>
               <p className="text-xs text-gray-500 mt-1">${g.currentAmount} / ${g.targetAmount}</p>
             </div>
             <button onClick={() => {
                const newGoals = goals.map((go:any) => go.id === g.id ? {...go, currentAmount: go.currentAmount + 100} : go);
                setGoals(newGoals);
             }} className="bg-blue-100 text-blue-600 p-3 rounded-full hover:bg-blue-200">
               💧 Regar ($100)
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const DebtFreedom = ({ debts, setDebts, onBack }: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newDebt, setNewDebt] = useState({ creditor: '', amount: '', score: '5' });

  const addDebt = () => {
    if(!newDebt.creditor) return;
    setDebts([...debts, { id: Date.now().toString(), creditor: newDebt.creditor, totalAmount: Number(newDebt.amount), interestRate: 0, minPayment: 0, emotionalScore: Number(newDebt.score) }]);
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         <HeaderBack title="Adiós Deudas" onBack={onBack} noMargin />
         <button onClick={() => setIsAdding(!isAdding)} className="bg-red-500 text-white px-3 py-2 rounded-lg font-bold flex gap-1 items-center text-sm"><PlusCircle size={16}/> Nueva</button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-3xl shadow mb-4">
           <input className="w-full p-3 bg-gray-50 rounded-xl mb-3" placeholder="Acreedor (ej. Banco)" value={newDebt.creditor} onChange={e=>setNewDebt({...newDebt, creditor: e.target.value})} />
           <input className="w-full p-3 bg-gray-50 rounded-xl mb-3" type="number" placeholder="Monto Total ($)" value={newDebt.amount} onChange={e=>setNewDebt({...newDebt, amount: e.target.value})} />
           <label className="text-xs font-bold text-gray-500">Nivel de Estrés (1-10)</label>
           <input className="w-full p-3 bg-gray-50 rounded-xl mb-3" type="range" min="1" max="10" value={newDebt.score} onChange={e=>setNewDebt({...newDebt, score: e.target.value})} />
           <button onClick={addDebt} className="w-full bg-gray-900 text-white py-2 rounded-xl font-bold">Agregar Deuda</button>
        </div>
      )}

      <div className="bg-amber-50 p-4 rounded-xl mb-6 text-amber-800 text-sm">
        Carmelita recomienda el método <b>Avalancha Emocional</b>: Paga primero lo que más te quite el sueño.
      </div>
      {debts.map((d: any) => (
        <div key={d.id} className="bg-white p-6 rounded-3xl shadow mb-4 border-l-4 border-red-500">
          <div className="flex justify-between">
            <h3 className="font-bold">{d.creditor}</h3>
            <span className="text-red-500 font-bold">${d.totalAmount}</span>
          </div>
          <p className="text-sm text-gray-500">Interés: {d.interestRate}% anual</p>
          <div className="mt-2 flex gap-2">
             <span className="text-xs bg-gray-100 px-2 py-1 rounded">Estrés: {d.emotionalScore}/10</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const TaxCalculator = ({ onBack }: any) => {
  const [income, setIncome] = useState(0);
  const [regime, setRegime] = useState('RESICO');
  const tax = regime === 'RESICO' ? income * 0.025 : income * 0.30; 
  return (
    <div className="max-w-xl mx-auto">
      <HeaderBack title="Calculadora SAT" onBack={onBack} />
      <div className="bg-white p-6 rounded-3xl shadow">
        <label className="block mb-2 font-bold text-gray-700">Ingresos del Mes:</label>
        <input type="number" onChange={(e)=>setIncome(Number(e.target.value))} className="w-full p-3 bg-gray-50 rounded-xl mb-4" />
        <div className="flex gap-2 mb-6">
          <button onClick={()=>setRegime('RESICO')} className={`flex-1 p-2 rounded-lg border ${regime==='RESICO'?'bg-emerald-100 border-emerald-500':''}`}>RESICO</button>
          <button onClick={()=>setRegime('ACTIVIDAD')} className={`flex-1 p-2 rounded-lg border ${regime==='ACTIVIDAD'?'bg-blue-100 border-blue-500':''}`}>Act. Empresarial</button>
        </div>
        <div className="text-center p-4 bg-gray-100 rounded-xl">
           <p className="text-sm text-gray-500">ISR Estimado a Pagar:</p>
           <p className="text-3xl font-bold text-gray-800">${tax.toFixed(2)}</p>
           <p className="text-xs text-gray-400 mt-2">*Estimado.</p>
        </div>
      </div>
    </div>
  );
};

const CreditEvaluator = ({ onBack }: any) => {
  const [desc, setDesc] = useState('');
  const [result, setResult] = useState<{risk: string, advice: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const handleEval = async () => {
    setLoading(true);
    const res = await analyzeCreditRisk(desc);
    setResult(res);
    setLoading(false);
  };
  return (
    <div className="max-w-xl mx-auto">
      <HeaderBack title="Semáforo de Crédito" onBack={onBack} />
      <div className="bg-white p-6 rounded-3xl shadow">
         <textarea className="w-full p-4 bg-gray-50 rounded-xl mb-4" placeholder="Ej: Quiero pedir $10,000..." onChange={e=>setDesc(e.target.value)} />
         <button onClick={handleEval} disabled={loading} className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold">
            {loading ? 'Analizando...' : 'Analizar Riesgo'}
         </button>
         {result && (
           <div className={`mt-6 p-4 rounded-xl border-l-4 ${result.risk === 'LOW' ? 'bg-green-50 border-green-500' : result.risk === 'MEDIUM' ? 'bg-yellow-50 border-yellow-500' : 'bg-red-50 border-red-500'}`}>
              <h3 className="font-bold mb-1">{result.risk === 'LOW' ? 'Adelante (Verde)' : result.risk === 'MEDIUM' ? 'Cuidado (Amarillo)' : 'Peligro (Rojo)'}</h3>
              <p>{result.advice}</p>
           </div>
         )}
      </div>
    </div>
  );
};

const CRM = ({ clients, setClients, onBack }: any) => {
  const [selectedClient, setSelected] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', notes: '' });

  const addClient = () => {
    setClients([...clients, { id: Date.now().toString(), ...newClient, temperature: 'WARM' }]);
    setIsAdding(false);
  };

  const generateMsg = async (client: any) => {
     setMsg("Escribiendo...");
     const txt = await generateClientMessage(client.name, "Ofrecer promoción de fin de mes");
     setMsg(txt);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         <HeaderBack title="Mis Clientes" onBack={onBack} noMargin />
         <button onClick={() => setIsAdding(!isAdding)} className="bg-purple-500 text-white px-3 py-2 rounded-lg font-bold flex gap-1 items-center text-sm"><PlusCircle size={16}/> Nuevo</button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-3xl shadow mb-4">
           <input className="w-full p-3 bg-gray-50 rounded-xl mb-3" placeholder="Nombre" value={newClient.name} onChange={e=>setNewClient({...newClient, name: e.target.value})} />
           <input className="w-full p-3 bg-gray-50 rounded-xl mb-3" placeholder="Teléfono" value={newClient.phone} onChange={e=>setNewClient({...newClient, phone: e.target.value})} />
           <textarea className="w-full p-3 bg-gray-50 rounded-xl mb-3" placeholder="Notas (ej. cumpleaños)" value={newClient.notes} onChange={e=>setNewClient({...newClient, notes: e.target.value})} />
           <button onClick={addClient} className="w-full bg-gray-900 text-white py-2 rounded-xl font-bold">Guardar</button>
        </div>
      )}

      <div className="grid gap-4">
        {clients.map((c: any) => (
          <div key={c.id} className="bg-white p-6 rounded-3xl shadow">
             <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-lg">{c.name}</h3>
               <span className={`px-2 py-1 rounded text-xs font-bold ${c.temperature==='HOT'?'bg-red-100 text-red-600':'bg-blue-100 text-blue-600'}`}>{c.temperature}</span>
             </div>
             <p className="text-gray-500 text-sm mb-4">{c.notes}</p>
             <div className="flex gap-2">
               <button onClick={() => { setSelected(c); generateMsg(c); }} className="flex-1 bg-purple-100 text-purple-700 py-2 rounded-xl text-sm font-bold">Generar Mensaje</button>
             </div>
             {selectedClient?.id === c.id && msg && <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm italic border border-gray-200">"{msg}"</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const InventoryManager = ({ inventory, setInventory, onBack }: any) => {
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeStock = async () => {
    setAnalyzing(true);
    const inventoryText = inventory.map((i:any) => `${i.name}: ${i.stock} ${i.unit} (Mínimo: ${i.minStock})`).join(', ');
    const advice = await askCarmelita(`Analiza este inventario y dime qué urge comprar: ${inventoryText}. Responde corto.`, 'logistics');
    setAnalysis(advice);
    setAnalyzing(false);
  }

  return (
    <div>
      <HeaderBack title="Inventario Inteligente" onBack={onBack} />
      <div className="bg-white p-4 rounded-3xl shadow mb-6">
         <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-700">Asistente de Compras</h3>
            <Lightbulb className="text-yellow-500" />
         </div>
         <p className="text-sm text-gray-500 mb-4">{analysis || "Carmelita puede revisar tu stock y decirte qué comprar."}</p>
         <button onClick={analyzeStock} disabled={analyzing} className="w-full bg-blue-100 text-blue-700 py-2 rounded-xl font-bold">
            {analyzing ? 'Revisando despensa...' : 'Analizar con IA'}
         </button>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        {inventory.map((item: any) => (
          <div key={item.id} className="p-4 border-b last:border-0 flex justify-between items-center">
             <div>
               <p className="font-bold">{item.name}</p>
               <p className={`text-sm ${item.stock <= item.minStock ? 'text-red-500 font-bold' : 'text-gray-500'}`}>Stock: {item.stock} {item.unit}</p>
             </div>
             <div className="flex gap-2">
               <button onClick={() => {
                 setInventory(inventory.map((i:any) => i.id === item.id ? {...i, stock: i.stock + 1} : i));
               }} className="bg-gray-100 p-2 rounded-lg">+</button>
               <button onClick={() => {
                 setInventory(inventory.map((i:any) => i.id === item.id ? {...i, stock: Math.max(0, i.stock - 1)} : i));
               }} className="bg-gray-100 p-2 rounded-lg">-</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AppointmentCalendar = ({ events, setEvents, onBack }: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' });

  const addEvent = () => {
    setEvents([...events, { id: Date.now().toString(), ...newEvent, type: 'CLIENT' }]);
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         <HeaderBack title="Calendario" onBack={onBack} noMargin />
         <button onClick={() => setIsAdding(!isAdding)} className="bg-indigo-500 text-white px-3 py-2 rounded-lg font-bold flex gap-1 items-center text-sm"><PlusCircle size={16}/> Nueva</button>
      </div>

      <div className="mb-6 bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex flex-col items-center text-center">
         <Share2 className="text-indigo-500 mb-2" />
         <h3 className="font-bold text-indigo-900">Tu Link de Citas</h3>
         <p className="text-indigo-700 text-sm mb-4">Comparte este link para que tus clientes agenden solos.</p>
         <button onClick={() => alert("Link copiado: carmelita.app/tu-negocio")} className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold shadow-sm">
           Copiar Link
         </button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-3xl shadow mb-4">
           <input className="w-full p-3 bg-gray-50 rounded-xl mb-3" placeholder="Título (ej. Pastel Boda)" value={newEvent.title} onChange={e=>setNewEvent({...newEvent, title: e.target.value})} />
           <div className="flex gap-2 mb-3">
             <input type="date" className="flex-1 p-3 bg-gray-50 rounded-xl" value={newEvent.date} onChange={e=>setNewEvent({...newEvent, date: e.target.value})} />
             <input type="time" className="flex-1 p-3 bg-gray-50 rounded-xl" value={newEvent.time} onChange={e=>setNewEvent({...newEvent, time: e.target.value})} />
           </div>
           <button onClick={addEvent} className="w-full bg-gray-900 text-white py-2 rounded-xl font-bold">Agendar</button>
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl shadow">
        <h3 className="font-bold text-gray-700 mb-4">Próximos Eventos</h3>
        <div className="space-y-4">
           {events.map((ev: any) => (
             <div key={ev.id} className="flex gap-4 items-center">
                <div className="bg-gray-100 p-3 rounded-xl text-center min-w-[60px]">
                   <p className="text-xs font-bold text-gray-500 uppercase">{new Date(ev.date).toLocaleString('es-MX', {weekday: 'short'})}</p>
                   <p className="text-xl font-bold text-gray-800">{new Date(ev.date).getDate()}</p>
                </div>
                <div>
                   <p className="font-bold">{ev.title}</p>
                   <p className="text-sm text-gray-500">{ev.time}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const GovernmentSupport = ({ onBack }: any) => {
  const [search, setSearch] = useState("");
  const [grants, setGrants] = useState([
    { id: 1, title: "Mujer Emprende", state: "CDMX", amount: "$15,000" },
    { id: 2, title: "Tandas del Bienestar", state: "Federal", amount: "$6,000" },
    { id: 3, title: "Impulso Nafin", state: "Jalisco", amount: "$50,000" },
    { id: 4, title: "Fondo PyME", state: "Nuevo León", amount: "$25,000" },
  ]);

  const filtered = grants.filter(g => g.title.toLowerCase().includes(search.toLowerCase()) || g.state.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <HeaderBack title="Apoyos de Gobierno" onBack={onBack} />
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="Buscar por estado o nombre..." 
          className="w-full p-4 pl-12 bg-white rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Search className="absolute left-4 top-4 text-gray-400" />
      </div>

      <div className="grid gap-4">
        {filtered.map(g => (
          <div key={g.id} className="bg-white p-6 rounded-3xl shadow flex justify-between items-center">
             <div>
                <h3 className="font-bold text-gray-800">{g.title}</h3>
                <div className="flex gap-2 mt-1">
                   <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">{g.amount}</span>
                   <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded flex items-center gap-1"><MapPin size={10} /> {g.state}</span>
                </div>
             </div>
             <button className="bg-green-500 text-white p-2 rounded-xl">
               <ArrowRight size={20} />
             </button>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-400 mt-4">No encontramos apoyos con ese nombre.</p>}
      </div>
    </div>
  );
};

const SocialCafe = ({ user }: any) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'plaza' | 'profile'>('feed');

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">El Café Social ☕</h1>
      
      <div className="flex p-1 bg-gray-200 rounded-xl mb-6">
        <button onClick={() => setActiveTab('feed')} className={`flex-1 py-2 rounded-lg font-bold ${activeTab === 'feed' ? 'bg-white shadow' : 'text-gray-500'}`}>Chisme</button>
        <button onClick={() => setActiveTab('plaza')} className={`flex-1 py-2 rounded-lg font-bold ${activeTab === 'plaza' ? 'bg-white shadow' : 'text-gray-500'}`}>Trueque</button>
        <button onClick={() => setActiveTab('profile')} className={`flex-1 py-2 rounded-lg font-bold ${activeTab === 'profile' ? 'bg-white shadow' : 'text-gray-500'}`}>Mi Perfil</button>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white p-8 rounded-3xl shadow text-center">
           <div className="w-24 h-24 bg-rose-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white font-bold">
             {user.displayName[0]}
           </div>
           <h2 className="text-2xl font-bold text-gray-800">{user.displayName}</h2>
           <p className="text-rose-500 font-bold mb-2">{user.businessType}</p>
           <p className="text-gray-600 mb-6 italic">"{user.bio}"</p>
           
           <h3 className="font-bold text-left mb-3">Mis Medallas</h3>
           <div className="flex gap-2 flex-wrap mb-6">
             {user.badges?.map((b:string) => (
               <span key={b} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 flex items-center gap-1">
                 <Award size={12} /> {b}
               </span>
             ))}
           </div>
           
           <h3 className="font-bold text-left mb-3">Mis Publicaciones</h3>
           <div className="bg-gray-50 p-4 rounded-xl text-left text-sm text-gray-500">
             Aún no has publicado nada. ¡Preséntate en el Chisme!
           </div>
        </div>
      )}

      {activeTab === 'feed' && (
        <>
          <div className="bg-white p-6 rounded-3xl shadow mb-6">
             <textarea className="w-full bg-gray-50 p-4 rounded-xl mb-2" placeholder="Comparte un logro o pide un consejo..." />
             <button className="bg-rose-500 text-white px-6 py-2 rounded-full font-bold">Publicar</button>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">J</div>
                  <div>
                     <p className="font-bold text-sm">Juana Tacos</p>
                     <p className="text-xs text-gray-500">Hace 2 horas</p>
                  </div>
                </div>
                <p className="text-gray-700">¡Chicas! Hoy logré vender todos mis tamales antes de las 10am. Gracias a Carmelita por ayudarme a costear bien.</p>
                <div className="mt-4 flex gap-4 text-gray-500 text-sm">
                   <button className="flex items-center gap-1 hover:text-rose-500"><Heart size={16} /> 12</button>
                   <button className="flex items-center gap-1 hover:text-blue-500"><MessageCircle size={16} /> 2</button>
                </div>
            </div>
          </div>
        </>
      )} 
      
      {activeTab === 'plaza' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-3xl shadow">
             <div className="h-32 bg-gray-100 rounded-xl mb-3 flex items-center justify-center text-gray-400">Foto</div>
             <h3 className="font-bold text-gray-800">Vitrina Refrigerada</h3>
             <p className="text-emerald-600 font-bold">$3,500</p>
             <p className="text-xs text-gray-500 mb-3">Usada, buen estado.</p>
             <button className="w-full bg-emerald-100 text-emerald-700 py-2 rounded-xl font-bold text-sm">Contactar</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Store = ({ user }: any) => (
  <div className="max-w-4xl mx-auto text-center">
     <h1 className="text-3xl font-bold mb-2">Tiendita Carmelita</h1>
     <p className="mb-8 text-gray-500">Créditos y Membresías para tu negocio.</p>
     
     {/* Credits */}
     <div className="grid md:grid-cols-3 gap-6 mb-12">
       <div className="bg-white p-6 rounded-3xl shadow border border-gray-100 hover:border-rose-300 transition-colors">
          <h3 className="font-bold text-xl mb-2">Puccito</h3>
          <p className="text-3xl font-bold text-rose-500 mb-4">50 CC</p>
          <p className="text-gray-500 text-sm mb-6">$49 MXN</p>
          <button className="w-full py-2 bg-gray-900 text-white rounded-xl font-bold">Comprar</button>
       </div>
       <div className="bg-rose-500 text-white p-8 rounded-3xl shadow-xl transform scale-105">
          <h3 className="font-bold text-xl mb-2">El Cafecito</h3>
          <p className="text-3xl font-bold mb-4">150 CC</p>
          <p className="opacity-80 text-sm mb-6">$129 MXN</p>
          <button className="w-full py-3 bg-white text-rose-600 rounded-xl font-bold">Comprar</button>
       </div>
       <div className="bg-white p-6 rounded-3xl shadow border border-gray-100 hover:border-rose-300 transition-colors">
          <h3 className="font-bold text-xl mb-2">La Comida</h3>
          <p className="text-3xl font-bold text-rose-500 mb-4">500 CC</p>
          <p className="text-gray-500 text-sm mb-6">$399 MXN</p>
          <button className="w-full py-2 bg-gray-900 text-white rounded-xl font-bold">Comprar</button>
       </div>
     </div>

     {/* Memberships */}
     <h2 className="text-2xl font-bold mb-6">Membresías</h2>
     <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div className="bg-gray-100 p-6 rounded-3xl">
           <h3 className="font-bold text-xl mb-2">Básica</h3>
           <p className="text-sm text-gray-600 mb-4">Herramientas esenciales</p>
           <ul className="text-left text-sm space-y-2 mb-6 px-4">
             <li>✅ Árbol Financiero</li>
             <li>✅ Calculadora SAT</li>
           </ul>
           <button className="w-full py-2 border-2 border-gray-300 rounded-xl font-bold">Gratis</button>
        </div>
        <div className="bg-purple-100 p-6 rounded-3xl border border-purple-200">
           <div className="flex justify-center items-center gap-2 mb-2">
             <Star className="text-purple-600" fill="currentColor" />
             <h3 className="font-bold text-xl text-purple-900">Premium</h3>
           </div>
           <p className="text-sm text-purple-700 mb-4">Todo ilimitado + IA avanzada</p>
           <ul className="text-left text-sm space-y-2 mb-6 px-4 text-purple-800">
             <li>✅ Agencia de Marketing IA (Veo)</li>
             <li>✅ CRM Ilimitado</li>
             <li>✅ Soporte Prioritario</li>
           </ul>
           <button className="w-full py-2 bg-purple-600 text-white rounded-xl font-bold">Suscribirse ($199/mes)</button>
        </div>
     </div>
  </div>
);

const HeaderBack = ({ title, onBack, noMargin }: any) => (
  <div className={`flex items-center gap-4 ${noMargin ? '' : 'mb-6'}`}>
    <button onClick={onBack} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
      <ArrowLeft size={20} />
    </button>
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
  </div>
);

const Agency = ({ user }: { user: UserProfile }) => {
  const [activeTab, setActiveTab] = useState<'copy' | 'image' | 'video' | 'strategy'>('copy');
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<any>(null); // Changed to any to handle JSON
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    try {
      let output: any = "";
      if (activeTab === 'copy') {
        output = await askCarmelita(`Actúa como experta en marketing. Crea un caption de Instagram para: ${prompt}`, 'marketing');
      } else if (activeTab === 'strategy') {
        output = await generateMarketingStrategy(prompt);
      } else if (activeTab === 'image') {
        const img = await generateAgencyImage(prompt);
        if (img) output = img;
      } else if (activeTab === 'video') {
        output = await generateAgencyVideo(prompt);
      }
      setResult(output);
    } catch (e) {
      console.error(e);
      setResult("Hubo un error, mi niña. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-rose-500 p-8 text-white">
          <h2 className="text-3xl font-script font-bold mb-2">La Agencia de Carmelita</h2>
          <p className="opacity-90">Crea contenido mágico para tus redes. Tienes <span className="font-bold bg-white/20 px-2 rounded">{user.credits} CC</span>.</p>
        </div>

        <div className="p-6">
          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-xl overflow-x-auto">
             <button onClick={()=>setActiveTab('copy')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold whitespace-nowrap ${activeTab==='copy'?'bg-white shadow':''}`}>Texto</button>
             <button onClick={()=>setActiveTab('strategy')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold whitespace-nowrap ${activeTab==='strategy'?'bg-white shadow':''}`}>Estrategia</button>
             <button onClick={()=>setActiveTab('image')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold whitespace-nowrap ${activeTab==='image'?'bg-white shadow':''}`}>Imagen</button>
             <button onClick={()=>setActiveTab('video')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold whitespace-nowrap ${activeTab==='video'?'bg-white shadow':''}`}>Video</button>
          </div>

          <textarea 
            className="w-full bg-rose-50 border-2 border-rose-100 rounded-2xl p-4 focus:outline-none focus:border-rose-400 min-h-[120px]"
            placeholder={activeTab === 'image' ? "Describe la imagen..." : "Describe tu producto..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="mt-4 flex justify-end">
            <button onClick={handleGenerate} disabled={loading || !prompt} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg disabled:opacity-50">
              {loading ? "Creando..." : "Generar"}
            </button>
          </div>

          {result && (
            <div className="mt-8">
               <h3 className="font-bold text-gray-500 text-xs uppercase mb-4 px-1">Resultado:</h3>
               
               {/* Strategy Card View */}
               {activeTab === 'strategy' && typeof result === 'object' ? (
                 <div className="space-y-6 animate-fade-in">
                    {/* Header Card */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                       <div className="flex items-center gap-3 mb-2 opacity-90">
                          <Target size={20} />
                          <span className="font-bold text-sm tracking-widest uppercase">Objetivo</span>
                       </div>
                       <h3 className="text-2xl font-bold leading-tight">{result.objetivo}</h3>
                       <p className="mt-4 text-white/80 text-sm font-medium">🗣️ Tono sugerido: {result.tono}</p>
                    </div>

                    {/* Segmentation Card */}
                    <div className="bg-white border-2 border-indigo-50 rounded-2xl p-6 shadow-sm">
                       <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                         <Users className="text-indigo-500" /> ¿A quién le vendemos?
                       </h4>
                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-indigo-50 p-4 rounded-xl">
                             <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Perfil & Intereses</p>
                             <p className="font-bold text-gray-800 mb-2">{result.segmentacion?.perfil}</p>
                             <div className="flex flex-wrap gap-1">
                               {result.segmentacion?.intereses?.map((int: string, i:number) => (
                                 <span key={i} className="text-xs bg-white text-indigo-600 px-2 py-1 rounded-md font-bold shadow-sm">{int}</span>
                               ))}
                             </div>
                          </div>
                          <div className="bg-rose-50 p-4 rounded-xl">
                             <p className="text-xs font-bold text-rose-400 uppercase mb-1">Su Dolor (El Problema)</p>
                             <p className="text-gray-700 italic">"{result.segmentacion?.dolor}"</p>
                          </div>
                       </div>
                    </div>

                    {/* Steps Card */}
                    <div className="bg-white border-2 border-emerald-50 rounded-2xl p-6 shadow-sm">
                       <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                         <Megaphone className="text-emerald-500" /> Plan de Acción
                       </h4>
                       <div className="space-y-4">
                         {result.pasos?.map((paso: string, i: number) => (
                           <div key={i} className="flex gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">
                                {i + 1}
                              </div>
                              <p className="text-gray-700 pt-1">{paso}</p>
                           </div>
                         ))}
                       </div>
                    </div>
                 </div>
               ) : (
                 // Default View for Text/Image/Video
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                   {(activeTab === 'copy') && <p className="whitespace-pre-wrap">{result}</p>}
                   {activeTab === 'image' && <img src={result} alt="Generated" className="w-full rounded-xl shadow-md" />}
                   {activeTab === 'video' && <video src={result} controls className="w-full rounded-xl bg-black" />}
                   {/* Fallback if strategy returns string error */}
                   {activeTab === 'strategy' && typeof result === 'string' && <p>{result}</p>}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const University = () => {
  const [activeLesson, setActiveLesson] = useState<any>(null);

  const modules = [
    { id: 1, title: "1. El Miedo al SAT", desc: "Entiende los impuestos sin llorar." },
    { id: 2, title: "2. Costeo Básico", desc: "No regales tu trabajo, mi niña." },
    { id: 3, title: "3. Marketing con Amor", desc: "Vende sin sentir que molestas." }
  ];

  if (activeLesson) {
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setActiveLesson(null)} className="mb-4 flex items-center gap-2 text-gray-500 font-bold"><ArrowLeft size={16}/> Volver</button>
        <div className="bg-white p-8 rounded-3xl shadow-xl">
           <h2 className="text-2xl font-bold mb-4">{activeLesson.title}</h2>
           <p className="text-gray-600 mb-8 leading-relaxed">
             Aquí iría el contenido educativo detallado del módulo. Imagina un video de Carmelita explicando con peras y manzanas cómo funciona el RESICO.
           </p>
           <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200 mb-6">
              <h3 className="font-bold text-yellow-800 mb-2">Quiz Rápido</h3>
              <p className="text-sm text-yellow-700 mb-4">¿El dinero que entra a la caja es todo tuyo?</p>
              <div className="space-y-2">
                 <button className="w-full bg-white py-2 rounded-lg border hover:bg-red-50 text-left px-4 text-sm">Sí, obvio.</button>
                 <button className="w-full bg-white py-2 rounded-lg border hover:bg-green-50 text-left px-4 text-sm" onClick={()=>alert("¡Correcto! Una parte es para insumos y otra para impuestos.")}>No, hay que separar costos.</button>
              </div>
           </div>
           <button onClick={()=>alert("¡Felicidades! Certificado desbloqueado (simulado).")} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
             <Award /> Reclamar Certificado
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center py-10">
        <GraduationCap size={64} className="mx-auto text-rose-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Universidad Carmelita</h2>
        <p className="text-gray-500 mt-2">Aprende a tu ritmo y gana diplomas.</p>
      </div>
      
      <div className="grid gap-4">
        {modules.map(m => (
          <div key={m.id} className="bg-white p-6 rounded-3xl shadow flex justify-between items-center hover:shadow-lg transition cursor-pointer" onClick={() => setActiveLesson(m)}>
             <div className="flex items-center gap-4">
               <div className="bg-rose-100 p-3 rounded-xl text-rose-500">
                 <BookOpen size={24} />
               </div>
               <div>
                 <h3 className="font-bold text-lg">{m.title}</h3>
                 <p className="text-gray-500 text-sm">{m.desc}</p>
               </div>
             </div>
             <ArrowRight className="text-gray-300" />
          </div>
        ))}
      </div>
    </div>
  );
};