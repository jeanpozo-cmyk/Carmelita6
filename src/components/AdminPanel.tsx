import React, { useState } from 'react';
import { UserRole, CourseModule } from '../types';
import { 
  LayoutDashboard, BookOpen, Bell, MessageSquare, Users, 
  PlusCircle, Trash2, Calendar, Send, CheckCircle, DollarSign, Search, Filter, Award
} from 'lucide-react';

interface Props {
  role: UserRole;
  onBack: () => void;
}

export default function AdminPanel({ role, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'comms' | 'affiliates' | 'support'>('dashboard');

  // Security Check
  if (role !== 'SUPERADMIN') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
         <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
           <Lock size={32} />
         </div>
         <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Restringido</h1>
         <p className="text-gray-500 mb-6">Esta zona es solo para la Tía Suprema (Administradoras).</p>
         <button onClick={onBack} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition">
           Volver al Inicio
         </button>
      </div>
    );
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'courses': return <CourseManager />;
      case 'comms': return <CommunicationsManager />;
      case 'affiliates': return <AffiliateManager />;
      case 'support': return <SupportManager />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex-shrink-0 flex flex-col z-10">
        <div className="p-8 border-b border-gray-100">
           <h1 className="text-3xl font-script text-rose-600 font-bold">Tía Suprema</h1>
           <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mt-1">Panel de Control</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
           <AdminNavBtn icon={<LayoutDashboard size={20}/>} label="Resumen" active={activeTab==='dashboard'} onClick={()=>setActiveTab('dashboard')} />
           <AdminNavBtn icon={<BookOpen size={20}/>} label="Universidad" active={activeTab==='courses'} onClick={()=>setActiveTab('courses')} />
           <AdminNavBtn icon={<Users size={20}/>} label="Afiliadas" active={activeTab==='affiliates'} onClick={()=>setActiveTab('affiliates')} />
           <AdminNavBtn icon={<Bell size={20}/>} label="Comunicación" active={activeTab==='comms'} onClick={()=>setActiveTab('comms')} />
           <AdminNavBtn icon={<MessageSquare size={20}/>} label="Soporte" active={activeTab==='support'} onClick={()=>setActiveTab('support')} />
        </nav>
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3 mb-4 px-4">
             <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">TS</div>
             <div className="overflow-hidden">
               <p className="text-sm font-bold text-gray-800 truncate">Admin Principal</p>
               <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online</p>
             </div>
          </div>
          <button onClick={onBack} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-bold transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto animate-fade-in">
           {renderContent()}
        </div>
      </main>
    </div>
  );
}

const AdminNavBtn = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-rose-500 text-white shadow-lg translate-x-1' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </button>
);

// --- SECTIONS ---

const AdminDashboard = () => (
  <div>
    <header className="mb-8">
      <h2 className="text-3xl font-bold text-gray-800">Buenos días, Jefa.</h2>
      <p className="text-gray-500">Aquí está el reporte de hoy.</p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Usuarios Totales" value="1,248" color="border-rose-500" icon={<Users className="text-rose-500 mb-2" />} />
        <StatCard title="Ingresos del Mes" value="$45,200" color="border-emerald-500" icon={<DollarSign className="text-emerald-500 mb-2" />} />
        <StatCard title="Afiliadas Activas" value="34" color="border-purple-500" icon={<Users className="text-purple-500 mb-2" />} />
        <StatCard title="Tickets Abiertos" value="12" color="border-amber-500" icon={<MessageSquare className="text-amber-500 mb-2" />} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-800">Actividad Reciente</h3>
          <button className="text-sm text-rose-500 font-bold hover:underline">Ver todo</button>
        </div>
        <div className="space-y-4">
          <ActivityRow user="Ana María" action="Compró Paquete Puccito" time="Hace 5 min" type="sale" />
          <ActivityRow user="Juana Tacos" action="Generó video con Veo" time="Hace 12 min" type="usage" />
          <ActivityRow user="Lupita Cakes" action="Completó módulo SAT" time="Hace 1 hora" type="learning" />
          <ActivityRow user="Sra. Vlog" action="Nueva afiliada registrada" time="Hace 2 horas" type="affiliate" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-rose-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
         <h3 className="font-bold text-xl mb-4">Carmelita AI Status</h3>
         <div className="space-y-4">
           <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
              <span>Gemini 2.5 Flash</span>
              <span className="bg-green-400 text-green-900 text-xs px-2 py-1 rounded font-bold">OPERATIVO</span>
           </div>
           <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
              <span>Veo Video Gen</span>
              <span className="bg-green-400 text-green-900 text-xs px-2 py-1 rounded font-bold">OPERATIVO</span>
           </div>
           <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm opacity-80 mb-2">Créditos consumidos hoy:</p>
              <p className="text-3xl font-bold">45,201 Tokens</p>
           </div>
         </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, color, icon }: any) => (
  <div className={`bg-white p-6 rounded-3xl shadow-sm border-l-[6px] ${color} hover:shadow-md transition-shadow`}>
    {icon}
    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-bold mt-1 text-gray-800">{value}</p>
  </div>
);

