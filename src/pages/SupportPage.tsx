import React, { useState } from 'react';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageSquare, Lightbulb, Phone, HelpCircle, ChevronDown, CheckCircle2, Send, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface FaqItem {
  question: { id: string; en: string; zh: string };
  answer: { id: string; en: string; zh: string };
}

export default function SupportPage() {
  const { language } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    message: ''
  });

  const faqs: FaqItem[] = [
    {
      question: {
        id: 'Bagaimana cara melacak pengiriman pesanan saya?',
        en: 'How do I track my order delivery?',
        zh: '我如何追踪我的订单配送？'
      },
      answer: {
        id: 'Anda dapat memantau status pesanan dan nomor resi pengiriman secara real-time langsung melalui tab "Purchase History" di dashboard halaman Akun Anda setelah pembayaran terverifikasi.',
        en: 'You can monitor your order status and delivery tracking number in real-time directly through the "Purchase History" tab on your Account dashboard once your payment is verified.',
        zh: '付款验证成功后，您可以直接通过账户个人中心的 "Purchase History"（购买历史记录）标签页，实时监控订单状态和快递单号。'
      }
    },
    {
      question: {
        id: 'Berapa lama masa berlaku garansi produk GG Store?',
        en: 'How long is the warranty period for GG Store products?',
        zh: 'GG Store 产品的保修期是多久？'
      },
      answer: {
        id: 'Seluruh produk hardware utama (keyboard, mouse, headset) dilindungi oleh Garansi Resmi Servis & Sparepart selama 2 Tahun penuh sejak tanggal pembelian untuk menjamin keandalan persenjataan Anda.',
        en: 'All major hardware products (keyboards, mice, headsets) are protected by a comprehensive 2-Year Official Service & Spare Parts Warranty from the date of purchase to ensure your gear reliability.',
        zh: '所有核心电竞硬件产品（键盘、鼠标、耳机）自购买之日起，均享有为期 2 年的官方整机及零部件保修服务，保障您的战斗装备始终处于巅峰状态。'
      }
    },
    {
      question: {
        id: 'Apakah transaksi pembayaran via Midtrans aman?',
        en: 'Is the payment transaction via Midtrans secure?',
        zh: '通过 Midtrans 进行的支付交易安全吗？'
      },
      answer: {
        id: 'Sangat aman. GG Store terintegrasi dengan Midtrans Sandbox & Production yang menggunakan teknologi enkripsi SSL perbankan 256-bit dan deteksi fraud AI tercanggih untuk mengamankan data pembayaran Anda.',
        en: 'Extremely secure. GG Store integrates with Midtrans Sandbox & Production which employs bank-grade 256-bit SSL encryption and state-of-the-art AI fraud detection to safeguard your payment details.',
        zh: '绝对安全。GG Store 集成了 Midtrans 支付网关，该网关采用银行级 256 位 SSL 加密协议和最先进的 AI 欺诈防范检测系统，确保您的付款数据万无一失。'
      }
    },
    {
      question: {
        id: 'Bagaimana kebijakan retur jika barang mengalami kerusakan?',
        en: 'What is the return policy if the product is damaged?',
        zh: '如果收到商品有损坏，退换货政策是怎样的？'
      },
      answer: {
        id: 'Kami menawarkan kebijakan 30 Hari Tukar Baru. Jika Anda menerima barang cacat pabrik atau rusak saat transit, hubungi kami untuk mendapatkan kurir penjemputan gratis dan penggantian unit baru tanpa biaya tambahan.',
        en: 'We offer a 30-Day Zero-Hassle Replacement Policy. If you receive a product with manufacturing defects or shipping damage, contact us for a free return pickup and a brand-new swap at no cost.',
        zh: '我们提供 30 天无忧退换货服务。如果您收到具有出厂缺陷或物流运输损坏的产品，请联系我们，我们将安排快递免费上门取件，并为您免费更换全新产品。'
      }
    }
  ];

  const categories = {
    id: [
      { value: 'hardware', label: 'Saran Produk & Hardware Baru' },
      { value: 'website', label: 'Saran Peningkatan Website' },
      { value: 'service', label: 'Masukan Kualitas Pelayanan' },
      { value: 'other', label: 'Saran & Kritik Lainnya' }
    ],
    en: [
      { value: 'hardware', label: 'New Gear & Product Requests' },
      { value: 'website', label: 'Website & System Enhancements' },
      { value: 'service', label: 'Customer Service Feedback' },
      { value: 'other', label: 'Other Suggestions' }
    ],
    zh: [
      { value: 'hardware', label: '新装备与硬件产品提议' },
      { value: 'website', label: '网站与系统功能改进建议' },
      { value: 'service', label: '客户服务反馈与评价' },
      { value: 'other', label: '其他意见与建议' }
    ]
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    const subject = encodeURIComponent(`Saran GG Store dari ${formData.name}`);
    const body = encodeURIComponent(
      `Nama: ${formData.name}\n` +
      `Email Pengirim: ${formData.email}\n` +
      `Kategori: ${formData.category}\n\n` +
      `Pesan Saran:\n${formData.message}`
    );
    
    // Secara otomatis membuka aplikasi email pengguna (seperti Gmail/Outlook) dengan pesan yang sudah terisi
    window.location.href = `mailto:atar.muhasibi@gmail.com?subject=${subject}&body=${body}`;
    
    // Tampilkan pesan sukses di website
    setFormSubmitted(true);
  };

  const currentCats = categories[language as 'en' | 'id' | 'zh'] || categories.en;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        {/* Title Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[10px] font-mono font-bold tracking-widest bg-brand-red/10 border border-brand-red/30 px-3 py-1 text-brand-red uppercase mb-4"
          >
            {language === 'id' ? 'Pusat Bantuan GG' : language === 'zh' ? 'GG 客户支持中心' : 'GG Support Hub'}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black uppercase tracking-tighter italic mb-4"
          >
            {language === 'id' ? 'KAMI SIAP MEMBANTU ANDA' : language === 'zh' ? '为您提供专业电竞支持' : 'WE HAVE YOUR BACK'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-400 max-w-xl mx-auto font-medium"
          >
            {language === 'id' 
              ? 'Butuh bantuan dengan senjata gaming Anda? Hubungi spesialis kami atau jelajahi FAQ di bawah ini.' 
              : language === 'zh'
              ? '您的电竞装备需要协助吗？联系我们的技术专家或在下方查看常见问题解答。'
              : 'Need help optimizing your gaming arsenal? Get in touch with our tech specialists or browse the FAQs below.'}
          </motion.p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <Mail className="text-brand-red" size={24} />,
              title: 'Email',
              value: 'support@ggstore.com',
              sub: language === 'id' ? 'Respons < 24 Jam' : language === 'zh' ? '24小时内回复' : 'Replies < 24 Hours',
              link: 'mailto:support@ggstore.com'
            },
            {
              icon: <MessageCircle className="text-green-500" size={24} />,
              title: 'WhatsApp',
              value: '+62 895-3296-89737',
              sub: language === 'id' ? 'Layanan Cepat Instan' : language === 'zh' ? '即时在线客服' : 'Instant Technical Chat',
              link: 'https://wa.me/62895329689737'
            },
            {
              icon: <MessageSquare className="text-indigo-400" size={24} />,
              title: 'Discord HQ',
              value: 'discord.gg/ggstore',
              sub: language === 'id' ? 'Komunitas & Spesialis' : language === 'zh' ? '加入玩家社区' : 'Join Elite Lounge',
              link: 'https://discord.gg'
            },
            {
              icon: <Phone className="text-brand-red" size={24} />,
              title: language === 'id' ? 'Telepon' : language === 'zh' ? '热线电话' : 'Hotline',
              value: '021-9988-7766',
              sub: language === 'id' ? 'Senin - Jumat 09:00 - 18:00' : language === 'zh' ? '周一至周五 09:00 - 18:00' : 'Mon - Fri 09:00 - 18:00',
              link: 'tel:02199887766'
            }
          ].map((item, idx) => (
            <motion.a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-bg-secondary border border-white/5 p-6 rounded-sm hover:border-brand-red/40 hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center mb-4 group-hover:bg-brand-red/10 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider mb-1">{item.title}</h3>
                <p className="text-xs font-mono font-bold text-white mb-2">{item.value}</p>
              </div>
              <span className="text-[10px] text-gray-500 font-medium">{item.sub}</span>
            </motion.a>
          ))}
        </div>

        {/* FAQ & Form Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
          {/* FAQ Accordion Section */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-2">
              <HelpCircle className="text-brand-red" size={20} />
              <span>{language === 'id' ? 'PERTANYAAN POPULER (FAQ)' : language === 'zh' ? '常见问题解答 (FAQ)' : 'POPULAR INQUIRIES (FAQ)'}</span>
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                const qText = faq.question[language as 'en' | 'id' | 'zh'] || faq.question.en;
                const aText = faq.answer[language as 'en' | 'id' | 'zh'] || faq.answer.en;

                return (
                  <div key={idx} className="border border-white/5 bg-bg-secondary rounded-sm overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm uppercase tracking-wide hover:bg-white/5 transition-colors"
                    >
                      <span>{qText}</span>
                      <ChevronDown size={16} className={`text-brand-red transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-black/20"
                        >
                          <p className="p-4 text-xs sm:text-sm text-gray-400 leading-relaxed font-medium border-t border-white/5">
                            {aText}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GG Suggestion Box */}
          <div className="lg:col-span-5 bg-bg-secondary border border-white/5 p-6 rounded-sm">
            <h2 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-2">
              <Lightbulb className="text-brand-red animate-pulse" size={20} />
              <span>{language === 'id' ? 'KOTAK SARAN GG' : language === 'zh' ? 'GG 意见与反馈箱' : 'GG SUGGESTION BOX'}</span>
            </h2>

            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form
                  key="support-form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div>
                    <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                      {language === 'id' ? 'NAMA LENGKAP' : language === 'zh' ? '您的姓名' : 'FULL NAME'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 px-4 py-2.5 text-xs text-white rounded-sm focus:border-brand-red focus:outline-none transition-colors"
                      placeholder={language === 'id' ? 'Masukkan nama lengkap Anda' : language === 'zh' ? '输入您的名字' : 'Enter your name'}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                      {language === 'id' ? 'ALAMAT E-MAIL' : language === 'zh' ? '电子邮箱' : 'EMAIL ADDRESS'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 px-4 py-2.5 text-xs text-white rounded-sm focus:border-brand-red focus:outline-none transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                      {language === 'id' ? 'KATEGORI SARAN' : language === 'zh' ? '意见建议类别' : 'SUGGESTION CATEGORY'}
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-white/10 px-4 py-2.5 text-xs text-white rounded-sm focus:border-brand-red focus:outline-none transition-colors"
                    >
                      {currentCats.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                      {language === 'id' ? 'IDE & SARAN ANDA' : language === 'zh' ? '您的意见与点子' : 'YOUR IDEAS & FEEDBACK'}
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 p-4 text-xs text-white rounded-sm focus:border-brand-red focus:outline-none transition-colors resize-none"
                      placeholder={language === 'id' ? 'Tuliskan ide canggih, saran kustomisasi, atau peningkatan fitur yang Anda impikan...' : language === 'zh' ? '在此写下您对定制装备、功能改进或新产品的想法与建议...' : 'Write your creative gear ideas, customization feedback, or system suggestions...'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-brand-red hover:bg-brand-red/90 text-brand-dark font-black text-xs uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer border border-brand-red/50 shadow-lg hover:shadow-brand-red/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Send size={14} className={isSubmitting ? "animate-pulse" : ""} />
                    <span>{isSubmitting ? (language === 'id' ? 'MENGIRIM...' : language === 'zh' ? '发送中...' : 'SENDING...') : (language === 'id' ? 'KIRIM MASUKAN' : language === 'zh' ? '提交意见反馈' : 'SUBMIT FEEDBACK')}</span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="form-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 animate-bounce">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wider text-white">
                    {language === 'id' ? 'TERIMA KASIH ATAS IDE ANDA!' : language === 'zh' ? '非常感谢您的宝贵建议！' : 'THANK YOU FOR YOUR FEEDBACK!'}
                  </h3>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed font-medium">
                    {language === 'id' 
                      ? 'Ide brilian Anda telah didengar oleh tim GG Store. Kami berkomitmen untuk terus berinovasi demi menciptakan ekosistem peripheral gaming terbaik di dunia!' 
                      : language === 'zh'
                      ? '您的创意点子已成功传送至 GG Store 开发团队。我们致力于不断精进与创新，为您打造全球最顶奢的电竞外设生态！'
                      : 'Your brilliant suggestion has been received by the GG Store crew. We are committed to constant innovation for the ultimate gaming ecosystem!'}
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', email: '', category: 'hardware', message: '' });
                    }}
                    className="mt-4 px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono font-bold text-[10px] uppercase tracking-wider rounded-sm transition-all cursor-pointer"
                  >
                    {language === 'id' ? 'Kirim Saran Lain' : language === 'zh' ? '提供更多建议' : 'Submit Another Idea'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
