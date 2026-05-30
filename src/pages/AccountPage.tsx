import React, { useState } from 'react';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import { motion } from 'motion/react';
import { 
  Package, 
  LogOut, 
  ChevronRight, 
  Store, 
  Plus, 
  ShoppingBag, 
  Info, 
  UserCheck, 
  CheckCircle2,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate, Link } from 'react-router-dom';

export default function AccountPage() {
  const { 
    orders, 
    products, 
    addProduct, 
    activeRole, 
    setActiveRole, 
    storeInfo, 
    createStore,
    addToCart,
    logout,
    wishlist,
    toggleWishlist
  } = useApp();

  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Derive display name and initials from Supabase user metadata
  const fullName: string = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest';
  const userEmail: string = user?.email || '';
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Navigation within account page
  const [customerTab, setCustomerTab] = useState<'orders' | 'wishlist'>('orders');
  const [merchantTab, setMerchantTab] = useState<'dashboard' | 'add-product'>('dashboard');

  // Form states
  const [storeName, setStoreName] = useState('');
  const [storeDesc, setStoreDesc] = useState('');
  
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodType, setProdType] = useState('keyboard');
  const [prodImage, setProdImage] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodReport, setProdReport] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodVariants, setProdVariants] = useState('');

  const [notification, setNotification] = useState('');

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !storeDesc.trim()) return;
    createStore({
      name: storeName,
      description: storeDesc
    });
    setNotification('Toko berhasil dibuat!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice.trim() || !prodDesc.trim()) return;

    // Use default Unsplash image if none provided
    const defaultImages: Record<string, string> = {
      keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1200',
      mouse: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1200',
      audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200',
      accessory: 'https://images.unsplash.com/photo-1615494488192-7f35c76936a4?q=80&w=1200'
    };

    const finalImage = prodImage.trim() || defaultImages[prodType] || defaultImages.keyboard;

    addProduct({
      name: prodName,
      price: parseInt(prodPrice, 10),
      image: finalImage,
      category: prodCategory.trim() || 'General',
      type: prodType,
      description: prodDesc,
      analysisReport: prodReport.trim() || undefined,
      storeName: storeInfo?.name || 'My Store',
      stock: prodStock ? parseInt(prodStock, 10) : 0,
      variants: prodVariants ? prodVariants.split(',').map(v => v.trim()).filter(Boolean) : []
    });

    // Reset Form
    setProdName('');
    setProdPrice('');
    setProdCategory('');
    setProdImage('');
    setProdDesc('');
    setProdReport('');
    setProdStock('');
    setProdVariants('');

    setNotification('Produk berhasil ditambahkan ke katalog!');
    setTimeout(() => setNotification(''), 3000);
    setMerchantTab('dashboard');
  };

  // Filter products added by this merchant store
  const merchantProducts = products.filter(p => p.storeName === storeInfo?.name);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-brand-red selection:text-brand-dark transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {notification && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500 text-emerald-500 rounded-sm font-mono text-xs uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 size={16} />
            {notification}
          </div>
        )}

        <div className="flex flex-col-reverse lg:flex-row-reverse gap-12">
          {/* Account Navigation / Profile Card */}
          <aside className="w-full lg:w-72 space-y-4">
            <div className="p-8 bg-bg-secondary border border-border-subtle rounded-sm text-center">
              <div className="w-24 h-24 bg-brand-red rounded-full mx-auto mb-4 flex items-center justify-center text-brand-dark font-black text-4xl italic">
                {initials}
              </div>
              <h2 className="text-xl font-black italic uppercase tracking-tighter">{fullName}</h2>
              <p className="text-xs font-mono text-gray-500 tracking-widest mt-1">{userEmail}</p>
              
              {/* Role Indicator Badge */}
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-brand-red/10 border border-brand-red/20 rounded-full text-[10px] font-black uppercase text-brand-red tracking-wider">
                <UserCheck size={10} />
                {activeRole === 'customer' ? 'Customer Mode' : 'Merchant Mode'}
              </div>
            </div>

            {/* Toggle Role Selector */}
            <div className="p-4 bg-bg-secondary border border-border-subtle rounded-sm space-y-3">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Select Active Role</span>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setActiveRole('customer')}
                  className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-sm border transition-all ${activeRole === 'customer' ? 'bg-brand-red text-brand-dark border-brand-red' : 'border-border-subtle text-gray-400 hover:text-white'}`}
                >
                  Customer
                </button>
                <button 
                  onClick={() => setActiveRole('merchant')}
                  className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-sm border transition-all ${activeRole === 'merchant' ? 'bg-brand-red text-brand-dark border-brand-red' : 'border-border-subtle text-gray-400 hover:text-white'}`}
                >
                  Merchant
                </button>
              </div>
            </div>
            
            {/* Sidebar Buttons depending on active role */}
            {activeRole === 'customer' ? (
              <div className="space-y-1">
                <NavButton 
                  icon={<Package size={20} />} 
                  label="Purchase History" 
                  active={customerTab === 'orders'} 
                  onClick={() => setCustomerTab('orders')}
                />
                <NavButton 
                  icon={<Heart size={20} />} 
                  label="My Wishlist" 
                  active={customerTab === 'wishlist'} 
                  onClick={() => setCustomerTab('wishlist')}
                />
              </div>
            ) : storeInfo ? (
              <div className="space-y-1">
                <NavButton 
                  icon={<Store size={20} />} 
                  label="Store Dashboard" 
                  active={merchantTab === 'dashboard'} 
                  onClick={() => setMerchantTab('dashboard')} 
                />
                <NavButton 
                  icon={<Plus size={20} />} 
                  label="Add Product" 
                  active={merchantTab === 'add-product'} 
                  onClick={() => setMerchantTab('add-product')} 
                />
              </div>
            ) : null}

            <div className="pt-6">
              <button 
                onClick={async () => { await signOut(); logout(); navigate('/auth'); }}
                className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold uppercase tracking-tighter text-red-500 hover:bg-red-500/10 transition-all rounded-sm cursor-pointer"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-grow space-y-12">
            {activeRole === 'customer' ? (
              customerTab === 'orders' ? (
                /* CUSTOMER VIEW: PURCHASE HISTORY */
                <div>
                  <div className="flex items-center justify-between mb-8 border-b border-border-subtle pb-4">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Purchase History</h1>
                  </div>

                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-6 bg-bg-secondary border border-border-subtle rounded-sm hover:border-text-primary/20 transition-all group">
                        <div className="flex flex-col md:grid md:grid-cols-5 gap-4 md:gap-6 md:items-center">
                          <div className="flex justify-between items-center md:block">
                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest md:mb-1">Order #</p>
                            <p className="font-bold uppercase tracking-tighter text-brand-red">{order.id}</p>
                          </div>
                          <div className="flex justify-between items-center md:block">
                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest md:mb-1">Date</p>
                            <p className="font-bold text-sm">{order.date}</p>
                          </div>
                          <div className="flex justify-between items-center md:block">
                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest md:mb-1">Status</p>
                            <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                              {order.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center md:block md:text-right">
                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest md:mb-1">Total</p>
                            <p className="font-black italic tracking-tighter text-brand-red">
                              Rp {order.total.toLocaleString('id-ID')}
                            </p>
                          </div>
                          <div className="flex justify-between md:justify-end items-center gap-3 pt-2 md:pt-0 border-t border-border-subtle md:border-0 mt-2 md:mt-0">
                            <span className="text-xs font-mono text-gray-400">[{order.items} items]</span>
                            {order.details && order.details.length > 0 && (
                              <button
                                onClick={() => {
                                  order.details?.forEach(item => {
                                    addToCart({
                                      id: item.id,
                                      name: item.name,
                                      price: item.price,
                                      image: item.image,
                                      rating: 5,
                                      category: 'Gear',
                                      type: 'accessory',
                                      description: ''
                                    }, item.color);
                                  });
                                  setNotification(`Added all items from order ${order.id} to cart!`);
                                  setTimeout(() => setNotification(''), 3000);
                                }}
                                className="px-2 py-1 bg-brand-red text-brand-dark hover:opacity-90 transition-all text-[9px] font-black uppercase tracking-tighter rounded-sm cursor-pointer"
                              >
                                Reorder All
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Order items listing */}
                        {order.details && order.details.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border-subtle grid grid-cols-1 md:grid-cols-2 gap-4">
                            {order.details.map((item, idx) => (
                              <div key={idx} className="flex gap-3 items-center bg-bg-primary/20 p-3 border border-border-subtle rounded-sm">
                                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover grayscale opacity-75 rounded-sm" />
                                <div className="flex-grow">
                                  <h4 className="text-xs font-bold uppercase tracking-tighter">{item.name}</h4>
                                  <p className="text-[9px] font-mono text-gray-500">QTY: {item.quantity} | {item.color}</p>
                                </div>
                                <button
                                  onClick={() => {
                                    addToCart({
                                      id: item.id,
                                      name: item.name,
                                      price: item.price,
                                      image: item.image,
                                      rating: 5,
                                      category: 'Gear',
                                      type: 'accessory',
                                      description: ''
                                    }, item.color);
                                    setNotification(`"${item.name}" added to cart!`);
                                    setTimeout(() => setNotification(''), 3000);
                                  }}
                                  className="px-2 py-1 border border-brand-red/20 text-brand-red bg-brand-red/5 hover:bg-brand-red hover:text-brand-dark transition-all text-[9px] font-bold uppercase tracking-tighter rounded-sm cursor-pointer"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {orders.length === 0 && (
                      <div className="py-20 text-center border border-dashed border-border-subtle rounded-sm">
                        <ShoppingBag size={40} className="mx-auto text-gray-600 mb-4 opacity-30" />
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">No transaction logs available.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* CUSTOMER VIEW: WISHLIST */
                <div>
                  <div className="flex items-center justify-between mb-8 border-b border-border-subtle pb-4">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">My Wishlist</h1>
                  </div>

                  {wishlist.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                      {products.filter(p => wishlist.includes(p.id)).map((product) => (
                        <div key={product.id} className="group bg-bg-secondary md:glass rounded-sm overflow-hidden border border-border-subtle md:border-white/5 hover:border-brand-red/50 transition-all duration-500 flex flex-col h-full relative shadow-lg shadow-black/20">
                          <div className="relative overflow-hidden aspect-square md:aspect-[4/5]">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <button
                              onClick={() => toggleWishlist(product.id)}
                              className="absolute top-2 left-2 md:top-4 md:left-4 p-2 md:p-2.5 rounded-full glass border border-white/10 hover:border-brand-red transition-all cursor-pointer z-20"
                              aria-label="Remove from Wishlist"
                            >
                              <Heart size={14} className="fill-brand-red text-brand-red" />
                            </button>
                          </div>
                          
                          <div className="p-3 md:p-6 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-1.5 md:mb-2">
                              <p className="text-brand-red font-mono text-[9px] md:text-[10px] uppercase tracking-widest bg-brand-red/10 px-1.5 py-0.5 rounded-sm">{product.category}</p>
                            </div>
                            <h3 className="text-xs md:text-xl font-bold md:font-black md:italic uppercase tracking-tight md:tracking-tighter mb-2 group-hover:text-brand-red transition-colors leading-tight line-clamp-2 flex-grow">
                              {product.name}
                            </h3>
                            
                            <div className="flex items-center justify-between mt-auto mb-1">
                              <span className="text-brand-red font-bold text-sm md:text-xl tracking-tight md:tracking-tighter">Rp {product.price.toLocaleString('id-ID')}</span>
                              <button 
                                onClick={() => {
                                  addToCart(product);
                                  setNotification(`"${product.name}" added to cart!`);
                                  setTimeout(() => setNotification(''), 3000);
                                }}
                                className="p-1.5 md:p-2.5 bg-brand-red text-brand-dark rounded-full hover:bg-white hover:text-black transition-all cursor-pointer"
                              >
                                <ShoppingBag size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center glass rounded-sm">
                      <Heart size={40} className="mx-auto text-gray-600 mb-4 opacity-30" />
                      <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-6">Your wishlist is empty.</p>
                      <Link
                        to="/catalog"
                        className="inline-block bg-white text-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-red hover:text-brand-dark transition-all rounded-sm"
                      >
                        Browse Weapons of Choice
                      </Link>
                    </div>
                  )}
                </div>
              )
            ) : (
              /* MERCHANT VIEW */
              <div>
                {!storeInfo ? (
                  /* MERCHANT: NO STORE YET -> STORE CREATION FORM */
                  <div className="max-w-2xl bg-bg-secondary border border-border-subtle p-8 rounded-sm space-y-6">
                    <div>
                      <h1 className="text-3xl font-black italic uppercase tracking-tighter">Launch Your Store</h1>
                      <p className="text-xs text-gray-400 font-light mt-1">Start selling high-performance mechanical parts and bespoke gaming accessories.</p>
                    </div>

                    <form onSubmit={handleCreateStore} className="space-y-6">
                      <div>
                        <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Store Name</label>
                        <input 
                          type="text" 
                          required
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          placeholder="e.g. Vulcan Custom Keyboards"
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Store Description</label>
                        <textarea 
                          required
                          rows={4}
                          value={storeDesc}
                          onChange={(e) => setStoreDesc(e.target.value)}
                          placeholder="Describe the philosophy and gear segment of your workshop..."
                          className="w-full bg-transparent border-2 border-border-subtle focus:border-brand-red rounded-sm p-4 text-sm text-text-primary focus:ring-0 transition-colors font-sans"
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="w-full bg-brand-red text-brand-dark py-4 font-black uppercase tracking-tighter hover:opacity-90 transition-all rounded-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Store size={18} /> Initialize Store
                      </button>
                    </form>
                  </div>
                ) : merchantTab === 'dashboard' ? (
                  /* MERCHANT: DASHBOARD */
                  <div className="space-y-8">
                    <div className="p-8 bg-bg-secondary border border-border-subtle rounded-sm">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest font-bold">Active Merchant Partner</span>
                          <h1 className="text-4xl font-black italic uppercase tracking-tighter mt-1">{storeInfo.name}</h1>
                          <p className="text-xs text-gray-400 font-light mt-2 max-w-xl">{storeInfo.description}</p>
                        </div>
                        <button 
                          onClick={() => setMerchantTab('add-product')}
                          className="bg-brand-red text-brand-dark px-6 py-3 font-black text-xs uppercase tracking-wider rounded-sm hover:opacity-95 flex items-center gap-2 cursor-pointer"
                        >
                          <Plus size={16} /> New Product
                        </button>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Your Products</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {merchantProducts.map((product) => (
                          <div key={product.id} className="glass p-4 md:p-6 rounded-sm border-white/5 flex gap-4 items-start md:items-center">
                            <img src={product.image} alt={product.name} className="w-16 h-16 md:w-20 md:h-20 object-cover grayscale rounded-sm shrink-0" />
                            <div className="flex-grow">
                              <span className="text-[9px] font-mono text-brand-red uppercase tracking-wider bg-brand-red/10 px-1.5 py-0.5 rounded-sm">{product.category}</span>
                              <h3 className="text-sm md:text-lg font-bold md:font-black md:italic uppercase tracking-tight md:tracking-tighter leading-tight mt-1 md:mt-2 line-clamp-2">{product.name}</h3>
                              <div className="flex flex-col mt-2 gap-1">
                                <p className="text-sm md:text-md font-bold text-brand-red">Rp {product.price.toLocaleString('id-ID')}</p>
                                {product.stock !== undefined && (
                                  <p className="text-[10px] md:text-xs font-mono text-gray-400">Stock: {product.stock}</p>
                                )}
                                {product.variants && product.variants.length > 0 && (
                                  <div className="flex gap-1 flex-wrap mt-1 hidden md:flex">
                                    {product.variants.map((v, i) => (
                                      <span key={i} className="px-1.5 py-0.5 bg-white/5 rounded-sm text-[8px] font-mono uppercase text-gray-300">
                                        {v}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {merchantProducts.length === 0 && (
                        <div className="py-20 text-center border border-dashed border-border-subtle rounded-sm bg-bg-secondary/40">
                          <ShoppingBag size={36} className="mx-auto text-gray-600 mb-4 opacity-30" />
                          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">No products added yet.</p>
                          <button 
                            onClick={() => setMerchantTab('add-product')}
                            className="mt-4 text-brand-red font-black text-xs uppercase tracking-wider hover:underline"
                          >
                            Add your first product
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* MERCHANT: ADD PRODUCT FORM */
                  <div className="max-w-2xl bg-bg-secondary border border-border-subtle p-8 rounded-sm space-y-6">
                    <div>
                      <h1 className="text-3xl font-black italic uppercase tracking-tighter">Add Custom Gear</h1>
                      <p className="text-xs text-gray-400 font-light mt-1">Provide detailed descriptions, pricing, and analysis reports for verification.</p>
                    </div>

                    <form onSubmit={handleAddProduct} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Product Name</label>
                          <input 
                            type="text" 
                            required
                            value={prodName}
                            onChange={(e) => setProdName(e.target.value)}
                            placeholder="e.g. Apex Cobalt Switches"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Price (IDR Rupiah)</label>
                          <input 
                            type="number" 
                            required
                            value={prodPrice}
                            onChange={(e) => setProdPrice(e.target.value)}
                            placeholder="e.g. 1500000"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Category Label</label>
                          <input 
                            type="text" 
                            value={prodCategory}
                            onChange={(e) => setProdCategory(e.target.value)}
                            placeholder="e.g. Hot-swappable, 2.4Ghz"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Gear Type</label>
                          <select 
                            value={prodType}
                            onChange={(e) => setProdType(e.target.value)}
                            className="w-full bg-transparent border-0 border-b-2 border-border-subtle py-3 px-0 focus:ring-0 focus:border-brand-red transition-colors font-sans text-text-primary text-sm uppercase tracking-wider"
                          >
                            <option value="keyboard" className="bg-bg-secondary text-text-primary">Keyboard</option>
                            <option value="mouse" className="bg-bg-secondary text-text-primary">Mouse</option>
                            <option value="audio" className="bg-bg-secondary text-text-primary">Audio</option>
                            <option value="accessory" className="bg-bg-secondary text-text-primary">Accessory</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Stock</label>
                          <input 
                            type="number" 
                            required
                            value={prodStock}
                            onChange={(e) => setProdStock(e.target.value)}
                            placeholder="e.g. 50"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Variants (comma separated)</label>
                          <input 
                            type="text" 
                            value={prodVariants}
                            onChange={(e) => setProdVariants(e.target.value)}
                            placeholder="e.g. Red, Blue, Green"
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Image URL (Optional)</label>
                        <input 
                          type="text" 
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          placeholder="Paste a direct image URL (Unsplash/Imgur)"
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Product Description</label>
                        <textarea 
                          required
                          rows={3}
                          value={prodDesc}
                          onChange={(e) => setProdDesc(e.target.value)}
                          placeholder="Provide custom key specifications and physical layout aspects..."
                          className="w-full bg-transparent border-2 border-border-subtle focus:border-brand-red rounded-sm p-4 text-sm text-text-primary focus:ring-0 transition-colors font-sans"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Merchant Analysis Report (Optional)</label>
                        <textarea 
                          rows={3}
                          value={prodReport}
                          onChange={(e) => setProdReport(e.target.value)}
                          placeholder="Submit custom analysis report (e.g. latency reports, dampening sound metrics, build materials data)..."
                          className="w-full bg-transparent border-2 border-border-subtle focus:border-brand-red rounded-sm p-4 text-sm text-text-primary focus:ring-0 transition-colors font-sans"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button 
                          type="button" 
                          onClick={() => setMerchantTab('dashboard')}
                          className="w-1/3 border border-border-subtle text-text-primary py-4 font-black uppercase tracking-tighter hover:bg-white/5 transition-all rounded-sm cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="w-2/3 bg-brand-red text-brand-dark py-4 font-black uppercase tracking-tighter hover:opacity-90 transition-all rounded-sm shadow-xl cursor-pointer"
                        >
                          Add Product
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function NavButton({ 
  icon, 
  label, 
  active = false, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-black uppercase tracking-tighter transition-all rounded-sm font-bold cursor-pointer ${active ? 'bg-brand-red text-brand-dark' : 'text-gray-400 hover:bg-bg-secondary hover:text-text-primary'}`}
    >
      {icon}
      {label}
    </button>
  );
}