const ActivityRow = ({ user, action, time, type }: any) => {
  const colors: any = { sale: 'bg-green-100 text-green-600', usage: 'bg-blue-100 text-blue-600', learning: 'bg-yellow-100 text-yellow-600', affiliate: 'bg-purple-100 text-purple-600' };
  return (
    <div className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded-lg transition-colors">
       <div className="flex items-center gap-3">
         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${colors[type]}`}>
            {user[0]}
         </div>
         <div>
           <p className="font-bold text-gray-800 text-sm">{user}</p>
           <p className="text-gray-500 text-xs">{action}</p>
         </div>
       </div>
       <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{time}</span>
    </div>
  );
};

const CourseManager = () => {
  const [courses, setCourses] = useState<CourseModule[]>([
    { id: '1', title: '1. El Miedo al SAT', desc: 'Entiende los impuestos sin llorar.', content: '...', quizQuestion: '¿El SAT es tu enemigo?', quizAnswer: 'No, es tu socio (a la fuerza).' }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', desc: '', quizQ: '', quizA: '' });

  const handleAdd = () => {
    if(!newCourse.title) return;
    setCourses([...courses, { 
      id: Date.now().toString(), 
      title: newCourse.title, 
      desc: newCourse.desc, 
      content: 'Contenido del curso...',
      quizQuestion: newCourse.quizQ,
      quizAnswer: newCourse.quizA
    }]);
    setIsAdding(false);
    setNewCourse({ title: '', desc: '', quizQ: '', quizA: '' });
  };

  const handleDelete = (id: string) => {
    if(window.confirm("¿Seguro que quieres borrar este curso?")) {
      setCourses(courses.filter(c => c.id !== id));
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Universidad Carmelita</h2>
          <p className="text-gray-500 text-sm">Gestiona el contenido educativo.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105">
          <PlusCircle size={20} /> Crear Curso
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-3xl shadow-lg mb-8 border border-emerald-100 animate-slide-down relative">
          <button onClick={()=>setIsAdding(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><Trash2 size={20}/></button>
          <h3 className="font-bold text-xl mb-6 text-gray-800">Nuevo Módulo Educativo</h3>
          <div className="grid gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Título del Curso</label>
              <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ej: Finanzas para no contadores" value={newCourse.title} onChange={e=>setNewCourse({...newCourse, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Descripción Corta</label>
              <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="De qué trata..." value={newCourse.desc} onChange={e=>setNewCourse({...newCourse, desc: e.target.value})} />
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
               <h4 className="font-bold text-sm text-yellow-800 mb-3 flex items-center gap-2"><Award size={16}/> Configuración del Quiz</h4>
               <div className="grid md:grid-cols-2 gap-4">
                 <input className="w-full p-3 bg-white rounded-xl text-sm" placeholder="Pregunta del Quiz" value={newCourse.quizQ} onChange={e=>setNewCourse({...newCourse, quizQ: e.target.value})} />
                 <input className="w-full p-3 bg-white rounded-xl text-sm" placeholder="Respuesta Correcta" value={newCourse.quizA} onChange={e=>setNewCourse({...newCourse, quizA: e.target.value})} />
               </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={()=>setIsAdding(false)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition">Cancelar</button>
            <button onClick={handleAdd} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg">Publicar Módulo</button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {courses.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group border border-gray-100">
             <div className="flex items-center gap-5">
               <div className="bg-rose-100 text-rose-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                 <BookOpen size={24} />
               </div>
               <div>
                 <h4 className="font-bold text-lg text-gray-800">{c.title}</h4>
                 <p className="text-sm text-gray-500 mb-1">{c.desc}</p>
                 {c.quizQuestion && (
                   <span className="inline-flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                     <Award size={10} /> Con Quiz
                   </span>
                 )}
               </div>
             </div>
             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><PlusCircle size={18} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
             </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
            <p>No hay cursos creados aún.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AffiliateManager = () => {
  const [affiliates, setAffiliates] = useState([
    { id: 1, name: "Maria Influencer", referrals: 45, pendingPayout: 4500, status: 'PENDING' },
    { id: 2, name: "Sra. Vlog", referrals: 12, pendingPayout: 1200, status: 'PENDING' },
    { id: 3, name: "Tiktok Star", referrals: 80, pendingPayout: 0, status: 'PAID' },
  ]);

  const handlePay = (id: number) => {
    if(window.confirm("¿Confirmar pago realizado?")) {
      setAffiliates(affiliates.map(a => a.id === id ? { ...a, pendingPayout: 0, status: 'PAID' } : a));
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Afiliadas</h2>
            <p className="text-gray-500 text-sm">Embajadoras que traen usuarias.</p>
         </div>
         <div className="bg-white border p-2 rounded-lg flex gap-2">
            <button className="p-2 bg-gray-100 rounded hover:bg-gray-200"><Filter size={18}/></button>
            <button className="p-2 bg-gray-100 rounded hover:bg-gray-200"><Search size={18}/></button>
         </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-5 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Afiliada</th>
              <th className="p-5 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Referidos</th>
              <th className="p-5 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="p-5 text-xs font-extrabold text-gray-500 uppercase tracking-wider text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {affiliates.map(a => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-5 font-bold text-gray-800">{a.name}</td>
                <td className="p-5 text-gray-600">
                  <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full font-bold text-xs">{a.referrals}</span>
                </td>
                <td className="p-5">
                   {a.status === 'PENDING' ? (
                     <span className="text-amber-600 font-bold text-sm bg-amber-100 px-3 py-1 rounded-full flex w-fit items-center gap-1">
                       <DollarSign size={12}/> ${a.pendingPayout} Pendiente
                     </span>
                   ) : (
                     <span className="text-green-600 font-bold text-sm bg-green-100 px-3 py-1 rounded-full flex w-fit items-center gap-1">
                       <CheckCircle size={12}/> Pagado
                     </span>
                   )}
                </td>
                <td className="p-5 text-right">
                  {a.status === 'PENDING' && (
                    <button onClick={() => handlePay(a.id)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 shadow-md transition-transform hover:scale-105">
                      Pagar Ahora
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CommunicationsManager = () => {
  const [msg, setMsg] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const sendPush = () => {
    if(!msg) return;
    setHistory([`Push: "${msg}" enviado a 1,248 usuarias`, ...history]);
    alert("¡Enviado con éxito!");
    setMsg("");
  };

  const publishEvent = () => {
    if(!eventTitle || !eventDate) return;
    setHistory([`Evento: "${eventTitle}" (${eventDate}) agregado a calendarios`, ...history]);
    alert("¡Evento publicado!");
    setEventTitle("");
    setEventDate("");
  };

  return (
    <div className="max-w-5xl grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Notificaciones Push</h2>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <label className="block font-bold text-sm text-gray-600 mb-2">Mensaje Global</label>
             <textarea 
               className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4 h-32 focus:ring-2 focus:ring-rose-500 outline-none" 
               placeholder="Ej: ¡Chicas! Mañana vence el plazo del SAT..."
               value={msg}
               onChange={e => setMsg(e.target.value)}
             ></textarea>
             <button onClick={sendPush} disabled={!msg} className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg disabled:opacity-50 transition">
               <Send size={18} /> Enviar a Todas
             </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Agenda Global</h2>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <label className="block font-bold text-sm text-gray-600 mb-2">Título del Evento</label>
             <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Webinar de Ventas" value={eventTitle} onChange={e=>setEventTitle(e.target.value)} />
             
             <label className="block font-bold text-sm text-gray-600 mb-2">Fecha</label>
             <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 outline-none" value={eventDate} onChange={e=>setEventDate(e.target.value)} />
             
             <button onClick={publishEvent} disabled={!eventTitle || !eventDate} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg disabled:opacity-50 transition">
               <Calendar size={18} /> Publicar en Calendarios
             </button>
          </div>
        </div>
      </div>

      <div>
         <h2 className="text-xl font-bold text-gray-800 mb-6">Historial</h2>
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full max-h-[500px] overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-gray-400 text-sm text-center italic">No hay acciones recientes.</p>
            ) : (
              <ul className="space-y-4">
                {history.map((h, i) => (
                  <li key={i} className="text-sm text-gray-600 pb-3 border-b border-gray-50 last:border-0">
                    <span className="block font-bold text-gray-800 mb-1">Hace un momento</span>
                    {h}
                  </li>
                ))}
              </ul>
            )}
         </div>
      </div>
    </div>
  );
};

const SupportManager = () => (
  <div className="max-w-5xl">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Bandeja de Soporte</h2>
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="p-5 text-xs font-extrabold text-gray-500 uppercase">Usuario</th>
            <th className="p-5 text-xs font-extrabold text-gray-500 uppercase">Problema</th>
            <th className="p-5 text-xs font-extrabold text-gray-500 uppercase">Estado</th>
            <th className="p-5 text-xs font-extrabold text-gray-500 uppercase text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr className="hover:bg-gray-50">
            <td className="p-5 font-bold">María López</td>
            <td className="p-5 text-gray-600">No carga mi árbol financiero</td>
            <td className="p-5"><span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">ABIERTO</span></td>
            <td className="p-5 text-right"><button className="text-blue-600 font-bold hover:underline">Responder</button></td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="p-5 font-bold">Luisa Fernanda</td>
            <td className="p-5 text-gray-600">Error en pago Stripe</td>
            <td className="p-5"><span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold">EN PROCESO</span></td>
            <td className="p-5 text-right"><button className="text-blue-600 font-bold hover:underline">Responder</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);