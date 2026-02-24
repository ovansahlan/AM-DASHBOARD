import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  ComposedChart, Line, Cell, AreaChart, Area, LineChart
} from 'recharts';
import { 
  UploadCloud, TrendingUp, Database, Filter, Megaphone,
  Search, CheckCircle, AlertCircle, DollarSign, Activity, X,
  Store, ArrowUpRight, ArrowDownRight, Minus, Users, Info, ArrowLeft, Zap, MapPin, Phone, Mail, Award, LayoutDashboard, Table, ShoppingBag, Target, Percent, ExternalLink, Calculator,
  ShoppingCart, Check, ArrowRight, Settings, List, Tags, Ticket, ChevronDown, Plus, MousePointer, Eye, RefreshCw, BarChart2, FileText, MessageCircle
} from 'lucide-react';

// ============================================================================
// UTILS & CONSTANTS (DASHBOARD)
// ============================================================================
const cleanNumber = (val) => {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val;
  const str = String(val).replace(/[▲▼%,]/g, '').trim();
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

const formatCurrency = (val) => {
  if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(2)}B`;
  if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `Rp ${(val / 1000).toFixed(0)}K`;
  return `Rp ${val}`;
};

const formatMonth = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
};

const COLORS = {
  primary: '#00B14F',   
  growth: '#0ea5e9',    
  decline: '#ef4444',   
  finance: '#f59e0b',   
  lastMonth: '#fb923c', 
  white: '#ffffff',
  slate900: '#0f172a',
  slate500: '#64748b',
  netSales: '#10b981', 
  basketSize: '#3b82f6' 
};

// Fungsi Penentu Klasifikasi Campaign
const getMerchantSegment = (campaignsStr) => {
  const c = campaignsStr ? String(campaignsStr).trim().toLowerCase() : '';
  if (!c || c === '-' || c === '0' || c.includes('no campaign')) return '0 Invest';
  
  const camps = c.split(/[|,]/).map(x => x.trim()).filter(Boolean);
  let hasGMS = false, hasBoosterPlus = false, hasLocal = false;
  
  camps.forEach(camp => {
    if (camp.includes('gms')) hasGMS = true;
    else if (camp.includes('booster+')) hasBoosterPlus = true;
    else hasLocal = true;
  });
  
  if (hasBoosterPlus) return 'Booster+';
  if (hasGMS && hasLocal) return 'GMS & Local';
  if (hasGMS && !hasLocal) return 'GMS Only';
  return 'Local Only';
};

// ============================================================================
// UTILS: INDEXEDDB BROWSER STORAGE (Anti-Quota Exceeded)
// ============================================================================
const DB_NAME = 'AmDashboardDB';
const STORE_NAME = 'merchantsStore';
const DB_VERSION = 1;

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(e.target.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

const saveToIndexedDB = async (key, data) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, key);
    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e.target.error);
  });
};

const loadFromIndexedDB = async (key) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

// ============================================================================
// UTILS, CONSTANTS & COMPONENTS (MERCHANT SIMULATOR)
// ============================================================================
const STRATEGY = {
  'normal': { k: 20, v: 0, tiers: null, title: 'NORMAL', benefits: ['Margin Aman 100%', 'Kestabilan Brand Jangka Panjang'] },
  'puas-cuan': { k: 32, v: 30, tiers: { hemat: { max: 45000, min: 15000 }, ekstra: { max: 80000, min: 35000 } }, title: 'CUAN 32%', benefits: ['Diskon Didukung Grab', 'Volume Penjualan Meningkat Drastis'] },
  'booster': { k: 38, v: 35, tiers: { hemat: { max: 55000, min: 15000 }, ekstra: { max: 100000, min: 35000 } }, title: 'BOOSTER 38%', benefits: ['Prioritas Pencarian Utama', 'Slot Banner Flash Sale Eksklusif'] },
  'cofund': { k: 20, v: 40, tiers: null, title: 'COFUND', benefits: ['Sharing Cost Promo', 'Akses ke Pengguna Baru'] }
};

const VOUCHERS = [
  { code: 'PUAS30', scheme: 'puas-cuan', label: 'Diskon Puas 30%', desc: 'Potongan 30%', disc: 30 },
  { code: 'PUAS35', scheme: 'booster', label: 'Diskon Puas 35%', desc: 'Potongan 35%', disc: 35 },
  { code: 'MITRA50', scheme: 'cofund', label: 'Diskon 40% (Patungan)', desc: 'Sharing Cost', disc: 40 }
];

const METRICS_GUIDE = [
  {
    metric: "CTR (Click-Through Rate)",
    rows: [
      { status: "Buruk", range: "< 1%", desc: "Daya tarik visual rendah. Foto menu tidak menggugah selera, judul kurang menarik.", color: "text-rose-600", bg: "bg-rose-50 border-rose-100" },
      { status: "Sehat", range: "1.5% - 2.5%", desc: "Cukup relevan. Restomu sudah muncul di depan audiens yang tepat.", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
      { status: "Ideal", range: "> 3.5%", desc: "Sangat Menarik. Foto produk sangat kuat dan biasanya dibantu dengan promo.", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" }
    ]
  },
  {
    metric: "CVR (Conversion Rate)",
    rows: [
      { status: "Buruk", range: "< 5%", desc: "Ada hambatan di menu. Mungkin harga terlalu mahal, ongkir tidak masuk akal.", color: "text-rose-600", bg: "bg-rose-50 border-rose-100" },
      { status: "Sehat", range: "8% - 12%", desc: "Menu meyakinkan. Deskripsi jelas dan harga sesuai dengan ekspektasi konsumen.", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
      { status: "Ideal", range: "> 15%", desc: "Mesin Penjual Otomatis. Promo dalam toko sangat efektif mengunci pembeli.", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" }
    ]
  },
  {
    metric: "ROAS (Return on Ad Spend)",
    rows: [
      { status: "Buruk", range: "< 2.5x", desc: "Bakar duit. Pendapatan tidak cukup menutupi biaya (COGS, komisi, iklan).", color: "text-rose-600", bg: "bg-rose-50 border-rose-100" },
      { status: "Sehat", range: "4x - 6x", desc: "Operasional aman. Sudah balik modal dan mulai mendapatkan margin tipis.", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
      { status: "Ideal", range: "> 8x", desc: "Sangat Profitabel. Iklan bekerja sangat efisien. Keuntungan bersih tebal.", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" }
    ]
  }
];

const fNum = (n) => Math.round(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const pNum = (n) => typeof n === 'number' ? n : parseFloat((n||'').toString().replace(/[^0-9]/g, '')) || 0;
const pFloat = (n) => typeof n === 'number' ? n : parseFloat((n||'').toString().replace(/,/g, '.').replace(/[^0-9.]/g, '')) || 0;

const SimLabel = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
    <div className="bg-slate-100 p-1.5 rounded-lg text-slate-500">
      {Icon && <Icon size={16} />}
    </div>
    <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">
      {children}
    </span>
  </div>
);

const SimInputGroup = ({ label, prefix, suffix, value, onChange, type = "text", inputMode }) => (
  <div className="w-full">
    {label && <div className="mb-1.5"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p></div>}
    <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 flex items-center transition-all focus-within:border-[#00B14F] focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100 h-10 md:h-12 shadow-sm">
      {prefix && <span className="text-xs font-bold text-slate-400 mr-2">{prefix}</span>}
      <input 
        type={type}
        inputMode={inputMode || (type === 'number' ? 'decimal' : 'numeric')}
        className="w-full bg-transparent outline-none font-bold text-slate-700 text-sm tabular-nums placeholder:text-slate-300"
        value={value}
        onChange={onChange}
      />
      {suffix && <span className="text-xs font-bold text-slate-400 ml-2">{suffix}</span>}
    </div>
  </div>
);

const SimKpiCard = ({ title, value, sub, valueColor = "text-slate-800", isClickable, onClick, isEditing, editValue, onEditChange, onEditFocus, onEditBlur, icon: Icon, iconColorClass = "text-slate-500", bgBlob = "bg-slate-100" }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-5 rounded-[24px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col justify-center relative overflow-hidden ${isClickable ? 'cursor-pointer hover:border-[#00B14F] group hover:-translate-y-1 transition-all duration-300' : ''}`}
  >
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-40 -mr-4 -mt-4 transition-transform duration-700 ${bgBlob} ${isClickable ? 'group-hover:scale-125' : ''}`}></div>
    
    <div className="flex justify-between items-start mb-3 relative z-10">
       <div className="flex items-center gap-2">
          {Icon && <div className={`p-1.5 rounded-xl bg-slate-50 border border-slate-100 ${iconColorClass}`}><Icon size={16}/></div>}
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
             {title} {isClickable && <MousePointer size={12} className="text-slate-300 group-hover:text-[#00B14F] ml-1"/>}
          </p>
       </div>
    </div>
    
    <div className="mb-2 relative z-10">
      {isEditing !== undefined ? (
         <input 
            className={`w-full bg-transparent border-none outline-none font-black text-2xl md:text-3xl ${valueColor} tabular-nums p-0 focus:ring-0 leading-none`}
            value={isEditing ? editValue : value}
            onChange={(e) => onEditChange(e.target.value)}
            onFocus={onEditFocus}
            onBlur={onEditBlur}
            inputMode="numeric"
            placeholder="0"
          />
      ) : (
         <div className={`text-2xl md:text-3xl font-black tracking-tight leading-none ${valueColor}`}>
           {value}
         </div>
      )}
    </div>
    
    {sub && (
      <div className="mt-auto pt-3 relative z-10">
        <div className="bg-slate-50 inline-block px-2.5 py-1 rounded-lg border border-slate-100">
           <p className="text-[10px] font-bold text-slate-500">{sub}</p>
        </div>
      </div>
    )}
  </div>
);

// ============================================================================
// KOMPONEN: TAB MERCHANT SIMULATOR
// ============================================================================
const MerchantSimulator = () => {
  const [page, setPage] = useState('calc'); 
  const [scheme, setScheme] = useState('normal');
  const [tier, setTier] = useState('hemat');
  const [subMode, setSubMode] = useState('val'); 
  const [activeModal, setActiveModal] = useState(null); 

  const [inputs, setInputs] = useState({
    mainVal: "25.000", subVal: "0", menuName: "Menu Baru", kPct: 20, vDisk: 0, mDisk: "0", minO: "0", mShare: 50
  });

  const [histData, setHistData] = useState({ omset: "50.000.000", orders: "1000", aov: "50.000", invest: "5" });
  const [growthProj, setGrowthProj] = useState(20);
  const [futureCostPct, setFutureCostPct] = useState(5); 

  const [adsBudget, setAdsBudget] = useState("30.000"); 
  const [adsType, setAdsType] = useState('keyword'); 
  const [cpcBid, setCpcBid] = useState("2.500");
  const [adsCvr, setAdsCvr] = useState("15"); 
  const [adsCtr, setAdsCtr] = useState("3.5");

  const [localAppPrice, setLocalAppPrice] = useState("");
  const [isEditingAppPrice, setIsEditingAppPrice] = useState(false);

  const [cart, setCart] = useState([]);
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [deliveryType, setDeliveryType] = useState('prioritas');
  const [showVoucherDropdown, setShowVoucherDropdown] = useState(false);

  const calc = useMemo(() => {
    const off = pNum(inputs.mainVal); const subRaw = pNum(inputs.subVal); const actSub = subMode === 'val' ? subRaw : (off * subRaw / 100);
    const k = pNum(inputs.kPct); const v = pNum(inputs.vDisk); const md = pNum(inputs.mDisk) || Infinity; const s = pNum(inputs.mShare);

    const list = Math.ceil(((off - actSub) / (1 - k / 100)) / 100) * 100;
    const disc = Math.round(Math.min(list * v / 100, md));
    const pay = list - disc;
    let mPromoCost = 0; if (scheme === 'cofund') mPromoCost = Math.round((s / 100) * (v / 100) * list);
    
    const commAmount = (list - mPromoCost) * (k/100); 
    const net = Math.round(list - commAmount - mPromoCost);
    const totalCut = list - net;
    const mexInvestPct = list > 0 ? (totalCut / list) * 100 : 0;
    
    return { list, pay, net, mPromoCost, totalDisc: disc, mexInvestPct };
  }, [inputs, subMode, scheme]);

  useEffect(() => {
    const conf = STRATEGY[scheme];
    setInputs(prev => ({ ...prev, kPct: conf.k, vDisk: conf.v, mDisk: conf.tiers ? fNum(conf.tiers[tier].max) : "0", minO: conf.tiers ? fNum(conf.tiers[tier].min) : "0" }));
  }, [scheme, tier]);

  useEffect(() => {
    if (adsType === 'keyword') { setCpcBid("2.500"); setAdsCvr("15"); setAdsCtr("3.5"); } 
    else if (adsType === 'banner') { setCpcBid("800"); setAdsCvr("5"); setAdsCtr("1.2"); } 
    else if (adsType === 'cpo') { setCpcBid("8.000"); setAdsCvr("100"); setAdsCtr("2.0"); }
  }, [adsType]);

  const handleInputChange = (key, value) => {
    let cleanVal = value;
    if (['mainVal', 'subVal', 'mDisk', 'minO'].includes(key)) cleanVal = fNum(pNum(value));
    setInputs(prev => ({ ...prev, [key]: cleanVal }));
  };

  const handleHistChange = (key, value) => {
    if (key === 'invest') { setHistData(prev => ({ ...prev, [key]: value.replace(/[^0-9.,]/g, '') })); return; }
    const rawVal = pNum(value);
    setHistData(prev => {
      const curOrders = pNum(prev.orders); const curAov = pNum(prev.aov);
      let newData = { ...prev, [key]: fNum(rawVal) };
      if (key === 'omset') { if (curOrders > 0) newData.aov = fNum(rawVal / curOrders); } 
      else if (key === 'orders') { newData.omset = fNum(rawVal * curAov); } 
      else if (key === 'aov') { newData.omset = fNum(curOrders * rawVal); }
      return newData;
    });
  };

  const handleAppPriceManual = (val) => {
    const rawVal = parseInt(val.replace(/[^0-9]/g, '') || '0', 10);
    setLocalAppPrice(fNum(rawVal));
    const k = pNum(inputs.kPct); const subRaw = pNum(inputs.subVal); const actSub = subMode === 'val' ? subRaw : (pNum(inputs.mainVal) * subRaw / 100);
    setInputs(prev => ({ ...prev, mainVal: fNum(Math.round(rawVal * (1 - k / 100) + actSub)) }));
  };

  const handleTargetOrderChange = (val) => {
    const rawVal = pNum(val); const baseOrders = pNum(histData.orders);
    if (baseOrders > 0) setGrowthProj(((rawVal - baseOrders) / baseOrders) * 100);
  };

  const addToCart = () => {
    const priceToCart = pNum(isEditingAppPrice ? localAppPrice : calc.list);
    const newItem = { id: Date.now(), name: inputs.menuName, price: priceToCart, qty: 1 };
    setCart(prev => {
      const idx = prev.findIndex(i => i.name === newItem.name && i.price === newItem.price);
      if (idx > -1) { const next = [...prev]; next[idx].qty += 1; return next; }
      return [...prev, newItem];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, qty: Math.max(1, item.qty + delta) };
      return item;
    }));
  };

  const selectVoucher = (v) => { setActiveVoucher(v); setShowVoucherDropdown(false); };

  const checkout = useMemo(() => {
    const baseOngkir = { prioritas: 15000, standar: 10000, hemat: 5000 }[deliveryType];
    let subtotal = cart.reduce((a, b) => a + (b.price * b.qty), 0);
    let totalPotDisc = 0, schemeKey = 'normal', totalMerchantCost = 0, limitMin = 0, limitMax = Infinity, thresholdMet = true;

    if (activeVoucher) {
      schemeKey = activeVoucher.scheme; const conf = STRATEGY[schemeKey];
      if (conf.tiers && conf.tiers[tier]) { limitMin = conf.tiers[tier].min; limitMax = conf.tiers[tier].max; } 
      else if (schemeKey === 'cofund') { limitMin = pNum(inputs.minO); limitMax = pNum(inputs.mDisk) || Infinity; }

      if (subtotal >= limitMin) {
        totalPotDisc = Math.min(Math.round(subtotal * (activeVoucher.disc / 100)), limitMax);
        if (schemeKey === 'cofund') totalMerchantCost = Math.round(totalPotDisc * (inputs.mShare / 100));
      } else { thresholdMet = false; }
    }
    const ongkirDisc = (schemeKey !== 'normal') ? 10000 : 0;
    return { subtotal, finalDisc: totalPotDisc, finalOngkir: Math.max(0, baseOngkir - ongkirDisc), total: subtotal - totalPotDisc + Math.max(0, baseOngkir - ongkirDisc) + 1500, ongkirDisc, totalMerchantCost, schemeKey, limitMin, limitMax, thresholdMet };
  }, [cart, activeVoucher, deliveryType, inputs.mShare, inputs.minO, inputs.mDisk, tier]);

  const projection = useMemo(() => {
    const hOmset = pNum(histData.omset); const hOrders = pNum(histData.orders); const hAOV = pNum(histData.aov); const hInvestPct = pFloat(histData.invest); 
    const pOrders = Math.round(hOrders * (1 + growthProj / 100));
    const newAOV = checkout.subtotal > 0 ? checkout.subtotal : hAOV;
    const pOmset = pOrders * newAOV;
    const futureInvestPct = pFloat(futureCostPct);
    const pInvestTotal = Math.round(pOmset * (futureInvestPct / 100));
    return { 
      hOmset, hOrders, hDailyOrders: hOrders > 0 ? Math.round(hOrders / 30) : 0, hInvestAmount: Math.round(hOmset * (hInvestPct / 100)), hInvestPct, hNet: hOmset - Math.round(hOmset * (hInvestPct / 100)), hAOV, 
      pOmset, pOrders, pDailyOrders: Math.round(pOrders / 30), pInvestTotal, pNet: pOmset - pInvestTotal, newAOV, futureInvestPct 
    };
  }, [histData, growthProj, checkout, futureCostPct]);

  const adsSim = useMemo(() => {
    const budget = pNum(adsBudget); const costUnit = pNum(cpcBid) || 0; const cvrVal = pNum(adsCvr) || 0; const ctrVal = pNum(adsCtr) || 0.1; 
    const cvr = cvrVal / 100; const ctr = ctrVal / 100; const baseAOV = pNum(histData.aov) || 40000;
    let estClicks, estOrders, estGrossSales, roas, actualCost, estImpressions;

    if (adsType === 'cpo') {
       estOrders = Math.floor(budget / (costUnit || 10000)); actualCost = estOrders * (costUnit || 10000); estGrossSales = estOrders * baseAOV;
       estClicks = cvr > 0 ? Math.round(estOrders / (cvrVal > 99 ? 0.2 : cvr)) : 0; estImpressions = ctr > 0 ? Math.round(estClicks / ctr) : 0;
       roas = actualCost > 0 ? (estGrossSales / actualCost) : 0;
    } else {
       const cpc = costUnit || (adsType === 'keyword' ? 2500 : 800);
       estClicks = Math.floor(budget / cpc); estOrders = Math.floor(estClicks * cvr); actualCost = estClicks * cpc; estGrossSales = estOrders * baseAOV;
       roas = budget > 0 ? (estGrossSales / budget) : 0; estImpressions = ctr > 0 ? Math.round(estClicks / ctr) : 0;
    }
    return { cpc: costUnit, estClicks, cvr, ctrVal, estImpressions, estOrders, estGrossSales, roas, baseAOV, actualCost };
  }, [adsBudget, adsType, histData.aov, cpcBid, adsCvr, adsCtr]);

  return (
    <div className="animate-in fade-in duration-500 relative z-10">
        
        {/* MODAL BREAKDOWN */}
        {activeModal && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
            <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                 <h3 className="font-bold text-sm uppercase tracking-widest text-slate-800">
                   {activeModal === 'cust' ? 'Payment Breakdown' : 'Revenue Breakdown'}
                 </h3>
                 <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Harga Aplikasi</span>
                  <span className="font-bold text-slate-800">Rp {fNum(calc.list)}</span>
                </div>
                {activeModal === 'cust' ? (
                  <div className="flex justify-between text-sm text-rose-500 font-medium">
                    <span>Diskon Campaign</span>
                    <span className="font-bold">- Rp {fNum(calc.list - calc.pay)}</span>
                  </div>
                ) : (
                  <Fragment>
                    <div className="flex justify-between text-sm text-slate-500 font-medium">
                      <span>Komisi Grab ({inputs.kPct}%)</span>
                      <span className="font-bold text-slate-800">- Rp {fNum((calc.list - calc.mPromoCost) * (pNum(inputs.kPct)/100))}</span>
                    </div>
                    {scheme === 'cofund' && (
                      <div className="flex justify-between text-sm text-blue-600 font-medium">
                        <span>Beban Toko</span>
                        <span className="font-bold">- Rp {fNum(calc.mPromoCost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-amber-600 pt-2 border-t border-slate-100 font-medium">
                      <span>Mex Investment</span>
                      <span className="font-bold">{calc.mexInvestPct.toFixed(1)}%</span>
                    </div>
                  </Fragment>
                )}
                <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {activeModal === 'cust' ? 'Total Bayar' : 'Net Bersih'}
                  </span>
                  <span className={`text-2xl font-black tracking-tight ${activeModal === 'cust' ? 'text-[#00B14F]' : 'text-blue-600'}`}>
                    Rp {fNum(activeModal === 'cust' ? calc.pay : calc.net)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOP SUB-NAVIGATION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2 drop-shadow-md">
                 <Calculator className="w-6 h-6 text-emerald-400"/> Merchant Simulator
              </h2>
              <p className="text-xs text-slate-300 font-medium mt-1">Simulasikan margin, harga coret, ongkir, hingga ROAS Ads.</p>
            </div>
            
            <div className="flex bg-slate-900/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-xl overflow-x-auto w-full sm:w-auto custom-scrollbar">
               <button onClick={() => setPage('calc')} className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${page === 'calc' ? 'bg-[#00B14F] text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                   <Calculator className="w-4 h-4" /> Margin
               </button>
               <button onClick={() => setPage('checkout')} className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${page === 'checkout' ? 'bg-[#00B14F] text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                   <ShoppingCart className="w-4 h-4" /> Checkout {cart.length > 0 && <span className="bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] ml-1">{cart.length}</span>}
               </button>
               <button onClick={() => setPage('prospect')} className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${page === 'prospect' ? 'bg-[#00B14F] text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                   <TrendingUp className="w-4 h-4" /> Proyeksi
               </button>
               <button onClick={() => setPage('ads')} className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${page === 'ads' ? 'bg-[#00B14F] text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                   <Megaphone className="w-4 h-4" /> Ads
               </button>
            </div>
        </div>

        {/* DYNAMIC TOP PANELS (SIMULATOR) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-8">
            {page === 'prospect' ? (
              <Fragment>
                <SimKpiCard title="AOV Lama" icon={ShoppingBag} iconColorClass="text-slate-500" bgBlob="bg-slate-100" value={`Rp ${fNum(projection.hAOV)}`} sub={`${fNum(projection.hOrders)} Order/Bulan`} valueColor="text-slate-700" />
                <SimKpiCard title="AOV Baru (Est)" icon={TrendingUp} iconColorClass="text-emerald-500" bgBlob="bg-gradient-to-br from-emerald-100 to-transparent" value={`Rp ${fNum(projection.newAOV)}`} sub={`${fNum(projection.pOrders)} Order/Bulan`} valueColor="text-emerald-600" />
                <SimKpiCard title="Selisih Profit" icon={DollarSign} iconColorClass={projection.pNet >= projection.hNet ? 'text-blue-500' : 'text-rose-500'} bgBlob={projection.pNet >= projection.hNet ? 'bg-gradient-to-br from-blue-100 to-transparent' : 'bg-gradient-to-br from-rose-100 to-transparent'} value={`${projection.pNet >= projection.hNet ? '+' : ''}Rp ${fNum(projection.pNet - projection.hNet)}`} valueColor={projection.pNet >= projection.hNet ? 'text-blue-600' : 'text-rose-500'} />
              </Fragment>
            ) : page === 'checkout' ? (
               <Fragment>
                <SimKpiCard title="Subtotal Cart" icon={ShoppingCart} iconColorClass="text-slate-500" bgBlob="bg-slate-100" value={`Rp ${fNum(checkout.subtotal)}`} valueColor="text-slate-700" />
                <SimKpiCard title="Promo Terpakai" icon={Zap} iconColorClass={activeVoucher ? "text-emerald-500" : "text-slate-400"} bgBlob={activeVoucher ? "bg-gradient-to-br from-emerald-100 to-transparent" : "bg-slate-100"} value={activeVoucher ? activeVoucher.code : 'NORMAL'} valueColor={activeVoucher ? 'text-emerald-600' : 'text-slate-400'} />
                <SimKpiCard title="Total Diskon" icon={Ticket} iconColorClass="text-rose-500" bgBlob="bg-gradient-to-br from-rose-100 to-transparent" value={checkout.finalDisc > 0 ? `- Rp ${fNum(checkout.finalDisc)}` : '-'} valueColor="text-rose-500" />
               </Fragment>
            ) : page === 'ads' ? (
               <Fragment>
                <SimKpiCard title="Model Ads" icon={Megaphone} iconColorClass="text-slate-500" bgBlob="bg-slate-100" value={adsType === 'cpo' ? 'Pesanan' : adsType.toUpperCase()} valueColor="text-slate-700" />
                <SimKpiCard title={adsType === 'cpo' ? 'Biaya/Order' : 'Bid CPC'} icon={DollarSign} iconColorClass="text-slate-500" bgBlob="bg-slate-100" value={`Rp ${fNum(pNum(cpcBid))}`} valueColor="text-slate-700" />
                <SimKpiCard title="Target ROAS" icon={Target} iconColorClass={adsSim.roas >= 5 ? 'text-emerald-500' : adsSim.roas >= 3 ? 'text-blue-500' : 'text-rose-500'} bgBlob={adsSim.roas >= 5 ? 'bg-gradient-to-br from-emerald-100 to-transparent' : adsSim.roas >= 3 ? 'bg-gradient-to-br from-blue-100 to-transparent' : 'bg-gradient-to-br from-rose-100 to-transparent'} value={`${adsSim.roas.toFixed(1)}x`} valueColor={adsSim.roas >= 5 ? 'text-emerald-600' : adsSim.roas >= 3 ? 'text-blue-500' : 'text-rose-500'} />
               </Fragment>
            ) : (
              <Fragment>
                <SimKpiCard title="Harga Aplikasi" icon={List} iconColorClass="text-slate-500" bgBlob="bg-slate-100" value={`Rp ${fNum(calc.list)}`} valueColor="text-slate-800"
                   isEditing={isEditingAppPrice} editValue={localAppPrice} 
                   onEditChange={handleAppPriceManual} onEditFocus={() => { setIsEditingAppPrice(true); setLocalAppPrice(fNum(calc.list)); }} onEditBlur={() => { setIsEditingAppPrice(false); setLocalAppPrice(fNum(calc.list)); }}
                />
                <SimKpiCard title="Pax Pays (Bayar)" icon={ShoppingCart} iconColorClass="text-emerald-500" bgBlob="bg-gradient-to-br from-emerald-100 to-transparent" value={`Rp ${fNum(calc.pay)}`} sub={calc.list > calc.pay ? `Coret dari Rp ${fNum(calc.list)}` : 'Harga Normal'} valueColor="text-[#00B14F]" isClickable onClick={() => setActiveModal('cust')} />
                <SimKpiCard title="Net Rev (Bersih)" icon={Activity} iconColorClass="text-blue-500" bgBlob="bg-gradient-to-br from-blue-100 to-transparent" value={`Rp ${fNum(calc.net)}`} sub={`Mex Inv: ${calc.mexInvestPct.toFixed(1)}%`} valueColor="text-blue-600" isClickable onClick={() => setActiveModal('net')} />
              </Fragment>
            )}
        </div>

        {/* TAB CONTENTS */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 mb-10 relative z-10">
          
          {/* TAB 1: MARGIN CALC */}
          {page === 'calc' && (
            <div className="space-y-8">
              <div className="border-b border-slate-100 pb-8">
                <SimLabel icon={Tags}>1. Strategi Campaign</SimLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {Object.keys(STRATEGY).map(k => {
                    const isActive = scheme === k;
                    return (
                      <button 
                        key={k} onClick={() => setScheme(k)} 
                        className={`py-4 rounded-2xl text-xs font-black uppercase transition-all duration-200 border-2 relative
                          ${isActive ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md shadow-emerald-500/10' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                      >
                        {k === 'normal' ? 'Normal' : k === 'puas-cuan' ? 'Cuan 32%' : k === 'booster' ? 'Boost 38%' : 'CoFund'}
                      </button>
                    )
                  })}
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex-1">
                    <h2 className="font-black text-sm md:text-base text-slate-800 tracking-tight mb-3">{STRATEGY[scheme].title}</h2>
                    <div className="flex flex-col gap-2">
                      {STRATEGY[scheme].benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="text-emerald-500 mt-0.5 shrink-0"><Check size={14} strokeWidth={4}/></div>
                          <span className="text-xs md:text-sm font-bold text-slate-600 leading-snug">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {STRATEGY[scheme].tiers && (
                    <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm self-start">
                      {['hemat', 'ekstra'].map(t => (
                        <button key={t} onClick={() => setTier(t)} className={`px-5 py-2.5 rounded-lg text-[11px] font-black uppercase transition-all ${tier === t ? 'bg-[#00B14F] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>{t}</button>
                      ))}
                    </div>
                  )}
                </div>

                {scheme === 'cofund' && (
                  <div className="mt-5 bg-blue-50/80 rounded-2xl p-5 border border-blue-200">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-blue-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-blue-800">Mex Promo Share</span>
                      </div>
                      <span className="text-sm font-black bg-white text-blue-600 px-3 py-1 rounded-lg border border-blue-200 shadow-sm">{inputs.mShare}%</span>
                    </div>
                    <input type="range" min="0" max="100" step="5" value={inputs.mShare} onChange={(e) => setInputs(prev => ({ ...prev, mShare: parseInt(e.target.value) }))} className="w-full h-2.5 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-4" />
                    <div className="flex justify-between items-end bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                      <div className="text-left"><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Beban Toko</p><p className="font-black text-base text-slate-800">Rp {fNum(calc.mPromoCost)}</p></div>
                      <div className="text-right"><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Beban Grab</p><p className="font-black text-base text-blue-600">Rp {fNum(calc.totalDisc - calc.mPromoCost)}</p></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                {/* Left: Input Menu */}
                <div>
                   <SimLabel icon={List}>2. Harga Menu</SimLabel>
                   <div className="space-y-5 mb-6">
                      <SimInputGroup label="Harga Jual Offline" prefix="Rp" value={inputs.mainVal} onChange={(e) => handleInputChange('mainVal', e.target.value)} />
                      
                      <div>
                        <div className="mb-2"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subsidi Toko / Mark-up</p></div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 flex items-center transition-all focus-within:border-[#00B14F] focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100 h-12 shadow-sm">
                          <input type="text" inputMode="numeric" className="w-full bg-transparent outline-none font-bold text-slate-700 text-base tabular-nums placeholder:text-slate-300" value={inputs.subVal} onChange={(e) => handleInputChange('subVal', e.target.value)} />
                          <div className="flex bg-slate-200/60 rounded-lg p-1 ml-3 shrink-0 gap-1 border border-slate-200">
                            <button onClick={() => setSubMode('val')} className={`w-10 h-7 flex items-center justify-center text-xs font-black rounded-md transition-all ${subMode === 'val' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>Rp</button>
                            <button onClick={() => setSubMode('pct')} className={`w-10 h-7 flex items-center justify-center text-xs font-black rounded-md transition-all ${subMode === 'pct' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>%</button>
                          </div>
                        </div>
                      </div>
                   </div>
                   <div className="flex gap-4 items-end pt-5 border-t border-slate-100">
                      <SimInputGroup label="Nama Menu" value={inputs.menuName} onChange={(e) => handleInputChange('menuName', e.target.value)} inputMode="text" />
                      <button onClick={addToCart} className="h-12 px-6 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2 shrink-0">Add <ArrowRight size={16} strokeWidth={3}/></button>
                   </div>
                </div>

                {/* Right: Config */}
                <div>
                  <SimLabel icon={Settings}>3. Aturan Skema</SimLabel>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                    <SimInputGroup label="Komisi" suffix="%" value={inputs.kPct} type="number" onChange={(e) => handleInputChange('kPct', e.target.value)} />
                    <SimInputGroup label="Diskon" suffix="%" value={inputs.vDisk} type="number" onChange={(e) => handleInputChange('vDisk', e.target.value)} />
                    <SimInputGroup label="Min. Order" prefix="Rp" value={inputs.minO} onChange={(e) => handleInputChange('minO', e.target.value)} />
                    <SimInputGroup label="Max. Disk" prefix="Rp" value={inputs.mDisk} onChange={(e) => handleInputChange('mDisk', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHECKOUT */}
          {page === 'checkout' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
               <div className="space-y-6">
                  <div className="border border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50/50">
                    <SimLabel icon={Info}>1. Pengiriman</SimLabel>
                    <div className="space-y-3">
                      {['prioritas', 'standar', 'hemat'].map(id => (
                        <div key={id} onClick={() => setDeliveryType(id)} className={`p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${deliveryType === id ? 'bg-emerald-50 border-emerald-400 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryType === id ? 'border-emerald-500' : 'border-slate-300'}`}>
                              {deliveryType === id && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"/>}
                            </div>
                            <div>
                              <p className={`font-black text-xs md:text-sm uppercase tracking-wider ${deliveryType === id ? 'text-emerald-800' : 'text-slate-700'}`}>{id}</p>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Est. {id === 'prioritas' ? '20' : id === 'standar' ? '30' : '45'} mnt</p>
                            </div>
                          </div>
                          <div className="text-right">
                             {checkout.ongkirDisc > 0 ? (
                               <Fragment>
                                 <span className="block text-[10px] text-slate-400 line-through font-medium">Rp {fNum(id === 'prioritas' ? 15000 : id === 'standar' ? 10000 : 5000)}</span>
                                 <span className="block font-black text-base text-emerald-600">Rp {fNum(Math.max(0, (id === 'prioritas' ? 15000 : id === 'standar' ? 10000 : 5000) - checkout.ongkirDisc))}</span>
                               </Fragment>
                             ) : (
                               <span className="font-black text-base text-slate-700">Rp {fNum(id === 'prioritas' ? 15000 : id === 'standar' ? 10000 : 5000)}</span>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50/50">
                    <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-100 p-2 rounded-xl text-slate-500"><ShoppingCart size={18} /></div>
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">2. Rincian Item</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-700 text-[11px] font-black px-3 py-1 rounded-lg border border-emerald-200 shadow-sm">{cart.reduce((a,b)=>a+b.qty,0)} Item</span>
                    </div>
                    <div className="space-y-4">
                      {cart.length === 0 ? (
                         <div className="text-center py-10 text-slate-400 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-2xl bg-white">Keranjang Kosong</div>
                      ) : cart.map(item => {
                        return (
                          <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-sm border border-emerald-100">{item.qty}</div>
                              <div>
                                <p className="font-black text-xs text-slate-800 mb-1">{item.name}</p>
                                <div className="flex items-center gap-3">
                                  <button onClick={() => updateCartQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200"><Minus size={12} strokeWidth={3} /></button>
                                  <span className="text-xs font-black text-slate-800 w-3 text-center">{item.qty}</span>
                                  <button onClick={() => updateCartQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-emerald-100 rounded-lg text-emerald-700 hover:bg-emerald-200"><Plus size={12} strokeWidth={3} /></button>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-slate-800 text-sm md:text-base">Rp {fNum(item.price * item.qty)}</p>
                              <button onClick={() => setCart(prev => prev.filter(i=>i.id!==item.id))} className="text-[10px] text-red-500 font-bold hover:text-red-700 uppercase tracking-widest mt-1.5">Hapus</button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
               </div>

               <div className="space-y-6 flex flex-col">
                   <div className="border border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50/50 h-full flex flex-col">
                      <SimLabel icon={Ticket}>3. Voucher & Promo</SimLabel>
                      <div className="relative mb-6">
                        <button onClick={() => setShowVoucherDropdown(!showVoucherDropdown)} className={`w-full p-4 md:p-5 rounded-2xl border-2 flex justify-between items-center transition-all bg-white shadow-sm ${activeVoucher ? 'border-emerald-400 ring-4 ring-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeVoucher ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}><Ticket size={20} /></div>
                            <div className="text-left">
                              <p className={`text-xs md:text-sm font-black uppercase tracking-wider ${activeVoucher ? 'text-emerald-800' : 'text-slate-600'}`}>{activeVoucher ? activeVoucher.code : 'Pilih Voucher'}</p>
                              <p className={`text-[10px] md:text-xs font-bold mt-1 ${activeVoucher ? 'text-emerald-500' : 'text-slate-400'}`}>{activeVoucher ? activeVoucher.label : 'Makin hemat pakai promo'}</p>
                            </div>
                          </div>
                          <ChevronDown size={20} className={`transition-transform duration-300 ${showVoucherDropdown ? 'rotate-180' : ''} ${activeVoucher ? 'text-emerald-600' : 'text-slate-400'}`}/>
                        </button>

                        {showVoucherDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100" onClick={() => selectVoucher(null)}>
                              <div className="flex justify-between items-center">
                                <div><p className="text-xs font-black text-slate-700">NORMAL</p><p className="text-[10px] text-slate-500 font-medium">Tanpa Voucher (Harga Normal)</p></div>
                                {!activeVoucher && <Check size={18} className="text-[#00B14F]" />}
                              </div>
                            </div>
                            {VOUCHERS.map((v, i) => (
                              <div key={i} className="p-4 hover:bg-emerald-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors" onClick={() => selectVoucher(v)}>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-xs font-black text-[#00B14F]">{v.code}</p>
                                    <p className="text-[10px] font-bold text-slate-700 mt-1">{v.label}</p>
                                  </div>
                                  {activeVoucher?.code === v.code && <Check size={18} className="text-[#00B14F]" />}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {activeVoucher && (
                        <div className="mb-6 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                          <div className="flex justify-between text-xs mb-2"><span className="text-slate-500 font-bold">Min. Order</span><span className="font-black text-slate-800">Rp {fNum(checkout.limitMin)}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Max. Diskon</span><span className="font-black text-slate-800">{checkout.limitMax === Infinity ? 'Tanpa Batas' : `Rp ${fNum(checkout.limitMax)}`}</span></div>
                          {!checkout.thresholdMet && (<div className="mt-4 text-[10px] text-rose-600 font-bold flex items-center gap-2 bg-rose-50 p-3 rounded-xl border border-rose-100"><AlertCircle size={14} /> Belum memenuhi minimum order</div>)}
                        </div>
                      )}

                      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200 mt-auto">
                        <div className="space-y-4 mb-5">
                            <div className="flex justify-between text-xs md:text-sm font-bold text-slate-600"><span>Subtotal</span><span>Rp {fNum(checkout.subtotal)}</span></div>
                            <div className="flex justify-between text-xs md:text-sm font-bold text-slate-600"><span>Ongkos Kirim</span><span>Rp {fNum(checkout.finalOngkir)}</span></div>
                            <div className="flex justify-between text-xs md:text-sm font-bold text-slate-600"><span>Biaya Layanan</span><span>Rp 1.500</span></div>
                            {checkout.finalDisc > 0 && (<div className="flex justify-between text-xs md:text-sm font-black text-emerald-600 pt-4 border-t border-slate-100"><span className="flex items-center gap-1.5"><Zap size={14}/> Promo Aktif</span><span>- Rp {fNum(checkout.finalDisc)}</span></div>)}
                            
                            {checkout.schemeKey === 'cofund' && checkout.totalMerchantCost > 0 && (
                              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 mt-3">
                                <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-2">Rincian Patungan (Cofund)</p>
                                <div className="flex justify-between text-[11px] mb-1.5"><span className="text-slate-600 font-medium">Beban Toko</span><span className="font-bold text-slate-800">Rp {fNum(checkout.totalMerchantCost)}</span></div>
                                <div className="flex justify-between text-[11px]"><span className="text-slate-600 font-medium">Beban Grab</span><span className="font-bold text-slate-800">Rp {fNum(checkout.finalDisc - checkout.totalMerchantCost)}</span></div>
                              </div>
                            )}
                        </div>

                        <div className="pt-5 mt-3 border-t-2 border-slate-100 border-dashed">
                          <div className="flex justify-between items-end mb-6">
                              <div>
                                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Tagihan</p>
                                  <p className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Rp {fNum(checkout.total)}</p>
                              </div>
                          </div>
                          <button className="w-full bg-[#00B14F] hover:bg-emerald-600 text-white p-4 md:p-5 rounded-2xl font-black text-sm md:text-base uppercase tracking-wider shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex justify-center items-center gap-3 group">
                              Simulasi Pesan <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform"/>
                          </button>
                        </div>
                      </div>
                   </div>
               </div>
            </div>
          )}

          {/* TAB 3: PROSPECT */}
          {page === 'prospect' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-6">
                <div className="border border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50/50">
                  <SimLabel icon={BarChart2}>1. Data Historis (Bulan Lalu)</SimLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <SimInputGroup label="Omset Penjualan" prefix="Rp" value={histData.omset} onChange={(e) => handleHistChange('omset', e.target.value)} />
                    <SimInputGroup label="Jumlah Order" value={histData.orders} onChange={(e) => handleHistChange('orders', e.target.value)} />
                    <SimInputGroup label="AOV (Rata2 Order)" prefix="Rp" value={histData.aov} onChange={(e) => handleHistChange('aov', e.target.value)} />
                    <SimInputGroup label="Beban Promo/Ads" suffix="%" value={histData.invest} onChange={(e) => handleHistChange('invest', e.target.value)} />
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50/50">
                  <SimLabel icon={TrendingUp}>2. Target Proyeksi Baru</SimLabel>
                  <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kenaikan Order</span>
                      <span className="text-2xl font-black text-[#00B14F] bg-green-50 px-3 py-1 rounded-xl border border-green-100">+{growthProj}%</span>
                    </div>
                    <input type="range" min="0" max="200" step="5" value={growthProj} onChange={(e) => setGrowthProj(Number(e.target.value))} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00B14F]" />
                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Est. Total Order Baru</div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
                        <input type="text" inputMode="numeric" className="bg-transparent outline-none font-black text-slate-800 text-lg tabular-nums w-20 text-right" value={fNum(Math.round(pNum(histData.orders) * (1 + growthProj/100)))} onChange={(e) => handleTargetOrderChange(e.target.value)} />
                        <span className="text-xs font-bold text-slate-400">Trx</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {/* Historis Summary */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5 relative z-10">Ringkasan Bulan Lalu</p>
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-end"><p className="text-xs font-bold text-slate-500 uppercase">Omset</p><p className="text-xl font-black text-slate-800">Rp {fNum(projection.hOmset)}</p></div>
                    <div className="flex justify-between items-end"><p className="text-xs font-bold text-slate-500 uppercase">Orders</p><p className="text-lg font-black text-slate-700">{fNum(projection.hOrders)} <span className="text-[11px] font-medium text-slate-400 ml-1">({fNum(projection.hDailyOrders)}/hr)</span></p></div>
                    <div className="flex justify-between items-end"><p className="text-xs font-bold text-slate-500 uppercase">AOV</p><p className="text-lg font-black text-slate-700">Rp {fNum(projection.hAOV)}</p></div>
                    <div className="flex justify-between items-end"><p className="text-xs font-bold text-slate-500 uppercase">Beban ({projection.hInvestPct}%)</p><p className="text-lg font-black text-rose-500">Rp {fNum(projection.hInvestAmount)}</p></div>
                    <div className="flex justify-between items-end pt-4 border-t border-slate-100 mt-2"><p className="text-sm font-black text-slate-800 uppercase">Net Profit</p><p className="text-2xl font-black text-blue-600">Rp {fNum(projection.hNet)}</p></div>
                  </div>
                </div>

                {/* Proyeksi Summary */}
                <div className="bg-emerald-50 rounded-3xl p-6 md:p-8 border border-emerald-200 shadow-xl shadow-emerald-500/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-100 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none"></div>
                  <p className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-5 relative z-10">Simulasi Masa Depan</p>
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-end"><p className="text-xs font-bold text-emerald-800 uppercase">Est. Omset</p><p className="text-2xl font-black text-emerald-900 tracking-tight">Rp {fNum(projection.pOmset)}</p></div>
                    <div className="flex justify-between items-end">
                       <div className="flex flex-col"><p className="text-xs font-bold text-emerald-800 uppercase">Est. Orders</p><span className="text-[10px] font-black text-emerald-600 mt-1">+{growthProj.toFixed(0)}% Kenaikan</span></div>
                       <p className="text-lg font-black text-emerald-800">{fNum(projection.pOrders)} <span className="text-[11px] font-medium text-emerald-600/70 ml-1">({fNum(projection.pDailyOrders)}/hr)</span></p>
                    </div>
                    <div className="flex justify-between items-end">
                       <div className="flex flex-col"><p className="text-xs font-bold text-emerald-800 uppercase">Est. AOV</p><span className="text-[10px] font-bold text-emerald-600/70 mt-1">Diambil dari Cart</span></div>
                       <p className="text-lg font-black text-emerald-800">Rp {fNum(projection.newAOV)}</p>
                    </div>
                    <div className="flex justify-between items-end">
                       <div className="flex flex-col gap-1.5"><p className="text-xs font-bold text-emerald-800 uppercase">Est. Beban</p><div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-emerald-200 w-fit shadow-sm"><input type="number" value={futureCostPct} onChange={(e) => setFutureCostPct(e.target.value)} className="bg-transparent text-emerald-800 font-black text-sm w-10 outline-none text-center" /><span className="text-[10px] font-black text-emerald-500">%</span></div></div>
                       <p className="text-lg font-black text-rose-500">Rp {fNum(projection.pInvestTotal)}</p>
                    </div>
                    <div className="flex justify-between items-end pt-5 border-t border-emerald-200/50 mt-2"><p className="text-sm font-black text-emerald-900 uppercase">Est. Net Profit</p><p className="text-3xl font-black text-[#00B14F] tracking-tight">Rp {fNum(projection.pNet)}</p></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADS */}
          {page === 'ads' && (
            <div className="space-y-8 pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-6">
                  <div className="border border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50/50">
                    <SimLabel icon={Megaphone}>1. Pilih Jenis Iklan</SimLabel>
                    <div className="space-y-3">
                      <div onClick={() => setAdsType('keyword')} className={`p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all bg-white ${adsType === 'keyword' ? 'border-[#00B14F] shadow-lg shadow-emerald-500/10 ring-1 ring-green-100' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex justify-between items-start mb-2"><h4 className="font-black text-sm text-slate-800">Pencarian (Keyword)</h4>{adsType === 'keyword' && <Check size={18} className="text-[#00B14F]" />}</div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">Tampil di hasil pencarian. Bayar per klik (CPC). Sangat cocok menangkap niat beli tinggi.</p>
                      </div>
                      <div onClick={() => setAdsType('banner')} className={`p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all bg-white ${adsType === 'banner' ? 'border-[#00B14F] shadow-lg shadow-emerald-500/10 ring-1 ring-green-100' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex justify-between items-start mb-2"><h4 className="font-black text-sm text-slate-800">Jelajah (Banner)</h4>{adsType === 'banner' && <Check size={18} className="text-[#00B14F]" />}</div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">Tampil di halaman utama. Cocok untuk membangun brand awareness toko Anda.</p>
                      </div>
                      <div onClick={() => setAdsType('cpo')} className={`p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all bg-white ${adsType === 'cpo' ? 'border-[#00B14F] shadow-lg shadow-emerald-500/10 ring-1 ring-green-100' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex justify-between items-start mb-2"><h4 className="font-black text-sm text-slate-800">Pesanan (CPO)</h4>{adsType === 'cpo' && <Check size={18} className="text-[#00B14F]" />}</div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">Hanya bayar ketika terjadi order. Resiko sangat rendah dan garansi ROAS.</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50/50">
                    <SimLabel icon={Target}>2. Budget & Performa</SimLabel>
                    <div className="space-y-5">
                      <SimInputGroup label="Budget Harian" prefix="Rp" value={adsBudget} onChange={(e) => setAdsBudget(e.target.value)} />
                      <div className="flex gap-4">
                        <div className="flex-1"><SimInputGroup label={adsType === 'cpo' ? "Biaya per Order" : "Max CPC (Bid)"} prefix="Rp" value={cpcBid} onChange={(e) => setCpcBid(e.target.value)} inputMode="numeric"/></div>
                      </div>
                      {adsType !== 'cpo' && (
                        <div className="flex gap-4">
                          <div className="flex-1"><SimInputGroup label="Est. CTR (%)" suffix="%" value={adsCtr} onChange={(e) => setAdsCtr(e.target.value)} inputMode="decimal"/></div>
                          <div className="flex-1"><SimInputGroup label="Est. CVR (%)" suffix="%" value={adsCvr} onChange={(e) => setAdsCvr(e.target.value)} inputMode="decimal"/></div>
                        </div>
                      )}
                      <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                        <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                          {adsType === 'cpo' ? <span>Anda hanya akan ditagih <b className="font-black">Rp {cpcBid}</b> saat order masuk.</span> : <span>Default rekomendasi sistem: CPC <b className="font-black">Rp {adsType === 'keyword' ? '2.500' : '800'}</b>, CTR <b className="font-black">{adsType === 'keyword' ? '3.5' : '1.2'}%</b>.</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-full">
                  <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl shadow-slate-200/40 border border-slate-100 h-full flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
                    
                    <div className="flex items-center gap-3 mb-8 pb-5 border-b border-slate-100 relative z-10">
                      <div className="bg-green-50 p-2 rounded-xl text-[#00B14F]"><Activity size={20} /></div>
                      <span className="text-sm md:text-base font-black uppercase tracking-widest text-slate-800">Estimasi Hasil Harian</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-8 mb-8 relative z-10">
                      <div>
                         <p className="text-[11px] font-bold text-slate-400 uppercase mb-1.5 tracking-widest">Est. Tayangan</p>
                         <p className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">{fNum(adsSim.estImpressions)}</p>
                         {adsType !== 'cpo' && (<p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-2"><Eye size={12} className="text-[#00B14F]"/> CTR {adsSim.ctrVal}%</p>)}
                      </div>
                      <div>
                         <p className="text-[11px] font-bold text-slate-400 uppercase mb-1.5 tracking-widest">Est. Klik Traffic</p>
                         <p className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">{fNum(adsSim.estClicks)}</p>
                         {adsType !== 'cpo' && (<p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-2"><MousePointer size={12} className="text-[#00B14F]"/> Bayar jika diklik</p>)}
                      </div>
                      <div className="pt-5 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-400 uppercase mb-1.5 tracking-widest">Biaya Iklan</p>
                        <p className="text-xl md:text-2xl font-black text-rose-500 tracking-tight">Rp {fNum(adsSim.actualCost)}</p>
                      </div>
                      <div className="pt-5 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-400 uppercase mb-1.5 tracking-widest">Est. Order</p>
                        <p className="text-xl md:text-2xl font-black text-[#00B14F] tracking-tight">{fNum(adsSim.estOrders)}</p>
                        {adsType !== 'cpo' && (<p className="text-[10px] text-slate-500 font-bold mt-2">CVR {(adsSim.cvr * 100).toFixed(0)}%</p>)}
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t-2 border-slate-100 border-dashed relative z-10">
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Potensi Omset</span>
                        <span className="text-3xl md:text-4xl font-black text-[#00B14F] tracking-tight">Rp {fNum(adsSim.estGrossSales)}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">ROAS</span>
                        <span className={`text-base md:text-lg font-black ${adsSim.roas >= 5 ? 'text-emerald-600' : adsSim.roas >= 3 ? 'text-blue-600' : 'text-rose-600'}`}>{adsSim.roas.toFixed(1)}x</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-4 text-center italic font-medium">*Diestimasi dengan AOV Rp {fNum(adsSim.baseAOV)}. Aktual dapat berbeda.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TABEL METRIK */}
              <div className="border border-slate-200 rounded-[32px] p-5 md:p-8 bg-white shadow-xl shadow-slate-200/40 overflow-hidden mb-10">
                <SimLabel icon={Activity}>Panduan Kesehatan Metrik</SimLabel>
                <div className="overflow-x-auto custom-scrollbar pb-2 mt-4">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b-2 border-slate-100">
                        <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[160px]">Metrik</th>
                        <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[100px]">Status</th>
                        <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[120px]">Target</th>
                        <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Analisis & Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {METRICS_GUIDE.map((metricItem, mIdx) => (
                        <Fragment key={mIdx}>
                          {metricItem.rows.map((row, rIdx) => (
                            <tr key={`${mIdx}-${rIdx}`} className="hover:bg-slate-50/80 transition-colors">
                              {rIdx === 0 && (<td rowSpan={3} className="py-4 px-4 align-top border-r border-slate-50"><span className="text-sm font-black text-slate-800">{metricItem.metric}</span></td>)}
                              <td className="py-4 px-4 align-top"><span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border shadow-sm ${row.bg} ${row.color}`}>{row.status}</span></td>
                              <td className="py-4 px-4 align-top"><span className="text-xs font-bold text-slate-600">{row.range}</span></td>
                              <td className="py-4 px-4 align-top"><p className="text-xs text-slate-500 leading-relaxed font-medium">{row.desc}</p></td>
                            </tr>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default function App() {
  const [data, setData] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isForceUpload, setIsForceUpload] = useState(false);
  
  const [fileMaster, setFileMaster] = useState(null);
  const [fileHistory, setFileHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMex, setSelectedMex] = useState(null);
  
  const [selectedAM, setSelectedAM] = useState('All'); 
  const [selectedPriority, setSelectedPriority] = useState('All');
  
  const [activeTab, setActiveTab] = useState('overview'); 
  const [activeSegmentModal, setActiveSegmentModal] = useState(null);
  const [showWaModal, setShowWaModal] = useState(false);

  // --- LOGIKA TEMPLATE WHATSAPP ---
  const handleSendWA = (templateType) => {
      if (!selectedMex || !selectedMex.phone) return;
      
      const phone = selectedMex.phone.replace(/\D/g, ''); // Hapus semua karakter non-angka
      const owner = selectedMex.ownerName !== '-' ? selectedMex.ownerName : 'Owner';
      
      // Mengambil nama AM dari data dan membersihkan spasi berlebih
      const amFull = (selectedMex.amName || 'AM').trim();
      const amFullLower = amFull.toLowerCase();
      
      let amShort = amFull.split(' ')[0]; // Fallback: ambil kata pertama jika tidak masuk mapping

      // Mapping cerdas: Cek apakah nama mengandung keyword tertentu (tahan terhadap typo/perbedaan format di data real)
      if (amFullLower.includes('novan')) {
          amShort = 'Novan';
      } else if (amFullLower.includes('reginaldo') || amFullLower.includes('aldo')) {
          amShort = 'Aldo';
      } else if (amFullLower.includes('dadan')) {
          amShort = 'Dadan';
      } else if (amFullLower.includes('hikam')) {
          amShort = 'Hikam';
      }

      const mexName = selectedMex.name;
      const mcaLimit = formatCurrency(selectedMex.mcaWlLimit);
      
      let templates = [];

      switch(templateType) {
          case 'promo':
              templates = [
                  `Halo kak ${owner}! Saya ${amShort} dari Grab. Ada program Promo spesial nih yang pas banget buat naikin orderan di ${mexName}. Boleh kita bahas via telpon kak?`,
                  `Selamat pagi/siang kak ${owner}, saya ${amShort} (Grab). Khusus untuk ${mexName}, kita ada kuota promo eksklusif loh. Mau saya bantu jelaskan detailnya?`,
                  `Halo kak ${owner}, dengan ${amShort} dari Grab. Yuk boost lagi penjualan ${mexName} pakai promo terbaru dari Grab! Kalau kakak berminat, boleh kita ngobrol sebentar?`,
                  `Permisi kak ${owner}! Saya ${amShort} (Grab). Sayang banget nih kalau ${mexName} kelewatan campaign promo bulan ini. Ada waktu luang buat saya jelasin untungnya kak?`,
                  `Halo kak ${owner}! ${amShort} dari Grab. Mau nawarin join promo nih buat ${mexName} biar makin ramai pembeli. Bisa telpon sebentar untuk detailnya kak?`
              ];
              break;
          case 'mca':
              templates = [
                  `Halo kak ${owner}! Saya ${amShort} dari Grab. Kabar gembira, ${mexName} dapat limit pinjaman modal kerja (MCA) s.d *${mcaLimit}*! Yuk cairkan buat tambah modal, mau dibantu prosesnya kak?`,
                  `Selamat kak ${owner}! Saya ${amShort} (Grab). Toko ${mexName} terpilih dapat fasilitas GrabModal (MCA) s.d *${mcaLimit}*. Prosesnya cepat lho kak, mau diskusi dulu?`,
                  `Halo kak ${owner}, dengan ${amShort} dari Grab. ${mexName} lagi butuh tambahan modal? Kebetulan ada limit MCA s.d *${mcaLimit}* nih kak. Boleh kita telpon untuk rinciannya?`,
                  `Permisi kak ${owner}, saya ${amShort} dari Grab. Cuma mau infoin kalau ${mexName} eligible dapat limit pinjaman *${mcaLimit}*. Sayang kalau nggak dimanfaatin kak, mau saya bantu aktivasi?`,
                  `Halo kak ${owner}! ${amShort} dari Grab di sini. Mau ngabarin kalau ${mexName} punya limit GrabModal s.d *${mcaLimit}*. Cairnya gampang banget, minat buat ngobrol sebentar kak?`
              ];
              break;
          case 'inactive':
              templates = [
                  `Halo kak ${owner}! Saya ${amShort} dari Grab. Saya cek ${mexName} lagi offline nih. Apakah ada kendala operasional atau di aplikasinya kak? Biar saya bantu.`,
                  `Selamat siang kak ${owner}, saya ${amShort} (Grab). Notis ${mexName} belum aktif nih kak. Kalau ada masalah sama device/aplikasi, kabarin saya ya.`,
                  `Halo kak ${owner}, dengan ${amShort} dari Grab. Sayang banget pesanan berpotensi miss karena ${mexName} lagi offline. Ada yang bisa saya bantu supaya toko online lagi kak?`,
                  `Permisi kak ${owner}, saya ${amShort} dari Grab. ${mexName} statusnya offline terus nih belakangan ini. Apakah tokonya sedang libur atau ada kendala teknis kak?`,
                  `Halo kak ${owner}! ${amShort} dari Grab. Mau make sure aja, ${mexName} lagi offline karena kendala resto/aplikasi nggak ya? Kalau butuh bantuan, saya siap support kak.`
              ];
              break;
          default:
              templates = [
                  `Halo kak ${owner}, saya ${amShort} dari Grab. Boleh minta waktunya sebentar untuk ngobrolin performa ${mexName} belakangan ini?`,
                  `Selamat siang kak ${owner}! Saya ${amShort} (AM Grab). Ingin diskusi sedikit tentang penjualan ${mexName}. Kapan sekiranya kakak ada waktu luang?`,
                  `Halo kak ${owner}, dengan ${amShort} dari Grab. Saya lihat ada potensi nih untuk ${mexName}, boleh kita telepon sebentar kak?`,
                  `Permisi kak ${owner}, saya ${amShort} (Grab). Mau update seputar performa toko ${mexName} nih kak, apakah berkenan untuk telpon hari ini?`,
                  `Halo kak ${owner}! ${amShort} dari Grab di sini. Saya mau share insight performa ${mexName} bulan ini. Enaknya kita diskusi jam berapa ya kak?`
              ];
      }

      // Pilih 1 template secara acak dari array
      const randomText = templates[Math.floor(Math.random() * templates.length)];

      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(randomText)}`, '_blank');
      setShowWaModal(false);
  };

  // --- MEMUAT DATA DARI LOCAL STORAGE (INDEXEDDB) ---
  useEffect(() => {
    const loadLocalData = async () => {
        try {
            const saved = await loadFromIndexedDB('am_dashboard_data');
            if (saved && saved.length > 0) {
                saved.sort((a, b) => a.name.localeCompare(b.name));
                setData(saved);
                setIsForceUpload(false);
            }
        } catch (e) {
            console.error("Gagal memuat data lokal", e);
        }
        setIsInitializing(false);
    };
    loadLocalData();
  }, []);

  // --- SIMPAN KE LOCAL STORAGE ---
  const saveToLocal = async (finalData) => {
      setLoading(true);
      try {
          await new Promise(resolve => setTimeout(resolve, 500));
          await saveToIndexedDB('am_dashboard_data', finalData);
          setData(finalData);
          setIsForceUpload(false);
      } catch (e) {
          setErrorMsg("Gagal menyimpan data (File terlalu besar/Error): " + e.message);
      }
      setLoading(false);
  };

  // --- PARSERS ---
  const parseCSVString = (str) => {
    const arr = []; let quote = false; let row = 0, col = 0;
    for (let c = 0; c < str.length; c++) {
      let cc = str[c], nc = str[c+1];
      arr[row] = arr[row] || []; arr[row][col] = arr[row][col] || '';
      if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; continue; }
      if (cc === '"') { quote = !quote; continue; }
      if (cc === ',' && !quote) { ++col; continue; }
      if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue; }
      if ((cc === '\n' || cc === '\r') && !quote) { ++row; col = 0; continue; }
      arr[row][col] += cc;
    }
    return arr;
  };

  const parseAndSave = async (masterText, histText) => {
    try {
        const masterLines = parseCSVString(masterText);
        
        let masterHeaderIdx = -1; let masterRawHeaders = [];
        for (let i = 0; i < Math.min(20, masterLines.length); i++) {
          const test = (masterLines[i] || []).map(h => h ? String(h).trim().replace(/[\r\n]+/g, ' ') : '');
          if (test.includes('Mex ID')) { masterRawHeaders = test; masterHeaderIdx = i; break; }
        }

        if (masterHeaderIdx === -1) throw new Error("Kolom 'Mex ID' tidak ditemukan di data Master Outlet."); 

        const masterHeaders = []; const mCounts = {};
        masterRawHeaders.forEach(h => {
          if (!h) { masterHeaders.push(''); return; }
          if (mCounts[h]) { masterHeaders.push(`${h}.${mCounts[h]}`); mCounts[h]++; }
          else { masterHeaders.push(h); mCounts[h] = 1; }
        });

        const mIdx = masterHeaders.indexOf('Mex ID');
        const mtdBIdx = masterHeaders.findIndex(h => h.includes('MTD (BS)') || h.includes('MTD\n(BS)'));
        const lmBIdx = mtdBIdx > 0 ? mtdBIdx - 1 : -1;
        const mtdAIdx = masterHeaders.findIndex(h => h.includes('Total MTD (Ads)') || h.includes('Total MTD\n(Ads)'));
        const lmAIdx = mtdAIdx > 0 ? mtdAIdx - 1 : -1;
        
        const prioHeader = masterHeaders.find(h => {
            const lh = h.toLowerCase();
            return lh.includes('priority') || lh.includes('prio') || lh.includes('framework');
        });

        const pointHeader = masterHeaders.find(h => {
            const lh = h.toLowerCase();
            return lh.includes('total point') || lh.includes('point');
        });

        let parsedDataMap = new Map();

        for (let i = masterHeaderIdx + 1; i < masterLines.length; i++) {
          const vals = masterLines[i];
          if (!vals || !vals[mIdx] || vals[mIdx].toLowerCase() === 'mex id') continue;
          let obj = {};
          masterHeaders.forEach((h, idx) => { if(h) obj[h] = vals[idx] !== undefined ? String(vals[idx]).trim() : ''; });
          
          const mexId = obj['Mex ID'];
          
          let prioVal = (prioHeader && obj[prioHeader]) ? String(obj[prioHeader]).trim() : '-';
          if (!prioVal || prioVal === '') prioVal = '-';
          
          parsedDataMap.set(mexId, {
            id: mexId,
            name: obj['Mex Name'],
            amName: obj['AM Name'] || 'Unassigned',
            ownerName: vals[10] !== undefined && String(vals[10]).trim() !== '' ? String(vals[10]).trim() : '-',
            lmBs: cleanNumber(vals[lmBIdx]),
            mtdBs: cleanNumber(obj['MTD (BS)'] || obj['MTD\n(BS)']),
            rrBs: cleanNumber(obj['RR (BS)'] || obj['RR\n(BS)']),
            rrVsLm: cleanNumber(obj['% RR vs LM (BS)'] || obj['% RR vs LM\n(BS)']),
            miMtd: cleanNumber(obj['MTD (MI)'] || obj['MTD\n(MI)']),
            adsLM: cleanNumber(vals[lmAIdx]),
            adsTotal: cleanNumber(obj['Total MTD (Ads)'] || obj['Total MTD\n(Ads)']),
            adsRR: cleanNumber(obj['RR (Ads)']),
            mcaAmount: cleanNumber(obj['MCA Amount']),
            mcaWlLimit: cleanNumber(obj['MCA WL']),
            mcaWlClass: obj['MCA WL Classification'] || '-Not in WL',
            mcaPriority: prioVal,
            disbursedDate: obj['Disbursed date'],
            zeusStatus: obj['Zeus'],
            joinDate: obj['Join Date'],
            campaigns: obj['Campaign'] || '',
            commission: obj['Base Commission'],
            city: obj['City Mex'],
            address: obj['Adress'] || obj['Address'],
            phone: obj['Phone zeus'],
            email: obj['Email zeus'],
            latitude: obj['Latitude'] || obj['Lat'] || (vals[14] !== undefined ? String(vals[14]).trim() : ''), 
            longitude: obj['Longitude'] || obj['Long'] || obj['Lng'] || (vals[15] !== undefined ? String(vals[15]).trim() : ''),
            lastUpdate: '',
            campaignPoint: cleanNumber(pointHeader ? obj[pointHeader] : 0), 
            history: [] 
          });
        }

        if (histText) {
            const histLines = parseCSVString(histText);
            const histHeaders = (histLines[0] || []).map(h => h ? String(h).trim() : '');
            
            const hMexIdx = histHeaders.indexOf('merchant_id');
            const hMonthIdx = histHeaders.indexOf('first_day_of_month');
            const hBsIdx = histHeaders.indexOf('basket_size');
            const hTotalOrdersIdx = histHeaders.indexOf('total_orders');
            const hCompletedOrdersIdx = histHeaders.indexOf('completed_orders');
            const hPromoOrdersIdx = histHeaders.indexOf('orders_with_promo_mfp_gms');
            const hAovIdx = histHeaders.indexOf('aov');
            const hMfcIdx = histHeaders.indexOf('mfc_mex_spend');
            const hMfpIdx = histHeaders.indexOf('mfp_mex_spend');
            const hCpoIdx = histHeaders.indexOf('cpo');
            const hGmsIdx = histHeaders.indexOf('gms');
            const hCommIdx = histHeaders.indexOf('basic_commission');
            const hAdsWebIdx = histHeaders.indexOf('ads_web');
            const hAdsMobIdx = histHeaders.indexOf('ads_mobile');
            const hAdsDirIdx = histHeaders.indexOf('ads_direct');

            if (hMexIdx !== -1 && hMonthIdx !== -1) {
                for (let i = 1; i < histLines.length; i++) {
                    const vals = histLines[i];
                    if (!vals || !vals[hMexIdx]) continue;
                    const mexId = String(vals[hMexIdx]).trim();
                    
                    if (parsedDataMap.has(mexId)) {
                        if (vals[0] && String(vals[0]).trim() !== '') {
                            parsedDataMap.get(mexId).lastUpdate = String(vals[0]).trim();
                        }
                        
                        const baseBs = cleanNumber(vals[hBsIdx]);
                        const totalOrders = cleanNumber(vals[hTotalOrdersIdx]);
                        const completedOrders = hCompletedOrdersIdx !== -1 ? cleanNumber(vals[hCompletedOrdersIdx]) : totalOrders;
                        const promoOrders = cleanNumber(vals[hPromoOrdersIdx]);
                        const promoPct = totalOrders > 0 ? ((promoOrders / totalOrders) * 100).toFixed(1) : 0;
                        
                        const mfc = cleanNumber(vals[hMfcIdx]);
                        const mfp = cleanNumber(vals[hMfpIdx]);
                        const cpoVal = cleanNumber(vals[hCpoIdx]);
                        const gmsVal = cleanNumber(vals[hGmsIdx]);
                        const basicComm = cleanNumber(vals[hCommIdx]);
                        const adsWeb = cleanNumber(vals[hAdsWebIdx]);
                        const adsMob = cleanNumber(vals[hAdsMobIdx]);
                        const adsDir = cleanNumber(vals[hAdsDirIdx]);
                        const adsTotalHist = adsWeb + adsMob + adsDir;
                        
                        const totalInvestment = mfc + mfp + cpoVal + gmsVal + basicComm + adsTotalHist;
                        const netSales = baseBs - totalInvestment;
                        const miPercentage = baseBs > 0 ? ((totalInvestment / baseBs) * 100).toFixed(1) : 0;

                        parsedDataMap.get(mexId).history.push({
                            month: vals[hMonthIdx],
                            basket_size: baseBs,
                            net_sales: netSales,
                            total_orders: totalOrders,
                            completed_orders: completedOrders,
                            orders_with_promo: promoOrders,
                            promo_order_pct: parseFloat(promoPct),
                            aov: cleanNumber(vals[hAovIdx]),
                            mfc: mfc,
                            mfp: mfp,
                            cpo: cpoVal,
                            gms: gmsVal,
                            basic_commission: basicComm,
                            ads_total_hist: adsTotalHist,
                            mi_percentage: parseFloat(miPercentage),
                            total_investment: totalInvestment
                        });
                    }
                }
            }
        }

        const finalData = Array.from(parsedDataMap.values()).map(merchant => {
            if (merchant.history.length > 0) merchant.history.sort((a, b) => new Date(a.month) - new Date(b.month));
            return merchant;
        });

        await saveToLocal(finalData);

    } catch (err) {
        console.error(err);
        setErrorMsg(err.message || "Gagal memproses data. Pastikan format benar.");
        setLoading(false);
    }
  };

  const handleProcessFiles = async () => {
    setLoading(true); setErrorMsg('');
    try {
        const masterText = await fileMaster.text();
        let histText = null;
        if (fileHistory) {
            histText = await fileHistory.text();
        }
        await parseAndSave(masterText, histText);
    } catch (err) {
        setErrorMsg("Gagal membaca file dari komputer Anda.");
        setLoading(false);
    }
  };

  const loadDemo = () => { 
     setLoading(true); 
     setTimeout(() => { 
        const amNames = ['Muhamad Novan Nufulfattah Sahlan', 'Mohammad Reginaldo', 'Dadan Nurdiansyah', 'Saeful Hikam'];
        const possibleCampaigns = ['GMS Booster', 'GMS Cuan', 'Free Ongkir', 'WEEKENDFEST', 'Booster+'];
        const months = ['2025-01-01','2025-02-01','2025-03-01','2025-04-01','2025-05-01','2025-06-01','2025-07-01','2025-08-01','2025-09-01','2025-10-01','2025-11-01','2025-12-01','2026-01-01','2026-02-01'];

        const genData = Array.from({ length: 150 }).map((_, i) => {
          const isGrowing = Math.random() > 0.4;
          const lm = Math.floor(Math.random() * 50000000) + 5000000;
          const rr = isGrowing ? lm * (1 + Math.random() * 0.5) : lm * (1 - Math.random() * 0.3);
          const mtd = rr * 0.7;
          const mca = Math.random() > 0.8 ? Math.floor(Math.random() * 50000000) + 10000000 : 0;
          const mcaLimit = mca > 0 ? mca * 1.5 : (Math.random() > 0.85 ? 25000000 : 0);
          
          const pRoll = Math.random();
          const mcaPriority = mcaLimit > 0 ? (pRoll > 0.7 ? 'P1' : pRoll > 0.3 ? 'P2' : 'P3') : '-';

          let assignedCampaigns = [];
          const campaignRoll = Math.random();
          if (campaignRoll < 0.2) assignedCampaigns = ['No Campaign'];
          else if (campaignRoll < 0.35) assignedCampaigns = [possibleCampaigns[0]]; // GMS Only
          else if (campaignRoll < 0.5) assignedCampaigns = [possibleCampaigns[4]];  // Booster+
          else if (campaignRoll < 0.7) assignedCampaigns = [possibleCampaigns[1], possibleCampaigns[3]]; // GMS & Local
          else assignedCampaigns = [possibleCampaigns[2], possibleCampaigns[3]]; // Local Only

          let baseBs = Math.floor(Math.random() * 15000000) + 5000000;
          const history = months.map(m => {
              const trend = 1 + (Math.random() * 0.4 - 0.2); 
              baseBs = Math.max(1000000, baseBs * trend);
              const totalOrders = Math.floor(baseBs / (30000 + Math.random() * 50000));
              const completedOrders = Math.floor(totalOrders * (0.8 + Math.random() * 0.2)); 
              const promoOrders = Math.floor(totalOrders * (Math.random() * 0.8)); 
              
              const mfc = baseBs * (Math.random() * 0.03);
              const mfp = baseBs * (Math.random() * 0.04);
              const cpoVal = baseBs * (Math.random() * 0.02);
              const gmsVal = baseBs * (Math.random() * 0.02);
              const basicComm = baseBs * 0.20; 
              const adsWeb = baseBs * (Math.random() * 0.015);
              const adsMob = baseBs * (Math.random() * 0.015);
              const adsDir = baseBs * (Math.random() * 0.01);
              const adsTotalHist = adsWeb + adsMob + adsDir;
              
              const totalInvestment = mfc + mfp + cpoVal + gmsVal + basicComm + adsTotalHist;
              const netSales = baseBs - totalInvestment;
              const miPercentage = baseBs > 0 ? ((totalInvestment / baseBs) * 100).toFixed(1) : 0;

              return {
                  month: m,
                  basket_size: baseBs,
                  net_sales: netSales,
                  total_orders: totalOrders,
                  completed_orders: completedOrders,
                  orders_with_promo: promoOrders,
                  promo_order_pct: totalOrders > 0 ? parseFloat(((promoOrders / totalOrders) * 100).toFixed(1)) : 0,
                  aov: totalOrders > 0 ? Math.floor(baseBs / totalOrders) : 0,
                  mfc: mfc,
                  mfp: mfp,
                  cpo: cpoVal,
                  gms: gmsVal,
                  basic_commission: basicComm,
                  ads_total_hist: adsTotalHist,
                  mi_percentage: parseFloat(miPercentage),
                  total_investment: totalInvestment
              };
          });

          return {
            id: `6-C${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            name: `Merchant ${String.fromCharCode(65 + (i % 26))} - ${['Bandung', 'Jakarta', 'Sukabumi', 'Bali'][i % 4]}`,
            amName: amNames[i % 4],
            ownerName: `Ona ${String.fromCharCode(65 + (i % 26))}`,
            lmBs: lm, mtdBs: mtd, rrBs: rr, rrVsLm: ((rr - lm) / lm) * 100,
            miMtd: Math.floor(Math.random() * 5000000),
            adsLM: Math.floor(Math.random() * 12000000), 
            adsTotal: Math.floor(Math.random() * 8000000), adsRR: Math.floor(Math.random() * 15000000),
            mcaAmount: mca, 
            mcaWlLimit: mcaLimit, 
            mcaWlClass: mcaLimit > 0 ? 'Repeat' : '-Not in WL',
            mcaPriority: mcaPriority,
            disbursedDate: mca > 0 ? `15-Feb-26` : '',
            zeusStatus: Math.random() > 0.15 ? 'ACTIVE' : 'INACTIVE',
            joinDate: `12-Jan-22`,
            campaigns: assignedCampaigns.join(' | '),
            commission: '20%',
            city: ['Bandung', 'Jakarta', 'Sukabumi', 'Bali'][i % 4],
            address: `Jl. Jend. Sudirman No. ${Math.floor(Math.random() * 100)}`,
            phone: `+62 812-${Math.floor(Math.random() * 9000)}-${Math.floor(Math.random() * 9000)}`,
            email: `contact@merchant${i}.com`,
            latitude: (-6.2 + Math.random() * 0.5).toFixed(6),
            longitude: (106.8 + Math.random() * 0.5).toFixed(6),
            lastUpdate: '22 Feb 2026',
            campaignPoint: Math.random() > 0.7 ? Math.floor(Math.random() * 500) : 0,
            history: history 
          };
        });
        
        saveToLocal(genData); 
     }, 600); 
  };

  // --- COMPUTATIONS ---
  const amOptions = useMemo(() => ['All', ...Array.from(new Set(data.map(d => d.amName).filter(Boolean))).sort()], [data]);
  const priorityOptions = useMemo(() => ['All', ...Array.from(new Set(data.map(d => d.mcaPriority).filter(p => p && p !== '-'))).sort()], [data]);

  const activeData = useMemo(() => {
     let filtered = data;
     if (selectedAM !== 'All') filtered = filtered.filter(d => d.amName === selectedAM);
     if (selectedPriority !== 'All') filtered = filtered.filter(d => d.mcaPriority === selectedPriority);
     return filtered;
  }, [data, selectedAM, selectedPriority]);

  const campaignStats = useMemo(() => {
    let zeroInvest = 0, gmsOnly = 0, gmsLocal = 0, boosterPlus = 0, localOnly = 0;
    let joiners = 0;
    const counts = {};

    activeData.forEach(d => {
      const segment = getMerchantSegment(d.campaigns);
      
      if (segment === '0 Invest') {
        zeroInvest++;
      } else {
        joiners++;
        const c = d.campaigns ? String(d.campaigns).trim().toLowerCase() : '';
        const camps = c.split(/[|,]/).map(x => x.trim()).filter(Boolean);
        camps.forEach(camp => {
          counts[camp] = (counts[camp] || 0) + 1;
        });
      }

      if (segment === 'Booster+') boosterPlus++;
      else if (segment === 'GMS & Local') gmsLocal++;
      else if (segment === 'GMS Only') gmsOnly++;
      else if (segment === 'Local Only') localOnly++;
    });

    const classification = [
      { name: 'GMS Only', count: gmsOnly, fill: '#0ea5e9' },       
      { name: 'GMS & Local', count: gmsLocal, fill: '#8b5cf6' },  
      { name: 'Booster+', count: boosterPlus, fill: '#f59e0b' },  
      { name: 'Local Only', count: localOnly, fill: '#10b981' },  
      { name: '0 Invest', count: zeroInvest, fill: '#cbd5e1' }   
    ];

    return { 
      joiners, 
      zeroInvest, 
      classification, 
      list: Object.entries(counts).map(([name, count]) => ({ name, count })) 
    };
  }, [activeData]);

  // Menyiapkan daftar merchant khusus untuk modal segmen yang diklik
  const filteredSegmentMerchants = useMemo(() => {
     if (!activeSegmentModal) return [];
     return activeData.filter(m => getMerchantSegment(m.campaigns) === activeSegmentModal)
                      .sort((a, b) => b.mtdBs - a.mtdBs); 
  }, [activeData, activeSegmentModal]);

  const kpi = useMemo(() => {
    if (!activeData.length) return null;
    let activeMex = 0; let inactiveMex = 0;
    activeData.forEach(d => { if (d.zeusStatus && d.zeusStatus.toUpperCase() === 'ACTIVE') { activeMex++; } else { inactiveMex++; } });
    const totalPts = activeData.reduce((a, c) => a + (c.campaignPoint || 0), 0);

    return {
      lm: activeData.reduce((a, c) => a + c.lmBs, 0), rr: activeData.reduce((a, c) => a + c.rrBs, 0), mtd: activeData.reduce((a, c) => a + c.mtdBs, 0),
      adsLm: activeData.reduce((a, c) => a + c.adsLM, 0), adsMtd: activeData.reduce((a, c) => a + c.adsTotal, 0), adsRr: activeData.reduce((a, c) => a + c.adsRR, 0),
      mcaDis: activeData.reduce((a, c) => a + (String(c.disbursedDate).includes('Feb') ? c.mcaAmount : 0), 0), mcaDisCount: activeData.filter(c => c.mcaAmount > 0).length, mcaEli: activeData.reduce((a, c) => a + (c.mcaWlLimit > 0 && !c.mcaWlClass.includes('Not') ? c.mcaWlLimit : 0), 0),
      joiners: campaignStats.joiners, totalMex: activeData.length, activeMex, inactiveMex, totalPoints: totalPts, activeCampCount: campaignStats.list.length, avgPtsPerJoiner: campaignStats.joiners > 0 ? Math.round(totalPts / campaignStats.joiners) : 0
    };
  }, [activeData, campaignStats]);

  const chartsData = useMemo(() => {
    const mtd = [...activeData].sort((a, b) => b.mtdBs - a.mtdBs).slice(0, 10);
    const ads = [...activeData].sort((a, b) => b.adsLM - a.adsLM).slice(0, 10);
    let g = 0, d = 0, s = 0;
    activeData.forEach(x => { if (x.rrBs > x.lmBs * 1.05) g++; else if (x.rrBs < x.lmBs * 0.95) d++; else s++; });
    const total = Math.max(1, g + d + s);
    return { mtd, ads, health: [ { name: 'Growing', count: g, percentage: ((g / total) * 100).toFixed(0), color: '#00B14F' }, { name: 'Declining', count: d, percentage: ((d / total) * 100).toFixed(0), color: COLORS.decline }, { name: 'Stable', count: s, percentage: ((s / total) * 100).toFixed(0), color: COLORS.finance } ] };
  }, [activeData]);

  const filtered = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return activeData.filter(d => d.name.toLowerCase().includes(s) || d.id.toLowerCase().includes(s));
  }, [activeData, searchTerm]);

  const handleSearchChange = (e) => {
    const val = e.target.value; setSearchTerm(val);
    if (val && activeTab !== 'data' && !selectedMex) { setActiveTab('data'); }
  };

  const renderMerchantCampaigns = (campaignStr) => {
    if (!campaignStr || campaignStr === '-' || campaignStr === '0' || campaignStr.toLowerCase().includes('no campaign')) { 
      return <span className="text-slate-400 text-[10px] font-semibold italic block mt-1">Tidak ada partisipasi campaign.</span>; 
    }
    const camps = campaignStr.split(/[|,]/).map(c => c.trim()).filter(Boolean);
    return (
        <div className="flex flex-wrap gap-1 mt-1.5">
            {camps.map((camp, idx) => ( 
              <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 shadow-[0_1px_2px_rgb(0,0,0,0.05)]">
                <Zap className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />{camp}
              </span> 
            ))}
        </div>
    );
  };

  const onChartClick = (state) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      if (state.activePayload[0].payload.id) { setSelectedMex(state.activePayload[0].payload); setActiveTab('overview'); }
    }
  };

  if (isInitializing) {
     return (
       <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
         <div className="text-center animate-pulse flex flex-col items-center">
            <Activity className="w-12 h-12 text-[#00B14F] mb-4" />
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Memuat Dashboard...</h2>
         </div>
       </div>
     )
  }

  // --- RENDER SCREEN AWAL (UPLOAD) ---
  if (data.length === 0 || isForceUpload) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-800">
        
        {/* Background Accents */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[100%] bg-emerald-900/40 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[100%] bg-blue-900/30 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="text-center max-w-xl z-10 bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-[32px] shadow-2xl w-full mx-auto border border-white/20 animate-in fade-in zoom-in-95 relative">
          
          <div className="w-16 h-16 bg-gradient-to-br from-[#00B14F] to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-1 text-slate-900 tracking-tight uppercase">AM DASHBOARD <span className="text-[#00B14F]">PRO</span></h1>
          <p className="text-slate-500 mb-8 text-xs font-semibold tracking-wide">MERCHANT INTELLIGENCE PLATFORM</p>
          
          {errorMsg && <div className="mb-6 p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex gap-2 border border-rose-100 items-center text-left leading-snug"><AlertCircle className="w-5 h-5 shrink-0" />{errorMsg}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col items-center justify-center p-5 border-2 border-slate-200 border-dashed rounded-2xl bg-slate-50 relative group hover:border-[#00B14F] hover:bg-emerald-50/50 transition-all cursor-pointer">
                <Store className={`w-7 h-7 mb-2 transition-colors ${fileMaster ? 'text-[#00B14F]' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                <p className="text-slate-800 font-bold text-xs mb-1">Master Outlet</p>
                <p className="text-[10px] text-slate-400 text-center px-2 line-clamp-2 leading-tight">{fileMaster ? fileMaster.name : 'Upload file utama (.csv)'}</p>
                <input type="file" accept=".csv" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFileMaster(e.target.files[0])} />
                {fileMaster && <div className="absolute top-3 right-3 bg-white rounded-full shadow-sm"><CheckCircle className="w-4 h-4 text-[#00B14F]" /></div>}
              </div>
              <div className="flex flex-col items-center justify-center p-5 border-2 border-slate-200 border-dashed rounded-2xl bg-slate-50 relative group hover:border-[#00B14F] hover:bg-emerald-50/50 transition-all cursor-pointer">
                <FileText className={`w-7 h-7 mb-2 transition-colors ${fileHistory ? 'text-[#00B14F]' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                <p className="text-slate-800 font-bold text-xs mb-1">Data Historis</p>
                <p className="text-[10px] text-slate-400 text-center px-2 line-clamp-2 leading-tight">{fileHistory ? fileHistory.name : 'Upload data bulanan (opsional)'}</p>
                <input type="file" accept=".csv" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFileHistory(e.target.files[0])} />
                {fileHistory && <div className="absolute top-3 right-3 bg-white rounded-full shadow-sm"><CheckCircle className="w-4 h-4 text-[#00B14F]" /></div>}
              </div>
          </div>

          <button onClick={handleProcessFiles} disabled={loading || !fileMaster} className={`w-full py-4 bg-slate-900 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 mb-4 text-sm hover:bg-slate-800 shadow-xl shadow-slate-900/20 ${!fileMaster ? 'opacity-50 cursor-not-allowed shadow-none' : 'active:scale-95'}`}>
            {loading ? <Activity className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />} {loading ? 'MEMPROSES DATA...' : 'MASUK KE DASHBOARD'}
          </button>
          
          <button onClick={loadDemo} disabled={loading} className="w-full py-3 bg-transparent text-slate-500 hover:text-slate-800 font-bold transition-all flex items-center justify-center gap-2 text-xs rounded-xl hover:bg-slate-50">
            <TrendingUp className="w-4 h-4" /> Eksplorasi dengan Data Dummy
          </button>

          {data.length > 0 && isForceUpload && (
             <button onClick={() => setIsForceUpload(false)} disabled={loading} className="w-full py-3 mt-2 bg-slate-100 text-slate-500 hover:text-slate-700 font-bold transition-all text-xs rounded-xl hover:bg-slate-200">
                Batal & Kembali
             </button>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER DASHBOARD UTAMA ---
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans overflow-hidden relative">
      
      {/* DECORATIVE TOP BACKGROUND ANCHOR */}
      <div className="absolute top-0 left-0 right-0 h-[280px] md:h-[320px] bg-slate-900 z-0 rounded-b-[40px] shadow-lg">
         <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[200%] bg-emerald-900/30 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute top-[0%] right-[-10%] w-[50%] h-[150%] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {/* ========================================================= */}
      {/* MODAL TEMPLATE WHATSAPP */}
      {/* ========================================================= */}
      {showWaModal && selectedMex && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowWaModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-100 shrink-0 bg-white relative z-10">
               <div>
                  <h3 className="font-black text-lg md:text-xl text-slate-900 flex items-center gap-2">
                     <MessageCircle className="w-5 h-5 text-[#00B14F]"/>
                     Pesan WhatsApp
                  </h3>
                  <p className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mt-1.5 inline-block">
                     *Teks dipilih acak (Anti-Spam)
                  </p>
               </div>
               <button onClick={() => setShowWaModal(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-5 md:p-6 bg-[#f8fafc] space-y-3">
               {/* Option General */}
               <button onClick={() => handleSendWA('general')} className="w-full text-left p-4 bg-white border border-slate-200 hover:border-[#00B14F] hover:shadow-md rounded-2xl transition-all group">
                   <p className="font-bold text-sm text-slate-800 group-hover:text-[#00B14F] mb-1">Review Performa (General)</p>
                   <p className="text-xs text-slate-500 line-clamp-2">Ada 5 variasi pesan sapaan untuk diskusi performa secara umum dengan owner...</p>
               </button>
               
               {/* Option Promo */}
               <button onClick={() => handleSendWA('promo')} className="w-full text-left p-4 bg-white border border-slate-200 hover:border-[#00B14F] hover:shadow-md rounded-2xl transition-all group">
                   <p className="font-bold text-sm text-slate-800 group-hover:text-[#00B14F] mb-1 flex items-center gap-1.5"><Zap size={14} className="text-amber-500"/> Penawaran Promo</p>
                   <p className="text-xs text-slate-500 line-clamp-2">Ada 5 variasi pesan untuk mengajak merchant mengikuti program promo/campaign...</p>
               </button>
               
               {/* Option MCA (Hanya muncul jika eligible) */}
               {selectedMex.mcaWlLimit > 0 && !selectedMex.mcaWlClass.includes('Not') && (
                   <button onClick={() => handleSendWA('mca')} className="w-full text-left p-4 bg-blue-50 border border-blue-200 hover:border-blue-500 hover:shadow-md rounded-2xl transition-all group">
                       <p className="font-bold text-sm text-blue-800 group-hover:text-blue-600 mb-1 flex items-center gap-1.5"><Database size={14} className="text-blue-500"/> Info Limit MCA</p>
                       <p className="text-xs text-blue-600/80 line-clamp-2">Ada 5 variasi pesan untuk menginfokan fasilitas pinjaman senilai {formatCurrency(selectedMex.mcaWlLimit)}...</p>
                   </button>
               )}
               
               {/* Option Inactive (Hanya muncul jika toko Inactive) */}
               {selectedMex.zeusStatus !== 'ACTIVE' && (
                   <button onClick={() => handleSendWA('inactive')} className="w-full text-left p-4 bg-rose-50 border border-rose-200 hover:border-rose-500 hover:shadow-md rounded-2xl transition-all group">
                       <p className="font-bold text-sm text-rose-800 group-hover:text-rose-600 mb-1 flex items-center gap-1.5"><AlertCircle size={14} className="text-rose-500"/> Follow-up Toko Offline</p>
                       <p className="text-xs text-rose-600/80 line-clamp-2">Ada 5 variasi sapaan untuk menanyakan kendala toko yang sedang inactive/offline...</p>
                   </button>
               )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DAFTAR MERCHANT PER SEGMEN CAMPAIGN */}
      {/* ========================================================= */}
      {activeSegmentModal && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setActiveSegmentModal(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden">
            
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-100 shrink-0 bg-white relative z-10">
               <div>
                  <h3 className="font-black text-lg md:text-xl text-slate-900 flex items-center gap-2">
                     <Target className="w-5 h-5 text-[#00B14F]"/>
                     Segmen: <span className="text-[#00B14F]">{activeSegmentModal}</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Daftar {filteredSegmentMerchants.length} merchant dalam kategori ini</p>
               </div>
               <button onClick={() => setActiveSegmentModal(null)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar bg-[#f8fafc]">
               {filteredSegmentMerchants.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                    <Store className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-xs font-bold uppercase tracking-widest">Kosong</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-3">
                    {filteredSegmentMerchants.map((mex) => (
                       <div key={mex.id} onClick={() => { setSelectedMex(mex); setActiveSegmentModal(null); setActiveTab('overview'); }} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#00B14F] hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer transition-all duration-300 group">
                          <div className="min-w-0 pr-4">
                             <p className="font-bold text-sm md:text-base text-slate-800 group-hover:text-[#00B14F] truncate transition-colors">{mex.name}</p>
                             <div className="-mt-0.5">
                                {renderMerchantCampaigns(mex.campaigns)}
                             </div>
                          </div>
                          <div className="text-right shrink-0">
                             <p className="font-black text-sm md:text-base text-slate-800">{formatCurrency(mex.mtdBs)}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">MTD Sales</p>
                          </div>
                       </div>
                    ))}
                 </div>
               )}
            </div>

          </div>
        </div>
      )}

      {/* ELEGAN & MODERN HEADER */}
      <header className="sticky top-0 z-40 transition-all pt-4 pb-2 md:py-4 px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 md:gap-6 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-2xl shadow-black/20">
          
          {/* 1. Left Section: Logo & Desktop Tabs / Back Button */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
             {/* Logo */}
             <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setSelectedMex(null); setActiveTab('overview'); setSearchTerm(''); }}>
               <div className="w-10 h-10 bg-gradient-to-br from-[#00B14F] to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
                 <Activity className="w-5 h-5 text-white" />
               </div>
               <h1 className="text-xl md:text-2xl font-black text-white tracking-tight hidden lg:block drop-shadow-sm">
                 AM DASHBOARD <span className="text-emerald-400 ml-0.5">PRO</span>
               </h1>
             </div>

             {/* TABS NAVIGATION (Desktop) */}
             {!selectedMex && (
               <Fragment>
                 <div className="hidden md:block w-px h-8 bg-slate-700/50 mx-1"></div>
                 <div className="hidden md:flex bg-slate-950/50 p-1.5 rounded-2xl shrink-0 border border-white/5">
                     <button onClick={() => { setActiveTab('overview'); setSearchTerm(''); }} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-[#00B14F] text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                         <LayoutDashboard className="w-4 h-4" /> Overview
                     </button>
                     <button onClick={() => setActiveTab('data')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'data' ? 'bg-[#00B14F] text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                         <Table className="w-4 h-4" /> Master Data
                     </button>
                     <button onClick={() => setActiveTab('simulator')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'simulator' ? 'bg-[#00B14F] text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                         <Calculator className="w-4 h-4" /> Simulator
                     </button>
                 </div>
               </Fragment>
             )}

             {/* Back Button for Detail View */}
             {selectedMex && (
                 <button onClick={() => setSelectedMex(null)} className="group flex items-center gap-2 text-slate-300 hover:text-white font-bold text-xs md:text-sm transition-all px-4 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700 border border-white/10 ml-2">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Kembali
                 </button>
             )}
          </div>
          
          {/* 2. Center Section: Global Search Bar */}
          {!selectedMex && activeTab !== 'simulator' && (
            <div className="flex-1 max-w-md mx-auto relative group hidden md:block animate-in fade-in zoom-in-95">
               <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                   <Search className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
               </div>
               <input 
                   type="text" 
                   value={searchTerm} 
                   onChange={handleSearchChange} 
                   placeholder="Cari nama atau ID merchant..." 
                   className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-11 pr-10 py-3 text-sm text-white font-semibold placeholder:text-slate-400 focus:outline-none focus:bg-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner" 
               />
               {searchTerm && (
                   <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors">
                       <X className="w-4 h-4" />
                   </button>
               )}
            </div>
          )}

          {/* 3. Right Section: Filters & Actions */}
          {!selectedMex && activeTab !== 'simulator' && (
            <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0 animate-in fade-in">
               {/* Filters Pill */}
               <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-2xl px-3 py-2.5 md:py-3 shadow-inner hover:border-slate-500 transition-colors">
                   <Filter className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400 hidden sm:block mr-2" />
                   
                   <select value={selectedAM} onChange={(e) => { setSelectedAM(e.target.value); setSelectedMex(null); }} className="bg-transparent text-slate-200 hover:text-white text-xs font-bold focus:outline-none w-20 sm:w-28 cursor-pointer appearance-none truncate">
                      {amOptions.map(am => <option key={am} value={am} className="text-slate-900">{am}</option>)}
                   </select>
                   
                   <div className="w-px h-5 bg-slate-600 mx-2 md:mx-3"></div>
                   
                   <select value={selectedPriority} onChange={(e) => { setSelectedPriority(e.target.value); setSelectedMex(null); }} className="bg-transparent text-amber-400 hover:text-amber-300 text-xs font-bold focus:outline-none w-16 sm:w-24 cursor-pointer appearance-none text-right sm:text-left pr-1">
                      {priorityOptions.map(p => <option key={p} value={p} className="text-slate-900">{p === 'All' ? 'All Prio' : p}</option>)}
                   </select>
                   <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block ml-1" />
               </div>

               {/* UPDATE DATA BUTTON */}
               <button onClick={() => setIsForceUpload(true)} className="group flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 w-10 h-10 md:w-auto md:px-4 md:h-11 rounded-2xl font-bold text-xs transition-all shadow-lg shadow-black/20">
                   <RefreshCw className="w-4 h-4 md:mr-2 group-hover:rotate-180 transition-transform duration-500" /> 
                   <span className="hidden md:block">Update</span>
               </button>
            </div>
          )}
        </div>

        {/* TABS NAVIGATION (Mobile - Floating below header) */}
        {!selectedMex && (
          <div className="md:hidden flex justify-center mt-3 animate-in fade-in slide-in-from-top-2 relative z-40">
             <div className="flex bg-slate-900/90 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl">
                <button onClick={() => { setActiveTab('overview'); setSearchTerm(''); }} className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeTab === 'overview' ? 'bg-[#00B14F] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                    <LayoutDashboard className="w-3.5 h-3.5" /> Overview
                </button>
                <button onClick={() => setActiveTab('data')} className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeTab === 'data' ? 'bg-[#00B14F] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                    <Table className="w-3.5 h-3.5" /> Data
                </button>
                <button onClick={() => setActiveTab('simulator')} className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeTab === 'simulator' ? 'bg-[#00B14F] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                    <Calculator className="w-3.5 h-3.5" /> Simulator
                </button>
             </div>
          </div>
        )}
        
        {/* Mobile Search Bar */}
        {!selectedMex && activeTab !== 'simulator' && (
           <div className="md:hidden mt-3 px-4 animate-in fade-in slide-in-from-top-2 relative z-30">
               <div className="relative group">
                   <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                       <Search className="w-4 h-4 text-slate-400" />
                   </div>
                   <input 
                       type="text" 
                       value={searchTerm} 
                       onChange={handleSearchChange} 
                       placeholder="Cari merchant..." 
                       className="w-full bg-white/95 backdrop-blur-lg border border-slate-200 rounded-2xl pl-11 pr-10 py-3 text-sm text-slate-800 font-bold focus:outline-none focus:border-[#00B14F] focus:ring-4 focus:ring-[#00B14F]/10 transition-all shadow-lg" 
                   />
                   {searchTerm && (
                       <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 text-slate-500 rounded-lg">
                           <X className="w-4 h-4" />
                       </button>
                   )}
               </div>
           </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative w-full hide-scrollbar z-10 p-4 md:p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto pb-safe">
          {!selectedMex ? (
            <Fragment>
              {/* ========================================================= */}
              {/* TAB 1: DASHBOARD OVERVIEW */}
              {/* ========================================================= */}
              {activeTab === 'overview' && (
                <div className="space-y-5 md:space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">

                    {/* KPI CARDS - Compact 5 Columns with Colored Blobs */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                      
                      {/* Basketsize Card */}
                      <div className="bg-white p-5 md:p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col h-full col-span-2 lg:col-span-1 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-bl-full opacity-40 -mr-4 -mt-4 group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-50 rounded-xl text-[#00B14F]"><Activity size={18} /></div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Basketsize</p>
                          </div>
                        </div>
                        <div className="relative z-10 mb-4">
                            <span className="text-3xl font-black text-slate-800 tracking-tight leading-none block mb-1">{formatCurrency(kpi?.rr || 0)}</span>
                            <span className="text-[10px] font-black text-[#00B14F] uppercase tracking-widest">Projected Runrate</span>
                        </div>
                        <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50 relative z-10">
                          <div className="flex-1 min-w-0 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex flex-col justify-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 truncate">Last Month</span>
                            <span className="text-xs font-black text-slate-600 truncate" title={formatCurrency(kpi?.lm || 0)}>{formatCurrency(kpi?.lm || 0)}</span>
                          </div>
                          <div className="flex-1 min-w-0 bg-emerald-50 p-2.5 rounded-2xl border border-emerald-100 flex flex-col justify-center">
                            <span className="text-[9px] font-bold text-slate-500 uppercase mb-0.5 truncate">MTD Sales</span>
                            <span className="text-xs font-black text-slate-800 truncate" title={formatCurrency(kpi?.mtd || 0)}>{formatCurrency(kpi?.mtd || 0)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Ads Spend Card */}
                      <div className="bg-white p-5 md:p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col h-full relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-100 to-transparent rounded-bl-full opacity-40 -mr-4 -mt-4 group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-rose-50 rounded-xl text-rose-500"><Megaphone size={18} /></div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ads Spend</p>
                          </div>
                        </div>
                        <div className="relative z-10 mb-4">
                            <span className="text-3xl font-black text-slate-800 tracking-tight leading-none block mb-1">{formatCurrency(kpi?.adsRr || 0)}</span>
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Projected Cost</span>
                        </div>
                        <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50 relative z-10">
                          <div className="flex-1 min-w-0 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex flex-col justify-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 truncate">Last Month</span>
                            <span className="text-xs font-black text-slate-600 truncate" title={formatCurrency(kpi?.adsLm || 0)}>{formatCurrency(kpi?.adsLm || 0)}</span>
                          </div>
                          <div className="flex-1 min-w-0 bg-rose-50 p-2.5 rounded-2xl border border-rose-100 flex flex-col justify-center">
                            <span className="text-[9px] font-bold text-rose-500 uppercase mb-0.5 truncate">MTD Ads</span>
                            <span className="text-xs font-black text-slate-800 truncate" title={formatCurrency(kpi?.adsMtd || 0)}>{formatCurrency(kpi?.adsMtd || 0)}</span>
                          </div>
                        </div>
                      </div>

                      {/* MCA Disbursed Card */}
                      <div className="bg-white p-5 md:p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col h-full relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-transparent rounded-bl-full opacity-40 -mr-4 -mt-4 group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <div className="flex items-center gap-2">
                             <div className="p-2 bg-amber-50 rounded-xl text-amber-500"><Database size={18} /></div>
                             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">MCA Config</p>
                          </div>
                        </div>
                        <div className="relative z-10 mb-4">
                            <span className="text-3xl font-black text-slate-800 tracking-tight leading-none block mb-1">{formatCurrency(kpi?.mcaDis || 0)}</span>
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Total Disbursed</span>
                        </div>
                        <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50 relative z-10">
                          <div className="flex-1 min-w-0 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex flex-col justify-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 truncate">Eligibility</span>
                            <span className="text-xs font-black text-slate-600 truncate" title={formatCurrency(kpi?.mcaEli || 0)}>{formatCurrency(kpi?.mcaEli || 0)}</span>
                          </div>
                          <div className="w-16 min-w-0 bg-amber-50 p-2.5 rounded-2xl border border-amber-100 flex flex-col items-center justify-center shrink-0">
                            <span className="text-[9px] font-bold text-amber-600 uppercase mb-0.5 truncate max-w-full">Toko</span>
                            <span className="text-xs font-black text-amber-700 truncate max-w-full" title={kpi?.mcaDisCount || 0}>{kpi?.mcaDisCount || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Campaign Pts Card */}
                      <div className="bg-white p-5 md:p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col h-full relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-transparent rounded-bl-full opacity-40 -mr-4 -mt-4 group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                           <div className="flex items-center gap-2">
                             <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500"><Award size={18} /></div>
                             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Campaign</p>
                           </div>
                        </div>
                        <div className="relative z-10 mb-4">
                            <span className="text-3xl font-black text-slate-800 tracking-tight leading-none block mb-1">{(kpi?.totalPoints || 0).toLocaleString('id-ID')}</span>
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Total Points</span>
                        </div>
                        <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50 relative z-10">
                          <div className="flex-1 min-w-0 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex flex-col justify-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 truncate">Joiners</span>
                            <span className="text-xs font-black text-slate-600 truncate" title={`${kpi?.joiners || 0} Toko`}>{kpi?.joiners || 0} Toko</span>
                          </div>
                          <div className="flex-1 min-w-0 bg-indigo-50 p-2.5 rounded-2xl border border-indigo-100 flex flex-col justify-center">
                            <span className="text-[9px] font-bold text-indigo-500 uppercase mb-0.5 truncate">Avg Pts</span>
                            <span className="text-xs font-black text-indigo-700 truncate" title={kpi?.avgPtsPerJoiner || 0}>{kpi?.avgPtsPerJoiner || 0}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Outlets Card */}
                      <div className="bg-white p-5 md:p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col h-full relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-40 -mr-4 -mt-4 group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                           <div className="flex items-center gap-2">
                             <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><Store size={18} /></div>
                             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Outlets</p>
                           </div>
                        </div>
                        <div className="relative z-10 mb-4">
                            <span className="text-3xl font-black text-slate-800 tracking-tight leading-none block mb-1">{kpi?.totalMex || 0}</span>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Total Managed</span>
                        </div>
                        <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50 relative z-10">
                          <div className="flex-1 min-w-0 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex flex-col justify-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 truncate">Inactive</span>
                            <span className="text-xs font-black text-slate-500 truncate" title={kpi?.inactiveMex || 0}>{kpi?.inactiveMex || 0}</span>
                          </div>
                          <div className="flex-1 min-w-0 bg-blue-50 p-2.5 rounded-2xl border border-blue-100 flex flex-col justify-center">
                            <span className="text-[9px] font-bold text-blue-500 uppercase mb-0.5 truncate">Active</span>
                            <span className="text-xs font-black text-blue-700 truncate" title={kpi?.activeMex || 0}>{kpi?.activeMex || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CHARTS ROW 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                      {/* Top 10 MTD */}
                      <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="text-[#00B14F] w-5 h-5"/> Top 10 Merchants <span className="text-slate-400 font-bold normal-case text-xs bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">(MTD Sales)</span></h3>
                        </div>
                        <div className="h-64 md:h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartsData.mtd} onClick={onChartClick} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                              <XAxis dataKey="name" tick={{ fill: COLORS.slate500, fontSize: 9, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.substring(0, 6)+'.'} />
                              <YAxis tick={{ fill: COLORS.slate400, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} width={60} />
                              <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v) => formatCurrency(v)} />
                              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop:'10px' }} iconType="circle"/>
                              <Bar dataKey="lmBs" name="LM Sales" fill={COLORS.lastMonth} radius={[6,6,0,0]} maxBarSize={28} cursor="pointer" />
                              <Bar dataKey="mtdBs" name="MTD Sales" fill={COLORS.primary} radius={[6,6,0,0]} maxBarSize={28} cursor="pointer" />
                              <Line type="monotone" dataKey="rrBs" name="Runrate" stroke={COLORS.growth} strokeWidth={4} dot={{r:4, fill: '#ffffff', strokeWidth: 3}} activeDot={{r: 6}} cursor="pointer" />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Campaign Segmentation Chart */}
                      <div className="bg-white p-5 md:p-6 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col h-[400px] lg:h-full lg:max-h-[450px]">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Target className="text-indigo-500 w-5 h-5"/> Campaign Segment</h3>
                            <span className="bg-indigo-50 text-indigo-700 font-black text-[10px] md:text-xs px-2.5 py-1 rounded-lg border border-indigo-100">
                                {(( (kpi?.joiners || 0) / Math.max(1, (kpi?.joiners || 0) + campaignStats.zeroInvest)) * 100).toFixed(0)}% Rate
                            </span>
                        </div>
                        
                        <div className="flex-1 w-full overflow-hidden">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={campaignStats.classification} 
                                layout="vertical" 
                                margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
                                onClick={(state) => {
                                  if (state && state.activePayload && state.activePayload.length > 0) {
                                    setActiveSegmentModal(state.activePayload[0].payload.name);
                                  }
                                }}
                            >
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: COLORS.slate500, fontSize: 11, fontWeight: 700 }} width={85} />
                              <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border:'none', padding: '10px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                              <Bar 
                                dataKey="count" 
                                name="Total Merchant" 
                                radius={[0, 8, 8, 0]} 
                                barSize={26} 
                                cursor="pointer"
                                label={{ position: 'right', fill: '#475569', fontSize: 12, fontWeight: 900 }}
                              >
                                {campaignStats.classification.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 text-center mt-3 bg-slate-50 py-2 rounded-xl">*Klik bar grafik untuk detail merchant</p>
                      </div>
                    </div>

                    {/* CHARTS ROW 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                      <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Megaphone className="text-rose-500 w-5 h-5"/> Top 10 Ads Spender <span className="text-slate-400 font-bold normal-case text-xs bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">(vs LM & RR)</span></h3>
                        </div>
                        <div className="h-56 md:h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartsData.ads} onClick={onChartClick} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                              <XAxis dataKey="name" tick={{ fill: COLORS.slate500, fontSize: 9, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.substring(0, 8)+'.'} />
                              <YAxis tick={{ fill: COLORS.slate400, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} width={60} />
                              <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding:'12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v) => formatCurrency(v)} />
                              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop:'10px' }} iconType="circle" />
                              <Bar dataKey="adsLM" name="Ads LM" fill="#c084fc" radius={[6,6,0,0]} maxBarSize={32} cursor="pointer" />
                              <Bar dataKey="adsTotal" name="Ads MTD" fill="#fb923c" radius={[6,6,0,0]} maxBarSize={32} cursor="pointer" />
                              <Line type="monotone" dataKey="adsRR" name="Ads RR" stroke="#2dd4bf" strokeWidth={4} dot={{r:4, fill: '#ffffff', strokeWidth: 3}} activeDot={{r: 6}} cursor="pointer" />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Portfolio Health */}
                      <div className="bg-white p-5 md:p-6 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col justify-center h-[350px] lg:h-full lg:max-h-[400px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full opacity-50 -mr-8 -mt-8 pointer-events-none"></div>
                        <div className="flex justify-between items-end mb-6 relative z-10">
                            <div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Activity className="text-blue-500 w-5 h-5"/> Portfolio Health</h3>
                                <p className="text-[11px] font-bold text-slate-500 mt-1">Growth vs LM</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl md:text-3xl font-black text-[#00B14F] leading-none drop-shadow-sm">{chartsData.health[0].percentage}%</span>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Growing</p>
                            </div>
                        </div>
                        <div className="flex h-5 md:h-6 w-full rounded-full overflow-hidden bg-slate-100 shadow-inner mb-8 relative z-10">
                            {chartsData.health.map((h, i) => (
                                <div key={i} style={{ width: `${h.percentage}%`, backgroundColor: h.color }} className="h-full border-r-2 border-white/40 hover:brightness-110 transition-all cursor-pointer" title={`${h.name}: ${h.percentage}%`} />
                            ))}
                        </div>
                        <div className="space-y-4 relative z-10">
                            {chartsData.health.map((h, i) => (
                                <div key={i} className="flex items-center justify-between text-sm bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3.5 h-3.5 rounded-md shadow-sm" style={{ backgroundColor: h.color }} />
                                        <span className="font-bold text-slate-700">{h.name}</span>
                                    </div>
                                    <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100">{h.count} <span className="text-[10px] text-slate-400 font-bold ml-1.5">({h.percentage}%)</span></span>
                                </div>
                            ))}
                        </div>
                      </div>
                    </div>

                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 2: MASTER DATASET */}
              {/* ========================================================= */}
              {activeTab === 'data' && (
                <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden animate-in fade-in duration-500 flex flex-col h-[80vh]">
                  <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-[#f8fafc] shrink-0">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Table className="w-5 h-5 text-indigo-500"/> Master Data Directory</h3>
                    <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-black shadow-sm">Records: {filtered.length}</div>
                  </div>
                  
                  <div className="overflow-auto flex-1 custom-scrollbar">
                    {filtered.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Search className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm font-bold uppercase tracking-widest">Data tidak ditemukan.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm relative">
                         <thead className="bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest border-b-2 border-slate-100 sticky top-0 z-10">
                           <tr>
                             <th className="px-5 py-4">Merchant</th>
                             <th className="px-4 py-4 text-center hidden md:table-cell">Campaign</th>
                             <th className="px-4 py-4 text-center">Trend vs LM</th>
                             <th className="px-4 py-4 text-center hidden lg:table-cell">Priority</th>
                             <th className="px-5 py-4 text-right">MTD Sales</th>
                             <th className="px-5 py-4 text-center">Status</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                            {filtered.map((r) => (
                              <tr key={r.id} onClick={() => setSelectedMex(r)} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                <td className="px-5 py-3 w-1/3">
                                  <p className="font-bold text-slate-800 text-xs md:text-sm group-hover:text-[#00B14F] truncate transition-colors">{r.name}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <p className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{r.id}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center hidden md:table-cell">
                                  <span className={`text-[10px] font-bold ${r.campaigns && r.campaigns !== '-' && !r.campaigns.toLowerCase().includes('no campaign') ? 'text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100' : 'text-slate-400 bg-slate-50 px-2 py-1 rounded-md'}`}>
                                    {r.campaigns && r.campaigns !== '-' && !r.campaigns.toLowerCase().includes('no campaign') ? 'Active' : '-'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                   <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black shadow-sm ${r.rrBs > r.lmBs ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                      {r.rrBs > r.lmBs ? <ArrowUpRight className="w-3.5 h-3.5"/> : <ArrowDownRight className="w-3.5 h-3.5"/>}
                                      {Math.abs(r.rrVsLm).toFixed(0)}%
                                   </span>
                                </td>
                                <td className="px-4 py-3 text-center hidden lg:table-cell">
                                   <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${r.mcaPriority !== '-' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'text-slate-400 bg-slate-50'}`}>
                                      {r.mcaPriority}
                                   </span>
                                </td>
                                <td className="px-5 py-3 font-mono text-slate-800 font-black text-right text-xs md:text-sm">{formatCurrency(r.mtdBs)}</td>
                                <td className="px-5 py-3 text-center">
                                   <div className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${r.zeusStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{r.zeusStatus}</div>
                                </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 3: MERCHANT SIMULATOR */}
              {/* ========================================================= */}
              {activeTab === 'simulator' && (
                <MerchantSimulator />
              )}
            </Fragment>
          ) : (
            // =========================================================
            // VIEW MERCHANT DETAIL
            // =========================================================
            <div className="animate-in slide-in-from-right-8 duration-500 space-y-5 md:space-y-6 pb-12">

               {/* Profile Header */}
               <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full opacity-50 -mr-8 -mt-8 pointer-events-none"></div>
                  <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-1.5">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight">{selectedMex.name}</h2>
                        <span className={`hidden md:inline-flex px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest ${selectedMex.zeusStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{selectedMex.zeusStatus}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <span className="font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold">{selectedMex.id}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-700 font-bold uppercase tracking-wider text-xs"><Users className="w-3.5 h-3.5 inline mr-1 text-slate-400" /> {selectedMex.amName}</span>
                     </div>
                  </div>
                  <span className={`md:hidden inline-flex px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest ${selectedMex.zeusStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{selectedMex.zeusStatus}</span>
               </div>

               {/* NEW TOP KPI CARDS (PROPORTIONAL 4-COLS) DIBAWAH HEADER */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Card 1: Sales */}
                  <div className="bg-white rounded-[32px] shadow-lg shadow-slate-200/40 border border-slate-100 p-5 md:p-6 flex flex-col h-full group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-bl-full opacity-40 -mr-4 -mt-4 group-hover:scale-125 transition-transform duration-700"></div>
                     <div className="flex justify-between items-start mb-6 relative z-10">
                         <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-50 rounded-xl text-[#00B14F]"><Activity size={16}/></div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Sales</p>
                         </div>
                         <div className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-lg border ${selectedMex.rrBs > selectedMex.lmBs ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
                            {selectedMex.rrBs > selectedMex.lmBs ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
                            {Math.abs(selectedMex.rrVsLm).toFixed(1)}%
                         </div>
                     </div>
                     <div className="relative z-10 mb-4">
                         <span className="text-2xl md:text-3xl font-black text-[#00B14F] tracking-tight leading-none block mb-1">{formatCurrency(selectedMex.rrBs)}</span>
                         <span className="text-[10px] font-black text-[#00B14F] uppercase tracking-widest">Projected Runrate</span>
                     </div>
                     <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50 relative z-10">
                         <div className="flex-1 min-w-0 bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-center">
                           <span className="text-[9px] text-slate-400 font-bold uppercase mb-0.5 truncate">Last Month</span>
                           <span className="text-xs font-black text-slate-600 truncate" title={formatCurrency(selectedMex.lmBs)}>{formatCurrency(selectedMex.lmBs)}</span>
                         </div>
                         <div className="flex-1 min-w-0 bg-emerald-50 p-2 rounded-xl border border-emerald-100 flex flex-col justify-center">
                           <span className="text-[9px] text-slate-500 font-bold uppercase mb-0.5 truncate">MTD Sales</span>
                           <span className="text-xs font-black text-slate-800 truncate" title={formatCurrency(selectedMex.mtdBs)}>{formatCurrency(selectedMex.mtdBs)}</span>
                         </div>
                     </div>
                  </div>

                  {/* Card 2: Active Campaigns */}
                  <div className="bg-white rounded-[32px] shadow-lg shadow-slate-200/40 border border-slate-100 p-5 md:p-6 flex flex-col h-full group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-transparent rounded-bl-full opacity-40 -mr-4 -mt-4 group-hover:scale-125 transition-transform duration-700"></div>
                     <div className="flex justify-between items-start mb-6 relative z-10">
                         <div className="flex items-center gap-2">
                            <div className="p-2 bg-amber-50 rounded-xl text-amber-500"><Zap size={16}/></div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Campaigns</p>
                         </div>
                     </div>
                     <div className="relative z-10 mb-4">
                         <span className="text-2xl md:text-3xl font-black text-amber-500 tracking-tight leading-none block mb-1 flex items-center gap-2">
                           {selectedMex.campaignPoint || 0} <Award className="w-6 h-6 text-amber-300" />
                         </span>
                         <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Campaign Points</span>
                     </div>
                     <div className="mt-auto pt-4 border-t border-slate-50 relative z-10">
                         <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1 truncate">Active List:</span>
                         {renderMerchantCampaigns(selectedMex.campaigns)}
                     </div>
                  </div>

                  {/* Card 3: Marketing */}
                  <div className="bg-white rounded-[32px] shadow-lg shadow-slate-200/40 border border-slate-100 p-5 md:p-6 flex flex-col h-full group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-100 to-transparent rounded-bl-full opacity-40 -mr-4 -mt-4 group-hover:scale-125 transition-transform duration-700"></div>
                     <div className="flex justify-between items-start mb-6 relative z-10">
                         <div className="flex items-center gap-2">
                             <div className="p-2 bg-rose-50 rounded-xl text-rose-500"><Megaphone size={16}/></div>
                             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Marketing</p>
                         </div>
                     </div>
                     <div className="relative z-10 mb-4">
                         <span className="text-2xl md:text-3xl font-black text-rose-500 tracking-tight leading-none block mb-1">{formatCurrency(selectedMex.adsTotal)}</span>
                         <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Ads Spend (MTD)</span>
                     </div>
                     <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50 relative z-10">
                         <div className="flex-1 min-w-0 bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-center">
                           <span className="text-[9px] text-slate-400 font-bold uppercase mb-0.5 truncate">Promo (MI)</span>
                           <span className="text-xs font-black text-slate-700 truncate" title={formatCurrency(selectedMex.miMtd)}>{formatCurrency(selectedMex.miMtd)}</span>
                         </div>
                         <div className="w-16 min-w-0 bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col items-center justify-center shrink-0">
                           <span className="text-[9px] text-slate-400 font-bold uppercase mb-0.5 truncate max-w-full">Komisi</span>
                           <span className="text-xs font-black text-slate-800 truncate max-w-full" title={selectedMex.commission || '-'}>{selectedMex.commission || '-'}</span>
                         </div>
                     </div>
                  </div>

                  {/* Card 4: MCA */}
                  <div className="bg-white rounded-[32px] shadow-lg shadow-slate-200/40 border border-slate-100 p-5 md:p-6 flex flex-col h-full group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-40 -mr-4 -mt-4 group-hover:scale-125 transition-transform duration-700"></div>
                     <div className="flex justify-between items-start mb-6 relative z-10">
                         <div className="flex items-center gap-2">
                             <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><Database size={16}/></div>
                             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">MCA Config</p>
                         </div>
                         {selectedMex.mcaPriority && selectedMex.mcaPriority !== '-' && (
                             <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[9px] font-black uppercase shadow-sm border border-blue-100">
                                {selectedMex.mcaPriority}
                             </span>
                         )}
                     </div>
                     <div className="relative z-10 mb-4">
                         <span className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight leading-none block mb-1">{formatCurrency(selectedMex.mcaAmount)}</span>
                         <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Dana Cair</span>
                     </div>
                     <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50 relative z-10">
                         <div className="flex-1 min-w-0 bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-center">
                           <span className="text-[9px] text-slate-400 font-bold uppercase mb-0.5 truncate">Limit Tersedia</span>
                           <span className="text-xs font-black text-slate-700 truncate" title={selectedMex.mcaWlLimit > 0 ? formatCurrency(selectedMex.mcaWlLimit) : 'Rp 0'}>{selectedMex.mcaWlLimit > 0 ? formatCurrency(selectedMex.mcaWlLimit) : 'Rp 0'}</span>
                         </div>
                         <div className="flex items-center justify-center p-2 min-w-0 shrink-0">
                           <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border truncate ${selectedMex.mcaWlLimit > 0 && !selectedMex.mcaWlClass.includes('Not') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                               {selectedMex.mcaWlLimit > 0 && !selectedMex.mcaWlClass.includes('Not') ? 'Eligible' : 'Not Eligible'}
                           </span>
                         </div>
                     </div>
                  </div>
               </div>

               {/* RESTRUCTURED ANALYTICS CHARTS */}
               {selectedMex.history && selectedMex.history.length > 0 && (
                   <div className="space-y-5 md:space-y-6">
                       
                       {/* ROW 1: 12-Month Review (Left) + Investment (Right) */}
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
                           {/* 12-Month Review */}
                           <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-5 md:p-6 flex flex-col h-[400px] md:h-[480px]">
                                <div className="flex justify-between items-start md:items-center mb-6 gap-2">
                                   <div>
                                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="text-blue-500 w-5 h-5"/> 12-Month Review</h3>
                                   </div>
                                   {selectedMex.lastUpdate && (
                                       <div className="flex flex-col text-right justify-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm shrink-0">
                                           <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Last Update</span>
                                           <span className="text-[10px] md:text-xs font-black text-slate-700 leading-none">{selectedMex.lastUpdate}</span>
                                       </div>
                                   )}
                                </div>
                                <div className="flex-1 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <ComposedChart data={selectedMex.history.slice(-12)} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="month" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={formatMonth} />
                                        <YAxis yAxisId="left" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} width={60} />
                                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: '#f97316', fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={40} />
                                        <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v, n) => [n.includes('%') ? `${v}%` : formatCurrency(v), n]} labelFormatter={formatMonth}/>
                                        <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop:'15px' }} />
                                        
                                        <Line yAxisId="left" type="monotone" dataKey="basket_size" name="Total Basket Size" stroke={COLORS.basketSize} strokeWidth={4} dot={{r:4, fill: '#ffffff', strokeWidth: 3}} activeDot={{r: 6}} />
                                        <Bar yAxisId="left" dataKey="net_sales" stackId="a" name="Net Sales" fill={COLORS.netSales} maxBarSize={20} radius={[4,4,0,0]} />
                                        <Bar yAxisId="left" dataKey="total_investment" stackId="a" name="MI (Rp)" fill="#f43f5e" radius={[4,4,0,0]} maxBarSize={20} />
                                        <Line yAxisId="right" type="monotone" dataKey="mi_percentage" name="MI %" stroke="#f97316" strokeWidth={3} dot={{r:4, fill: '#ffffff', strokeWidth: 3}} activeDot={{r: 6}} />
                                      </ComposedChart>
                                    </ResponsiveContainer>
                                 </div>
                           </div>

                           {/* 3. MERCHANT INVESTMENT */}
                           <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-5 md:p-6 flex flex-col h-[400px] md:h-[480px]">
                                <div className="flex justify-between items-start mb-6">
                                   <div className="flex items-center gap-2">
                                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><DollarSign className="text-rose-500 w-5 h-5"/> Investment (MI)</h3>
                                   </div>
                                   <div className="bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 flex items-center gap-1.5 shadow-sm">
                                      <Percent className="w-3.5 h-3.5 text-rose-500"/>
                                      <span className="text-[11px] font-black text-rose-700" title="MI % dari Basket Size Bulan Terakhir">
                                          {selectedMex.history[selectedMex.history.length-1].mi_percentage}%
                                      </span>
                                   </div>
                                </div>
                                <div className="flex-1 w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={selectedMex.history.slice(-12)} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                          <XAxis dataKey="month" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={formatMonth} />
                                          <YAxis tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} width={50} />
                                          <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v) => formatCurrency(v)} labelFormatter={formatMonth}/>
                                          
                                          <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '15px' }} iconType="circle" />
                                          
                                          <Bar dataKey="mfp" stackId="a" name="Local Promo" fill="#3b82f6" maxBarSize={28} />
                                          <Bar dataKey="mfc" stackId="a" name="Harga Coret" fill="#22c55e" maxBarSize={28} />
                                          <Bar dataKey="cpo" stackId="a" name="GMS" fill="#f97316" maxBarSize={28} />
                                          <Bar dataKey="ads_total_hist" stackId="a" name="Iklan" fill="#ef4444" radius={[6,6,0,0]} maxBarSize={28} />
                                      </BarChart>
                                  </ResponsiveContainer>
                                </div>
                           </div>
                       </div>

                       {/* ROW 2: AOV & Orders (Left) + Promo Usage (Right) */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                            {/* 1. AOV TREND */}
                            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-5 md:p-6">
                                <div className="flex items-center gap-2 mb-6">
                                   <ShoppingBag className="w-5 h-5 text-indigo-500"/>
                                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">AOV & Orders</h3>
                                </div>
                                <div className="h-56 md:h-[300px] w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <ComposedChart data={selectedMex.history.slice(-12)} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                                          <defs>
                                              <linearGradient id="colorAov" x1="0" y1="0" x2="0" y2="1">
                                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                              </linearGradient>
                                          </defs>
                                          <XAxis dataKey="month" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={formatMonth} />
                                          <YAxis yAxisId="left" domain={['auto', 'auto']} tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} width={45} />
                                          <YAxis yAxisId="right" orientation="right" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} width={30} />
                                          <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v, n) => [n.includes('Orders') ? v : formatCurrency(v), n]} labelFormatter={formatMonth}/>
                                          <Area yAxisId="left" type="monotone" dataKey="aov" name="AOV" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAov)" />
                                          <Line yAxisId="right" type="monotone" dataKey="completed_orders" name="Completed Orders" stroke="#10b981" strokeWidth={3} dot={{r:3}} activeDot={{r:5}} />
                                      </ComposedChart>
                                  </ResponsiveContainer>
                                </div>
                            </div>

                            {/* 2. ORDER WITH CAMPAIGN % */}
                            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-5 md:p-6">
                                <div className="flex items-start gap-2 mb-6">
                                   <Target className="w-5 h-5 text-teal-500 shrink-0"/>
                                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-tight">
                                       Promo Usage <span className="text-[10px] text-slate-400 font-bold normal-case tracking-normal block mt-0.5">(Gms & Cofund Only)</span>
                                   </h3>
                                </div>
                                <div className="h-56 md:h-[300px] w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={selectedMex.history.slice(-12)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                          <XAxis dataKey="month" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={formatMonth} />
                                          <YAxis domain={[0, 100]} tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={35} />
                                          <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v) => `${v}%`} labelFormatter={formatMonth}/>
                                          <Line type="monotone" dataKey="promo_order_pct" name="% Promo Usage" stroke="#14b8a6" strokeWidth={4} dot={{r:4, fill: '#ffffff', strokeWidth: 3}} activeDot={{r:6}} />
                                      </LineChart>
                                  </ResponsiveContainer>
                                </div>
                            </div>
                       </div>
                   </div>
               )}

               {/* NEW: CONTACT DETAILS AT THE BOTTOM */}
               <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-5 md:p-8 mt-6">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                     <Info className="w-5 h-5 text-indigo-500"/>
                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Informasi Kontak & Lokasi</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

                      {/* Contact Box */}
                      <div className="bg-gradient-to-br from-slate-50 to-white p-4 md:p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center gap-4">
                         <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-slate-400 shrink-0 mt-0.5"/>
                            <div className="flex flex-col">
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone Number</span>
                               {selectedMex.phone && selectedMex.phone !== '-' ? (
                                  <button 
                                     onClick={() => setShowWaModal(true)}
                                     className="text-sm md:text-base font-black text-slate-800 hover:text-[#00B14F] transition-colors flex items-center gap-1.5 group cursor-pointer text-left"
                                     title="Pilih Template Pesan WhatsApp"
                                  >
                                     {selectedMex.phone}
                                     <MessageCircle className="w-3.5 h-3.5 text-[#00B14F] opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </button>
                               ) : (
                                  <span className="text-sm md:text-base font-black text-slate-800">-</span>
                               )}
                            </div>
                         </div>
                         <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-slate-400 shrink-0 mt-0.5"/>
                            <div className="flex flex-col">
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email Address</span>
                               <span className="text-sm font-bold text-indigo-600 break-all">{selectedMex.email || '-'}</span>
                            </div>
                         </div>
                      </div>

                      {/* Address Box */}
                      <div className="bg-gradient-to-br from-slate-50 to-white p-4 md:p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center gap-4 lg:col-span-2">
                         <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5"/>
                            <div className="flex flex-col">
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Address</span>
                               <span className="text-sm font-semibold text-slate-700 leading-relaxed">{selectedMex.city ? `${selectedMex.address}, ${selectedMex.city}` : '-'}</span>
                            </div>
                         </div>
                         {(selectedMex.latitude || selectedMex.longitude) && (
                            <div className="flex items-start gap-3">
                               <ExternalLink className="w-5 h-5 text-slate-400 shrink-0 mt-0.5"/>
                               <div className="flex flex-col">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Maps Coords</span>
                                  <a href={`https://maps.google.com/?q=${selectedMex.latitude},${selectedMex.longitude}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-blue-500 hover:text-blue-700 transition-colors font-bold break-all">
                                      {selectedMex.latitude}, {selectedMex.longitude}
                                  </a>
                               </div>
                            </div>
                         )}
                      </div>
                  </div>
               </div>

            </div>
          )}
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .pb-safe { padding-bottom: max(2rem, env(safe-area-inset-bottom)); }
        * { font-feature-settings: "tnum" on, "lnum" on; }
        
        @keyframes float-down { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(2.5px); } }
        .animate-float-down { animation: float-down 1.5s ease-in-out infinite; }
        
        @keyframes float-up { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
        .animate-float-up { animation: float-up 1.5s ease-in-out infinite; }
      `}} />
    </div>
  );
}
