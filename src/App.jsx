import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  ComposedChart, Line, Cell, AreaChart, Area, LabelList, PieChart, Pie
} from 'recharts';
import { 
  UploadCloud, TrendingUp, Database, Filter, Megaphone,
  Search, CheckCircle, AlertCircle, DollarSign, Activity, X,
  Store, ArrowUpRight, ArrowDownRight, Users, Info, ArrowLeft, Zap, MapPin, Phone, Smartphone, Mail, Award, LayoutDashboard, Table, ShoppingBag, Target, Percent, ExternalLink,
  Check, ChevronDown, MousePointer, RefreshCw, BarChart2, FileText, MessageCircle, Clock, ArrowUp, ArrowDown, Moon, Sun, ChevronLeft, ChevronRight
} from 'lucide-react';

// ============================================================================
// UTILS & CONSTANTS
// ============================================================================
const cleanNumber = (val) => {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val;
  let str = String(val).trim().replace(/[▲▼%\s]/g, ''); 
  if (!str) return 0;
  const commaCount = (str.match(/,/g) || []).length;
  const dotCount = (str.match(/\./g) || []).length;
  
  if (commaCount > 0 && dotCount > 0) {
     if (str.lastIndexOf(',') > str.lastIndexOf('.')) str = str.replace(/\./g, '').replace(',', '.');
     else str = str.replace(/,/g, '');
  } else if (commaCount > 0) {
     if (commaCount > 1) str = str.replace(/,/g, ''); 
     else {
         const parts = str.split(',');
         if (parts[1] && parts[1].length === 3) str = str.replace(',', ''); 
         else str = str.replace(',', '.'); 
     }
  } else if (dotCount > 0) {
     if (dotCount > 1) str = str.replace(/\./g, ''); 
     else {
         const parts = str.split('.');
         if (parts[1] && parts[1].length === 3) str = str.replace(/\./g, ''); 
     }
  }
  str = str.replace(/[^0-9.-]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

const formatCurrency = (val) => {
  if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(2)}B`;
  if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `Rp ${(val / 1000).toFixed(0)}K`;
  return `Rp ${val}`;
};

const formatCurrencyFull = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
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
  slate500: '#64748b',
  slate400: '#94a3b8',
  netSales: '#10b981', 
  basketSize: '#3b82f6' 
};

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

const getPriorityBadgeClass = (prio) => {
    if (!prio || prio === '-') return 'bg-slate-500/[0.65] text-white border-slate-600/[0.65] shadow-sm backdrop-blur-sm';
    const p = String(prio).toUpperCase();
    if (p.includes('P0')) return 'bg-rose-600/[0.65] text-white border-rose-700/[0.65] shadow-sm backdrop-blur-sm';
    if (p.includes('P1')) return 'bg-amber-600/[0.65] text-white border-amber-700/[0.65] shadow-sm backdrop-blur-sm';
    if (p.includes('P2')) return 'bg-blue-600/[0.65] text-white border-blue-700/[0.65] shadow-sm backdrop-blur-sm';
    if (p.includes('P3')) return 'bg-emerald-600/[0.65] text-white border-emerald-700/[0.65] shadow-sm backdrop-blur-sm';
    return 'bg-indigo-600/[0.65] text-white border-indigo-700/[0.65] shadow-sm backdrop-blur-sm';
};

const getShortAMName = (fullName) => {
    const amFull = (fullName || 'AM').trim();
    const amFullLower = amFull.toLowerCase();
    let amShort = amFull.split(' ')[0]; 
    if (amFullLower.includes('novan')) return 'Novan';
    if (amFullLower.includes('reginaldo') || amFullLower.includes('aldo')) return 'Aldo';
    if (amFullLower.includes('dadan')) return 'Dadan';
    if (amFullLower.includes('hikam')) return 'Hikam';
    return amShort;
};

// ============================================================================
// INDEXEDDB BROWSER STORAGE
// ============================================================================
const DB_NAME = 'AmDashboardDB';
const STORE_NAME = 'merchantsStore';
const initDB = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = e => reject(e.target.error);
    request.onsuccess = e => resolve(e.target.result);
    request.onupgradeneeded = e => {
      if (!e.target.result.objectStoreNames.contains(STORE_NAME)) {
        e.target.result.createObjectStore(STORE_NAME);
      }
    };
});
const saveToIndexedDB = async (key, data) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const request = transaction.objectStore(STORE_NAME).put(data, key);
    request.onsuccess = () => resolve();
    request.onerror = e => reject(e.target.error);
  });
};
const loadFromIndexedDB = async (key) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(key);
    request.onsuccess = e => resolve(e.target.result);
    request.onerror = e => reject(e.target.error);
  });
};
const fNum = (n) => Math.round(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function App() {
  const [data, setData] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isForceUpload, setIsForceUpload] = useState(false);
  const [globalLastUpdate, setGlobalLastUpdate] = useState('');
  
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
  const [showMcaModal, setShowMcaModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showMiModal, setShowMiModal] = useState(false);
  const [showOutletsModal, setShowOutletsModal] = useState(false);
  const [showAdsModal, setShowAdsModal] = useState(false);
  const [outletModalTab, setOutletModalTab] = useState('inactive');
  
  const [showFloatingBar, setShowFloatingBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [compareMonths, setCompareMonths] = useState(['', '', '']);
  const [sortConfig, setSortConfig] = useState({ key: 'mtdBs', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('am_dashboard_theme') === 'dark');

  useEffect(() => { localStorage.setItem('am_dashboard_theme', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);
  useEffect(() => { setShowFloatingBar(true); }, [selectedMex]);

  const handleMainScroll = (e) => {
      const currentScrollY = e.target.scrollTop;
      if (currentScrollY > lastScrollY && currentScrollY > 20) setShowFloatingBar(false);
      else setShowFloatingBar(true);
      setLastScrollY(currentScrollY);
  };

  const handleSendWA = (templateType) => {
      if (!selectedMex || !selectedMex.phone) return;
      const phone = selectedMex.phone.replace(/\D/g, ''); 
      const owner = selectedMex.ownerName !== '-' ? selectedMex.ownerName : 'Mitra Grab';
      const amShort = getShortAMName(selectedMex.amName);
      const mexName = selectedMex.name;
      let mcaLimit = selectedMex.mcaWlLimit >= 1000000 ? `Rp ${Number.isInteger(selectedMex.mcaWlLimit/1000000) ? selectedMex.mcaWlLimit/1000000 : (selectedMex.mcaWlLimit/1000000).toFixed(1).replace('.', ',')} Juta` : `Rp ${fNum(selectedMex.mcaWlLimit)}`;

      let templates = [];
      switch(templateType) {
          case 'promo': templates = [`Halo kak ${owner}! Saya ${amShort} (Grab). Ada program Promo spesial buat ${mexName}. Boleh bahas via telpon?`, `Selamat pagi kak ${owner}, saya ${amShort}. Khusus ${mexName} ada kuota promo. Mau dibantu?`]; break;
          case 'mca': templates = [`Halo kak ${owner}! Ada program Grab Modal Mantul s/d ${mcaLimit} untuk ${mexName}. Cek aplikasi ya!`, `Siang kak ${owner}! Yuk kembangin ${mexName} dengan Modal Mantul s/d ${mcaLimit}. Cek GrabMerchant!`]; break;
          case 'inactive': templates = [`Halo kak ${owner}! Saya cek ${mexName} offline nih. Ada kendala kak?`, `Siang kak ${owner}, notis ${mexName} belum aktif. Kalau ada kendala kabari ya.`]; break;
          default: templates = [`Halo kak ${owner}, saya ${amShort} (Grab). Boleh ngobrol bentar soal performa ${mexName}?`, `Siang kak ${owner}! Ingin diskusi penjualan ${mexName}. Kapan ada waktu luang?`];
      }
      const randomText = templates[Math.floor(Math.random() * templates.length)];
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(randomText)}`, '_blank');
      setShowWaModal(false);
  };

  useEffect(() => {
    const loadLocalData = async () => {
        try {
            const saved = await loadFromIndexedDB('am_dashboard_data');
            if (saved && saved.length > 0) {
                saved.sort((a, b) => a.name.localeCompare(b.name));
                setData(saved); setIsForceUpload(false);
                const savedUpdate = localStorage.getItem('am_dashboard_last_update');
                if (savedUpdate) setGlobalLastUpdate(savedUpdate);
            }
        } catch (e) {}
        setIsInitializing(false);
    };
    loadLocalData();
  }, []);

  const saveToLocal = async (finalData) => {
      setLoading(true);
      try {
          await new Promise(resolve => setTimeout(resolve, 500));
          await saveToIndexedDB('am_dashboard_data', finalData);
          setData(finalData); setIsForceUpload(false);
      } catch (e) { setErrorMsg("Gagal menyimpan data: " + e.message); }
      setLoading(false);
  };

  const parseCSVString = (str) => {
    const firstLine = str.split('\n')[0] || '';
    const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';
    const arr = []; let quote = false; let row = 0, col = 0;
    for (let c = 0; c < str.length; c++) {
      let cc = str[c], nc = str[c+1];
      arr[row] = arr[row] || []; arr[row][col] = arr[row][col] || '';
      if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; continue; }
      if (cc === '"') { quote = !quote; continue; }
      if (cc === delimiter && !quote) { ++col; continue; }
      if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue; }
      if ((cc === '\n' || cc === '\r') && !quote) { ++row; col = 0; continue; }
      arr[row][col] += cc;
    }
    return arr;
  };

  const parseAndSave = async (masterText, histText) => {
    try {
        const masterLines = parseCSVString(masterText);
        const firstRow = masterLines[0] || [];
        let extractedDate = ''; let extractedMonth = '';
        if (String(firstRow[45]).trim().toUpperCase() === 'MTD') { extractedDate = String(firstRow[46]).trim(); extractedMonth = String(firstRow[47]).trim(); } 
        else {
            const fallbackIdx = firstRow.lastIndexOf('MTD');
            if (fallbackIdx !== -1) { extractedDate = String(firstRow[fallbackIdx + 1]).trim(); extractedMonth = String(firstRow[fallbackIdx + 2]).trim(); }
        }
        if (extractedDate) {
            const updateStr = `${extractedDate} ${extractedMonth || 'Feb'}`.trim();
            localStorage.setItem('am_dashboard_last_update', updateStr); setGlobalLastUpdate(updateStr);
        }
        
        let masterHeaderIdx = -1; let masterRawHeaders = [];
        for (let i = 0; i < Math.min(20, masterLines.length); i++) {
          const test = (masterLines[i] || []).map(h => h ? String(h).trim().replace(/[\r\n]+/g, ' ') : '');
          if (test.includes('Mex ID')) { masterRawHeaders = test; masterHeaderIdx = i; break; }
        }
        if (masterHeaderIdx === -1) throw new Error("Kolom 'Mex ID' tidak ditemukan."); 

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
        const mtdMiIdx = masterHeaders.findIndex(h => h.includes('MTD (MI)') || h.includes('MTD\n(MI)'));
        const lmMiIdx = mtdMiIdx > 0 ? mtdMiIdx - 1 : -1;
        const prioHeader = masterHeaders.find(h => h.toLowerCase().includes('priority') || h.toLowerCase().includes('prio') || h.toLowerCase().includes('framework'));
        const pointHeader = masterHeaders.find(h => h.toLowerCase().includes('total point') || h.toLowerCase().includes('point'));

        let parsedDataMap = new Map();
        for (let i = masterHeaderIdx + 1; i < masterLines.length; i++) {
          const vals = masterLines[i];
          if (!vals || !vals[mIdx] || vals[mIdx].toLowerCase() === 'mex id') continue;
          let obj = {}; masterHeaders.forEach((h, idx) => { if(h) obj[h] = vals[idx] !== undefined ? String(vals[idx]).trim() : ''; });
          
          const mexId = obj['Mex ID'];
          const lmBsVal = cleanNumber(vals[lmBIdx]); const mtdBsVal = cleanNumber(obj['MTD (BS)'] || obj['MTD\n(BS)']); const rrBsVal = cleanNumber(obj['RR (BS)'] || obj['RR\n(BS)']);
          let calcRrVsLm = lmBsVal > 0 ? ((rrBsVal - lmBsVal) / lmBsVal) * 100 : (rrBsVal > 0 ? 100 : 0);
          
          parsedDataMap.set(mexId, {
            id: mexId, name: obj['Mex Name'], amName: obj['AM Name'] || 'Unassigned',
            ownerName: vals[10] !== undefined && String(vals[10]).trim() !== '' ? String(vals[10]).trim() : '-',
            lmBs: lmBsVal, mtdBs: mtdBsVal, rrBs: rrBsVal, rrVsLm: calcRrVsLm,
            lmMi: cleanNumber(vals[lmMiIdx]), mtdMi: cleanNumber(obj['MTD (MI)'] || obj['MTD\n(MI)']), rrMi: cleanNumber(obj['RR (MI)'] || obj['RR\n(MI)']),
            adsLM: cleanNumber(vals[lmAIdx]), adsTotal: cleanNumber(obj['Total MTD (Ads)'] || obj['Total MTD\n(Ads)']), adsRR: cleanNumber(obj['RR (Ads)']),
            adsMob: cleanNumber(obj['Ads Mobile'] || obj['Ads mobile'] || obj['MTD Ads Mobile'] || obj['Ads Mob']),
            adsWeb: cleanNumber(obj['Ads Web'] || obj['Ads web'] || obj['MTD Ads Web']),
            adsDir: cleanNumber(obj['Ads Direct'] || obj['Ads direct'] || obj['MTD Ads Direct'] || obj['Ads Dir']),
            mcaAmount: cleanNumber(obj['MCA Amount']), mcaWlLimit: cleanNumber(obj['MCA WL']),
            mcaWlClass: obj['MCA WL Classification'] || '-Not in WL',
            mcaPriority: (prioHeader && obj[prioHeader]) ? String(obj[prioHeader]).trim() : '-',
            mcaDropOff: obj['Drop Off Screen'] && String(obj['Drop Off Screen']).trim().toUpperCase() !== 'FALSE' ? String(obj['Drop Off Screen']).trim() : '-',
            mcaDisburseStatus: obj['Disburse Status'] || '', disbursedDate: obj['Disbursed date'],
            zeusStatus: obj['Zeus'], joinDate: obj['Join Date'], campaigns: obj['Campaign'] || '', commission: obj['Base Commission'],
            city: obj['City Mex'], address: obj['Adress'] || obj['Address'], phone: obj['Phone zeus'], email: obj['Email zeus'],
            latitude: obj['Latitude'] || obj['Lat'] || (vals[14] !== undefined ? String(vals[14]).trim() : ''), 
            longitude: obj['Longitude'] || obj['Long'] || obj['Lng'] || (vals[15] !== undefined ? String(vals[15]).trim() : ''),
            lastUpdate: '', campaignPoint: cleanNumber(pointHeader ? obj[pointHeader] : 0), history: [] 
          });
        }

        if (histText) {
            const histLines = parseCSVString(histText);
            const histHeaders = (histLines[0] || []).map(h => h ? String(h).trim() : '');
            const hMexIdx = histHeaders.indexOf('merchant_id'); const hMonthIdx = histHeaders.indexOf('first_day_of_month');
            const hBsIdx = histHeaders.indexOf('basket_size'); const hTotalOrdersIdx = histHeaders.indexOf('total_orders');
            const hCompletedOrdersIdx = histHeaders.indexOf('completed_orders'); const hPromoOrdersIdx = histHeaders.indexOf('orders_with_promo_mfp_gms');
            const hAovIdx = histHeaders.indexOf('aov'); const hMfcIdx = histHeaders.indexOf('mfc_mex_spend');
            const hMfpIdx = histHeaders.indexOf('mfp_mex_spend'); const hCpoIdx = histHeaders.indexOf('cpo');
            const hGmsIdx = histHeaders.indexOf('gms'); const hCommIdx = histHeaders.indexOf('basic_commission');
            const hAdsWebIdx = histHeaders.indexOf('ads_web'); const hAdsMobIdx = histHeaders.indexOf('ads_mobile'); const hAdsDirIdx = histHeaders.indexOf('ads_direct');

            if (hMexIdx !== -1 && hMonthIdx !== -1) {
                for (let i = 1; i < histLines.length; i++) {
                    const vals = histLines[i];
                    if (!vals || !vals[hMexIdx]) continue;
                    const mexId = String(vals[hMexIdx]).trim();
                    if (parsedDataMap.has(mexId)) {
                        if (vals[0] && String(vals[0]).trim() !== '') parsedDataMap.get(mexId).lastUpdate = String(vals[0]).trim();
                        const baseBs = cleanNumber(vals[hBsIdx]); const totalOrders = cleanNumber(vals[hTotalOrdersIdx]);
                        const promoOrders = cleanNumber(vals[hPromoOrdersIdx]);
                        const adsTotalHist = cleanNumber(vals[hAdsWebIdx]) + cleanNumber(vals[hAdsMobIdx]) + cleanNumber(vals[hAdsDirIdx]);
                        const totalInvestment = cleanNumber(vals[hMfcIdx]) + cleanNumber(vals[hMfpIdx]) + cleanNumber(vals[hCpoIdx]) + cleanNumber(vals[hGmsIdx]) + cleanNumber(vals[hCommIdx]) + adsTotalHist;

                        parsedDataMap.get(mexId).history.push({
                            month: vals[hMonthIdx], basket_size: baseBs, net_sales: baseBs - totalInvestment,
                            total_orders: totalOrders, completed_orders: hCompletedOrdersIdx !== -1 ? cleanNumber(vals[hCompletedOrdersIdx]) : totalOrders,
                            orders_with_promo: promoOrders, promo_order_pct: totalOrders > 0 ? parseFloat(((promoOrders / totalOrders) * 100).toFixed(1)) : 0,
                            aov: cleanNumber(vals[hAovIdx]), mfc: cleanNumber(vals[hMfcIdx]), mfp: cleanNumber(vals[hMfpIdx]), cpo: cleanNumber(vals[hCpoIdx]), gms: cleanNumber(vals[hGmsIdx]), basic_commission: cleanNumber(vals[hCommIdx]), ads_total_hist: adsTotalHist,
                            mi_percentage: baseBs > 0 ? parseFloat(((totalInvestment / baseBs) * 100).toFixed(1)) : 0, total_investment: totalInvestment
                        });
                    }
                }
            }
        }
        const finalData = Array.from(parsedDataMap.values()).map(m => { if (m.history.length > 0) m.history.sort((a, b) => new Date(a.month) - new Date(b.month)); return m; });
        await saveToLocal(finalData);
    } catch (err) { setErrorMsg(err.message || "Gagal memproses data."); setLoading(false); }
  };

  const handleProcessFiles = async () => {
    setLoading(true); setErrorMsg('');
    try {
        const masterText = await fileMaster.text();
        const histText = fileHistory ? await fileHistory.text() : null;
        await parseAndSave(masterText, histText);
    } catch (err) { setErrorMsg("Gagal membaca file."); setLoading(false); }
  };

  const loadDemo = () => { 
     setLoading(true); 
     setTimeout(() => { 
        const amNames = ['Novan', 'Aldo', 'Dadan', 'Hikam'];
        const camps = ['GMS', 'Cuan', 'Ongkir', 'WEEKENDFEST', 'Booster+'];
        const m = ['2025-01-01','2025-02-01','2025-03-01','2025-04-01','2025-05-01','2025-06-01','2025-07-01','2025-08-01','2025-09-01','2025-10-01','2025-11-01','2025-12-01','2026-01-01','2026-02-01'];
        const genData = Array.from({ length: 150 }).map((_, i) => {
          const lm = Math.floor(Math.random() * 50000000) + 5000000;
          const rr = Math.random() > 0.4 ? lm * (1 + Math.random() * 0.5) : lm * (1 - Math.random() * 0.3);
          const mca = Math.random() > 0.8 ? Math.floor(Math.random() * 50000000) + 10000000 : 0;
          let baseBs = Math.floor(Math.random() * 15000000) + 5000000;
          const hist = m.map(mon => {
              baseBs = Math.max(1000000, baseBs * (1 + (Math.random() * 0.4 - 0.2)));
              const ord = Math.floor(baseBs / 40000);
              return { month: mon, basket_size: baseBs, net_sales: baseBs * 0.8, total_orders: ord, completed_orders: ord, orders_with_promo: Math.floor(ord*0.5), promo_order_pct: 50, aov: 40000, mfc: 0, mfp: 0, cpo: 0, gms: 0, basic_commission: 0, ads_total_hist: 0, mi_percentage: 12, total_investment: 0 };
          });
          return {
            id: `6-C${Math.random().toString(36).substr(2, 9).toUpperCase()}`, name: `Merchant ${String.fromCharCode(65 + (i % 26))} - Kota`, amName: amNames[i % 4], ownerName: `Ona`,
            lmBs: lm, mtdBs: rr * 0.7, rrBs: rr, rrVsLm: ((rr - lm) / lm) * 100, lmMi: 0, mtdMi: 0, rrMi: 0, adsLM: 0, adsTotal: 0, adsMob: 0, adsWeb: 0, adsDir: 0, adsRR: 0,
            mcaAmount: mca, mcaWlLimit: mca > 0 ? mca * 1.5 : 0, mcaWlClass: mca > 0 ? 'Repeat' : '-Not in WL', mcaPriority: mca > 0 ? 'P1' : '-', mcaDropOff: '-', mcaDisburseStatus: mca > 0 ? 'Disbursed' : '', disbursedDate: mca > 0 ? `15-Feb-26` : '',
            zeusStatus: Math.random() > 0.15 ? 'ACTIVE' : 'INACTIVE', joinDate: `12-Jan-22`, campaigns: Math.random() < 0.2 ? 'No Campaign' : camps[Math.floor(Math.random()*5)], commission: '20%',
            city: 'Kota', address: 'Jalan', phone: '+628123456789', email: 'test@mail.com', latitude: '', longitude: '', lastUpdate: '22 Feb', campaignPoint: 100, history: hist 
          };
        });
        saveToLocal(genData); 
     }, 600); 
  };

  const amOptions = useMemo(() => ['All', ...Array.from(new Set(data.map(d => d.amName).filter(Boolean))).sort()], [data]);
  const priorityOptions = useMemo(() => ['All', ...Array.from(new Set(data.map(d => d.mcaPriority).filter(p => p && p !== '-'))).sort()], [data]);
  const activeData = useMemo(() => selectedAM !== 'All' ? data.filter(d => d.amName === selectedAM) : data, [data, selectedAM]);

  const campaignStats = useMemo(() => {
    let zeroInvest = 0, gmsOnly = 0, gmsLocal = 0, boosterPlus = 0, localOnly = 0, joiners = 0; const counts = {};
    activeData.forEach(d => {
      const seg = getMerchantSegment(d.campaigns);
      if (seg === '0 Invest') zeroInvest++;
      else { joiners++; const camps = (d.campaigns || '').split(/[|,]/).map(x => x.trim()).filter(Boolean); camps.forEach(c => counts[c] = (counts[c] || 0) + 1); }
      if (seg === 'Booster+') boosterPlus++; else if (seg === 'GMS & Local') gmsLocal++; else if (seg === 'GMS Only') gmsOnly++; else if (seg === 'Local Only') localOnly++;
    });
    return { joiners, zeroInvest, classification: [ { name: 'GMS Only', count: gmsOnly, fill: '#0ea5e9' }, { name: 'GMS & Local', count: gmsLocal, fill: '#8b5cf6' }, { name: 'Booster+', count: boosterPlus, fill: '#f59e0b' }, { name: 'Local Only', count: localOnly, fill: '#10b981' }, { name: '0 Invest', count: zeroInvest, fill: '#cbd5e1' } ], list: Object.entries(counts).map(([name, count]) => ({ name, count })) };
  }, [activeData]);

  const filteredSegmentMerchants = useMemo(() => activeSegmentModal ? activeData.filter(m => getMerchantSegment(m.campaigns) === activeSegmentModal).sort((a, b) => b.mtdBs - a.mtdBs) : [], [activeData, activeSegmentModal]);
  const disbursedMerchants = useMemo(() => activeData.filter(m => m.mcaAmount > 0 && ((m.disbursedDate && String(m.disbursedDate).trim() !== '-') || (m.mcaDisburseStatus && String(m.mcaDisburseStatus).toLowerCase().includes('pending')))).sort((a, b) => new Date(b.disbursedDate || 0) - new Date(a.disbursedDate || 0)), [activeData]);
  const inactiveMerchants = useMemo(() => activeData.filter(m => !m.zeusStatus || m.zeusStatus.toUpperCase() !== 'ACTIVE').sort((a,b) => b.lmBs - a.lmBs), [activeData]);
  const zeroTrxMerchants = useMemo(() => activeData.filter(m => m.mtdBs <= 0).sort((a,b) => b.lmBs - a.lmBs), [activeData]);

  const kpi = useMemo(() => {
    if (!activeData.length) return null;
    let act = 0, inact = 0, zTrx = 0;
    activeData.forEach(d => { if (d.zeusStatus === 'ACTIVE') act++; else inact++; if (d.mtdBs <= 0) zTrx++; });
    const totPts = activeData.reduce((a, c) => a + (c.campaignPoint || 0), 0);
    const disbursedFeb = activeData.filter(c => c.mcaAmount > 0 && String(c.disbursedDate).toLowerCase().includes('feb'));

    return {
      lm: activeData.reduce((a, c) => a + c.lmBs, 0), rr: activeData.reduce((a, c) => a + c.rrBs, 0), mtd: activeData.reduce((a, c) => a + c.mtdBs, 0),
      miLm: activeData.reduce((a, c) => a + (c.lmMi || 0), 0), miRr: activeData.reduce((a, c) => a + (c.rrMi || 0), 0), miMtd: activeData.reduce((a, c) => a + (c.mtdMi || 0), 0),
      adsLm: activeData.reduce((a, c) => a + c.adsLM, 0), adsMtd: activeData.reduce((a, c) => a + c.adsTotal, 0), adsRr: activeData.reduce((a, c) => a + c.adsRR, 0),
      adsMobMtd: activeData.reduce((a, c) => a + (c.adsMob || 0), 0), adsWebMtd: activeData.reduce((a, c) => a + (c.adsWeb || 0), 0), adsDirMtd: activeData.reduce((a, c) => a + (c.adsDir || 0), 0),
      mcaDis: disbursedFeb.reduce((a, c) => a + c.mcaAmount, 0), mcaDisCount: disbursedFeb.length, 
      mcaEli: activeData.reduce((a, c) => a + (c.mcaWlLimit > 0 && !c.mcaWlClass.includes('Not') ? c.mcaWlLimit : 0), 0),
      joiners: campaignStats.joiners, totalMex: activeData.length, activeMex: act, inactiveMex: inact, zeroTrxMex: zTrx, totalPoints: totPts, avgPtsPerJoiner: campaignStats.joiners > 0 ? Math.round(totPts / campaignStats.joiners) : 0
    };
  }, [activeData, campaignStats]);

  const chartsData = useMemo(() => {
    let g = 0, d = 0, s = 0; activeData.forEach(x => { if (x.rrBs > x.lmBs * 1.05) g++; else if (x.rrBs < x.lmBs * 0.95) d++; else s++; });
    const tot = Math.max(1, g + d + s);
    return { mtd: [...activeData].sort((a, b) => b.mtdBs - a.mtdBs).slice(0, 10), ads: [...activeData].sort((a, b) => b.adsLM - a.adsLM).slice(0, 10), health: [ { name: 'Growing', count: g, percentage: ((g/tot)*100).toFixed(0), color: '#00B14F' }, { name: 'Declining', count: d, percentage: ((d/tot)*100).toFixed(0), color: COLORS.decline }, { name: 'Stable', count: s, percentage: ((s/tot)*100).toFixed(0), color: COLORS.finance } ] };
  }, [activeData]);

  const filtered = useMemo(() => {
    let res = activeData.filter(d => (d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase())) && (selectedPriority === 'All' || d.mcaPriority === selectedPriority));
    if (sortConfig) {
      res.sort((a, b) => {
        let aV = a[sortConfig.key], bV = b[sortConfig.key];
        if (typeof aV === 'string') { aV = aV.toLowerCase(); bV = bV.toLowerCase(); }
        if (sortConfig.key === 'campaigns') { aV = a.campaigns && a.campaigns !== '-' && !a.campaigns.toLowerCase().includes('no') ? 1 : 0; bV = b.campaigns && b.campaigns !== '-' && !b.campaigns.toLowerCase().includes('no') ? 1 : 0; }
        if (aV < bV) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aV > bV) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return res;
  }, [activeData, searchTerm, selectedPriority, sortConfig]);

  const requestSort = (key) => setSortConfig({ key, direction: sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  const paginatedData = useMemo(() => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filtered, currentPage]);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); if (e.target.value && activeTab !== 'data' && !selectedMex) setActiveTab('data'); };
  const onChartClick = (state) => { if (state?.activePayload?.[0]?.payload?.id) { setSelectedMex(state.activePayload[0].payload); setActiveTab('overview'); } };

  const renderMerchantCampaigns = (campaignStr, hideEmpty = false) => {
    if (!campaignStr || campaignStr === '-' || campaignStr === '0' || campaignStr.toLowerCase().includes('no campaign')) { 
      if (hideEmpty) return null;
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

  if (isInitializing) return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4"><div className="animate-pulse flex flex-col items-center"><Activity className="w-12 h-12 text-[#00B14F] mb-4" /><h2 className="font-bold text-slate-500 uppercase tracking-widest">Memuat Dashboard...</h2></div></div>;
  if (data.length === 0 || isForceUpload) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-800">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[100%] bg-emerald-900/40 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[100%] bg-blue-900/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="text-center max-w-xl z-10 bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-[32px] shadow-2xl w-full mx-auto border border-white/20 animate-in fade-in zoom-in-95 relative">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00B14F] to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30"><Activity className="w-8 h-8 text-white" /></div>
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
             <button onClick={() => setIsForceUpload(false)} disabled={loading} className="w-full py-3 mt-2 bg-slate-100 text-slate-500 hover:text-slate-700 font-bold transition-all text-xs rounded-xl hover:bg-slate-200">Batal & Kembali</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark-theme' : ''} bg-[#f8fafc] text-slate-900 flex flex-col font-sans overflow-hidden relative transition-colors duration-300`}>
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center overflow-hidden">
         <div className="absolute inset-0 bg-grid-pattern"></div>
         <div className="absolute left-0 right-0 top-[-10%] md:top-[-20%] -z-10 m-auto h-[300px] w-[300px] md:h-[600px] md:w-[600px] rounded-full blur-[100px] glow-effect"></div>
         <div className="absolute inset-x-0 bottom-0 h-[40vh] fade-bottom"></div>
      </div>

      {/* --- ALL MODALS --- */}
      {showWaModal && selectedMex && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ease-out animate-in fade-in" onClick={() => setShowWaModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-300 ease-out overflow-hidden">
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
               <button onClick={() => handleSendWA('general')} className="w-full text-left p-4 bg-white border border-slate-200 hover:border-[#00B14F] hover:shadow-md rounded-2xl transition-all group">
                   <p className="font-bold text-sm text-slate-800 group-hover:text-[#00B14F] mb-1">Review Performa (General)</p>
                   <p className="text-xs text-slate-500 line-clamp-2">Ada 5 variasi pesan sapaan untuk diskusi performa secara umum dengan owner...</p>
               </button>
               <button onClick={() => handleSendWA('promo')} className="w-full text-left p-4 bg-white border border-slate-200 hover:border-[#00B14F] hover:shadow-md rounded-2xl transition-all group">
                   <p className="font-bold text-sm text-slate-800 group-hover:text-[#00B14F] mb-1 flex items-center gap-1.5"><Zap size={14} className="text-amber-500"/> Penawaran Promo</p>
                   <p className="text-xs text-slate-500 line-clamp-2">Ada 5 variasi pesan untuk mengajak merchant mengikuti program promo/campaign...</p>
               </button>
               {selectedMex.mcaWlLimit > 0 && !selectedMex.mcaWlClass.includes('Not') && (
                   <button onClick={() => handleSendWA('mca')} className="w-full text-left p-4 bg-blue-50 border border-blue-200 hover:border-blue-500 hover:shadow-md rounded-2xl transition-all group">
                       <p className="font-bold text-sm text-blue-800 group-hover:text-blue-600 mb-1 flex items-center gap-1.5"><Database size={14} className="text-blue-500"/> Info Limit MCA</p>
                       <p className="text-xs text-blue-600/80 line-clamp-2">Ada 5 variasi pesan untuk menginfokan fasilitas pinjaman senilai {formatCurrency(selectedMex.mcaWlLimit)}...</p>
                   </button>
               )}
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

      {/* MODAL DAFTAR MERCHANT PER SEGMEN CAMPAIGN */}
      {activeSegmentModal && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" onClick={() => setActiveSegmentModal(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300 ease-out overflow-hidden">
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
                    {filteredSegmentMerchants.map((mex, idx) => (
                       <div key={mex.id} style={{ animationDelay: `${idx * 30}ms` }} onClick={() => { setSelectedMex(mex); setActiveSegmentModal(null); setActiveTab('overview'); }} className="animate-fade-in-up flex justify-between items-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#00B14F] hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer transition-all duration-300 group">
                          <div className="min-w-0 pr-4">
                             <p className="font-bold text-sm md:text-base text-slate-800 group-hover:text-[#00B14F] truncate transition-colors">{mex.name}</p>
                             <div className="-mt-0.5">
                                {renderMerchantCampaigns(mex.campaigns)}
                             </div>
                          </div>
                          <div className="text-right shrink-0 flex flex-col items-end">
                             <p className="font-black text-sm md:text-base text-slate-800">{formatCurrency(mex.mtdBs)}</p>
                             <div className="flex items-center gap-1.5 mt-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">MTD Sales</p>
                                <span className={`flex items-center gap-0.5 px-1 py-0.5 rounded-md text-[8px] font-black border ${mex.campaignPoint > 0 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`} title="Campaign Points">
                                   <Award size={10} /> {mex.campaignPoint || 0}
                                </span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DAFTAR MERCHANT PENCAIRAN MCA */}
      {showMcaModal && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" onClick={() => setShowMcaModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300 ease-out overflow-hidden">
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-100 shrink-0 bg-white relative z-10">
               <div>
                  <h3 className="font-black text-lg md:text-xl text-slate-900 flex items-center gap-2">
                     <Database className="w-5 h-5 text-amber-500"/>
                     Merchant Pencairan MCA
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Daftar {disbursedMerchants.length} merchant yang telah mencairkan dana</p>
               </div>
               <button onClick={() => setShowMcaModal(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar bg-[#f8fafc]">
               {disbursedMerchants.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                    <Store className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-xs font-bold uppercase tracking-widest">Belum ada pencairan</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-3">
                    {disbursedMerchants.map((mex, idx) => {
                       const isPending = mex.mcaDisburseStatus && String(mex.mcaDisburseStatus).toLowerCase().includes('pending');
                       return (
                       <div key={mex.id} style={{ animationDelay: `${idx * 30}ms` }} onClick={() => { setSelectedMex(mex); setShowMcaModal(false); setActiveTab('overview'); }} className={`animate-fade-in-up flex justify-between items-center p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer transition-all duration-300 group ${isPending ? 'hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10' : 'hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10'}`}>
                          <div className="min-w-0 pr-4 flex-1">
                             <div className="flex items-center gap-2 min-w-0">
                                {mex.mcaPriority && mex.mcaPriority !== '-' && (
                                   <span className={`px-1.5 py-0.5 rounded text-[9px] font-black shrink-0 border ${getPriorityBadgeClass(mex.mcaPriority)}`}>
                                      {mex.mcaPriority}
                                   </span>
                                )}
                                <p className={`font-bold text-sm md:text-base text-slate-800 truncate transition-colors ${isPending ? 'group-hover:text-blue-600' : 'group-hover:text-amber-600'}`}>{mex.name}</p>
                             </div>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-black text-white bg-indigo-600/[0.65] border border-indigo-700/[0.65] px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1 shadow-sm backdrop-blur-sm"><Users size={10} className="text-indigo-100" /> {getShortAMName(mex.amName)}</span>
                                {mex.disbursedDate && String(mex.disbursedDate).trim() !== '-' && (
                                   <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest text-white shadow-sm backdrop-blur-sm ${isPending ? 'bg-blue-600/[0.65] border-blue-700/[0.65]' : 'bg-amber-600/[0.65] border-amber-700/[0.65]'}`}>{mex.disbursedDate}</span>
                                )}
                             </div>
                          </div>
                          <div className="text-right shrink-0 flex flex-col items-end">
                             <p className={`font-black text-sm md:text-base ${isPending ? 'text-blue-600' : 'text-amber-600'}`}>{formatCurrency(mex.mcaAmount)}</p>
                             <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${isPending ? 'text-blue-500' : 'text-slate-400'}`}>{isPending ? 'Pending' : 'Telah Cair'}</p>
                          </div>
                       </div>
                    )})}
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL MERCHANT INVESTMENT (MI) RATIO DETAIL */}
      {showMiModal && kpi && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" onClick={() => setShowMiModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-300 ease-out overflow-hidden">
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-100 shrink-0 bg-white relative z-10">
               <div>
                  <h3 className="font-black text-lg md:text-xl text-slate-900 flex items-center gap-2">
                     <Percent className="w-5 h-5 text-teal-500"/>
                     Investment Ratio (MI/BS)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Detail persentase beban promo terhadap omset merchant</p>
               </div>
               <button onClick={() => setShowMiModal(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X size={20}/></button>
            </div>
            <div className="p-4 md:p-6 bg-[#f8fafc] space-y-5 custom-scrollbar overflow-y-auto max-h-[75vh]">
               <div className="bg-white rounded-[28px] p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-6 animate-fade-in-up stagger-1">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full opacity-50 -mr-8 -mt-8 pointer-events-none"></div>
                   <div className="flex-1 w-full relative z-10 text-center md:text-left">
                       <p className="text-[11px] font-black text-teal-600 uppercase tracking-widest mb-2 flex items-center justify-center md:justify-start gap-1.5"><Activity size={14}/> Projected Ratio</p>
                       <div className="flex items-baseline justify-center md:justify-start gap-1 mb-2">
                           <span className="text-6xl font-black text-slate-800 tracking-tighter">
                               {kpi?.rr ? ((kpi.miRr / kpi.rr) * 100).toFixed(1) : 0}
                           </span>
                           <span className="text-3xl font-black text-slate-400">%</span>
                       </div>
                       <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
                           Diproyeksikan bahwa beban investasi (MI) akan memakan <strong className="text-slate-700">{kpi?.rr ? ((kpi.miRr / kpi.rr) * 100).toFixed(1) : 0}%</strong> dari total Omset bulan ini.
                       </p>
                   </div>
                   <div className="flex-1 w-full flex flex-col gap-4 relative z-10 border-t md:border-t-0 md:border-l border-slate-100 pt-5 md:pt-0 md:pl-6">
                       <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><TrendingUp size={12}/> Projected Sales (BS)</p>
                           <p className="text-xl md:text-2xl font-black text-slate-800">{formatCurrency(kpi.rr)}</p>
                       </div>
                       <div>
                           <p className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mb-1 flex items-center gap-1"><DollarSign size={12}/> Projected Invest (MI)</p>
                           <p className="text-xl md:text-2xl font-black text-teal-600">{formatCurrency(kpi.miRr)}</p>
                       </div>
                   </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in-up stagger-2">
                   <div className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-colors">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Last Month</p>
                       <div className="flex justify-between items-end mb-2">
                           <span className="text-4xl font-black text-slate-700 tracking-tight">{kpi?.lm ? ((kpi.miLm / kpi.lm) * 100).toFixed(1) : 0}%</span>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-2.5 mb-5 overflow-hidden">
                           <div className="bg-slate-400 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, kpi?.lm ? ((kpi.miLm / kpi.lm) * 100) : 0)}%` }}></div>
                       </div>
                       <div className="space-y-2.5 pt-4 border-t border-slate-50">
                           <div className="flex justify-between items-center text-xs">
                               <span className="text-slate-500 font-medium">Sales (BS)</span>
                               <span className="font-bold text-slate-800">{formatCurrency(kpi.lm)}</span>
                           </div>
                           <div className="flex justify-between items-center text-xs">
                               <span className="text-slate-500 font-medium">Invest (MI)</span>
                               <span className="font-bold text-slate-600">{formatCurrency(kpi.miLm)}</span>
                           </div>
                       </div>
                   </div>
                   <div className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-teal-300 transition-colors">
                       <div className="flex justify-between items-center mb-3">
                          <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12}/> MTD Actual</p>
                       </div>
                       <div className="flex justify-between items-end mb-2">
                           <span className="text-4xl font-black text-teal-600 tracking-tight">{kpi?.mtd ? ((kpi.miMtd / kpi.mtd) * 100).toFixed(1) : 0}%</span>
                       </div>
                       <div className="w-full bg-teal-50 rounded-full h-2.5 mb-5 overflow-hidden">
                           <div className="bg-teal-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, kpi?.mtd ? ((kpi.miMtd / kpi.mtd) * 100) : 0)}%` }}></div>
                       </div>
                       <div className="space-y-2.5 pt-4 border-t border-slate-50">
                           <div className="flex justify-between items-center text-xs">
                               <span className="text-slate-500 font-medium">Sales (BS)</span>
                               <span className="font-bold text-slate-800">{formatCurrency(kpi.mtd)}</span>
                           </div>
                           <div className="flex justify-between items-center text-xs">
                               <span className="text-slate-500 font-medium">Invest (MI)</span>
                               <span className="font-bold text-teal-600">{formatCurrency(kpi.miMtd)}</span>
                           </div>
                       </div>
                   </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADS SPEND BREAKDOWN */}
      {showAdsModal && (kpi || selectedMex) && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" onClick={() => setShowAdsModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-300 ease-out overflow-hidden">
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-100 shrink-0 bg-white relative z-10">
               <div>
                  <h3 className="font-black text-lg md:text-xl text-slate-900 flex items-center gap-2">
                     <Megaphone className="w-5 h-5 text-rose-500"/>
                     Ads Spend Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Rincian alokasi biaya iklan {selectedMex ? selectedMex.name : 'berdasarkan platform'}</p>
               </div>
               <button onClick={() => setShowAdsModal(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X size={20}/></button>
            </div>
            <div className="p-4 md:p-6 bg-[#f8fafc] space-y-5 custom-scrollbar overflow-y-auto max-h-[75vh]">
               <div className="bg-white rounded-[28px] p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col gap-6 animate-fade-in-up stagger-1">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full opacity-50 -mr-8 -mt-8 pointer-events-none"></div>
                   {(() => {
                       const adsData = selectedMex ? {
                           total: selectedMex.adsTotal || 0, rr: selectedMex.adsRR || 0, mob: selectedMex.adsMob || 0, web: selectedMex.adsWeb || 0, dir: selectedMex.adsDir || 0
                       } : {
                           total: kpi?.adsMtd || 0, rr: kpi?.adsRr || 0, mob: kpi?.adsMobMtd || 0, web: kpi?.adsWebMtd || 0, dir: kpi?.adsDirMtd || 0
                       };
                       const totalAds = adsData.total || 1; 
                       const mobPct = ((adsData.mob / totalAds) * 100).toFixed(1);
                       const webPct = ((adsData.web / totalAds) * 100).toFixed(1);
                       const dirPct = ((adsData.dir / totalAds) * 100).toFixed(1);

                       return (
                           <Fragment>
                               <div className="flex-1 w-full relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
                                   <div className="flex-1 text-center sm:text-left">
                                       <p className="text-[11px] font-black text-rose-600 uppercase tracking-widest mb-2 flex items-center justify-center sm:justify-start gap-1.5"><Activity size={14}/> Total Ads (MTD)</p>
                                       <p className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                                           {formatCurrency(adsData.total)}
                                       </p>
                                   </div>
                                   <div className="hidden sm:block w-px h-16 bg-slate-200"></div>
                                   <div className="flex-1 text-center sm:text-left">
                                       <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-center sm:justify-start gap-1.5"><TrendingUp size={14}/> Projected Runrate</p>
                                       <p className="text-4xl md:text-5xl font-black text-slate-400 tracking-tight">
                                           {formatCurrency(adsData.rr)}
                                       </p>
                                   </div>
                               </div>
                               <div className="space-y-4 relative z-10 w-full mt-2 border-t border-slate-100 pt-6">
                                   <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4 group hover:border-blue-300 transition-colors">
                                       <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:bg-blue-100 transition-colors"><Smartphone size={24} /></div>
                                       <div className="flex-1 w-full">
                                           <div className="flex justify-between items-end mb-1">
                                               <div><h4 className="font-black text-slate-800 text-sm md:text-base">Ads Mobile</h4><p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Marketing Self Serve</p></div>
                                               <div className="text-right"><p className="font-black text-blue-600 text-lg md:text-xl leading-none">{formatCurrency(adsData.mob)}</p><p className="text-xs font-bold text-slate-500 mt-1">{adsData.total > 0 ? mobPct : 0}% Porsi</p></div>
                                           </div>
                                           <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden"><div className="bg-blue-500 h-2 rounded-full transition-all duration-1000 delay-300" style={{ width: `${Math.min(100, adsData.total > 0 ? mobPct : 0)}%` }}></div></div>
                                       </div>
                                   </div>
                                   <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4 group hover:border-amber-300 transition-colors">
                                       <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:bg-amber-100 transition-colors"><ExternalLink size={24} /></div>
                                       <div className="flex-1 w-full">
                                           <div className="flex justify-between items-end mb-1">
                                               <div><h4 className="font-black text-slate-800 text-sm md:text-base">Ads Web</h4><p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Marketing Manager</p></div>
                                               <div className="text-right"><p className="font-black text-amber-600 text-lg md:text-xl leading-none">{formatCurrency(adsData.web)}</p><p className="text-xs font-bold text-slate-500 mt-1">{adsData.total > 0 ? webPct : 0}% Porsi</p></div>
                                           </div>
                                           <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden"><div className="bg-amber-500 h-2 rounded-full transition-all duration-1000 delay-500" style={{ width: `${Math.min(100, adsData.total > 0 ? webPct : 0)}%` }}></div></div>
                                       </div>
                                   </div>
                                   <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4 group hover:border-purple-300 transition-colors">
                                       <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:bg-purple-100 transition-colors"><Zap size={24} /></div>
                                       <div className="flex-1 w-full">
                                           <div className="flex justify-between items-end mb-1">
                                               <div><h4 className="font-black text-slate-800 text-sm md:text-base">Direct Ads</h4><p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Customize Ads</p></div>
                                               <div className="text-right"><p className="font-black text-purple-600 text-lg md:text-xl leading-none">{formatCurrency(adsData.dir)}</p><p className="text-xs font-bold text-slate-500 mt-1">{adsData.total > 0 ? dirPct : 0}% Porsi</p></div>
                                           </div>
                                           <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden"><div className="bg-purple-500 h-2 rounded-full transition-all duration-1000 delay-700" style={{ width: `${Math.min(100, adsData.total > 0 ? dirPct : 0)}%` }}></div></div>
                                       </div>
                                   </div>
                               </div>
                           </Fragment>
                       );
                   })()}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL OUTLETS ATTENTION (INACTIVE & 0-TRX) */}
      {showOutletsModal && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" onClick={() => setShowOutletsModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300 ease-out overflow-hidden">
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-100 shrink-0 bg-white relative z-10">
               <div>
                  <h3 className="font-black text-lg md:text-xl text-slate-900 flex items-center gap-2">
                     <Store className="w-5 h-5 text-blue-500"/>
                     Outlets Attention
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Daftar merchant yang perlu perhatian khusus</p>
               </div>
               <button onClick={() => setShowOutletsModal(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X size={20}/></button>
            </div>
            
            <div className="flex px-5 pt-4 gap-2 bg-[#f8fafc] border-b border-slate-100 shrink-0">
                <button onClick={() => setOutletModalTab('inactive')} className={`px-4 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-t-xl transition-all border-b-2 ${outletModalTab === 'inactive' ? 'border-slate-800 text-slate-800 bg-white shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Inactive ({kpi?.inactiveMex || 0})</button>
                <button onClick={() => setOutletModalTab('zerotrx')} className={`px-4 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-t-xl transition-all border-b-2 ${outletModalTab === 'zerotrx' ? 'border-rose-500 text-rose-600 bg-rose-50' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>0-Trx MTD ({kpi?.zeroTrxMex || 0})</button>
            </div>

            <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar bg-[#f8fafc]">
               {(() => {
                   const displayList = outletModalTab === 'inactive' ? inactiveMerchants : zeroTrxMerchants;
                   if (displayList.length === 0) {
                       return (
                           <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                               <CheckCircle className="w-10 h-10 mb-3 opacity-30 text-emerald-500" />
                               <p className="text-[11px] font-bold uppercase tracking-widest">Semua Aman!</p>
                           </div>
                       );
                   }
                   return (
                       <div className="grid grid-cols-1 gap-3">
                          {displayList.map((mex, idx) => (
                              <div key={mex.id} style={{ animationDelay: `${idx * 30}ms` }} onClick={() => { setSelectedMex(mex); setShowOutletsModal(false); setActiveTab('overview'); }} className={`animate-fade-in-up flex justify-between items-center p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer transition-all duration-300 group hover:shadow-lg ${outletModalTab === 'inactive' ? 'hover:border-slate-400 hover:shadow-slate-500/10' : 'hover:border-rose-400 hover:shadow-rose-500/10'}`}>
                                  <div className="min-w-0 pr-4 flex-1">
                                      <p className={`font-bold text-sm md:text-base text-slate-800 truncate transition-colors ${outletModalTab === 'inactive' ? 'group-hover:text-blue-600' : 'group-hover:text-rose-600'}`}>{mex.name}</p>
                                      <div className="flex flex-wrap items-center gap-2 mt-1">
                                          <span className="text-[9px] font-black text-white bg-indigo-600/[0.65] border border-indigo-700/[0.65] px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1 shadow-sm backdrop-blur-sm"><Users size={10} className="text-indigo-100" /> {getShortAMName(mex.amName)}</span>
                                          {outletModalTab === 'zerotrx' && (
                                              <span className="text-[9px] font-bold text-white bg-slate-600/[0.65] px-1.5 py-0.5 rounded border border-slate-700/[0.65] uppercase tracking-widest shadow-sm backdrop-blur-sm" title="Omset Bulan Lalu">LM: {formatCurrency(mex.lmBs)}</span>
                                          )}
                                      </div>
                                      {renderMerchantCampaigns(mex.campaigns, true)}
                                  </div>
                                  <div className="text-right shrink-0 flex flex-col items-end">
                                     <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm ${outletModalTab === 'inactive' ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                        {outletModalTab === 'inactive' ? 'Inactive' : '0-Trx'}
                                     </div>
                                  </div>
                              </div>
                          ))}
                       </div>
                   );
               })()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL COMPARE PERFORMANCE */}
      {showCompareModal && selectedMex && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" onClick={() => setShowCompareModal(false)} />
          <div className="relative w-full max-w-4xl bg-[#f8fafc] rounded-[32px] shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 ease-out overflow-hidden">
            <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-200 shrink-0 bg-white relative z-10 shadow-sm">
               <div>
                  <h3 className="font-black text-lg md:text-xl text-slate-900 flex items-center gap-2">
                     <BarChart2 className="w-5 h-5 text-indigo-500"/>
                     Performance Comparison
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{selectedMex.name}</p>
               </div>
               <button onClick={() => setShowCompareModal(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 custom-scrollbar flex flex-col">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 text-center md:hidden animate-pulse flex items-center justify-center gap-1.5"><ChevronLeft size={12}/> Geser kartu untuk membandingkan <ChevronRight size={12}/></p>
                <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-3 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 hide-scrollbar flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {[0, 1, 2].map((idx) => {
                        const selectedMonth = compareMonths[idx];
                        const hist = selectedMex.history.find(h => h.month === selectedMonth);
                        
                        const getGrowth = (current, previous) => {
                            if (!previous || previous === 0) return 0;
                            return ((current - previous) / previous) * 100;
                        };
                        
                        let prev = null;
                        if (hist) {
                            const currentIndex = selectedMex.history.findIndex(h => h.month === selectedMonth);
                            if (currentIndex > 0) prev = selectedMex.history[currentIndex - 1];
                        }

                        const renderGrowthBadge = (val, invert = false) => {
                            if (!val || val === 0) return null;
                            const isUp = val > 0;
                            const isGood = invert ? !isUp : isUp;
                            return (
                                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-black shadow-sm ${isGood ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                    {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {Math.abs(val).toFixed(1)}%
                                </span>
                            );
                        };

                        return (
                            <div key={idx} className="w-[200px] sm:w-[240px] md:w-auto md:flex-1 shrink-0 snap-center bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-3 md:p-5 shadow-sm flex flex-col relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="mb-3 md:mb-5 relative z-10">
                                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 md:mb-2">Bulan {idx + 1}</label>
                                    <select 
                                        value={selectedMonth}
                                        onChange={(e) => {
                                            const newMonths = [...compareMonths];
                                            newMonths[idx] = e.target.value;
                                            setCompareMonths(newMonths);
                                        }}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs md:text-sm font-bold rounded-lg md:rounded-xl px-2 py-1.5 md:px-3 md:py-2 focus:outline-none focus:border-indigo-400 transition-colors cursor-pointer"
                                    >
                                        <option value="">-- Pilih Bulan --</option>
                                        {[...selectedMex.history].reverse().map(h => (
                                            <option key={h.month} value={h.month}>{formatMonth(h.month)}</option>
                                        ))}
                                    </select>
                                </div>

                                {hist ? (
                                    <div className="relative z-10 flex flex-col mt-auto gap-2.5 md:gap-4">
                                        <div className="bg-emerald-600/70 border border-emerald-500/50 rounded-xl md:rounded-2xl p-2.5 md:p-4 flex flex-col items-center justify-center text-center shadow-inner backdrop-blur-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-bl-full opacity-50 -mr-2 -mt-2 pointer-events-none"></div>
                                            <p className="text-[9px] md:text-[10px] font-black text-emerald-50 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Activity size={12}/> Gross Sales</p>
                                            <p className="text-lg md:text-2xl font-black text-white tracking-tight mb-1.5 md:mb-2 truncate w-full px-1" title={formatCurrency(hist.basket_size)}>{formatCurrency(hist.basket_size)}</p>
                                            {renderGrowthBadge(getGrowth(hist.basket_size, prev?.basket_size))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                                            <div className="bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl p-2 md:p-3 flex flex-col items-center justify-center text-center shadow-sm min-w-0">
                                                <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1 truncate w-full justify-center"><ShoppingBag size={10} className="shrink-0"/> Orders</p>
                                                <p className="text-xs md:text-lg font-black text-slate-700 mb-1 truncate w-full" title={hist.completed_orders}>{hist.completed_orders}</p>
                                                {renderGrowthBadge(getGrowth(hist.completed_orders, prev?.completed_orders))}
                                            </div>
                                            <div className="bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl p-2 md:p-3 flex flex-col items-center justify-center text-center shadow-sm min-w-0">
                                                <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1 truncate w-full justify-center"><Target size={10} className="shrink-0"/> AOV</p>
                                                <p className="text-xs md:text-lg font-black text-slate-700 mb-1 truncate w-full" title={formatCurrency(hist.aov)}>{formatCurrency(hist.aov)}</p>
                                                {renderGrowthBadge(getGrowth(hist.aov, prev?.aov))}
                                            </div>
                                        </div>

                                        <div className="bg-rose-600/70 border border-rose-500/50 rounded-lg md:rounded-xl p-2.5 md:p-4 flex flex-col gap-2 md:gap-3 shadow-inner backdrop-blur-sm">
                                            <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-rose-400/40 gap-1">
                                                <div className="min-w-0">
                                                    <p className="text-[8px] md:text-[9px] font-bold text-rose-50 uppercase tracking-widest mb-0.5 flex items-center gap-1 truncate"><Zap size={10} className="shrink-0"/> Promo</p>
                                                    <p className="text-[11px] md:text-sm font-black text-white truncate" title={formatCurrency(hist.total_investment)}>{formatCurrency(hist.total_investment)}</p>
                                                </div>
                                                <div className="shrink-0">{renderGrowthBadge(getGrowth(hist.total_investment, prev?.total_investment), true)}</div>
                                            </div>
                                            <div className="flex justify-between items-center gap-1">
                                                <div className="min-w-0">
                                                    <p className="text-[8px] md:text-[9px] font-bold text-rose-50 uppercase tracking-widest mb-0.5 flex items-center gap-1 truncate"><Megaphone size={10} className="shrink-0"/> Ads</p>
                                                    <p className="text-[11px] md:text-sm font-black text-white truncate" title={formatCurrency(hist.ads_total_hist)}>{formatCurrency(hist.ads_total_hist)}</p>
                                                </div>
                                                <div className="shrink-0">{renderGrowthBadge(getGrowth(hist.ads_total_hist, prev?.ads_total_hist), true)}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 mt-6 md:mt-10">
                                        <BarChart2 className="w-10 h-10 md:w-12 md:h-12 mb-2 md:mb-3 opacity-20" />
                                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-center">Pilih bulan<br/>untuk melihat data</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL WIDTH ENTERPRISE SAAS HEADER */}
      <header className="flex-none relative z-50 w-full bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-8">
          
          <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
             <div className="flex items-center gap-2.5 cursor-pointer group shrink-0" onClick={() => { setSelectedMex(null); setActiveTab('overview'); setSearchTerm(''); }}>
               <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#00B14F] to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all">
                 <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
               </div>
               <div className="flex flex-col">
                 <h1 className="text-sm md:text-base lg:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-[#00B14F] transition-colors">
                   AM DASHBOARD <span className="text-[#00B14F] dark:text-emerald-400">PRO</span>
                 </h1>
               </div>
             </div>

             <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-700 shrink-0"></div>

             <div className="hidden md:flex items-center flex-1 min-w-0 relative">
                 {!selectedMex ? (
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
                        <button onClick={() => { setActiveTab('overview'); setSearchTerm(''); }} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-white dark:bg-slate-950 text-[#00B14F] dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-800/80' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}>
                            <LayoutDashboard className="w-4 h-4" /> Overview
                        </button>
                        <button onClick={() => setActiveTab('data')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'data' ? 'bg-white dark:bg-slate-950 text-[#00B14F] dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-800/80' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}>
                            <Table className="w-4 h-4" /> Directory
                        </button>
                    </div>
                 ) : (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 truncate animate-in slide-in-from-left-4 fade-in duration-300">
                        <button onClick={() => setSelectedMex(null)} className="hover:text-[#00B14F] transition-colors flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95">
                           <ArrowLeft className="w-3.5 h-3.5" /> Beranda
                        </button>
                        <span className="text-slate-300 dark:text-slate-600">/</span>
                        <span className="text-slate-800 dark:text-slate-200 truncate">{selectedMex.name}</span>
                    </div>
                 )}
             </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
             {!selectedMex && (
                 <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg lg:rounded-xl px-2.5 lg:px-3 h-9 sm:h-10 hover:border-[#00B14F] transition-colors">
                     <Filter className="w-3.5 h-3.5 text-emerald-500 mr-1.5 hidden sm:block" />
                     <select value={selectedAM} onChange={(e) => { setSelectedAM(e.target.value); setSelectedMex(null); setCurrentPage(1); }} className="bg-transparent text-slate-700 dark:text-slate-200 text-[10px] lg:text-xs font-bold focus:outline-none w-[70px] sm:w-[90px] lg:w-28 cursor-pointer appearance-none truncate">
                        {amOptions.map(am => <option key={am} value={am} className="text-slate-900">{am}</option>)}
                     </select>
                     <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                 </div>
             )}

             {selectedMex && (
                 <div className="hidden sm:flex items-center gap-1.5 lg:gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg lg:rounded-xl px-2.5 lg:px-3 py-1.5 lg:py-2 shadow-sm animate-in fade-in zoom-in-95 duration-300">
                    <Users className="w-3.5 h-3.5 text-[#00B14F]" />
                    <span className="text-slate-500 dark:text-slate-400 text-[9px] lg:text-[10px] font-bold tracking-widest uppercase">AM <span className="text-slate-800 dark:text-white ml-1 font-black">{selectedMex.amName}</span></span>
                 </div>
             )}

             <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-3 md:pl-4">
                 {globalLastUpdate && !selectedMex && (
                     <div className="flex flex-col justify-center px-2 lg:px-3 text-right hidden lg:flex">
                         <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Last Sync</span>
                         <span className="text-[10px] font-bold text-[#00B14F] dark:text-emerald-400 leading-none flex items-center gap-1 justify-end">
                             <Clock size={10} /> {globalLastUpdate}
                         </span>
                     </div>
                 )}
                 {!selectedMex && <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden lg:block"></div>}
                 
                 <button 
                     onClick={() => setIsForceUpload(true)} 
                     className="flex items-center justify-center text-slate-500 hover:text-[#00B14F] dark:text-slate-400 dark:hover:text-emerald-400 w-8 h-8 md:w-9 md:h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group shadow-sm border border-slate-200/50 dark:border-slate-700 active:scale-95"
                     title="Update Data"
                 >
                     <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                 </button>
                 
                 <button 
                     onClick={() => setIsDarkMode(!isDarkMode)} 
                     className="flex items-center justify-center text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 w-8 h-8 md:w-9 md:h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group shadow-sm border border-slate-200/50 dark:border-slate-700 active:scale-95"
                     title={isDarkMode ? "Beralih ke Light Mode" : "Beralih ke Dark Mode"}
                 >
                     {isDarkMode ? <Sun className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" /> : <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-500" />}
                 </button>
             </div>
          </div>
        </div>

        {/* MOBILE SUB-NAV */}
        {!selectedMex && (
            <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center justify-between px-4 py-2.5 gap-2">
                    <div className="flex w-full gap-2">
                        <button onClick={() => { setActiveTab('overview'); setSearchTerm(''); }} className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'overview' ? 'bg-white dark:bg-slate-800 text-[#00B14F] dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            <LayoutDashboard className="w-3.5 h-3.5" /> Overview
                        </button>
                        <button onClick={() => setActiveTab('data')} className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'data' ? 'bg-white dark:bg-slate-800 text-[#00B14F] dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            <Table className="w-3.5 h-3.5" /> Data
                        </button>
                    </div>
                </div>
            </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main onScroll={handleMainScroll} className={`flex-1 overflow-y-auto relative w-full hide-scrollbar z-10 px-4 md:px-6 lg:px-8 pt-4 md:pt-6 flex flex-col ${selectedMex ? 'pb-24' : 'pb-4'}`}>
        <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col pb-safe">

          {!selectedMex && (
            <div className="mb-4 md:mb-5 relative group z-20 animate-fade-in-up stagger-1">
               <div className="absolute inset-y-0 left-4 lg:left-5 flex items-center pointer-events-none">
                   <Search className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400 group-focus-within:text-[#00B14F] transition-colors duration-300" />
               </div>
               <input 
                   type="text" 
                   value={searchTerm} 
                   onChange={handleSearchChange} 
                   placeholder="Cari nama merchant atau ID..." 
                   className="w-full bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl pl-10 lg:pl-12 pr-10 lg:pr-12 py-3 lg:py-3.5 text-xs lg:text-sm text-slate-800 font-bold focus:outline-none focus:border-[#00B14F] focus:ring-4 focus:ring-[#00B14F]/10 transition-all duration-300 shadow-sm" 
               />
               {searchTerm && (
                   <button onClick={() => setSearchTerm('')} className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 p-1.5 lg:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                       <X className="w-4 h-4" />
                   </button>
               )}
            </div>
          )}

          {/* WRAPPER TRANISI TAB */}
          <div className="flex-1 flex flex-col relative w-full">
          {!selectedMex ? (
            <Fragment>
              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-5 md:space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out fill-mode-forwards absolute inset-0 w-full overflow-visible">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                      <div className="animate-fade-in-up stagger-1 bg-white rounded-[28px] border border-slate-200 p-5 lg:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 group h-full">
                         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                         <Activity className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                         <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-2 mb-5 pl-2 relative z-10">
                             <div className="flex items-center gap-2 lg:gap-3">
                                 <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Activity size={18} strokeWidth={2.5}/></div>
                                 <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest truncate">Basketsize</p>
                             </div>
                             {(() => {
                                 let trend = 0; 
                                 if (kpi?.lm > 0) trend = ((kpi.rr - kpi.lm) / kpi.lm) * 100; 
                                 else if (kpi?.rr > 0) trend = 100; 
                                 const isUp = trend >= 0;
                                 return (
                                     <div className={`self-start px-2 py-1 rounded-md text-[9px] lg:text-[10px] font-black flex items-center gap-1 whitespace-nowrap transition-colors ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                         {isUp ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {Math.abs(trend).toFixed(1)}%
                                     </div>
                                 );
                             })()}
                         </div>
                         <div className="pl-2 relative z-10 flex-1 flex flex-col justify-center">
                             <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">MTD Sales</p>
                             <p className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 lg:mb-4">{formatCurrency(kpi?.mtd || 0)}</p>
                             <div className="flex flex-wrap items-center gap-1.5 lg:gap-2 mb-1 lg:mb-2">
                                 <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Runrate:</span>
                                 <span className="text-xs lg:text-sm font-black text-slate-800">{formatCurrency(kpi?.rr || 0)}</span>
                             </div>
                         </div>
                         <div className="mt-auto pt-3 lg:pt-4 border-t border-slate-100 flex justify-between items-center pl-2 relative z-10">
                             <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase truncate pr-2">Last Month</span>
                             <span className="text-[10px] lg:text-xs font-black text-slate-700">{formatCurrency(kpi?.lm || 0)}</span>
                         </div>
                      </div>

                      <div onClick={() => setShowMiModal(true)} className="animate-fade-in-up stagger-2 cursor-pointer bg-white rounded-[28px] border border-slate-200 p-5 lg:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1 group h-full">
                         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500"></div>
                         <DollarSign className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                         <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-2 mb-5 pl-2 relative z-10">
                             <div className="flex items-center gap-2 lg:gap-3">
                                 <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0"><DollarSign size={18} strokeWidth={2.5}/></div>
                                 <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 truncate">Invest <MousePointer size={10} className="text-slate-300 group-hover:text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-0.5 shrink-0 hidden lg:block"/></p>
                             </div>
                             {(() => {
                                 let trend = 0; 
                                 if (kpi?.miLm > 0) trend = ((kpi.miRr - kpi.miLm) / kpi.miLm) * 100; 
                                 else if (kpi?.miRr > 0) trend = 100; 
                                 const isUp = trend > 0;
                                 return (
                                     <div className={`self-start px-2 py-1 rounded-md text-[9px] lg:text-[10px] font-black flex items-center gap-1 whitespace-nowrap transition-colors ${!isUp ? 'bg-teal-50 text-teal-600' : 'bg-rose-50 text-rose-600'}`}>
                                         {isUp ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {Math.abs(trend).toFixed(1)}%
                                     </div>
                                 );
                             })()}
                         </div>
                         <div className="pl-2 relative z-10 flex-1 flex flex-col justify-center">
                             <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                 <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">MTD Invest</p>
                                 <span className="text-[8px] lg:text-[9px] font-bold bg-slate-100 text-teal-600 px-1.5 py-0.5 rounded-md leading-none">{kpi?.mtd ? ((kpi.miMtd / kpi.mtd) * 100).toFixed(1) : 0}%</span>
                             </div>
                             <p className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 lg:mb-4">{formatCurrency(kpi?.miMtd || 0)}</p>
                             <div className="flex flex-wrap items-center gap-1.5 lg:gap-2 mb-1 lg:mb-2">
                                 <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Runrate:</span>
                                 <span className="text-xs lg:text-sm font-black text-slate-800">{formatCurrency(kpi?.miRr || 0)}</span>
                                 <span className="text-[8px] lg:text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md leading-none hidden lg:block">{kpi?.rr ? ((kpi.miRr / kpi.rr) * 100).toFixed(1) : 0}%</span>
                             </div>
                         </div>
                         <div className="mt-auto pt-3 lg:pt-4 border-t border-slate-100 flex justify-between items-center pl-2 relative z-10">
                             <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase truncate pr-2">Last Month</span>
                             <div className="flex items-center gap-1.5">
                                 <span className="text-[10px] lg:text-xs font-black text-slate-700">{formatCurrency(kpi?.miLm || 0)}</span>
                                 <span className="text-[8px] lg:text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md leading-none hidden sm:block">{kpi?.lm ? ((kpi.miLm / kpi.lm) * 100).toFixed(1) : 0}%</span>
                             </div>
                         </div>
                      </div>

                      <div onClick={() => setShowAdsModal(true)} className="animate-fade-in-up stagger-3 cursor-pointer bg-white rounded-[28px] border border-slate-200 p-5 lg:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1 group h-full">
                         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
                         <Megaphone className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                         <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-2 mb-5 pl-2 relative z-10">
                             <div className="flex items-center gap-2 lg:gap-3">
                                 <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><Megaphone size={18} strokeWidth={2.5}/></div>
                                 <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 truncate">Ads <MousePointer size={10} className="text-slate-300 group-hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-0.5 shrink-0 hidden lg:block"/></p>
                             </div>
                             {(() => {
                                 let trend = 0; 
                                 if (kpi?.adsLm > 0) trend = ((kpi.adsRr - kpi.adsLm) / kpi.adsLm) * 100; 
                                 else if (kpi?.adsRr > 0) trend = 100; 
                                 const isUp = trend > 0;
                                 return (
                                     <div className={`self-start px-2 py-1 rounded-md text-[9px] lg:text-[10px] font-black flex items-center gap-1 whitespace-nowrap transition-colors ${!isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                         {isUp ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {Math.abs(trend).toFixed(1)}%
                                     </div>
                                 );
                             })()}
                         </div>
                         <div className="pl-2 relative z-10 flex-1 flex flex-col justify-center">
                             <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">MTD Ads</p>
                             <p className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 lg:mb-4">{formatCurrency(kpi?.adsMtd || 0)}</p>
                             
                             <div className="flex flex-wrap items-center gap-1.5 lg:gap-2 mb-1 lg:mb-2">
                                 <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Runrate:</span>
                                 <span className="text-xs lg:text-sm font-black text-slate-800">{formatCurrency(kpi?.adsRr || 0)}</span>
                             </div>
                         </div>
                         <div className="mt-auto pt-3 lg:pt-4 border-t border-slate-100 flex justify-between items-center pl-2 relative z-10">
                             <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase truncate pr-2">Last Month</span>
                             <span className="text-[10px] lg:text-xs font-black text-slate-700">{formatCurrency(kpi?.adsLm || 0)}</span>
                         </div>
                      </div>

                      <div onClick={() => setShowMcaModal(true)} className="animate-fade-in-up stagger-4 cursor-pointer bg-white rounded-[28px] border border-slate-200 p-5 lg:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 group h-full">
                         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
                         <Database className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                         <div className="flex justify-between items-start mb-5 pl-2 relative z-10">
                             <div className="flex items-center gap-2 lg:gap-3">
                                 <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0"><Database size={18} strokeWidth={2.5}/></div>
                                 <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 truncate">MCA <MousePointer size={10} className="text-slate-300 group-hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-0.5 shrink-0 hidden lg:block"/></p>
                             </div>
                         </div>
                         <div className="pl-2 relative z-10 flex-1 flex flex-col justify-center">
                             <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Disbursed</p>
                             <p className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 lg:mb-4">{formatCurrency(kpi?.mcaDis || 0)}</p>
                             <div className="flex flex-wrap items-center gap-1.5 lg:gap-2 mb-1 lg:mb-2">
                                 <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Eligibility:</span>
                                 <span className="text-xs lg:text-sm font-black text-slate-800">{formatCurrency(kpi?.mcaEli || 0)}</span>
                             </div>
                         </div>
                         <div className="mt-auto pt-3 lg:pt-4 border-t border-slate-100 flex justify-between items-center pl-2 relative z-10">
                             <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase truncate pr-2">Total Toko</span>
                             <span className="px-2 py-1 rounded-md text-[9px] lg:text-[10px] font-black uppercase bg-slate-100 text-slate-600">{kpi?.mcaDisCount || 0} Toko</span>
                         </div>
                      </div>

                      <div className="animate-fade-in-up stagger-5 bg-white rounded-[28px] border border-slate-200 p-5 lg:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 group h-full">
                         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500"></div>
                         <Award className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                         <div className="flex justify-between items-start mb-5 pl-2 relative z-10">
                             <div className="flex items-center gap-2 lg:gap-3">
                                 <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0"><Award size={18} strokeWidth={2.5}/></div>
                                 <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest truncate">Campaigns</p>
                             </div>
                         </div>
                         <div className="pl-2 relative z-10 flex-1 flex flex-col justify-center">
                             <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Points</p>
                             <p className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 lg:mb-4">{(kpi?.totalPoints || 0).toLocaleString('id-ID')}</p>
                             <div className="flex flex-wrap items-center gap-1.5 lg:gap-2 mb-1 lg:mb-2">
                                 <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Joiners:</span>
                                 <span className="text-xs lg:text-sm font-black text-slate-800">{kpi?.joiners || 0} Toko</span>
                             </div>
                         </div>
                         <div className="mt-auto pt-3 lg:pt-4 border-t border-slate-100 flex justify-between items-center pl-2 relative z-10">
                             <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase truncate pr-2">Avg Points</span>
                             <span className="text-[10px] lg:text-xs font-black text-slate-700">{kpi?.avgPtsPerJoiner || 0} pts</span>
                         </div>
                      </div>
                      
                      <div onClick={() => setShowOutletsModal(true)} className="animate-fade-in-up stagger-6 cursor-pointer bg-white rounded-[28px] border border-slate-200 p-5 lg:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 group h-full">
                         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                         <Store className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                         <div className="flex justify-between items-start mb-5 pl-2 relative z-10">
                             <div className="flex items-center gap-2 lg:gap-3">
                                 <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><Store size={18} strokeWidth={2.5}/></div>
                                 <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 truncate">Outlets <MousePointer size={10} className="text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-0.5 shrink-0 hidden lg:block"/></p>
                             </div>
                         </div>
                         <div className="pl-2 relative z-10 flex-1 flex flex-col justify-center">
                             <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Managed</p>
                             <p className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 lg:mb-4">{kpi?.totalMex || 0}</p>
                             <div className="flex items-center gap-3 mb-1 lg:mb-2">
                                 <div className="flex items-center gap-1.5">
                                     <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                     <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active:</span>
                                     <span className="text-xs lg:text-sm font-black text-slate-800">{kpi?.activeMex || 0}</span>
                                 </div>
                             </div>
                         </div>
                         <div className="mt-auto pt-3 lg:pt-4 border-t border-slate-100 flex justify-between items-center pl-2 relative z-10 gap-2">
                             <div className="flex items-center gap-1 lg:gap-1.5 flex-1 min-w-0">
                                 <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-slate-400 shrink-0"></span>
                                 <span className="text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">Inactive</span>
                                 <span className="text-[9px] lg:text-xs font-black text-slate-700 ml-auto pl-1">{kpi?.inactiveMex || 0}</span>
                             </div>
                             <div className="w-px h-4 bg-slate-200 shrink-0"></div>
                             <div className="flex items-center gap-1 lg:gap-1.5 flex-1 min-w-0">
                                 <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-rose-500 shrink-0"></span>
                                 <span className="text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">0-Trx</span>
                                 <span className="text-[9px] lg:text-xs font-black text-rose-600 ml-auto pl-1">{kpi?.zeroTrxMex || 0}</span>
                             </div>
                         </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 mt-6">
                      <div className="animate-fade-in-up stagger-7 lg:col-span-2 bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 shrink-0 min-h-[44px]">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="text-[#00B14F] w-5 h-5"/> Top 10 Merchants <span className="text-slate-400 font-bold normal-case text-xs bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 hidden sm:inline-block">(MTD Sales)</span></h3>
                        </div>
                        <div className="h-[280px] md:h-[360px] w-full mt-auto">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartsData.mtd} onClick={onChartClick} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                              <XAxis dataKey="name" tick={{ fill: COLORS.slate500, fontSize: 9, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.substring(0, 6)+'.'} height={20} dy={5} />
                              <YAxis tick={{ fill: COLORS.slate400, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} width={65} />
                              <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v, name) => [formatCurrency(v), name]} />
                              <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '24px', paddingBottom: '0', fontSize: '11px', fontWeight: 'bold', width: '100%', left: 0, display: 'flex', justifyContent: 'center' }} iconType="circle"/>
                              <Bar dataKey="lmBs" name="LM Sales" fill={COLORS.slate500} radius={[6,6,0,0]} maxBarSize={28} cursor="pointer" />
                              <Bar dataKey="mtdBs" name="MTD Sales" fill={COLORS.primary} radius={[6,6,0,0]} maxBarSize={28} cursor="pointer" />
                              <Line type="monotone" dataKey="rrBs" name="Runrate" stroke={COLORS.growth} strokeWidth={4} dot={{r:4, fill: '#ffffff', strokeWidth: 3}} activeDot={{r: 6}} cursor="pointer">
                                  <LabelList 
                                      dataKey="rrVsLm" 
                                      position="top" 
                                      offset={12}
                                      content={(props) => {
                                          const { x, y, value } = props;
                                          if (value === undefined || value === null) return null;
                                          const numVal = parseFloat(value);
                                          const isPositive = numVal >= 0;
                                          const fill = isPositive ? '#10b981' : '#ef4444';
                                          const textStr = `${isPositive ? '+' : ''}${numVal.toFixed(0)}%`;
                                          return (
                                              <g>
                                                  <text x={x} y={y - 12} fill="none" stroke="#ffffff" strokeWidth={4} strokeLinejoin="round" fontSize={10} fontWeight="900" textAnchor="middle">{textStr}</text>
                                                  <text x={x} y={y - 12} fill={fill} fontSize={10} fontWeight="900" textAnchor="middle">{textStr}</text>
                                              </g>
                                          );
                                      }}
                                  />
                              </Line>
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="animate-fade-in-up stagger-8 bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                        <div className="flex justify-between items-center mb-8 shrink-0 min-h-[44px]">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Target className="text-indigo-500 w-5 h-5"/> Campaign Segment</h3>
                            <span className="bg-indigo-50 text-indigo-700 font-black text-[10px] md:text-xs px-2.5 py-1 rounded-lg border border-indigo-100 transition-transform hover:scale-105">
                                {(( (kpi?.joiners || 0) / Math.max(1, (kpi?.joiners || 0) + campaignStats.zeroInvest)) * 100).toFixed(0)}% Rate
                            </span>
                        </div>
                        <div className="h-[250px] md:h-[320px] w-full mt-auto overflow-hidden">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={campaignStats.classification} 
                                layout="vertical" 
                                margin={{ top: 10, right: 40, left: 0, bottom: 5 }}
                                onClick={(state) => {
                                  if (state && state.activePayload && state.activePayload.length > 0) {
                                    setActiveSegmentModal(state.activePayload[0].payload.name);
                                  }
                                }}
                            >
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: COLORS.slate500, fontSize: 11, fontWeight: 700 }} width={90} />
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
                                  <Cell key={`cell-${index}`} fill={entry.fill} className="transition-all duration-300 hover:opacity-80" />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 text-center mt-4 bg-slate-50 py-2 rounded-xl">*Klik bar grafik untuk detail</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 mt-6">
                      <div className="animate-fade-in-up stagger-9 lg:col-span-2 bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                        <div className="flex justify-between items-center mb-8 shrink-0 min-h-[44px]">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Megaphone className="text-rose-500 w-5 h-5"/> Top 10 Ads Spender <span className="text-slate-400 font-bold normal-case text-xs bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">(vs LM & RR)</span></h3>
                        </div>
                        <div className="h-[280px] md:h-[360px] w-full mt-auto">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartsData.ads} onClick={onChartClick} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                              <XAxis dataKey="name" tick={{ fill: COLORS.slate500, fontSize: 9, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.substring(0, 8)+'.'} height={20} dy={5} />
                              <YAxis tick={{ fill: COLORS.slate400, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} width={65} />
                              <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding:'12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v) => formatCurrency(v)} />
                              <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '24px', paddingBottom: '0', fontSize: '11px', fontWeight: 'bold', width: '100%', left: 0, display: 'flex', justifyContent: 'center' }} iconType="circle" />
                              <Bar dataKey="adsLM" name="Ads LM" fill={COLORS.slate500} radius={[6,6,0,0]} maxBarSize={32} cursor="pointer" />
                              <Bar dataKey="adsTotal" name="Ads MTD" fill="#fb923c" radius={[6,6,0,0]} maxBarSize={32} cursor="pointer" />
                              <Line type="monotone" dataKey="adsRR" name="Ads RR" stroke="#2dd4bf" strokeWidth={4} dot={{r:4, fill: '#ffffff', strokeWidth: 3}} activeDot={{r: 6}} cursor="pointer">
                                 <LabelList 
                                      dataKey="adsTotal" 
                                      position="top" 
                                      offset={12}
                                      content={(props) => {
                                          const { x, y, index } = props;
                                          const item = chartsData.ads[index];
                                          if (!item) return null;
                                          
                                          let adsTrend = 0;
                                          if (item.adsLM > 0) adsTrend = ((item.adsRR - item.adsLM) / item.adsLM) * 100;
                                          else if (item.adsRR > 0) adsTrend = 100;
                                          
                                          const isPositive = adsTrend >= 0;
                                          const fill = isPositive ? '#ef4444' : '#10b981'; 
                                          const textStr = `${isPositive ? '+' : ''}${adsTrend.toFixed(0)}%`;
                                          
                                          return (
                                              <g>
                                                  <text x={x} y={y - 12} fill="none" stroke="#ffffff" strokeWidth={4} strokeLinejoin="round" fontSize={10} fontWeight="900" textAnchor="middle">{textStr}</text>
                                                  <text x={x} y={y - 12} fill={fill} fontSize={10} fontWeight="900" textAnchor="middle">{textStr}</text>
                                              </g>
                                          );
                                      }}
                                  />
                              </Line>
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="animate-fade-in-up stagger-10 bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full opacity-50 -mr-8 -mt-8 pointer-events-none transition-transform duration-700 hover:scale-110"></div>
                        
                        <div className="flex justify-between items-end mb-4 relative z-10 shrink-0 min-h-[44px]">
                            <div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Activity className="text-blue-500 w-5 h-5"/> Portfolio Health</h3>
                                <p className="text-[11px] font-bold text-slate-500 mt-1">Trend vs Last Month</p>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative min-h-[180px] my-2">
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={chartsData.health}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius="65%"
                                  outerRadius="90%"
                                  paddingAngle={5}
                                  dataKey="count"
                                  stroke="none"
                                >
                                  {chartsData.health.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} cursor="pointer" className="hover:opacity-80 transition-all duration-300" />
                                  ))}
                                </Pie>
                                <RechartsTooltip 
                                    cursor={{fill: '#f8fafc'}} 
                                    contentStyle={{ borderRadius: '12px', border:'none', padding: '10px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value, name, props) => [`${value} Toko (${props.payload.percentage}%)`, name]}
                                />
                              </PieChart>
                           </ResponsiveContainer>
                           
                           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-in zoom-in-95 duration-700 delay-300">
                              <span className="text-3xl font-black text-[#00B14F] leading-none drop-shadow-sm">{chartsData.health[0].percentage}%</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Growing</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 relative z-10 mt-4 shrink-0">
                            {chartsData.health.map((h, i) => (
                                <div key={i} className="flex items-center justify-between text-sm bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3.5 h-3.5 rounded-md shadow-sm" style={{ backgroundColor: h.color }} />
                                        <span className="font-bold text-slate-700 text-xs">{h.name}</span>
                                    </div>
                                    <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100">{h.count} <span className="text-[10px] text-slate-400 font-bold ml-1.5">({h.percentage}%)</span></span>
                                </div>
                            ))}
                        </div>
                      </div>
                    </div>
                </div>
              )}

              {/* TAB 2: MASTER DATASET */}
              {activeTab === 'data' && (
                <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out fill-mode-forwards flex flex-col h-[80vh] absolute inset-0 w-full">
                  <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f8fafc] shrink-0">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Table className="w-5 h-5 text-indigo-500"/> Master Data Directory</h3>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm flex-1 sm:flex-none hover:border-indigo-400 transition-colors focus-within:ring-2 focus-within:ring-indigo-100">
                           <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
                           <select value={selectedPriority} onChange={(e) => { setSelectedPriority(e.target.value); setSelectedMex(null); setCurrentPage(1); }} className="bg-transparent text-slate-700 text-xs font-bold focus:outline-none w-full sm:w-32 cursor-pointer appearance-none transition-colors">
                              {priorityOptions.map(p => <option key={p} value={p}>{p === 'All' ? 'Semua Priority' : `Priority: ${p}`}</option>)}
                           </select>
                           <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 pointer-events-none" />
                        </div>
                        <div className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-xl text-xs font-black shadow-sm shrink-0 transition-transform hover:scale-105">
                          {filtered.length} Toko
                        </div>
                    </div>
                  </div>
                  
                  <div className="overflow-auto flex-1 custom-scrollbar">
                    {filtered.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-in fade-in zoom-in-95 duration-300">
                        <Search className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm font-bold uppercase tracking-widest">Data tidak ditemukan.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm relative">
                         <thead className="bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest border-b-2 border-slate-100 sticky top-0 z-10">
                           <tr>
                             <th className="px-4 py-4 text-center w-12">No.</th>
                             <th className="px-4 py-4 cursor-pointer hover:text-slate-700 transition-colors select-none group" onClick={() => requestSort('name')}>
                               <div className="flex items-center gap-1">Merchant {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#00B14F]" /> : <ArrowDown className="w-3 h-3 text-[#00B14F]" />)}</div>
                             </th>
                             <th className="px-4 py-4 text-center hidden md:table-cell cursor-pointer hover:text-slate-700 transition-colors select-none group" onClick={() => requestSort('campaigns')}>
                               <div className="flex items-center justify-center gap-1">Campaign {sortConfig.key === 'campaigns' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#00B14F]" /> : <ArrowDown className="w-3 h-3 text-[#00B14F]" />)}</div>
                             </th>
                             <th className="px-4 py-4 text-center cursor-pointer hover:text-slate-700 transition-colors select-none group" onClick={() => requestSort('rrVsLm')}>
                               <div className="flex items-center justify-center gap-1">Trend vs LM {sortConfig.key === 'rrVsLm' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#00B14F]" /> : <ArrowDown className="w-3 h-3 text-[#00B14F]" />)}</div>
                             </th>
                             <th className="px-4 py-4 text-center hidden lg:table-cell cursor-pointer hover:text-slate-700 transition-colors select-none group" onClick={() => requestSort('mcaPriority')}>
                               <div className="flex items-center justify-center gap-1">Priority {sortConfig.key === 'mcaPriority' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#00B14F]" /> : <ArrowDown className="w-3 h-3 text-[#00B14F]" />)}</div>
                             </th>
                             <th className="px-5 py-4 text-right cursor-pointer hover:text-slate-700 transition-colors select-none group" onClick={() => requestSort('mtdBs')}>
                               <div className="flex items-center justify-end gap-1">MTD Sales {sortConfig.key === 'mtdBs' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#00B14F]" /> : <ArrowDown className="w-3 h-3 text-[#00B14F]" />)}</div>
                             </th>
                             <th className="px-5 py-4 text-center cursor-pointer hover:text-slate-700 transition-colors select-none group" onClick={() => requestSort('zeusStatus')}>
                               <div className="flex items-center justify-center gap-1">Status {sortConfig.key === 'zeusStatus' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#00B14F]" /> : <ArrowDown className="w-3 h-3 text-[#00B14F]" />)}</div>
                             </th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                            {paginatedData.map((r, index) => (
                              <tr key={r.id} onClick={() => setSelectedMex(r)} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                <td className="px-4 py-3 text-center font-bold text-slate-400 text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="px-4 py-3 min-w-[200px]">
                                  <p className="font-bold text-slate-800 text-xs md:text-sm group-hover:text-[#00B14F] truncate transition-colors">{r.name}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <p className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded group-hover:bg-emerald-50 transition-colors">{r.id}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center hidden md:table-cell">
                                  {r.campaigns && r.campaigns !== '-' && !r.campaigns.toLowerCase().includes('no campaign') ? (
                                    <div className="inline-flex items-center justify-center bg-indigo-50 p-1 rounded-md border border-indigo-100 shadow-sm group-hover:scale-110 transition-transform" title="Active Campaign">
                                        <Check className="w-4 h-4 text-indigo-600" strokeWidth={3} />
                                    </div>
                                  ) : (
                                    <span className="text-slate-300 font-bold">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                   <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black shadow-sm transition-transform group-hover:scale-105 ${r.rrBs > r.lmBs ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                      {r.rrBs > r.lmBs ? <ArrowUpRight className="w-3.5 h-3.5"/> : <ArrowDownRight className="w-3.5 h-3.5"/>}
                                      {Math.abs(r.rrVsLm).toFixed(0)}%
                                   </span>
                                </td>
                                <td className="px-4 py-3 text-center hidden lg:table-cell">
                                   <span className={`text-[10px] font-black px-2 py-1 rounded-md border ${getPriorityBadgeClass(r.mcaPriority)}`}>
                                      {r.mcaPriority}
                                   </span>
                                </td>
                                <td className="px-5 py-3 font-mono text-slate-800 font-black text-right text-xs md:text-sm">{formatCurrency(r.mtdBs)}</td>
                                <td className="px-5 py-3 text-center">
                                   <div className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-colors ${r.zeusStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200' : 'bg-slate-100 text-slate-500'}`}>{r.zeusStatus}</div>
                                </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                    )}
                  </div>

                  {/* PAGINATION CONTROLS */}
                  {totalPages > 1 && (
                      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#f8fafc] shrink-0">
                          <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">
                              Menampilkan <span className="text-slate-800">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)}</span> dari {filtered.length} Toko
                          </span>
                          <div className="flex items-center gap-2">
                              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl bg-white border border-slate-200 hover:border-[#00B14F] hover:text-[#00B14F] disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                                  <ChevronLeft className="w-4 h-4" />
                              </button>
                              <span className="text-xs font-black text-slate-700 bg-white shadow-sm px-4 py-2 rounded-xl border border-slate-200">
                                  {currentPage} <span className="text-slate-400 font-bold mx-1">/</span> {totalPages}
                              </span>
                              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl bg-white border border-slate-200 hover:border-[#00B14F] hover:text-[#00B14F] disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                                  <ChevronRight className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  )}
                </div>
              )}
            </Fragment>
          ) : (
            // =========================================================
            // VIEW MERCHANT DETAIL
            // =========================================================
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 ease-out space-y-5 md:space-y-6 pb-12 w-full">

               <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 relative overflow-hidden animate-fade-in-up stagger-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full opacity-50 -mr-8 -mt-8 pointer-events-none transition-transform duration-700 hover:scale-110"></div>
                  <div className="relative z-10 w-full lg:w-auto">
                     <div className="flex items-center gap-3 md:gap-4 mb-2.5">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 text-[#00B14F] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-emerald-200 shadow-sm transition-transform hover:rotate-6">
                           <Store className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tight">{selectedMex.name}</h2>
                     </div>
                     <div className="flex items-center gap-3 text-sm text-slate-600 font-medium ml-1 md:ml-[64px]">
                        <div className="flex items-center gap-1.5 cursor-help bg-slate-50 border border-slate-100 pl-1.5 pr-2.5 py-1 rounded-lg transition-colors hover:border-slate-200 shadow-sm" title={selectedMex.zeusStatus === 'ACTIVE' ? 'Status: Aktif' : 'Status: Inactive'}>
                            {selectedMex.zeusStatus === 'ACTIVE' ? <CheckCircle className="w-4 h-4 text-[#00B14F]" /> : <AlertCircle className="w-4 h-4 text-slate-400" />}
                            <span className="font-mono text-slate-700 text-xs font-bold tracking-tight">{selectedMex.id}</span>
                        </div>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-700 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> Owner: <span className="text-slate-900">{selectedMex.ownerName !== '-' ? selectedMex.ownerName : 'Tidak Diketahui'}</span></span>
                     </div>
                  </div>
                  
                  <div className="relative z-10 shrink-0 w-full lg:w-auto flex flex-col sm:flex-row items-center justify-start lg:justify-end gap-3 mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-slate-100 lg:border-none">
                      <button onClick={() => { if (selectedMex.phone && selectedMex.phone !== '-') setShowWaModal(true); }} className={`hidden sm:flex w-full sm:w-auto px-4 py-2.5 rounded-xl text-[11px] md:text-xs font-black uppercase tracking-widest transition-all items-center justify-center gap-2 shadow-sm group active:scale-95 ${selectedMex.phone && selectedMex.phone !== '-' ? 'bg-[#00B14F] hover:bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`} title={selectedMex.phone && selectedMex.phone !== '-' ? 'Hubungi via WhatsApp' : 'Nomor tidak tersedia'}>
                         <MessageCircle size={16} className={selectedMex.phone && selectedMex.phone !== '-' ? "group-hover:scale-110 transition-transform" : ""} /> 
                         {selectedMex.phone && selectedMex.phone !== '-' ? 'Hubungi' : 'No. HP Kosong'}
                      </button>
                      {selectedMex.history && selectedMex.history.length > 0 && (
                          <button onClick={() => { const hist = selectedMex.history || []; const defaultMonths = [ hist.length > 2 ? hist[hist.length - 3].month : '', hist.length > 1 ? hist[hist.length - 2].month : '', hist.length > 0 ? hist[hist.length - 1].month : '' ]; setCompareMonths(defaultMonths); setShowCompareModal(true); }} className="w-full sm:w-auto bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-xl text-[11px] md:text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-indigo-200 shadow-sm group active:scale-95">
                             <BarChart2 size={16} className="group-hover:scale-110 transition-transform" /> Compare
                          </button>
                      )}
                  </div>
               </div>

               {/* REWORKED: 2 Columns on Mobile, 4 on Desktop */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  {/* CARD 1: SALES */}
                  <div className="bg-white rounded-[20px] md:rounded-[28px] border border-slate-200 p-4 md:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 group animate-fade-in-up stagger-2">
                     <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                     <Activity className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                     <div className="flex items-start mb-3 md:mb-5 pl-1.5 md:pl-2 relative z-10">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3">
                           <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors group-hover:bg-emerald-100"><Activity size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={2.5} /></div>
                           <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest truncate w-full">Sales</p>
                        </div>
                     </div>
                     <div className="pl-1.5 md:pl-2 relative z-10 flex-1 flex flex-col justify-center min-w-0">
                         <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2 mb-1">
                             <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">MTD Sales</p>
                             {(() => {
                                 let trend = 0; if (selectedMex.lmBs > 0) trend = ((selectedMex.rrBs - selectedMex.lmBs) / selectedMex.lmBs) * 100; else if (selectedMex.rrBs > 0) trend = 100; const isUp = trend >= 0;
                                 return (<div className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black flex items-center gap-0.5 w-fit transition-colors ${isUp ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 group-hover:bg-rose-100'}`}>{isUp ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>} {Math.abs(trend).toFixed(1)}%</div>);
                             })()}
                         </div>
                         <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2 md:mb-4 truncate" title={formatCurrency(selectedMex.mtdBs)}>{formatCurrency(selectedMex.mtdBs)}</p>
                         <div className="flex flex-col lg:flex-row lg:items-center gap-0.5 lg:gap-2 mb-1 md:mb-2">
                             <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Projected:</span>
                             <span className="text-[11px] sm:text-xs md:text-sm font-black text-slate-800 truncate">{formatCurrency(selectedMex.rrBs)}</span>
                         </div>
                     </div>
                     <div className="mt-auto pt-2 md:pt-4 border-t border-slate-100 flex flex-col lg:flex-row lg:justify-between lg:items-center pl-1.5 md:pl-2 relative z-10 gap-0.5">
                         <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Last Month</span>
                         <span className="text-[11px] sm:text-xs font-black text-slate-700 truncate">{formatCurrency(selectedMex.lmBs)}</span>
                     </div>
                  </div>

                  {/* CARD 2: CAMPAIGNS */}
                  <div className="bg-white rounded-[20px] md:rounded-[28px] border border-slate-200 p-4 md:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 group animate-fade-in-up stagger-3">
                     <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
                     <Award className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                     <div className="flex items-start mb-3 md:mb-5 pl-1.5 md:pl-2 relative z-10">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3">
                           <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center transition-colors group-hover:bg-amber-100"><Zap size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={2.5} /></div>
                           <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest truncate w-full">Campaigns</p>
                        </div>
                     </div>
                     <div className="pl-1.5 md:pl-2 relative z-10 flex-1 flex flex-col justify-center min-w-0">
                         <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Total Points</p>
                         <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2 md:mb-4">{selectedMex.campaignPoint || 0}</p>
                         <div className="min-w-0 w-full">
                             <div className="flex items-center gap-1.5 mb-1 md:mb-2">
                                 <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active List:</p>
                                 {(() => {
                                     const count = (!selectedMex.campaigns || selectedMex.campaigns === '-' || selectedMex.campaigns === '0' || selectedMex.campaigns.toLowerCase().includes('no campaign')) ? 0 : selectedMex.campaigns.split(/[|,]/).map(c => c.trim()).filter(Boolean).length;
                                     return count > 0 ? <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-xs sm:text-sm font-black leading-none shadow-sm">{count}</span> : null;
                                 })()}
                             </div>
                             <div className="flex overflow-x-auto hide-scrollbar gap-1 md:gap-1.5 pb-1 w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
                                {(!selectedMex.campaigns || selectedMex.campaigns === '-' || selectedMex.campaigns === '0' || selectedMex.campaigns.toLowerCase().includes('no campaign')) ? (
                                    <span className="text-slate-400 text-[10px] md:text-[11px] font-semibold italic shrink-0">Tidak ada</span>
                                ) : (
                                    selectedMex.campaigns.split(/[|,]/).map(c => c.trim()).filter(Boolean).map((camp, idx) => (
                                        <span key={idx} className="shrink-0 bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-colors hover:bg-slate-200" title={camp}>
                                            {camp}
                                        </span>
                                    ))
                                )}
                             </div>
                         </div>
                     </div>
                  </div>

                  {/* CARD 3: MARKETING */}
                  <div className="bg-white rounded-[20px] md:rounded-[28px] border border-slate-200 p-4 md:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1 group animate-fade-in-up stagger-4 cursor-pointer" onClick={() => setShowAdsModal(true)}>
                     <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
                     <Megaphone className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                     <div className="flex items-start mb-3 md:mb-5 pl-1.5 md:pl-2 relative z-10">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3">
                           <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center transition-colors group-hover:bg-rose-100"><Megaphone size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={2.5} /></div>
                           <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest truncate w-full flex items-center gap-1">Ads <MousePointer size={10} className="text-slate-300 group-hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-0.5 shrink-0 hidden lg:block"/></p>
                        </div>
                     </div>
                     <div className="pl-1.5 md:pl-2 relative z-10 flex-1 flex flex-col justify-center min-w-0">
                         <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2 mb-1">
                             <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ads Spend</p>
                             {(() => {
                                 let adsTrend = 0; if (selectedMex.adsLM > 0) adsTrend = ((selectedMex.adsRR - selectedMex.adsLM) / selectedMex.adsLM) * 100; else if (selectedMex.adsRR > 0) adsTrend = 100; const isAdsUp = adsTrend > 0;
                                 return (<div className={`px-1.5 py-0.5 rounded-md text-[8px] md:text-[9px] font-black flex items-center gap-0.5 w-fit transition-colors ${!isAdsUp ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 group-hover:bg-rose-100'}`}>{isAdsUp ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>} {Math.abs(adsTrend).toFixed(1)}%</div>);
                             })()}
                         </div>
                         <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2 md:mb-4 truncate" title={formatCurrency(selectedMex.adsTotal)}>{formatCurrency(selectedMex.adsTotal)}</p>
                         
                         <div className="flex flex-col lg:flex-row lg:items-center gap-0.5 lg:gap-2 mb-1 md:mb-2">
                             <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Projected:</span>
                             <span className="text-[10px] md:text-sm font-black text-slate-800 truncate">{formatCurrency(selectedMex.adsRR)}</span>
                         </div>
                     </div>
                     <div className="mt-auto pt-2 md:pt-4 border-t border-slate-100 flex flex-col lg:flex-row lg:justify-between lg:items-center pl-1.5 md:pl-2 relative z-10 gap-0.5">
                         <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Last Month</span>
                         <span className="text-[11px] sm:text-xs font-black text-slate-700 truncate">{formatCurrency(selectedMex.adsLM)}</span>
                     </div>
                  </div>

                  {/* CARD 4: MCA LIMIT */}
                  <div className="bg-white rounded-[20px] md:rounded-[28px] border border-slate-200 p-4 md:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 group animate-fade-in-up stagger-5">
                     <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                     <Database className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                     <div className="flex items-start mb-3 md:mb-5 pl-1.5 md:pl-2 relative z-10">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3">
                           <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center transition-colors group-hover:bg-blue-100"><Database size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={2.5} /></div>
                           <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest truncate w-full">MCA Config</p>
                        </div>
                     </div>
                     <div className="pl-1.5 md:pl-2 relative z-10 flex-1 flex flex-col justify-center min-w-0">
                         {(() => {
                             const isPending = selectedMex.mcaDisburseStatus && String(selectedMex.mcaDisburseStatus).toLowerCase().includes('pending');
                             const textColor = isPending ? 'text-amber-500' : 'text-blue-500';
                             const labelText = isPending ? 'Pending Disburse' : 'Disbursed';
                             return (
                                 <div className="mb-2 md:mb-4">
                                     <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">{labelText}</p>
                                     <p className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black ${textColor} tracking-tight leading-none truncate`} title={formatCurrency(selectedMex.mcaAmount)}>{formatCurrency(selectedMex.mcaAmount)}</p>
                                 </div>
                             );
                         })()}
                         <div className="flex flex-col lg:flex-row lg:items-center gap-0.5 lg:gap-2 mb-1 md:mb-2">
                             <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tersedia:</span>
                             <span className="text-[11px] sm:text-xs md:text-sm font-black text-slate-800 truncate">{selectedMex.mcaWlLimit > 0 ? formatCurrency(selectedMex.mcaWlLimit) : 'Rp 0'}</span>
                         </div>
                     </div>
                     <div className="mt-auto pt-2 md:pt-4 border-t border-slate-100 flex flex-col lg:flex-row lg:justify-between lg:items-center pl-1.5 md:pl-2 relative z-10 gap-1.5">
                         <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Eligibility</span>
                         <div className="flex flex-wrap items-center gap-1">
                             {selectedMex.mcaPriority && selectedMex.mcaPriority !== '-' && (
                                 <span className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${getPriorityBadgeClass(selectedMex.mcaPriority)}`}>{selectedMex.mcaPriority}</span>
                             )}
                             <span className={`px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-colors ${selectedMex.mcaWlLimit > 0 && !selectedMex.mcaWlClass.includes('Not') ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                                 {selectedMex.mcaWlLimit > 0 && !selectedMex.mcaWlClass.includes('Not') ? 'Eligible' : 'Not Eligible'}
                             </span>
                         </div>
                     </div>
                  </div>
               </div>

               {selectedMex.history && selectedMex.history.length > 0 && (
                   <div className="space-y-5 md:space-y-6">
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mt-2">
                           <div className="animate-fade-in-up stagger-6 bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                                <div className="flex justify-between items-start md:items-center mb-8 gap-2 shrink-0 min-h-[44px]">
                                   <div><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="text-blue-500 w-5 h-5"/> 12-Month Review</h3></div>
                                   {selectedMex.lastUpdate && (
                                       <div className="flex flex-col text-right justify-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm shrink-0">
                                           <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Last Update</span>
                                           <span className="text-[10px] md:text-xs font-black text-slate-700 leading-none">{selectedMex.lastUpdate}</span>
                                       </div>
                                   )}
                                </div>
                                <div className="h-[280px] md:h-[360px] w-full mt-auto">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <ComposedChart data={selectedMex.history.slice(-12)} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="month" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={formatMonth} height={20} dy={5} />
                                        <YAxis yAxisId="left" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} width={60} />
                                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: '#f97316', fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={40} />
                                        <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v, n) => [n.includes('%') ? `${v}%` : formatCurrency(v), n]} labelFormatter={formatMonth}/>
                                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '24px', paddingBottom: '0', fontSize: '11px', fontWeight: 'bold', width: '100%', left: 0, display: 'flex', justifyContent: 'center' }} />
                                        
                                        <Bar yAxisId="left" dataKey="net_sales" stackId="a" name="Net Sales" fill={COLORS.netSales} maxBarSize={28} radius={[4,4,0,0]} />
                                        <Bar yAxisId="left" dataKey="total_investment" stackId="a" name="MI (Rp)" fill="#f43f5e" radius={[4,4,0,0]} maxBarSize={28} />
                                        <Line yAxisId="right" type="monotone" dataKey="mi_percentage" name="MI %" stroke="#f97316" strokeWidth={2} strokeDasharray="4 4" dot={{r:3, fill: '#ffffff', strokeWidth: 2}} activeDot={{r: 5}} />
                                        <Line yAxisId="left" type="monotone" dataKey="basket_size" name="Total Basket Size" stroke={COLORS.basketSize} strokeWidth={2} strokeDasharray="4 4" dot={{r:3, fill: '#ffffff', strokeWidth: 2}} activeDot={{r: 5}} />
                                      </ComposedChart>
                                    </ResponsiveContainer>
                                 </div>
                           </div>

                           <div className="animate-fade-in-up stagger-7 bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                                <div className="flex justify-between items-start mb-8 shrink-0 min-h-[44px]">
                                   <div className="flex items-center gap-2">
                                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><DollarSign className="text-rose-500 w-5 h-5"/> Investment (MI)</h3>
                                   </div>
                                   <div className="bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105">
                                      <Percent className="w-3.5 h-3.5 text-rose-500"/>
                                      <span className="text-[11px] font-black text-rose-700" title="MI % dari Basket Size Bulan Terakhir">
                                          {selectedMex.history[selectedMex.history.length-1].mi_percentage}%
                                      </span>
                                   </div>
                                </div>
                                <div className="h-[280px] md:h-[360px] w-full mt-auto">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={selectedMex.history.slice(-12)} margin={{ top: 20, right: 45, left: -5, bottom: 5 }}>
                                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                          <XAxis dataKey="month" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={formatMonth} height={20} dy={5} />
                                          <YAxis tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} width={60} />
                                          <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v) => formatCurrency(v)} labelFormatter={formatMonth}/>
                                          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '24px', paddingBottom: '0', fontSize: '11px', fontWeight: 'bold', width: '100%', left: 0, display: 'flex', justifyContent: 'center' }} iconType="circle" />
                                          
                                          <Bar dataKey="mfp" stackId="a" name="Local Promo" fill="#3b82f6" maxBarSize={32} />
                                          <Bar dataKey="mfc" stackId="a" name="Harga Coret" fill="#22c55e" maxBarSize={32} />
                                          <Bar dataKey="cpo" stackId="a" name="GMS" fill="#f97316" maxBarSize={32} />
                                          <Bar dataKey="ads_total_hist" stackId="a" name="Iklan" fill="#ef4444" radius={[6,6,0,0]} maxBarSize={32} />
                                      </BarChart>
                                  </ResponsiveContainer>
                                </div>
                           </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-2">
                            <div className="animate-fade-in-up stagger-8 bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                                <div className="flex items-start gap-2 mb-8 shrink-0 min-h-[44px]">
                                   <ShoppingBag className="w-5 h-5 text-indigo-500 shrink-0"/>
                                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-tight">Completed Orders</h3>
                                </div>
                                <div className="h-[280px] md:h-[360px] w-full mt-auto">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={selectedMex.history.slice(-12)} margin={{ top: 30, right: 45, left: -5, bottom: 5 }}>
                                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                          <XAxis dataKey="month" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={formatMonth} height={20} dy={5} />
                                          <YAxis tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} width={45} />
                                          <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} labelFormatter={formatMonth}/>
                                          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '24px', paddingBottom: '0', fontSize: '11px', fontWeight: 'bold', width: '100%', left: 0, display: 'flex', justifyContent: 'center' }} iconType="circle" />
                                          <Bar dataKey="completed_orders" name="Completed Orders" fill="#10b981" radius={[4,4,0,0]} maxBarSize={32}>
                                              <LabelList dataKey="completed_orders" position="top" offset={10} fontSize={10} fontWeight={800} fill="#10b981" />
                                          </Bar>
                                      </BarChart>
                                  </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="animate-fade-in-up stagger-9 bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                                <div className="flex items-start gap-2 mb-8 shrink-0 min-h-[44px]">
                                   <Target className="w-5 h-5 text-teal-500 shrink-0"/>
                                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-tight">
                                       AOV & Promo Usage <span className="text-[10px] text-slate-400 font-bold normal-case tracking-normal block mt-0.5">(Gms & Cofund Only)</span>
                                   </h3>
                                </div>
                                <div className="h-[280px] md:h-[360px] w-full mt-auto">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <ComposedChart data={selectedMex.history.slice(-12)} margin={{ top: 30, right: 10, left: -5, bottom: 5 }}>
                                          <defs>
                                              <linearGradient id="colorAov" x1="0" y1="0" x2="0" y2="1">
                                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                              </linearGradient>
                                          </defs>
                                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                          <XAxis dataKey="month" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={formatMonth} height={20} dy={5} />
                                          <YAxis yAxisId="left" domain={['auto', 'auto']} tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} width={45} />
                                          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={40} />
                                          <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v, n) => [n.includes('%') ? `${v}%` : formatCurrency(v), n]} labelFormatter={formatMonth}/>
                                          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '24px', paddingBottom: '0', fontSize: '11px', fontWeight: 'bold', width: '100%', left: 0, display: 'flex', justifyContent: 'center' }} iconType="circle" />
                                          <Area yAxisId="left" type="monotone" dataKey="aov" name="AOV" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAov)">
                                              <LabelList dataKey="aov" position="top" offset={10} fontSize={9} fontWeight={800} fill="#6366f1" formatter={(v) => `${(v/1000).toFixed(0)}K`} />
                                          </Area>
                                          <Line yAxisId="right" type="monotone" dataKey="promo_order_pct" name="% Promo Usage" stroke="#14b8a6" strokeWidth={4} dot={{r:4, fill: '#ffffff', strokeWidth: 3}} activeDot={{r:6}} />
                                      </ComposedChart>
                                  </ResponsiveContainer>
                                </div>
                            </div>
                       </div>
                   </div>
               )}

               <div className="animate-fade-in-up stagger-10 bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-5 md:p-8 mt-6 hover:shadow-2xl transition-shadow duration-500">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                     <Info className="w-5 h-5 text-indigo-500"/>
                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Informasi Kontak & Lokasi</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                      <div className="bg-slate-50 p-4 md:p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center gap-4 transition-colors hover:bg-slate-100/50">
                         <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-slate-400 shrink-0 mt-0.5"/>
                            <div className="flex flex-col">
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone Number</span>
                               {selectedMex.phone && selectedMex.phone !== '-' ? (
                                  <button onClick={() => setShowWaModal(true)} className="text-sm md:text-base font-black text-slate-800 hover:text-[#00B14F] transition-colors flex items-center gap-1.5 group cursor-pointer text-left" title="Pilih Template Pesan WhatsApp">
                                     {selectedMex.phone}
                                     <MessageCircle className="w-3.5 h-3.5 text-[#00B14F] opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </button>
                               ) : (<span className="text-sm md:text-base font-black text-slate-800">-</span>)}
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

                      <div className="bg-slate-50 p-4 md:p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center gap-4 lg:col-span-2 transition-colors hover:bg-slate-100/50">
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

               {/* UNIVERSAL FLOATING ACTION BAR */}
               <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[55] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${showFloatingBar ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-90 pointer-events-none'}`}>
                   <div className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-xl p-1.5 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-slate-700/50 flex items-center justify-center gap-1.5">
                       <button onClick={() => setSelectedMex(null)} className="w-12 h-12 flex items-center justify-center text-white hover:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-all duration-300 active:scale-90" title="Kembali ke Dashboard">
                           <ArrowLeft className="w-5 h-5" />
                       </button>
                       <div className="w-px h-6 bg-slate-700/80 shrink-0"></div>
                       <button onClick={() => { if (selectedMex.phone && selectedMex.phone !== '-') setShowWaModal(true); }} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 active:scale-90 ${selectedMex.phone && selectedMex.phone !== '-' ? 'bg-[#00B14F] text-white hover:bg-emerald-600 shadow-[0_0_20px_-5px_rgba(0,177,79,0.5)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`} title="Hubungi via WhatsApp">
                           <MessageCircle className="w-5 h-5" />
                       </button>
                   </div>
               </div>

            </div>
          )}
          </div>
          
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
        
        @keyframes fadeInUpCustom {
            from { opacity: 0; transform: translate3d(0, 20px, 0); }
            to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        
        .animate-fade-in-up {
            opacity: 0;
            animation: fadeInUpCustom 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            will-change: opacity, transform;
        }
        
        .stagger-1 { animation-delay: 50ms; }
        .stagger-2 { animation-delay: 100ms; }
        .stagger-3 { animation-delay: 150ms; }
        .stagger-4 { animation-delay: 200ms; }
        .stagger-5 { animation-delay: 250ms; }
        .stagger-6 { animation-delay: 300ms; }
        .stagger-7 { animation-delay: 350ms; }
        .stagger-8 { animation-delay: 400ms; }
        .stagger-9 { animation-delay: 450ms; }
        .stagger-10 { animation-delay: 500ms; }

        @keyframes float-down { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(2.5px); } }
        .animate-float-down { animation: float-down 1.5s ease-in-out infinite; }
        
        @keyframes float-up { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
        .animate-float-up { animation: float-up 1.5s ease-in-out infinite; }

        .bg-grid-pattern { background-image: linear-gradient(to right, rgba(148, 163, 184, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.15) 1px, transparent 1px); background-size: 24px 24px; }
        .dark-theme .bg-grid-pattern { background-image: linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px); }
        .glow-effect { background-color: #00B14F; opacity: 0.12; }
        .dark-theme .glow-effect { opacity: 0.05; }
        .fade-bottom { background-image: linear-gradient(to top, #f8fafc 10%, transparent); }
        .dark-theme .fade-bottom { background-image: linear-gradient(to top, #020617 10%, transparent); }

        .dark-theme { background-color: #020617 !important; color: #f8fafc !important; }
        .dark-theme .bg-white { background-color: #0f172a !important; border-color: #1e293b !important; }
        .dark-theme .bg-\\[\\#f8fafc\\] { background-color: #020617 !important; }
        .dark-theme .text-slate-900, .dark-theme .text-slate-800 { color: #f8fafc !important; }
        .dark-theme .text-slate-700 { color: #e2e8f0 !important; }
        .dark-theme .text-slate-600 { color: #cbd5e1 !important; }
        .dark-theme .text-slate-500 { color: #94a3b8 !important; }
        .dark-theme .text-slate-400 { color: #64748b !important; }
        .dark-theme .border-slate-100, .dark-theme .border-slate-200 { border-color: #1e293b !important; }
        .dark-theme .border-slate-50 { border-color: #0f172a !important; }
        .dark-theme .bg-slate-50 { background-color: #1e293b !important; border-color: #334155 !important; color: #cbd5e1 !important; }
        .dark-theme .bg-slate-100 { background-color: #1e293b !important; border-color: #334155 !important; color: #cbd5e1 !important; }
        .dark-theme .bg-slate-50\\/50 { background-color: rgba(30, 41, 59, 0.5) !important; border-color: #334155 !important; }
        .dark-theme .divide-slate-50 > :not([hidden]) ~ :not([hidden]) { border-color: #1e293b !important; }
        .dark-theme .shadow-xl, .dark-theme .shadow-2xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.8) !important; }
        .dark-theme input, .dark-theme select { background-color: #0f172a !important; color: #f8fafc !important; border-color: #334155 !important; }
        
        .dark-theme .bg-emerald-50\\/60, .dark-theme .bg-emerald-50 { background-color: rgba(6, 78, 59, 0.3) !important; border-color: rgba(6, 78, 59, 0.5) !important; }
        .dark-theme .bg-teal-50\\/60, .dark-theme .bg-teal-50 { background-color: rgba(19, 78, 74, 0.3) !important; border-color: rgba(19, 78, 74, 0.5) !important; }
        .dark-theme .bg-rose-50\\/60, .dark-theme .bg-rose-50, .dark-theme .bg-rose-50\\/50 { background-color: rgba(136, 19, 55, 0.3) !important; border-color: rgba(136, 19, 55, 0.5) !important; }
        .dark-theme .bg-blue-50\\/60, .dark-theme .bg-blue-50, .dark-theme .bg-blue-50\\/50 { background-color: rgba(30, 58, 138, 0.3) !important; border-color: rgba(30, 58, 138, 0.5) !important; }
        .dark-theme .bg-amber-50\\/60, .dark-theme .bg-amber-50 { background-color: rgba(120, 53, 15, 0.3) !important; border-color: rgba(120, 53, 15, 0.5) !important; }
        .dark-theme .bg-indigo-50\\/60, .dark-theme .bg-indigo-50 { background-color: rgba(49, 46, 129, 0.3) !important; border-color: rgba(49, 46, 129, 0.5) !important; }
        .dark-theme .bg-purple-50 { background-color: rgba(88, 28, 135, 0.3) !important; border-color: rgba(88, 28, 135, 0.5) !important; }

        .dark-theme .text-emerald-900, .dark-theme .text-emerald-800, .dark-theme .text-emerald-700, .dark-theme .text-emerald-600, .dark-theme .text-emerald-500 { color: #34d399 !important; }
        .dark-theme .text-teal-900, .dark-theme .text-teal-800, .dark-theme .text-teal-700, .dark-theme .text-teal-600, .dark-theme .text-teal-500 { color: #2dd4bf !important; }
        .dark-theme .text-rose-900, .dark-theme .text-rose-800, .dark-theme .text-rose-700, .dark-theme .text-rose-600, .dark-theme .text-rose-500 { color: #fb7185 !important; }
        .dark-theme .text-blue-900, .dark-theme .text-blue-800, .dark-theme .text-blue-700, .dark-theme .text-blue-600, .dark-theme .text-blue-500 { color: #60a5fa !important; }
        .dark-theme .text-amber-900, .dark-theme .text-amber-800, .dark-theme .text-amber-700, .dark-theme .text-amber-600, .dark-theme .text-amber-500 { color: #fbbf24 !important; }
        .dark-theme .text-indigo-900, .dark-theme .text-indigo-800, .dark-theme .text-indigo-700, .dark-theme .text-indigo-600, .dark-theme .text-indigo-500 { color: #818cf8 !important; }
        
        .dark-theme .recharts-cartesian-grid-horizontal line, .dark-theme .recharts-cartesian-grid-vertical line { stroke: #1e293b !important; }
        .dark-theme .recharts-text { fill: #94a3b8 !important; }
        .dark-theme .recharts-default-tooltip { background-color: #0f172a !important; border-color: #1e293b !important; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.8) !important; }
        .dark-theme .recharts-tooltip-item { color: #f8fafc !important; }
        .dark-theme .recharts-tooltip-cursor { fill: #1e293b !important; }
        
        .dark-theme .hover\\:bg-slate-50:hover { background-color: #1e293b !important; }
        .dark-theme .hover\\:bg-slate-50\\/80:hover { background-color: #1e293b !important; }
        .dark-theme .hover\\:border-slate-300:hover { border-color: #475569 !important; }
        .dark-theme .hover\\:border-slate-400:hover { border-color: #64748b !important; }
      `}} />
    </div>
  );
}
