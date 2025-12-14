import React from 'react';
import { ArrowRight, Heart, TrendingUp, Users, ShieldCheck, Lock } from 'lucide-react';

interface Props {
  onLogin: () => void;
  onRegister: () => void;
  onAdminLogin: () => void;
  onAffiliate: () => void;
}

export default function LandingPage({ onLogin, onRegister, onAdminLogin, onAffiliate }: Props) {
  return (
    <div className="min-h-screen bg-rose-50 font-sans text-gray-800">
      {/* Hero */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-3xl font-script text-rose-600 font-bold">Carmelita</h1>
        <div className="flex items-center gap-4">
          <button onClick={onAffiliate} className="hidden md:block text-rose-600 hover:text-rose-700 font-bold text-sm">
            Programa de Afiliadas
          </button>
          
          {/* Admin Login Button - Prominent */}
          <button onClick={onAdminLogin} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm border border-gray-300 px-4 py-2 rounded-full hover:bg-white transition-colors">
            <Lock size={14} /> Modo Admin
          </button>

          <button onClick={onLogin} className="bg-white hover:bg-gray-50 text-rose-600 px-6 py-2 rounded-full shadow-sm border border-rose-100 transition font-bold">
            Entrar
          </button>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-6 py-16 text-center lg:text-left flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <span className="inline-block bg-rose-100 text-rose-600 px-4 py-1 rounded-full text-sm font-bold mb-4 animate-bounce">
            ✨ Tu amiga experta en finanzas ✨
          </span>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Haz crecer tu negocio <br/>
            <span className="text-rose-500 font-script">sin perder la paz</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Carmelita organiza tus cuentas, crea tu marketing mágico y te enseña a cobrar lo justo. Todo con la claridad y confianza que necesitas, amiga.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button onClick={onRegister} className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8 py-4 rounded-3xl shadow-xl flex items-center justify-center transition transform hover:scale-105 font-bold">
              Comenzar Gratis <ArrowRight className="ml-2" />
            </button>
            <button onClick={onAffiliate} className="bg-white text-rose-500 border-2 border-rose-100 hover:border-rose-300 text-lg px-8 py-4 rounded-3xl flex items-center justify-center font-bold">
              Quiero ser Embajadora
            </button>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative perspective-1000">
           <div className="bg-white p-8 rounded-[3rem] shadow-2xl relative z-10 border-4 border-rose-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg border-2 border-white">C</div>
                <div className="ml-4">
                  <p className="font-bold text-gray-900 text-lg">Carmelita</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> En línea ahora</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg italic leading-relaxed">
                "¡Hola! Vi que vendiste muy bien esta semana. ¡Felicidades! 🎉 
                Ya separé el 10% para tus impuestos y otro 10% para ese horno nuevo que quieres. ¿Vemos cómo va tu ganancia real?"
              </p>
           </div>
           {/* Decorative blobs */}
           <div className="absolute top-0 right-0 -mr-10 -mt-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
           <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 bg-white rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl font-bold mb-12 text-gray-800">Todo lo que necesitas para brillar</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-8 bg-rose-50 rounded-[2rem] hover:bg-rose-100 transition-colors cursor-pointer group">
               <div className="w-20 h-20 bg-white text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                 <TrendingUp size={40} />
               </div>
               <h3 className="text-2xl font-bold mb-3 text-rose-900">Finanzas Sanas</h3>
               <p className="text-rose-700 leading-relaxed">Tu dinero visualizado como un árbol. Raíces fuertes (ahorro) y frutos jugosos (ingresos).</p>
            </div>
            <div className="text-center p-8 bg-purple-50 rounded-[2rem] hover:bg-purple-100 transition-colors cursor-pointer group">
               <div className="w-20 h-20 bg-white text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                 <Users size={40} />
               </div>
               <h3 className="text-2xl font-bold mb-3 text-purple-900">Comunidad</h3>
               <p className="text-purple-700 leading-relaxed">Intercambia productos en "La Plaza" y aprende en la Universidad con otras emprendedoras.</p>
            </div>
            <div className="text-center p-8 bg-emerald-50 rounded-[2rem] hover:bg-emerald-100 transition-colors cursor-pointer group">
               <div className="w-20 h-20 bg-white text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                 <Heart size={40} />
               </div>
               <h3 className="text-2xl font-bold mb-3 text-emerald-900">Agencia IA</h3>
               <p className="text-emerald-700 leading-relaxed">Carmelita diseña tus posts, escribe tus mensajes y crea videos para tus redes.</p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-900 text-white py-12 text-center">
        <h3 className="font-script text-3xl text-rose-400 mb-4">Carmelita</h3>
        <p className="opacity-50 text-sm mb-6">Hecho con mucho amor en México 🇲🇽</p>
        <div className="flex justify-center items-center gap-6 text-sm font-bold">
           <button className="hover:text-rose-400 transition-colors">Términos</button>
           <button className="hover:text-rose-400 transition-colors">Privacidad</button>
           <button onClick={onAffiliate} className="text-emerald-400 hover:text-emerald-300 transition-colors">Embajadoras</button>
        </div>
      </footer>
    </div>
  );
}