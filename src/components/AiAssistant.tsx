import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Sparkles, RefreshCw, ArrowRight, Terminal, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedProducts?: string[]; // Product IDs
}

export default function AiAssistant() {
  const { products } = useApp();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: language === 'id' 
        ? 'Halo Champion! Saya VULCAN-9000, AI Assistant GG Store. Tanyakan apa saja tentang hardware gaming, spesifikasi switch, status order, atau rekomendasi gear terbaik!'
        : language === 'zh'
        ? '你好，游戏玩家！我是 VULCAN-9000，GG Store 的智能 AI 助手。向我询问有关游戏装备、开关规格、订单状态或最佳硬件推荐的任何问题！'
        : 'Welcome Champion! I am VULCAN-9000, your GG Store cybernetic AI Assistant. Ask me anything about gaming hardware, switch specs, shipping status, or premium gear recommendations!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Dynamically translate the welcome message in real-time if the user switches languages
  useEffect(() => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === 'welcome') {
          return {
            ...msg,
            text: language === 'id'
              ? 'Halo Champion! Saya VULCAN-9000, AI Assistant GG Store. Tanyakan apa saja tentang hardware gaming, spesifikasi switch, status order, atau rekomendasi gear terbaik!'
              : language === 'zh'
              ? '你好，游戏玩家！我是 VULCAN-9000，GG Store 的智能 AI 助手。向我询问有关游戏装备、开关规格、订单状态或最佳硬件推荐的任何问题！'
              : 'Welcome Champion! I am VULCAN-9000, your GG Store cybernetic AI Assistant. Ask me anything about gaming hardware, switch specs, shipping status, or premium gear recommendations!'
          };
        }
        return msg;
      })
    );
  }, [language]);

  // Handle global event to open the AI Assistant
  useEffect(() => {
    const handleOpenAi = () => setIsOpen(true);
    window.addEventListener('open-ai-assistant', handleOpenAi);
    return () => window.removeEventListener('open-ai-assistant', handleOpenAi);
  }, []);

  // Suggested prompts
  const quickPrompts = language === 'id' ? [
    { text: 'Rekomendasi Keyboard?', query: 'keyboard' },
    { text: 'Mouse Gaming Terbaik?', query: 'mouse' },
    { text: 'Bagaimana garansi?', query: 'warranty' },
    { text: 'Metode Pengiriman?', query: 'shipping' }
  ] : language === 'zh' ? [
    { text: '推荐机械键盘？', query: 'keyboard' },
    { text: '最佳游戏鼠标？', query: 'mouse' },
    { text: '保修政策是什么？', query: 'warranty' },
    { text: '配送方式有哪些？', query: 'shipping' }
  ] : [
    { text: 'Recommend Keyboard?', query: 'keyboard' },
    { text: 'Best Gaming Mouse?', query: 'mouse' },
    { text: 'How does warranty work?', query: 'warranty' },
    { text: 'Express Shipping specs?', query: 'shipping' }
  ];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI thinking and reply
    setTimeout(() => {
      const response = generateAiReply(textToSend);
      const aiMsg: Message = {
        id: 'msg-' + Date.now() + '-ai',
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: response.products
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAiReply = (query: string): { reply: string; products?: string[] } => {
    const q = query.toLowerCase();
    
    // Detect query language dynamically to answer in the customer's native language!
    let activeLang = language;
    
    const idKeywords = [
      'cara', 'bagaimana', 'gimana', 'bisa', 'ongkir', 'kirim', 'bayar', 'saja',
      'garansi', 'keranjang', 'tanya', 'rekomendasi', 'saya', 'mau', 'ada', 'apa',
      'dari', 'untuk', 'dijawab', 'buat', 'halo', 'hai', 'beli', 'pesan', 'toko',
      'terjual', 'barang', 'kurir', 'kek', 'yang', 'di', 'ini', 'itu', 'ke', 'dan',
      'atau', 'ga', 'gak', 'tidak', 'bukan', 'fitur', 'kok', 'sih', 'juga', 'jg',
      'pake', 'pakek', 'dijawab', 'ada', 'lah'
    ];
    
    const enKeywords = [
      'how', 'what', 'where', 'why', 'recommend', 'shipping', 'payment', 
      'warranty', 'checkout', 'cart', 'does', 'work', 'hello', 'hi', 
      'buy', 'shop', 'store', 'sold', 'product', 'item'
    ];
    
    const hasChinese = /[\u4e00-\u9fa5]/.test(query);
    
    if (hasChinese) {
      activeLang = 'zh';
    } else {
      const idCount = idKeywords.filter(word => q.includes(word)).length;
      const enCount = enKeywords.filter(word => q.includes(word)).length;
      if (idCount > enCount) {
        activeLang = 'id';
      } else if (enCount > idCount) {
        activeLang = 'en';
      }
    }
    
    // Core match rules for Indonesian, English, and Chinese
    // KEYBOARDS MATCH
    if (q.includes('keyboard') || q.includes('keycaps') || q.includes('switch') || q.includes('sound') || q.includes('thock') || q.includes('papan') || q.includes('键盘') || q.includes('轴')) {
      const kbs = products.filter(p => p.type === 'keyboard' || p.category.toLowerCase().includes('keyboard'));
      const kbNames = kbs.map(k => `- **${k.name}** (Rp ${k.price.toLocaleString('id-ID')})`).join('\n');
      
      const reply = activeLang === 'id'
        ? `Tentu! GG Store memiliki jajaran keyboard mekanis premium dengan build quality kokoh dan stabilizer yang sudah terlubrikasi dengan baik:\n\n${kbNames}\n\nUntuk suara ketikan bass melimpah (thocky), pilihlah **Striker-65 Mini** atau **Baryon-75 Core**. Ingin yang hening tapi responsif? **Nebula-98 Silent** adalah pilihan utama. Anda bisa mengklik produk di bawah ini untuk melihat spesifikasi detailnya.`
        : activeLang === 'zh'
        ? `当然！GG Store 拥有顶级的高端机械键盘系列，全部出厂已做精细润轴和稳定器调试：\n\n${kbNames}\n\n如果您追求完美的浑厚麻将音（Thocky），推荐选择 **Striker-65 Mini** 或 **Baryon-75 Core**。想要安静极速反馈？**Nebula-98 Silent** 是您的首选。您可以点击下方卡片查看详细参数。`
        : `Absolutely! GG Store offers premium custom mechanical keyboards, fully lubed out of the box with dynamic stabilizers:\n\n${kbNames}\n\nFor a deeper, bassy sound profile (thocky), go for the **Striker-65 Mini** or **Baryon-75 Core**. Prefer ultra-quiet linear switches? The **Nebula-98 Silent** is unmatched. Click the product cards below to check detailed specs!`;

      return { reply, products: kbs.slice(0, 3).map(k => k.id) };
    }

    // MOUSE MATCH
    if (q.includes('mouse') || q.includes('sensor') || q.includes('dpi') || q.includes('mousepad') || q.includes('tikus') || q.includes('鼠标')) {
      const mice = products.filter(p => p.type === 'mouse' || p.category.toLowerCase().includes('mouse'));
      const mouseNames = mice.map(m => `- **${m.name}** (Rp ${m.price.toLocaleString('id-ID')})`).join('\n');

      const reply = activeLang === 'id'
        ? `Berikut adalah persenjataan gaming mouse berpresisi tinggi di GG Store:\n\n${mouseNames}\n\nRekomendasi teratas kami adalah **Striker-X Modular Mouse** dengan bobot yang bisa disesuaikan dan sensor Pixart optik 26K DPI untuk aim super presisi. Untuk performa ringan, **Baryon-X Lite** berbobot 52g sangat lincah untuk game kompetitif FPS.`
        : activeLang === 'zh'
        ? `以下是 GG Store 顶级的电竞鼠标推荐：\n\n${mouseNames}\n\n我们的王牌推荐是 **Striker-X 模块化鼠标**，支持物理配重调节和 26K DPI 顶奢传感器。如果您追求极度轻量化，**Baryon-X Lite**（仅 52 克）是 FPS 高手的不二之选。`
        : `Here are the top-tier gaming mice engineered for absolute precision at GG Store:\n\n${mouseNames}\n\nOur top recommendation is the **Striker-X Modular Mouse** featuring customizable modular side grips and an advanced 26K DPI optical sensor. For lightweight speed, the **Baryon-X Lite** at 52g is perfect for competitive FPS play.`;

      return { reply, products: mice.slice(0, 3).map(m => m.id) };
    }

    // WARRANTY & POLICY
    if (q.includes('garansi') || q.includes('warranty') || q.includes('return') || q.includes('refund') || q.includes('retur') || q.includes('保修') || q.includes('退款')) {
      const reply = activeLang === 'id'
        ? `🛡️ **GG Store Warranty & Returns System**:\n\n1. **Garansi 2 Tahun**: Semua hardware utama dilindungi garansi servis dan part resmi selama 24 bulan.\n2. **30 Hari Retur**: Jika Anda tidak puas atau terdapat cacat pabrik, kembalikan dalam kondisi asli dalam 30 hari untuk penukaran unit baru.\n3. **Proses Cepat**: Hubungi tim kami lewat halaman Akun, dan kami akan mengirimkan kurir penjemputan gratis!`
        : activeLang === 'zh'
        ? `🛡️ **GG Store 保修与退换政策**：\n\n1. **两年官方保修**：所有核心电竞硬件均享有 24 个月的官方免费保修与零部件支持。\n2. **30天无忧退换**：如有任何质量问题或不满意，可在 30 天内联系客服申请退换。\n3. **极速售后**：只需在您的账户页面提交售后服务单，我们将为您免费安排快递上门取件！`
        : `🛡️ **GG Store Premium Warranty & Returns Policy**:\n\n1. **2-Year Warranty**: All core gaming hardware comes with a comprehensive 24-month manufacturer warranty.\n2. **30-Day Returns**: If there are any manufacturing issues, return the item in its original box within 30 days for a zero-hassle swap or refund.\n3. **Priority Support**: Simply open a ticket via your Account Dashboard and we will handle the rest!`;
      return { reply };
    }

    // SHIPPING & PAYMENT
    if (q.includes('ongkir') || q.includes('kirim') || q.includes('delivery') || q.includes('shipping') || q.includes('bayar') || q.includes('payment') || q.includes('midtrans') || q.includes('邮寄') || q.includes('支付')) {
      const reply = activeLang === 'id'
        ? `🚚 **Pengiriman & Pembayaran**:\n\n- **Metode Pembayaran**: Kami menggunakan gerbang pembayaran aman **Midtrans Sandbox/Production** yang mendukung GoPay, ShopeePay, Virtual Account Bank, dan Kartu Kredit.\n- **Estimasi Pengiriman**: JABODETABEK (1-2 hari kerja via Express Courier), Pulau Jawa (2-3 hari), Luar Jawa (3-5 hari).\n- **Asuransi Penuh**: Semua pengiriman kami lindungi asuransi kehilangan 100%.`
        : activeLang === 'zh'
        ? `🚚 **配送与安全支付**：\n\n- **支付渠道**：我们集成了主流的 **Midtrans 支付网关**，支持 GoPay、信用卡、各大银行虚拟账户等快捷安全支付。\n- **配送时效**：主要城市 1-2 天极速送达，偏远地区 3-5 天送达。\n- **全额运输险**：每一份包裹均含有 100% 全额丢失破损保险。`
        : `🚚 **Shipping & Seamless Payments**:\n\n- **Secure Checkout**: We utilize the fully integrated **Midtrans Payment Gateway**, supporting credit cards, bank virtual accounts, and instant e-wallets.\n- **Delivery Timeframes**: Local regions (1-2 business days via Express), other areas (3-5 business days).\n- **Fully Insured**: Every premium gear package is 100% insured against loss or transit damage.`;
      return { reply };
    }

    // WISHLIST INSTRUCTIONS MATCH
    if (q.includes('wishlist') || q.includes('wistlist') || q.includes('simpan') || q.includes('favorit') || q.includes('save') || q.includes('heart') || q.includes('hati') || q.includes('收藏')) {
      const reply = activeLang === 'id'
        ? `❤️ **Cara Menambahkan ke Wishlist (Daftar Keinginan):**\n\n1. **Melalui Halaman Catalog**: Cari barang yang Anda sukai, lalu klik tombol ikon **Hati (❤️)** di pojok kiri atas foto produk.\n2. **Melalui Detail Produk**: Buka halaman produk pilihan Anda, lalu klik tombol **Hati (❤️)** yang berada tepat di sebelah tombol "Add to Cart".\n3. **Melihat Wishlist**: Klik menu **Account** (profil Anda) di Header atas, lalu pilih tab **"My Wishlist"** untuk melihat daftar barang impian Anda yang tersimpan persisten!`
        : activeLang === 'zh'
        ? `❤️ **如何将商品添加至收藏夹（Wishlist）：**\n\n1. **在商品目录页**：浏览您心仪的装备，点击图片左上角的 **爱心（❤️）** 图标。\n2. **在商品详情页**：点击 "Add to Cart" 按钮旁边的 **爱心（❤️）** 按钮。\n3. **查看收藏夹**：点击顶部导航栏的 **Account** 进入个人中心，选择 **"My Wishlist"** 标签页即可查看所有收藏的顶奢装备！`
        : `❤️ **How to Add Products to your Wishlist:**\n\n1. **From the Catalog Page**: Browse item cards and click the **Heart (❤️)** icon in the top-left corner of the product cover image.\n2. **From the Product Detail Page**: Open the product detail and click the **Heart (❤️)** button situated next to the "Add to Cart" button.\n3. **Viewing Saved Items**: Go to your **Account** section from the Header and click the **"My Wishlist"** tab. All your favorites are securely stored here!`;
      return { reply };
    }

    // CART & CHECKOUT INSTRUCTIONS MATCH
    if (q.includes('keranjang') || q.includes('checkout') || q.includes('cart') || q.includes('pesan') || q.includes('beli') || q.includes('gimana bayar') || q.includes('cara order') || q.includes('order') || q.includes('购物车') || q.includes('结算')) {
      const reply = activeLang === 'id'
        ? `🛒 **Cara Memeriksa Keranjang & Melakukan Checkout:**\n\n1. **Membuka Keranjang**: Klik ikon **Tas Belanja (🛍️)** di pojok kanan atas Header untuk membuka panel keranjang samping yang interaktif.\n2. **Mengatur Barang**: Anda dapat menambah/mengurangi jumlah produk atau menghapus produk langsung dari panel keranjang tersebut.\n3. **Proses Checkout**: Klik tombol **"Proceed to Checkout"** di bagian bawah keranjang untuk diarahkan ke halaman Checkout.\n4. **Metode Pembayaran**: Isi informasi alamat pengiriman Anda, lalu klik **"Pay with Midtrans"** untuk menyelesaikan transaksi Anda dengan aman via Midtrans Sandbox!`
        : activeLang === 'zh'
        ? `🛒 **如何查看购物车并进行结算（Checkout）：**\n\n1. **打开购物车**：点击右上角导航栏的 **购物袋（🛍️）** 图标，即可唤出炫酷的侧边购物车面板。\n2. **管理商品**：在购物车中，您可以自由调整商品数量或直接删除商品。\n3. **前往结算**：点击购物车底部的 **"Proceed to Checkout"** 按钮进入结算页面。\n4. **安全付款**：填写收货地址信息，点击 **"Pay with Midtrans"** 按钮即可通过安全的 Midtrans 沙盒环境完成支付！`
        : `🛒 **How to View your Cart & Checkout:**\n\n1. **Open the Cart**: Click the **Shopping Bag (🛍️)** icon in the top-right corner of the Header to trigger the sleek sliding cart panel.\n2. **Manage Items**: Adjust quantities or remove items instantly within the slide-out panel.\n3. **Proceed to Checkout**: Click the **"Proceed to Checkout"** button at the bottom of your cart.\n4. **Complete Payment**: Fill in your shipping address details and click **"Pay with Midtrans"** to settle the order via secure Midtrans Sandbox!`;
      return { reply };
    }

    // GENERIC FALLBACK SEARCH
    // Try to search if any product name matches the query!
    const searchMatch = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    if (searchMatch.length > 0) {
      const reply = activeLang === 'id'
        ? `Saya menemukan hardware berikut yang cocok dengan pencarian Anda:\n\n${searchMatch.map(p => `- **${p.name}** (${p.category})`).join('\n')}\n\nKlik kartu produk di bawah ini untuk melihat ulasan, foto resolusi tinggi, dan melakukan pemesanan!`
        : activeLang === 'zh'
        ? `我为您找到了以下匹配的电竞装备：\n\n${searchMatch.map(p => `- **${p.name}** (${p.category})`).join('\n')}\n\n点击下方卡片即可直达产品详情页，查看特写镜头和玩家测评！`
        : `I found the following matches in our arsenal for your query:\n\n${searchMatch.map(p => `- **${p.name}** (${p.category})`).join('\n')}\n\nClick the item card below to view custom high-res assets, user reviews, and place your order!`;
      return { reply, products: searchMatch.slice(0, 3).map(p => p.id) };
    }

    // GENERIC DEFAULT REPLY
    const reply = activeLang === 'id'
      ? `Maaf, fitur atau informasi yang Anda tanyakan belum tersedia di platform GG Store saat ini. Kami terus memperbarui persenjataan hardware gaming dan fungsionalitas sistem kami. Tetap pantau info terbaru dari kami!`
      : activeLang === 'zh'
      ? `抱歉，您询问的功能或信息目前在 GG Store 平台上暂未提供。我们正在不断升级电竞装备库与系统功能，敬请期待最新的更新！`
      : `Apologies, the feature or information you are inquiring about is not yet available on the GG Store platform. We are constantly expanding our premium hardware inventory and system features. Stay tuned for future updates!`;

    return { reply };
  };

  return (
    <>
      {/* Floating Chat Button & Speech Bubble */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="fixed bottom-6 right-24 z-50 hidden sm:flex items-center gap-2 bg-bg-secondary/95 border border-white/10 px-4 py-3 rounded-sm shadow-xl backdrop-blur-md max-w-[240px] pointer-events-none"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse shrink-0" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-white">
            {language === 'id' 
              ? 'Tanya VULCAN AI!' 
              : language === 'zh'
              ? '咨询 VULCAN AI!'
              : 'Chat with VULCAN AI!'}
          </span>
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-bg-secondary/95" />
        </motion.div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-brand-red text-brand-dark rounded-full hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all cursor-pointer flex items-center justify-center border border-brand-red/50 group"
        aria-label="AI Support"
      >
        {isOpen ? (
          <X size={24} className="animate-spin-once" />
        ) : (
          <div className="relative">
            <MessageSquare size={24} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full" />
          </div>
        )}
      </button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-[92vw] sm:w-[400px] h-[550px] bg-bg-secondary/95 border border-white/10 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl z-50 flex flex-col overflow-hidden"
          >
            {/* Glassmorphic Glowing Top Header */}
            <div className="p-4 bg-gradient-to-r from-brand-red/10 to-brand-red/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-red text-brand-dark rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 leading-none">
                    VULCAN-9000
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-brand-red/10 border border-brand-red/20 rounded-full text-[8px] font-black text-brand-red">
                      <Sparkles size={8} /> AI ACTIVE
                    </span>
                  </h3>
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mt-1">GG Store Support Terminal</span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Body Container */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex gap-3 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'ai' ? 'bg-brand-red text-brand-dark' : 'bg-white/10 text-white font-mono'
                  }`}>
                    {msg.sender === 'ai' ? 'AI' : 'ME'}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-3 max-w-[75%]">
                    <div className={`p-4 rounded-sm text-xs font-mono tracking-wide leading-relaxed ${
                      msg.sender === 'ai' 
                        ? 'bg-white text-black font-semibold' 
                        : 'bg-brand-red text-brand-dark font-bold shadow-[0_5px_15px_rgba(239,68,68,0.2)]'
                    }`}>
                      {/* Formatted Text rendering supports line breaks */}
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>

                    {/* Suggested Clickable Product recommendation cards */}
                    {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {products
                          .filter(p => msg.suggestedProducts?.includes(p.id))
                          .map((prod) => (
                            <Link 
                              key={prod.id}
                              to={`/product/${prod.id}`}
                              onClick={() => setIsOpen(false)}
                              className="flex gap-3 p-3 bg-bg-primary/40 hover:bg-brand-red/10 border border-white/5 hover:border-brand-red/30 rounded-sm transition-all group"
                            >
                              <img 
                                src={prod.image} 
                                alt={prod.name} 
                                className="w-12 h-12 object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all border border-white/10" 
                              />
                              <div className="flex-grow min-w-0">
                                <h4 className="text-[10px] font-black uppercase tracking-tighter truncate group-hover:text-brand-red transition-colors">{prod.name}</h4>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-[10px] font-mono font-bold text-gray-400">Rp {prod.price.toLocaleString('id-ID')}</span>
                                  <div className="flex items-center gap-0.5 text-[8px] font-black text-brand-red">
                                    <Star size={8} className="fill-brand-red" />
                                    {prod.rating}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Pulsing AI Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-sm bg-brand-red text-brand-dark flex items-center justify-center text-xs font-bold">
                    AI
                  </div>
                  <div className="bg-white/5 border border-white/5 p-4 rounded-sm flex items-center gap-1 text-gray-500">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Chip Replies */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p.text)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-brand-red/10 border border-white/10 hover:border-brand-red/30 rounded-sm text-[9px] font-black uppercase tracking-wider text-gray-400 hover:text-brand-red transition-all cursor-pointer"
                  >
                    {p.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar Section */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="p-4 border-t border-white/10 bg-bg-primary/50 flex gap-2"
            >
              <input
                type="text"
                placeholder={language === 'id' 
                  ? 'Ketik pesan Anda...' 
                  : language === 'zh'
                  ? '输入您的消息...'
                  : 'Transmit secure message...'
                }
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-grow bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-xs font-mono font-bold tracking-wider placeholder-gray-600 focus:outline-none focus:border-brand-red transition-all"
                disabled={isTyping}
              />
              <button
                type="submit"
                className="p-3 bg-brand-red text-brand-dark rounded-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-brand-red/10 disabled:opacity-50"
                disabled={!inputVal.trim() || isTyping}
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
