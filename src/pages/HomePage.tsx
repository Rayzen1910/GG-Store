import React from 'react';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import { motion } from 'motion/react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage, translations } from '../context/LanguageContext.tsx';

const categories = [
  {
    titleKey: 'modern' as keyof typeof translations,
    descKey: 'modernDesc' as keyof typeof translations,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1200&auto=format&fit=crop',
  },
  {
    titleKey: 'minimalist' as keyof typeof translations,
    descKey: 'minimalistDesc' as keyof typeof translations,
    image: 'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?q=80&w=1200&auto=format&fit=crop',
  },
  {
    titleKey: 'gamer' as keyof typeof translations,
    descKey: 'gamerDesc' as keyof typeof translations,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
  }
];

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-brand-red selection:text-brand-dark overflow-x-hidden transition-colors duration-300 relative">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/20 to-bg-primary z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618335829737-2228ad30662e?q=80&w=2000&auto=format&fit=crop)' }}
        />
        
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-red font-mono tracking-widest text-sm uppercase mb-4 block">
              {t('newCollection')}
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black italic tracking-tighter mb-6 leading-tight">
              {t('builtFor')}<br />
              <span className="text-brand-red border-t-2 border-b-2 border-brand-red px-4 text-glow">
                {t('precision')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              {t('heroDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/catalog"
                className="bg-brand-red text-brand-dark px-10 py-5 font-bold rounded-sm flex items-center gap-2 hover:opacity-90 transition-all uppercase tracking-tighter shadow-[0_0_30px_rgba(239,68,68,0.3)]"
              >
                {t('discoverCollection')} <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Marquee */}
      <div className="py-12 border-y border-white/5 bg-black/20 overflow-hidden select-none">
        <motion.div 
          className="flex whitespace-nowrap gap-20"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {Array(10).fill(['RAZER', 'LOGITECH', 'STEELSERIES', 'CORSAIR', 'ASUS ROG', 'MSI']).flat().map((brand, i) => (
            <span key={i} className="text-4xl font-black italic text-white/10 tracking-tighter hover:text-brand-red transition-colors cursor-default uppercase">
              {brand}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Categories / Shop by Style */}
      <section className="py-24 px-6 bg-bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 border-l-4 border-brand-red pl-6">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">
              {t('shopByStyle')}
            </h2>
            <p className="text-gray-400 font-mono mt-2 uppercase tracking-widest text-xs">
              {t('curatedAesthetics')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.titleKey}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-[500px] overflow-hidden rounded-sm cursor-pointer border border-white/5"
              >
                <img 
                  src={cat.image} 
                  alt={t(cat.titleKey)}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-3xl font-black italic tracking-tighter mb-2 uppercase group-hover:text-brand-red transition-colors">
                    {t(cat.titleKey)}
                  </h3>
                  <p className="text-gray-300 text-sm mb-6 max-w-[250px] font-mono leading-tight">
                    {t(cat.descKey)}
                  </p>
                  <div className="h-0.5 w-12 bg-brand-red transition-all duration-300 group-hover:w-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { titleKey: 'zeroLatency' as const, descKey: 'zeroLatencyDesc' as const },
              { titleKey: 'modularDesign' as const, descKey: 'modularDesignDesc' as const },
              { titleKey: 'proTuned' as const, descKey: 'proTunedDesc' as const }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="glass p-10 rounded-sm border-l-4 border-brand-red"
              >
                <h4 className="text-xl font-black italic uppercase mb-4 tracking-tighter">
                  {t(feature.titleKey)}
                </h4>
                <p className="text-gray-400 font-mono text-sm leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-red transform -skew-y-3 origin-left z-0" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <h2 className="text-brand-dark text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-none">
            {t('readyToUpgrade')}
          </h2>
          <Link 
            to="/catalog"
            className="bg-text-primary text-bg-primary px-8 py-5 md:px-16 md:py-6 font-black rounded-sm flex items-center gap-3 hover:opacity-90 transition-all uppercase tracking-tighter shadow-2xl"
          >
            {t('goToShop')} <ChevronRight size={24} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
