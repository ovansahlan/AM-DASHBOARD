import React, { useState, useEffect, useMemo, Fragment, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  ComposedChart, Line, Cell, AreaChart, Area, LabelList, PieChart, Pie
} from 'recharts';
import { 
  UploadCloud, TrendingUp, Database, Filter, Megaphone,
  Search, CheckCircle, AlertCircle, DollarSign, Activity, X,
  Store, ArrowUpRight, ArrowDownRight, Users, Info, ArrowLeft, Zap, MapPin, Phone, Smartphone, Mail, Award, LayoutDashboard, Table, ShoppingBag, Target, Percent, ExternalLink, Calculator,
  Check, ChevronDown, MousePointer, RefreshCw, BarChart2, FileText, MessageCircle, Clock, ArrowUp, ArrowDown, Moon, Sun, ChevronLeft, ChevronRight, MonitorPlay, ThumbsUp, Trash2, Calendar, Camera, Loader2, Plus, StickyNote, UserPlus, UserMinus, Package, XCircle
} from 'lucide-react';

// ============================================================================
// GLOBAL STYLES (DARK MODE CSS)
// ============================================================================
const ThemeStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

    html, body, .font-sans, p, h1, h2, h3, h4, h5, h6, span, div, button, input, select, textarea {
        font-family: 'Plus Jakarta Sans', sans-serif !important;
    }
    .font-mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
    }

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
    .dark-theme .fade-bottom { background-image: linear-gradient(to top, #000000 10%, transparent); }

    .dark-theme { background-color: #000000 !important; color: #ffffff !important; }
    .dark-theme .bg-white { background-color: #121212 !important; border-color: #262626 !important; }
    .dark-theme .bg-white\\/80 { background-color: #121212 !important; border-color: #262626 !important; }
    .dark-theme .bg-white\\/95 { background-color: #121212 !important; border-color: #262626 !important; }
    .dark-theme .from-emerald-50\\/80 { --tw-gradient-from: #064e3b !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
    .dark-theme .from-slate-100\\/50 { --tw-gradient-from: #1e1e1e !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
    .dark-theme .to-white { --tw-gradient-to: #121212 !important; }
    .dark-theme .bg-\\[\\#f8fafc\\] { background-color: #000000 !important; }
    
    .dark-theme .text-slate-900, .dark-theme .text-slate-800 { color: #ffffff !important; }
    .dark-theme .text-slate-700 { color: #e5e5e5 !important; }
    .dark-theme .text-slate-600 { color: #d4d4d4 !important; }
    .dark-theme .text-slate-500 { color: #a3a3a3 !important; }
    .dark-theme .text-slate-400 { color: #737373 !important; }
    .dark-theme .border-slate-100, .dark-theme .border-slate-200 { border-color: #2d2d2d !important; }
    .dark-theme .border-slate-50 { border-color: #1e1e1e !important; }
    .dark-theme .bg-slate-50 { background-color: #1e1e1e !important; border-color: #2d2d2d !important; color: #f8fafc !important; }
    .dark-theme .bg-slate-100 { background-color: #262626 !important; border-color: #333333 !important; color: #f8fafc !important; }
    .dark-theme .bg-slate-50\\/50 { background-color: #1a1a1a !important; border-color: #2d2d2d !important; }
    .dark-theme .divide-slate-50 > :not([hidden]) ~ :not([hidden]) { border-color: #1e1e1e !important; }
    .dark-theme .shadow-xl, .dark-theme .shadow-2xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.9) !important; }
    .dark-theme input, .dark-theme select, .dark-theme textarea { background-color: #121212 !important; color: #ffffff !important; border-color: #2d2d2d !important; }

    /* TEXT ADJUSTMENTS FOR READABILITY (GLOBAL) */
    .dark-theme .text-emerald-900, .dark-theme .text-emerald-800, .dark-theme .text-emerald-700, .dark-theme .text-emerald-600, .dark-theme .text-emerald-500 { color: #34d399 !important; }
    .dark-theme .text-teal-900, .dark-theme .text-teal-800, .dark-theme .text-teal-700, .dark-theme .text-teal-600, .dark-theme .text-teal-500 { color: #2dd4bf !important; }
    .dark-theme .text-rose-900, .dark-theme .text-rose-800, .dark-theme .text-rose-700, .dark-theme .text-rose-600, .dark-theme .text-rose-500 { color: #fb7185 !important; }
    .dark-theme .text-blue-900, .dark-theme .text-blue-800, .dark-theme .text-blue-700, .dark-theme .text-blue-600, .dark-theme .text-blue-500 { color: #60a5fa !important; }
    .dark-theme .text-amber-900, .dark-theme .text-amber-800, .dark-theme .text-amber-700, .dark-theme .text-amber-600, .dark-theme .text-amber-500 { color: #fbbf24 !important; }
    .dark-theme .text-indigo-900, .dark-theme .text-indigo-800, .dark-theme .text-indigo-700, .dark-theme .text-indigo-600, .dark-theme .text-indigo-500 { color: #818cf8 !important; }
    .dark-theme .text-orange-900, .dark-theme .text-orange-800, .dark-theme .text-orange-700, .dark-theme .text-orange-600, .dark-theme .text-orange-500 { color: #fdba74 !important; }
    .dark-theme .text-cyan-900, .dark-theme .text-cyan-800, .dark-theme .text-cyan-700, .dark-theme .text-cyan-600, .dark-theme .text-cyan-500 { color: #22d3ee !important; }
    .dark-theme .text-purple-900, .dark-theme .text-purple-800, .dark-theme .text-purple-700, .dark-theme .text-purple-600, .dark-theme .text-purple-500 { color: #c084fc !important; }
    
    /* * SOLID COLORS FOR ALL BADGES & TAGS 
     * (We force text inside these badges to be WHITE so it doesn't blend/saru)
     */
    
    /* Emerald */
    .dark-theme .bg-emerald-50, .dark-theme .bg-emerald-50\\/80, .dark-theme .bg-emerald-100 { background-color: #10b981 !important; border-color: #059669 !important; color: #ffffff !important; }
    .dark-theme .bg-emerald-50 [class*="text-emerald-"], .dark-theme .bg-emerald-50\\/80 [class*="text-emerald-"], .dark-theme .bg-emerald-100 [class*="text-emerald-"] { color: #ffffff !important; }
    
    /* Teal */
    .dark-theme .bg-teal-50, .dark-theme .bg-teal-50\\/80, .dark-theme .bg-teal-50 { background-color: #14b8a6 !important; border-color: #0d9488 !important; color: #ffffff !important; }
    .dark-theme .bg-teal-50 [class*="text-teal-"], .dark-theme .bg-teal-50\\/80 [class*="text-teal-"], .dark-theme .bg-teal-50 [class*="text-teal-"] { color: #ffffff !important; }
    
    /* Rose */
    .dark-theme .bg-rose-50, .dark-theme .bg-rose-50\\/50, .dark-theme .bg-rose-100 { background-color: #f43f5e !important; border-color: #e11d48 !important; color: #ffffff !important; }
    .dark-theme .bg-rose-50 [class*="text-rose-"], .dark-theme .bg-rose-50\\/80 [class*="text-rose-"], .dark-theme .bg-rose-100 [class*="text-rose-"] { color: #ffffff !important; }
    
    /* Blue */
    .dark-theme .bg-blue-50, .dark-theme .bg-blue-50\\/80, .dark-theme .bg-blue-100 { background-color: #3b82f6 !important; border-color: #2563eb !important; color: #ffffff !important; }
    .dark-theme .bg-blue-50 [class*="text-blue-"], .dark-theme .bg-blue-50\\/80 [class*="text-blue-"], .dark-theme .bg-blue-100 [class*="text-blue-"] { color: #ffffff !important; }
    
    /* Amber */
    .dark-theme .bg-amber-50, .dark-theme .bg-amber-50\\/80, .dark-theme .bg-amber-100 { background-color: #f59e0b !important; border-color: #d97706 !important; color: #ffffff !important; }
    .dark-theme .bg-amber-50 [class*="text-amber-"], .dark-theme .bg-amber-50\\/80 [class*="text-amber-"], .dark-theme .bg-amber-100 [class*="text-amber-"] { color: #ffffff !important; }
    
    /* Indigo */
    .dark-theme .bg-indigo-50, .dark-theme .bg-indigo-50\\/80, .dark-theme .bg-indigo-100 { background-color: #6366f1 !important; border-color: #4f46e5 !important; color: #ffffff !important; }
    .dark-theme .bg-indigo-50 [class*="text-indigo-"], .dark-theme .bg-indigo-50\\/80 [class*="text-indigo-"], .dark-theme .bg-indigo-100 [class*="text-indigo-"] { color: #ffffff !important; }
    
    /* Purple */
    .dark-theme .bg-purple-50, .dark-theme .bg-purple-50\\/80, .dark-theme .bg-purple-100 { background-color: #a855f7 !important; border-color: #9333ea !important; color: #ffffff !important; }
    .dark-theme .bg-purple-50 [class*="text-purple-"], .dark-theme .bg-purple-50\\/80 [class*="text-purple-"], .dark-theme .bg-purple-100 [class*="text-purple-"] { color: #ffffff !important; }
    
    /* Cyan */
    .dark-theme .bg-cyan-50, .dark-theme .bg-cyan-50\\/80, .dark-theme .bg-cyan-100 { background-color: #06b6d4 !important; border-color: #0891b2 !important; color: #ffffff !important; }
    .dark-theme .bg-cyan-50 [class*="text-cyan-"], .dark-theme .bg-cyan-50\\/80 [class*="text-cyan-"], .dark-theme .bg-cyan-100 [class*="text-cyan-"] { color: #ffffff !important; }
    
    /* Orange */
    .dark-theme .bg-orange-50, .dark-theme .bg-orange-50\\/80, .dark-theme .bg-orange-100 { background-color: #f97316 !important; border-color: #ea580c !important; color: #ffffff !important; }
    .dark-theme .bg-orange-50 [class*="text-orange-"], .dark-theme .bg-orange-50\\/80 [class*="text-orange-"], .dark-theme .bg-orange-100 [class*="text-orange-"] { color: #ffffff !important; }

    /* SOLID COLORS FOR PRIORITY BADGES */
    .dark-theme .bg-slate-500\\/\\[0\\.65\\] { background-color: #475569 !important; border-color: #334155 !important; color: #ffffff !important; }
    .dark-theme .bg-rose-600\\/\\[0\\.65\\] { background-color: #e11d48 !important; border-color: #be123c !important; color: #ffffff !important; }
    .dark-theme .bg-amber-600\\/\\[0\\.65\\] { background-color: #d97706 !important; border-color: #b45309 !important; color: #ffffff !important; }
    .dark-theme .bg-blue-600\\/\\[0\\.65\\] { background-color: #2563eb !important; border-color: #1d4ed8 !important; color: #ffffff !important; }
    .dark-theme .bg-emerald-600\\/\\[0\\.65\\] { background-color: #059669 !important; border-color: #047857 !important; color: #ffffff !important; }
    .dark-theme .bg-indigo-600\\/\\[0\\.65\\] { background-color: #4f46e5 !important; border-color: #4338ca !important; color: #ffffff !important; }

    /* RECHARTS & OTHERS */
    .dark-theme .recharts-cartesian-grid-horizontal line, .dark-theme .recharts-cartesian-grid-vertical line { stroke: #1e1e1e !important; }
    .dark-theme .recharts-text { fill: #a3a3a3 !important; }
    .dark-theme .recharts-default-tooltip { background-color: #121212 !important; border-color: #2d2d2d !important; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.9) !important; }
    .dark-theme .recharts-tooltip-item { color: #ffffff !important; }
    .dark-theme .recharts-tooltip-cursor { fill: #1e1e1e !important; }
    
    .dark-theme .hover\\:bg-slate-50:hover { background-color: #1e1e1e !important; }
    .dark-theme .hover\\:bg-slate-50\\/80:hover { background-color: #1e1e1e !important; }
    .dark-theme .hover\\:border-slate-300:hover { border-color: #404040 !important; }
    .dark-theme .hover\\:border-slate-400:hover { border-color: #737373 !important; }

    /* --- EXPLICIT HEADER DARK MODE RULES --- */
    .dark-theme .header-main { background-color: #0a0a0a !important; border-color: #2d2d2d !important; }
    .dark-theme .header-title { color: #ffffff !important; }
    .dark-theme .header-pro-text { color: #34d399 !important; }
    .dark-theme .header-lastsync-label { color: #737373 !important; }
    .dark-theme .header-divider { background-color: #2d2d2d !important; }
    .dark-theme .header-divider-left { border-color: #2d2d2d !important; }
    
    .dark-theme .header-nav-bg { background-color: #1e1e1e !important; border-color: #2d2d2d !important; }
    .dark-theme .header-nav-active { background-color: #000000 !important; color: #34d399 !important; border-color: #2d2d2d !important; }
    .dark-theme .header-nav-inactive { color: #a3a3a3 !important; }
    .dark-theme .header-nav-inactive:hover { color: #e5e5e5 !important; background-color: rgba(30, 30, 30, 0.5) !important; }
    
    .dark-theme .header-breadcrumb-sep { color: #404040 !important; }
    .dark-theme .header-breadcrumb-text { color: #e5e5e5 !important; }
    .dark-theme .header-nav-btn { color: #a3a3a3 !important; }
    .dark-theme .header-nav-btn:hover { color: #34d399 !important; }

    .dark-theme .header-filter { background-color: #1e1e1e !important; border-color: #2d2d2d !important; }
    .dark-theme .header-select { color: #ffffff !important; }
    .dark-theme .header-select option { background-color: #121212 !important; color: #ffffff !important; }
    .dark-theme .header-select-icon { color: #737373 !important; }
    
    .dark-theme .header-am-badge { background-color: #1e1e1e !important; border-color: #2d2d2d !important; }
    .dark-theme .header-am-label { color: #a3a3a3 !important; }
    .dark-theme .header-am-val { color: #ffffff !important; }

    .dark-theme .header-icon-btn { color: #a3a3a3 !important; border-color: #2d2d2d !important; }
    .dark-theme .header-icon-btn:hover { background-color: #1e1e1e !important; }
    .dark-theme .header-icon-btn:hover svg.text-amber-500 { color: #fbbf24 !important; }

    .dark-theme .header-mobile-sub { background-color: #0a0a0a !important; border-color: #1e1e1e !important; }

    /* Panel Info Merchant Specific Dark Mode */
    .dark-theme .panel-info-backdrop { background-color: #121212 !important; border-color: #262626 !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.7) !important; }
    .dark-theme .panel-info-blob { display: none !important; }
    .dark-theme .panel-profile-card { background-image: none !important; background-color: #1a1a1a !important; border-color: #2d2d2d !important; }
    .dark-theme .panel-profile-blob { display: none !important; }
    .dark-theme .panel-text-muted { color: #a3a3a3 !important; }
    .dark-theme .panel-icon-primary { color: #34d399 !important; }
    .dark-theme .panel-divider { background-color: #404040 !important; }
    
    /* SOLID MERCHANT BADGES */
    .dark-theme .panel-badge { background-color: #262626 !important; border-color: #404040 !important; box-shadow: 0 2px 5px rgba(0,0,0,0.5) !important; }
    .dark-theme .panel-badge-text { color: #f8fafc !important; font-weight: 800 !important; }
    
    .dark-theme .panel-notes-card { background-color: #1a1a1a !important; border-color: #2d2d2d !important; }
    .dark-theme .panel-notes-title { color: #ffffff !important; }
    .dark-theme .panel-notes-btn { background-color: #451a03 !important; border-color: #78350f !important; color: #fbbf24 !important; }
    .dark-theme .panel-notes-btn:hover { background-color: #78350f !important; }
    
    .dark-theme .panel-notes-empty { background-color: #121212 !important; border-color: #333333 !important; color: #a3a3a3 !important; }
    .dark-theme .panel-note-item { background-color: #262626 !important; border-color: #333333 !important; }
    .dark-theme .panel-note-icon { background-color: #451a03 !important; border-color: #78350f !important; }
    .dark-theme .panel-note-icon svg { color: #fbbf24 !important; }
    .dark-theme .panel-note-date { color: #a3a3a3 !important; }
    .dark-theme .panel-note-text { color: #f8fafc !important; }
    .dark-theme .panel-note-more { color: #a3a3a3 !important; }
    .dark-theme .panel-note-more:hover { color: #fbbf24 !important; }

    /* FLOATING NAV DARK MODE */
    .dark-theme .panel-floating-nav { background-color: rgba(10, 10, 10, 0.95) !important; border-color: #262626 !important; }
    .dark-theme .panel-floating-nav-divider { background-color: #333333 !important; }
    .dark-theme .panel-floating-btn:hover { background-color: #1a1a1a !important; }
    .dark-theme .panel-floating-btn-disabled { background-color: #1a1a1a !important; color: #555555 !important; }

    /* LIST CARDS DARK Mode */
    .dark-theme .card-campaign-seg, .dark-theme .card-quick-search, .dark-theme .card-gms-tracker { background-color: #121212 !important; border-color: #1e1e1e !important; }
    .dark-theme .card-section-title { color: #ffffff !important; }
    .dark-theme .card-search-input { background-color: #000000 !important; border-color: #1e1e1e !important; color: #ffffff !important; }
    .dark-theme .card-search-item, .dark-theme .card-list-item { background-color: #1e1e1e !important; border-color: #2d2d2d !important; }
    .dark-theme .card-item-name { color: #ffffff !important; }
    .dark-theme .badge-date, .dark-theme .badge-package { border: none !important; }
    .dark-theme .dashboard-card { background-color: #121212 !important; border-color: #1e1e1e !important; }
    .dark-theme .card-main-value { color: #ffffff !important; }
    .dark-theme .card-sub-value { color: #d4d4d4 !important; }
  `}} />
);

// ============================================================================
// GOOGLE SHEETS API CONFIGURATION
// ============================================================================
const GOOGLE_SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbyiPgQX12g9f2csxcxNF7NTN3vtEFKOlnBjceBz3dzHh8DfoSLI8K8ccx3KKXdPvawR/exec'; 

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

const parseSafeDate = (dateStr) => {
    if (!dateStr) return new Date().toISOString();
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString();
    
    try {
        const str = String(dateStr).trim();
        const parts = str.split(/[\s,]+/);
        if (parts.length > 0 && parts[0].includes('/')) {
            const [day, month, year] = parts[0].split('/');
            let timeStr = '00:00:00';
            if (parts.length > 1) {
                let t = parts[1].replace(/\./g, ':');
                if (t.split(':').length === 2) t += ':00';
                timeStr = t;
            }
            const iso = `${year.length === 2 ? '20'+year : year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}T${timeStr}`;
            const test = new Date(iso);
            if (!isNaN(test.getTime())) return test.toISOString();
        }
    } catch(e) {}
    return new Date().toISOString();
};

// ============================================================================
// INDEXEDDB BROWSER STORAGE
// ============================================================================
const DB_NAME = 'AmDashboardDB_v3';
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

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================
const Modal = ({ isOpen, onClose, title, subtitle, icon: Icon, iconColor, maxWidth = "max-w-2xl", children, zIndex = 6000 }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex }}>
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" onClick={onClose} />
            <div className={`relative w-full ${maxWidth} bg-white rounded-[32px] shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 ease-out overflow-hidden`}>
                <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-100 shrink-0 bg-white relative z-10 shadow-sm">
                    <div>
                        <h3 className="font-black text-lg md:text-xl text-slate-900 flex items-center gap-2">
                            {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
                            {title}
                        </h3>
                        {subtitle && <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><X size={20}/></button>
                </div>
                {children}
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, icon: Icon, colorClass, gradientClass, subText, subValue }) => (
  <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative overflow-hidden">
      <div className={`absolute top-0 w-full h-1 bg-gradient-to-r ${gradientClass}`}></div>
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 ${colorClass}`}><Icon size={20} strokeWidth={2.5}/></div>
      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-lg sm:text-xl xl:text-2xl font-black text-slate-900 px-1 break-words leading-tight">{value}</p>
      {subText && <p className="text-[8px] md:text-[9px] text-slate-500 font-medium mt-2">{subText} {subValue && <strong className="text-slate-700">{subValue}</strong>}</p>}
  </div>
);

const DashboardCard = ({ title, value, subLabel, subValue, midLabel, midValue, icon: Icon, color, onClick, trend, borderClass }) => {
    const isUp = trend >= 0;
    return (
        <div onClick={onClick} className={`bg-white rounded-[28px] border border-slate-200 p-5 lg:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group h-full dashboard-card ${onClick ? 'cursor-pointer hover:border-'+borderClass : ''}`}>
           <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-${color}-500`}></div>
           <Icon className={`absolute -bottom-6 -right-6 w-32 h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110`} />
           
           {/* DIPERBAIKI: Mengubah flex-col menjadi justify-between items-start dan mengunci tinggi (h-44px) */}
           <div className="flex justify-between items-start gap-2 mb-4 lg:mb-5 pl-2 relative z-10 shrink-0 h-[44px] lg:h-[48px]">
               <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                   <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center shrink-0 shadow-inner`}><Icon size={18} strokeWidth={2.5}/></div>
                   <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 truncate card-title">{title}</p>
               </div>
               {trend !== undefined && !isNaN(trend) && (
                   <div className={`shrink-0 px-2 py-1 rounded-md text-[9px] lg:text-[10px] font-black flex items-center gap-1 whitespace-nowrap transition-colors ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                       {isUp ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {Math.abs(trend).toFixed(1)}%
                   </div>
               )}
           </div>
           
           <div className="pl-2 relative z-10 flex-1 flex flex-col justify-start">
               <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 card-mtd-label">MTD {title}</p>
               <p className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 lg:mb-4 card-main-value">{value}</p>
           </div>
           
           {midLabel ? (
               <div className="mt-auto flex flex-col gap-1.5 pl-2 relative z-10 shrink-0 min-h-[40px] lg:min-h-[44px]">
                   <div className="pt-3 lg:pt-4 border-t border-slate-100 flex justify-between items-center">
                       <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase truncate pr-2">{midLabel}</span>
                       <span className="text-[10px] lg:text-xs font-black text-slate-700 card-sub-value">{midValue}</span>
                   </div>
                   <div className="flex justify-between items-center">
                       <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase truncate pr-2">{subLabel}</span>
                       <span className="text-[10px] lg:text-xs font-black text-slate-700 card-sub-value">{subValue}</span>
                   </div>
               </div>
           ) : (
               <div className="mt-auto pt-3 lg:pt-4 border-t border-slate-100 flex justify-between items-center pl-2 relative z-10 shrink-0 min-h-[40px] lg:min-h-[44px]">
                   <span className="text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase truncate pr-2">{subLabel}</span>
                   <span className="text-sm lg:text-base font-black text-slate-700 card-sub-value">{subValue}</span>
               </div>
           )}
        </div>
    );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
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
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [outletModalTab, setOutletModalTab] = useState('inactive');
  
  const [showFloatingBar, setShowFloatingBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [compareMonths, setCompareMonths] = useState(['', '', '']);
  const [sortConfig, setSortConfig] = useState({ key: 'mtdBs', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const [noteText, setNoteText] = useState('');
  const [showPresentation, setShowPresentation] = useState(false);
  const presentationRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('am_dashboard_theme') === 'dark');

  useEffect(() => { localStorage.setItem('am_dashboard_theme', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);
  useEffect(() => { setShowFloatingBar(true); setShowPresentation(false); }, [selectedMex]);

  const handleMainScroll = (e) => {
      if(showPresentation) return;
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
      const expDate = "17 Maret 2026";

      let templates = [];
      
      const lastHistGen = selectedMex.history && selectedMex.history.length > 0 ? selectedMex.history[selectedMex.history.length-1] : null;
      const trendBulanLalu = selectedMex.lmBs > 0 ? (((selectedMex.rrBs - selectedMex.lmBs) / selectedMex.lmBs) * 100).toFixed(0) : 0;
      const aovText = lastHistGen ? formatCurrencyFull(lastHistGen.aov) : 'Rp -';
      const promoPctText = lastHistGen ? `${lastHistGen.promo_order_pct}%` : '-';

      switch(templateType) {
          case 'general': 
              templates = [
                  `Halo kak ${owner} 👋, aku ${amShort} (AM Grab).\n\nAku abis ngecek data *${mexName}* nih. Rata-rata pesanan kakak sekarang dapet di angka *${aovText}*.\n\nKayaknya ada 1-2 trik simpel yang bisa kita cobain bareng biar omset bulan ini bisa naik lebih ngebut lagi dibanding kemaren 📈.\n\nKira-kira kakak free kapan ya? Boleh kita jadwalkan ketemu sebentar buat ngobrolin ini?`,
                  
                  `Siang kak ${owner} 🙌. Sama ${amShort} dari Grab di sini.\n\nAku lagi pantau pergerakan *${mexName}*, tren proyeksi omsetnya sekarang ada di *${trendBulanLalu}%* vs bulan lalu nih. \n\nSebenernya ada strategi seru dari beberapa resto jagoan di area kakak yang belum dipake di toko ini, sayang banget lho potensinya 🤔.\n\nBoleh kita ketemuan besok atau lusa kak buat bahas idenya?`,
                  
                  `Halo kak ${owner}! Semoga usahanya makin rame ya 🙏.\n\nAku ${amShort} (AM Grab). Dari sistem, kulihat ketertarikan pelanggan sama promo *${mexName}* ada di *${promoPctText}*. \n\nAku nemu satu setelan (config) asik di app yang bisa bikin angkanya makin greget tanpa perlu nambah modal gede 💡.\n\nMau kubantu pandu cara setelnya kak? Kabari ya kapan pasnya kita bisa ketemuan!`,
                  
                  `Pagi/siang kak ${owner} ☀️. Aku ${amShort} dari Grab.\n\nCuma mau *update kilat* nih: Aku baru liat report *${mexName}* bulan ini. Secara umum udah oke, tapi *traffic* kunjungan ke profil resto kakak sebenernya bisa didorong lebih pol lagi 🔥.\n\nAku udah siapin *action plan* khusus nih buat *${mexName}*. Kalau kakak lagi nyantai, boleh info kapan kita bisa ketemuan sebentar?`,
                  
                  `Halo kak ${owner} 👋. Kenalin aku ${amShort} dari Grab yang bantu pantau *${mexName}*.\n\nLagi iseng cek laporan bulanan, lumayan asik liat rata-rata transaksi kakak nyentuh *${aovText}*.\n\nTapi aku liat ada peluang cuan di jam-jam tertentu yang sering kelewat nih kak 📉. Aku punya ide jitu yang cocok banget buat *cover* itu.\n\nBoleh kita atur waktu buat ketemu sebentar kak hari ini atau besok?`
              ];
              break;
          case 'promo': 
              templates = [
                  `Halo kak ${owner} 👋, aku ${amShort} (AM Grab).\n\nLiat performa *${mexName}*, kayaknya kita butuh suntikan orderan biar makin rame nih. Kebetulan banget Grab lagi ada program *Diskon Puas Booster* (Customer dapet diskon s/d 35% + Diskon Kilat 50% di jam rame! 🔥).\n\nPromo ini ampuh banget buat narik pelanggan baru. Boleh ketemuan bentar besok kak buat bahas itung-itungannya?`,
                  
                  `Siang kak ${owner} 🙌! Aku ${amShort} dari Grab.\n\nMendekati momen rame, aku mau ngusulin *${mexName}* buat ikut promo *Booster+* nih kak. Promo ini khusus mancing customer yang ordernya gede (transaksi di atas 100rb dapet diskon s/d 40% 🛍️).\n\nCocok banget buat naikin rata-rata nilai pesanan per nota. Kira-kira kapan kita bisa ketemu buat ngobrolin ini kak?`,
                  
                  `Halo kak ${owner} ☀️. Aku ${amShort} (Grab).\n\nBiar orderan *${mexName}* makin kenceng tapi cuan tetep aman, aku ada rekomendasi program *Diskon Puas Cuan* nih kak (Customer dapet diskon s/d 30% 💸).\n\nProgram ini *sweet spot* banget buat ningkatin penjualan harian secara stabil. Kapan kira-kira kakak ada waktu kosong buat ketemu bentar ngebahas ini?`,
                  
                  `Halo kak ${owner} 👋. Sama ${amShort} dari Grab di sini.\n\nSayang banget lho *traffic* di app Grab lagi tinggi-tingginya nih kak 📈. Gimana kalau *${mexName}* kita daftarin *Diskon Puas Booster* (Diskon s/d 35% + Kilat 50%) biar toko kakak langsung mentereng di posisi atas?\n\nBiar enak jelasinnya, kapan kakak luang biar kita bisa ketemuan ngopi bahas mekanismenya?`,
                  
                  `Halo kak ${owner} 🙏, aku ${amShort} (AM Grab).\n\nBuat maksimalkan penjualan *${mexName}* minggu ini, Grab lagi buka 3 andalan promo seksi nih: *Diskon Puas Booster*, *Diskon Puas Cuan*, atau *Booster+* khusus order gede-gedean 🚀.\n\nBiar milihnya gampang dan pas sama kondisi budget toko kakak, mending kita ketemuan aja yuk bentar buat diskusiin. Besok kira-kira bisa kak?`
              ];
              break;
          case 'mca': 
              templates = [
                  `Halo kak ${owner} 👋\n\nMenjelang puncak Ramadan dan Lebaran, kesiapan usaha menjadi hal penting agar pelayanan *${mexName}* tetap optimal 🚀.\n\nSaat ini tersedia program Grab Modal Mantul dengan estimasi pendanaan hingga *${mcaLimit}* 💰.\n\nPeriode penawaran ini dijadwalkan berakhir pada *${expDate}* ⏳.\n\nUntuk memastikan usaha tetap siap di momen hari raya, silakan cek ketersediaan penawaran di aplikasi GrabMerchant sebelum sistem menutup periode Ramadan.`,
                  
                  `Halo kak ${owner} 🙌\n\nRamadan adalah momen yang hanya datang setahun sekali dan sering menjadi periode dengan aktivitas penjualan yang meningkat 📈.\n\nKhusus untuk *${mexName}*, program Grab Modal Mantul tersedia dengan limit hingga *${mcaLimit}* 💸.\n\nPenawaran ini akan berakhir pada *${expDate}* ⚠️.\n\nSebelum periode Ramadan ditutup, Anda dapat melihat detail penawaran di aplikasi GrabMerchant agar tidak melewatkan kesempatan yang tersedia.`,
                  
                  `Selamat siang kak ${owner} 👋\n\nUntuk membantu menjaga kelancaran arus kas *${mexName}* selama Ramadan 🌙, tersedia program Grab Modal Mantul dengan estimasi pendanaan hingga *${mcaLimit}* 💵.\n\nPeriode khusus Ramadan ini akan berakhir pada *${expDate}* ⏰.\n\nAgar usaha tetap optimal menjelang Lebaran, silakan cek penawaran Anda melalui aplikasi GrabMerchant sebelum batas waktu tersebut.`,
                  
                  `Halo kak ${owner} 👋\n\nDalam menyambut hari raya, banyak usaha mempersiapkan tambahan stok dan operasional 📦.\n\nProgram Grab Modal Mantul menyediakan opsi pendanaan hingga *${mcaLimit}* khusus untuk *${mexName}* 🌟.\n\nPenawaran periode ini dijadwalkan berakhir pada *${expDate}* 🗓️.\n\nUntuk memastikan momentum Ramadan dapat dimanfaatkan dengan baik, silakan cek detailnya sebelum periode resmi ditutup.`,
                  
                  `Halo kak ${owner} 🙌\n\nMenjelang Lebaran, kesiapan usaha sangat berpengaruh pada kelancaran pelayanan pelanggan *${mexName}* 🍽️.\n\nSaat ini tersedia program Grab Modal Mantul dengan estimasi hingga *${mcaLimit}* 💳.\n\nPeriode penawaran akan berakhir pada *${expDate}* ⌛.\n\nSebelum sistem menutup akses periode Ramadan, Anda dapat melihat ketersediaan penawaran melalui aplikasi GrabMerchant.`,
                  
                  `Halo kak ${owner} 👋\n\nRamadan sering menjadi periode dengan peningkatan kebutuhan operasional 🛒.\n\nUntuk mendukung *${mexName}*, tersedia program Grab Modal Mantul dengan kisaran hingga *${mcaLimit}* 💰.\n\nPenawaran ini berlaku hingga *${expDate}* 📅.\n\nAgar tidak melewatkan kesempatan di momen tahunan ini, silakan cek detail penawaran di aplikasi GrabMerchant sebelum periode berakhir.`,
                  
                  `Selamat sore kak ${owner} 🙌\n\nDalam persiapan menghadapi puncak penjualan Lebaran, tambahan modal dapat membantu menjaga stabilitas *${mexName}* 📈.\n\nProgram Grab Modal Mantul menyediakan estimasi pendanaan hingga *${mcaLimit}* 💸.\n\nPeriode Ramadan ini akan ditutup pada *${expDate}* ⏳.\n\nSilakan cek informasi lengkapnya melalui aplikasi GrabMerchant sebelum periode resmi berakhir.`,
                  
                  `Halo kak ${owner} 👋\n\nMomentum Ramadan merupakan waktu yang tepat untuk memaksimalkan potensi usaha *${mexName}* ✨.\n\nProgram Grab Modal Mantul tersedia dengan limit hingga *${mcaLimit}* (sesuai hasil evaluasi) 💵.\n\nPenawaran periode ini dijadwalkan berakhir pada *${expDate}* ⚠️.\n\nUntuk memastikan usaha tetap siap hingga hari raya, silakan cek penawaran Anda sebelum sistem menutup periode tersebut.`,
                  
                  `Halo kak ${owner} 🙌\n\nMenjelang akhir Ramadan, banyak usaha mempersiapkan kebutuhan tambahan untuk menghadapi peningkatan pesanan 🛵.\n\nSaat ini tersedia program Grab Modal Mantul untuk *${mexName}* dengan estimasi hingga *${mcaLimit}* 💳.\n\nPenawaran berlaku hingga *${expDate}* ⏰.\n\nSebelum periode ini berakhir, Anda dapat mempertimbangkan dan melihat detailnya langsung di aplikasi GrabMerchant.`,
                  
                  `Yth. Kak ${owner} 🙏,\n\nProgram Grab Modal Mantul periode Ramadan masih tersedia untuk *${mexName}* dengan limit pendanaan hingga *${mcaLimit}* 💰.\n\nPeriode ini direncanakan berakhir pada *${expDate}* 🗓️.\n\nUntuk memastikan usaha tetap optimal di momen Lebaran, silakan cek ketersediaan penawaran melalui aplikasi GrabMerchant sebelum periode ditutup.`
              ];
              break;
          case 'inactive': templates = [`Halo kak ${owner}! Saya cek *${mexName}* offline nih. Ada kendala kak?`, `Siang kak ${owner}, notis *${mexName}* belum aktif. Kalau ada kendala kabari ya.`]; break;
          case 'report': 
              const rrBsFormatted = formatCurrencyFull(selectedMex.rrBs || 0);
              const lastHist = selectedMex.history && selectedMex.history.length > 0 ? selectedMex.history[selectedMex.history.length-1] : null;
              
              const lastOrders = lastHist ? lastHist.completed_orders : 0;
              const aovFormatted = lastHist ? formatCurrencyFull(lastHist.aov) : 'Rp 0';
              const promoPct = lastHist ? lastHist.promo_order_pct : 0;
              const roas = (lastHist && lastHist.ads_total_hist > 0) ? (lastHist.ads_sales / lastHist.ads_total_hist).toFixed(1) : 0;
              const adsOrders = lastHist ? lastHist.ads_orders : 0;

              let metricsText = `📈 Estimasi Omset: *${rrBsFormatted}*\n🛍️ Total Pesanan: *${lastOrders} Orders*\n💰 Rata-rata Pesanan: *${aovFormatted}*\n✨ Minat Promo: *${promoPct}%*`;
              if (roas > 0 || adsOrders > 0) {
                  metricsText += `\n🎯 Pesanan dari Iklan: *${adsOrders} Orders*\n📢 ROAS Iklan: *${roas}x*`;
              }
              
              let ctaText = "";
              if (selectedMex.mcaWlLimit > 0 && !String(selectedMex.mcaWlClass).includes('Not')) {
                  ctaText = `Khusus bulan ini, *${mexName}* juga terpilih untuk penawaran *Grab Modal Mantul s/d ${formatCurrencyFull(selectedMex.mcaWlLimit)}* lho! 🚀`;
              } else {
                  ctaText = `Mari maksimalkan terus performanya dengan berbagai program menarik dari Grab! 🚀`;
              }
              
              templates = [
                  `Halo kak ${owner}! Saya ${amShort} (AM Grab).\n\nBerikut adalah ringkasan performa *${mexName}* bulan ini:\n${metricsText}\n\n${ctaText}\n\n_(Saya juga melampirkan gambar ringkasan visualnya di atas 👆)_\n\nKapan ada waktu luang buat ketemuan bahas ini kak?`
              ];
              break;
          default: templates = [`Halo kak ${owner}, saya ${amShort} (Grab). Boleh ngobrol bentar sambil ketemuan bahas performa *${mexName}*?`, `Siang kak ${owner}! Ingin diskusi penjualan *${mexName}*. Kapan ada waktu luang buat ketemu?`];
      }
      const randomText = templates[Math.floor(Math.random() * templates.length)];
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(randomText)}`, '_blank');
      setShowWaModal(false);
  };

  const handleShareReport = async () => {
      if (!selectedMex || !selectedMex.phone || selectedMex.phone === '-') return;
      setIsCapturing(true);
      try {
          if (!window.html2canvas) {
              await new Promise((resolve, reject) => {
                  const script = document.createElement('script');
                  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                  script.onload = resolve;
                  script.onerror = reject;
                  document.head.appendChild(script);
              });
          }
          await new Promise(r => setTimeout(r, 400));
          const element = presentationRef.current;
          if (element) {
              const canvas = await window.html2canvas(element, {
                  scale: 2, 
                  useCORS: true,
                  backgroundColor: '#f8fafc',
                  windowWidth: window.innerWidth > 800 ? window.innerWidth : 800
              });
              const imgData = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = `Laporan_Performa_${selectedMex.name.replace(/\s+/g, '_')}.png`;
              link.href = imgData;
              link.click();
              handleSendWA('report');
          }
      } catch (err) {
          console.error("Gagal melakukan screenshot:", err);
          handleSendWA('report');
      } finally {
          setIsCapturing(false);
      }
  };

  useEffect(() => {
    const loadLocalData = async () => {
        setIsInitializing(true);
        try {
            let saved = await loadFromIndexedDB('am_dashboard_data_v3');
            
            if (saved && saved.length > 0) {
                saved.sort((a, b) => a.name.localeCompare(b.name));
                
                if (GOOGLE_SHEETS_API_URL) {
                    try {
                        const res = await fetch(GOOGLE_SHEETS_API_URL + '?t=' + new Date().getTime());
                        const cloudNotes = await res.json();
                        
                        if (Array.isArray(cloudNotes) && cloudNotes.length > 0) {
                            const notesMap = {};
                            cloudNotes.forEach((row, i) => {
                                const getVal = (keys) => {
                                    const foundKey = Object.keys(row).find(k => keys.includes(String(k).toLowerCase().replace(/[\s_]/g, '')));
                                    return foundKey ? row[foundKey] : undefined;
                                };

                                const mId = String(getVal(['merchantid', 'id']) || '').trim();
                                const tStamp = getVal(['timestamp', 'waktu', 'tanggal', 'date']) || new Date().toISOString();
                                const nText = getVal(['note', 'notes', 'catatan']) || '';

                                if (!mId || !nText) return;

                                if (!notesMap[mId]) notesMap[mId] = [];
                                notesMap[mId].push({
                                    id: String(tStamp), 
                                    date: parseSafeDate(tStamp), 
                                    text: String(nText)
                                });
                            });

                            saved = saved.map(mex => {
                                const mId = String(mex.id).trim();
                                const cNotes = notesMap[mId] || [];
                                const lNotes = mex.notes || [];
                                
                                const merged = new Map();
                                lNotes.forEach(n => merged.set(n.id, n));
                                cNotes.forEach(n => merged.set(n.id, n));
                                
                                const finalNotes = Array.from(merged.values());
                                finalNotes.sort((a, b) => {
                                    const tA = new Date(a.date).getTime();
                                    const tB = new Date(b.date).getTime();
                                    return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
                                });
                                
                                return { ...mex, notes: finalNotes };
                            });
                            
                            await saveToIndexedDB('am_dashboard_data_v3', saved);
                        }
                    } catch (err) {
                        console.error("Gagal sinkronisasi data dari Google Sheets (akan menggunakan lokal):", err);
                    }
                }

                setData(saved); 
                setIsForceUpload(false);
                const savedUpdate = localStorage.getItem('am_dashboard_last_update_v3');
                if (savedUpdate) setGlobalLastUpdate(savedUpdate);
            }
        } catch (e) {
            console.error("Gagal inisialisasi awal", e);
        }
        setIsInitializing(false);
    };
    loadLocalData();
  }, []);

  const saveToLocal = async (finalData, syncDateStr = null) => {
      setLoading(true);
      try {
          await new Promise(resolve => setTimeout(resolve, 500));
          await saveToIndexedDB('am_dashboard_data_v3', finalData);
          setData(finalData); setIsForceUpload(false);
          
          if (syncDateStr) {
              setGlobalLastUpdate(syncDateStr);
              localStorage.setItem('am_dashboard_last_update_v3', syncDateStr);
          }
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
          
          let updateStr = '';
          if (firstRow.length > 44 && firstRow[44]) {
              updateStr = String(firstRow[44]).trim();
          } else {
              const fbIdx = firstRow.findIndex(val => val && String(val).trim().toUpperCase() === 'MTD');
              if (fbIdx !== -1 && firstRow[fbIdx + 1]) updateStr = String(firstRow[fbIdx + 1]).trim();
          }
          if (!updateStr) updateStr = 'Terbaru';
          
          const existingData = await loadFromIndexedDB('am_dashboard_data_v3');
          const notesMap = new Map();
          if (existingData && Array.isArray(existingData)) existingData.forEach(d => { if (d.notes && d.notes.length) notesMap.set(d.id, d.notes); });

          let headerIdx = -1; let rawHeaders = [];
          for (let i = 0; i < Math.min(20, masterLines.length); i++) {
            const test = (masterLines[i] || []).map(h => h ? String(h).trim().replace(/[\r\n]+/g, ' ') : '');
            if (test.includes('Mex ID')) { rawHeaders = test; headerIdx = i; break; }
          }
          if (headerIdx === -1) throw new Error("Kolom 'Mex ID' tidak ditemukan."); 

          const headers = []; const mCounts = {};
          rawHeaders.forEach(h => { if (!h) { headers.push(''); return; } if (mCounts[h]) { headers.push(`${h}.${mCounts[h]}`); mCounts[h]++; } else { headers.push(h); mCounts[h] = 1; } });

          const mIdx = headers.indexOf('Mex ID');
          const mtdBIdx = headers.findIndex(h => h.includes('MTD (BS)') || h.includes('MTD\n(BS)')); const lmBIdx = mtdBIdx > 0 ? mtdBIdx - 1 : -1;
          const mtdAIdx = headers.findIndex(h => h.includes('Total MTD (Ads)') || h.includes('Total MTD\n(Ads)')); const lmAIdx = mtdAIdx > 0 ? mtdAIdx - 1 : -1;
          const mtdMiIdx = headers.findIndex(h => h.includes('MTD (MI)') || h.includes('MTD\n(MI)')); const lmMiIdx = mtdMiIdx > 0 ? mtdMiIdx - 1 : -1;
          const prioHeader = headers.find(h => h.toLowerCase().includes('priority') || h.toLowerCase().includes('prio') || h.toLowerCase().includes('framework'));
          const pointHeader = headers.find(h => h.toLowerCase().includes('total point') || h.toLowerCase().includes('point'));
          const gmsPackageHeader = headers.find(h => h && (h.toLowerCase().includes('gms package') || h.toLowerCase().includes('package')));

          let pMap = new Map();
          let rowIdx = 0;
          for (let i = headerIdx + 1; i < masterLines.length; i++) {
            const vals = masterLines[i]; if (!vals || !vals[mIdx] || String(vals[mIdx]).toLowerCase() === 'mex id') continue;
            let obj = {}; headers.forEach((h, idx) => { if(h) obj[h] = vals[idx] !== undefined ? String(vals[idx]).trim() : ''; });
            
            const mexId = obj['Mex ID'];
            const lmBsVal = cleanNumber(vals[lmBIdx]); const mtdBsVal = cleanNumber(obj['MTD (BS)'] || obj['MTD\n(BS)']); const rrBsVal = cleanNumber(obj['RR (BS)'] || obj['RR\n(BS)']);
            const calcRrVsLm = lmBsVal > 0 ? ((rrBsVal - lmBsVal) / lmBsVal) * 100 : (rrBsVal > 0 ? 100 : 0);
            
            const optInVal = (gmsPackageHeader && obj[gmsPackageHeader]) ? String(obj[gmsPackageHeader]).trim() : (vals[47] !== undefined ? String(vals[47]).trim() : '');
            const optOutVal = vals[52] !== undefined ? String(vals[52]).trim() : '';
            const optInDateVal = vals[48] !== undefined ? String(vals[48]).trim() : '';
            const optOutDateVal = vals[53] !== undefined ? String(vals[53]).trim() : '';

            pMap.set(mexId, {
              id: mexId, name: obj['Mex Name'], amName: obj['AM Name'] || 'Unassigned', ownerName: vals[10] !== undefined && String(vals[10]).trim() !== '' ? String(vals[10]).trim() : '-',
              lmBs: lmBsVal, mtdBs: mtdBsVal, rrBs: rrBsVal, rrVsLm: calcRrVsLm, lmMi: cleanNumber(vals[lmMiIdx]), mtdMi: cleanNumber(obj['MTD (MI)'] || obj['MTD\n(MI)']), rrMi: cleanNumber(obj['RR (MI)'] || obj['RR\n(MI)']),
              adsLM: cleanNumber(vals[lmAIdx]), adsTotal: cleanNumber(obj['Total MTD (Ads)'] || obj['Total MTD\n(Ads)']), adsRR: cleanNumber(obj['RR (Ads)']),
              adsMob: cleanNumber(obj['Ads Mobile'] || obj['Ads mobile'] || obj['MTD Ads Mobile'] || obj['Ads Mob']), adsWeb: cleanNumber(obj['Ads Web'] || obj['Ads web'] || obj['MTD Ads Web']), adsDir: cleanNumber(obj['Ads Direct'] || obj['Ads direct'] || obj['MTD Ads Direct'] || obj['Ads Dir']),
              mcaAmount: cleanNumber(obj['MCA Amount']), mcaWlLimit: cleanNumber(obj['MCA WL']), mcaWlClass: obj['MCA WL Classification'] || '-Not in WL', mcaPriority: (prioHeader && obj[prioHeader]) ? String(obj[prioHeader]).trim() : '-', mcaDropOff: obj['Drop Off Screen'] && String(obj['Drop Off Screen']).trim().toUpperCase() !== 'FALSE' ? String(obj['Drop Off Screen']).trim() : '-', mcaDisburseStatus: obj['Disburse Status'] || '', disbursedDate: obj['Disbursed date'],
              zeusStatus: obj['Zeus'], joinDate: obj['Join Date'], campaigns: obj['Campaign'] || '', commission: vals[13] || obj['Base Commission'], city: obj['City Mex'], address: obj['Adress'] || obj['Address'], phone: obj['Phone zeus'], email: obj['Email zeus'],
              latitude: obj['Latitude'] || obj['Lat'] || (vals[14] !== undefined ? String(vals[14]).trim() : ''), longitude: obj['Longitude'] || obj['Long'] || obj['Lng'] || (vals[15] !== undefined ? String(vals[15]).trim() : ''),
              lastUpdate: '', campaignPoint: cleanNumber(pointHeader ? obj[pointHeader] : 0), history: [], notes: notesMap.get(mexId) || [], 
              gmsOptIn: optInVal, gmsOptOut: optOutVal, gmsOptInDate: optInDateVal, gmsOptOutDate: optOutDateVal, rowNum: rowIdx++
            });
          }

          if (histText) {
              const histLines = parseCSVString(histText); const hHeaders = (histLines[0] || []).map(h => h ? String(h).trim() : '');
              const hMexIdx = hHeaders.indexOf('merchant_id'); const hMonthIdx = hHeaders.indexOf('first_day_of_month'); const hBsIdx = hHeaders.indexOf('basket_size'); const hTotOrdIdx = hHeaders.indexOf('total_orders'); const hCompOrdIdx = hHeaders.indexOf('completed_orders'); const hPromoOrdIdx = hHeaders.indexOf('orders_with_promo_mfp_gms'); const hAovIdx = hHeaders.indexOf('aov'); const hMfcIdx = hHeaders.indexOf('mfc_mex_spend'); const hMfpIdx = hHeaders.indexOf('mfp_mex_spend'); const hCpoIdx = hHeaders.indexOf('cpo'); const hGmsIdx = hHeaders.indexOf('gms'); const hCommIdx = hHeaders.indexOf('basic_commission'); const hAdsWebIdx = hHeaders.indexOf('ads_web'); const hAdsMobIdx = hHeaders.indexOf('ads_mobile'); const hAdsDirIdx = hHeaders.indexOf('ads_direct');
              
              const hMexIdxRight = hHeaders.lastIndexOf('merchant_id');
              const hMonthIdxRight = hHeaders.indexOf('month_id');
              const hPenetrationIdx = hHeaders.indexOf('penetration');
              const hHoursIdx = hHeaders.indexOf('hours_from_month');

              for (let i = 1; i < histLines.length; i++) {
                  const vals = histLines[i]; if (!vals) continue; 
                  
                  if (hMexIdx !== -1 && hMonthIdx !== -1 && vals[hMexIdx]) {
                      const mexId = String(vals[hMexIdx]).trim();
                      if (pMap.has(mexId)) {
                          if (vals[0] && String(vals[0]).trim() !== '') pMap.get(mexId).lastUpdate = String(vals[0]).trim();
                          const monthStr = String(vals[hMonthIdx]).trim();
                          let histEntry = pMap.get(mexId).history.find(h => h.month === monthStr);
                          if (!histEntry) {
                              histEntry = { month: monthStr, operational_hours: 0, penetration: 0 };
                              pMap.get(mexId).history.push(histEntry);
                          }
                          const baseBs = cleanNumber(vals[hBsIdx]); const totOrd = cleanNumber(vals[hTotOrdIdx]); const promoOrd = cleanNumber(vals[hPromoOrdIdx]);
                          const adsTotHist = cleanNumber(vals[hAdsWebIdx]) + cleanNumber(vals[hAdsMobIdx]) + cleanNumber(vals[hAdsDirIdx]);
                          const totInv = cleanNumber(vals[hMfcIdx]) + cleanNumber(vals[hMfpIdx]) + cleanNumber(vals[hCpoIdx]) + cleanNumber(vals[hGmsIdx]) + cleanNumber(vals[hCommIdx]) + adsTotHist;
                          const adsOrdHist = vals.length > 21 ? cleanNumber(vals[21]) : 0; const adsSalesHist = vals.length > 22 ? cleanNumber(vals[22]) : 0;
                          
                          Object.assign(histEntry, {
                              basket_size: baseBs, net_sales: baseBs - totInv, total_orders: totOrd, completed_orders: hCompOrdIdx !== -1 ? cleanNumber(vals[hCompOrdIdx]) : totOrd, orders_with_promo: promoOrd, promo_order_pct: totOrd > 0 ? parseFloat(((promoOrd / totOrd) * 100).toFixed(1)) : 0, aov: cleanNumber(vals[hAovIdx]), mfc: cleanNumber(vals[hMfcIdx]), mfp: cleanNumber(vals[hMfpIdx]), cpo: cleanNumber(vals[hCpoIdx]), gms: cleanNumber(vals[hGmsIdx]), basic_commission: cleanNumber(vals[hCommIdx]), ads_total_hist: adsTotHist, mi_percentage: baseBs > 0 ? parseFloat(((totInv / baseBs) * 100).toFixed(1)) : 0, total_investment: totInv, ads_orders: adsOrdHist, ads_sales: adsSalesHist
                          });
                      }
                  }

                  if (hMexIdxRight !== -1 && hMexIdxRight !== hMexIdx && hMonthIdxRight !== -1 && vals[hMexIdxRight]) {
                      const mexIdRight = String(vals[hMexIdxRight]).trim();
                      if (pMap.has(mexIdRight)) {
                          const monthStrRight = String(vals[hMonthIdxRight]).trim();
                          let histEntryRight = pMap.get(mexIdRight).history.find(h => h.month === monthStrRight);
                          if (!histEntryRight) {
                              histEntryRight = { month: monthStrRight, basket_size: 0, net_sales: 0, total_orders: 0, completed_orders: 0, aov: 0, promo_order_pct: 0, mi_percentage: 0, total_investment: 0, ads_total_hist: 0, operational_hours: 0, penetration: 0 };
                              pMap.get(mexIdRight).history.push(histEntryRight);
                          }
                          histEntryRight.operational_hours = hHoursIdx !== -1 ? cleanNumber(vals[hHoursIdx]) : 0;
                          
                          // PERBAIKAN LOGIKA PHOTO PENETRATION
                          let rawPen = hPenetrationIdx !== -1 ? cleanNumber(vals[hPenetrationIdx]) : 0;
                          if (rawPen > 1) rawPen = rawPen / 100; // Jika CSV menulis 85 atau 85%, ubah jadi 0.85
                          histEntryRight.penetration = Math.min(1, Math.max(0, rawPen)); // Kunci di rentang 0.0 - 1.0 (0% - 100%)
                      }
                  }
              }
          }
          const finalData = Array.from(pMap.values()).map(m => { 
              if (m.history.length > 0) {
                  m.history.sort((a, b) => new Date(a.month) - new Date(b.month));
                  m.latest_penetration = m.history[m.history.length - 1].penetration || 0;
              } else {
                  m.latest_penetration = 0;
              }
              return m; 
          });
          await saveToLocal(finalData, updateStr);
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
          const amNames = ['Novan', 'Aldo', 'Dadan', 'Hikam']; const camps = ['GMS', 'Cuan', 'Ongkir', 'WEEKENDFEST', 'Booster+']; const m = ['2025-01-01','2025-02-01','2025-03-01','2025-04-01','2025-05-01','2025-06-01','2025-07-01','2025-08-01','2025-09-01','2025-10-01','2025-11-01','2025-12-01','2026-01-01','2026-02-01'];
          const genData = Array.from({ length: 40 }).map((_, i) => {
              const lm = Math.floor(Math.random() * 50000000) + 5000000; const rr = Math.random() > 0.4 ? lm * (1 + Math.random() * 0.5) : lm * (1 - Math.random() * 0.3); const mca = Math.random() > 0.8 ? Math.floor(Math.random() * 50000000) + 10000000 : 0; let baseBs = Math.floor(Math.random() * 15000000) + 5000000;
              const hist = m.map(mon => {
                  baseBs = Math.max(1000000, baseBs * (1 + (Math.random() * 0.4 - 0.2))); const ord = Math.floor(baseBs / 40000); const adsTotHist = Math.random() > 0.3 ? Math.floor(Math.random() * 500000) + 100000 : 0; const adsSales = adsTotHist > 0 ? adsTotHist * (Math.random() * 5 + 1.5) : 0; const adsOrders = Math.floor(adsSales / 40000);
                  return { month: mon, basket_size: baseBs, net_sales: baseBs * 0.8, total_orders: ord, completed_orders: ord, orders_with_promo: Math.floor(ord*0.5), promo_order_pct: 50, aov: 40000, mfc: 0, mfp: 0, cpo: 0, gms: 0, basic_commission: 0, ads_total_hist: adsTotHist, mi_percentage: 12, total_investment: 0, ads_orders: adsOrders, ads_sales: adsSales, operational_hours: Math.floor(Math.random() * 150) + 100, penetration: Math.random() };
              });
              const randomDay = Math.floor(Math.random() * 28) + 1;
              const randomDayOut = Math.floor(Math.random() * 28) + 1;
              
              // NEW: Adaptasikan tanggal dummy pencairan ke bulan berjalan secara otomatis
              const dDateObj = new Date();
              const dMonth = dDateObj.toLocaleString('en-US', { month: 'short' });
              const dYear = String(dDateObj.getFullYear()).slice(-2);
              const demoDisbursedDate = `15-${dMonth}-${dYear}`;

              return {
                  id: `6-C${Math.random().toString(36).substr(2, 9).toUpperCase()}`, name: `Merchant ${String.fromCharCode(65 + (i % 26))} - Kota`, amName: amNames[i % 4], ownerName: `Ona`, lmBs: lm, mtdBs: rr * 0.7, rrBs: rr, rrVsLm: ((rr - lm) / lm) * 100, lmMi: 0, mtdMi: 0, rrMi: 0, adsLM: 0, adsTotal: 0, adsMob: 0, adsWeb: 0, adsDir: 0, adsRR: 0, mcaAmount: mca, mcaWlLimit: mca > 0 ? mca * 1.5 : 0, mcaWlClass: mca > 0 ? 'Repeat' : '-Not in WL', mcaPriority: mca > 0 ? 'P1' : '-', mcaDropOff: '-', mcaDisburseStatus: mca > 0 ? 'Disbursed' : '', disbursedDate: mca > 0 ? demoDisbursedDate : '', zeusStatus: Math.random() > 0.15 ? 'ACTIVE' : 'INACTIVE', joinDate: `12-Jan-22`, campaigns: Math.random() < 0.2 ? 'No Campaign' : camps[Math.floor(Math.random()*5)], commission: '20%', city: 'Kota', address: 'Jalan', phone: '+628123456789', email: 'test@mail.com', latitude: '', longitude: '', lastUpdate: '22 Feb', campaignPoint: 100, history: hist, notes: [],
                  gmsOptIn: Math.random() > 0.85 ? camps[Math.floor(Math.random()*3)] : '', gmsOptOut: Math.random() > 0.9 ? camps[Math.floor(Math.random()*3)] : '', gmsOptInDate: `${dDateObj.getFullYear()}-${String(dDateObj.getMonth()+1).padStart(2, '0')}-${randomDay.toString().padStart(2, '0')}`, gmsOptOutDate: `${dDateObj.getFullYear()}-${String(dDateObj.getMonth()+1).padStart(2, '0')}-${randomDayOut.toString().padStart(2, '0')}`, rowNum: i, latest_penetration: hist[hist.length-1].penetration 
              };
          });
          saveToLocal(genData, "17 Mar 2026"); 
       }, 600); 
  };

  const handleSaveNote = async () => {
      if (!noteText.trim() || !selectedMex) return;
      const timestamp = new Date().toISOString();
      const newNote = { id: timestamp, date: timestamp, text: noteText.trim() };
      const updatedMex = { ...selectedMex, notes: [newNote, ...(selectedMex.notes || [])] };
      const updatedData = data.map(m => m.id === updatedMex.id ? updatedMex : m);
      setSelectedMex(updatedMex); setData(updatedData); setNoteText(''); await saveToIndexedDB('am_dashboard_data_v3', updatedData);

      if (GOOGLE_SHEETS_API_URL) {
          try {
              const payload = { timestamp: timestamp, merchantId: selectedMex.id, merchantName: selectedMex.name, amName: selectedMex.amName || 'Unassigned', note: newNote.text };
              await fetch(GOOGLE_SHEETS_API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
          } catch (err) { console.error("Gagal mengirim ke Google Sheets:", err); }
      }
  };

  const handleDeleteNote = async (noteId) => {
      if (!selectedMex) return;
      const updatedMex = { ...selectedMex, notes: selectedMex.notes.filter(n => n.id !== noteId) };
      const updatedData = data.map(m => m.id === updatedMex.id ? updatedMex : m);
      setSelectedMex(updatedMex); setData(updatedData); await saveToIndexedDB('am_dashboard_data_v3', updatedData);
  };

  const amOptions = useMemo(() => ['All', ...Array.from(new Set(data.map(d => d.amName).filter(Boolean))).sort()], [data]);
  const priorityOptions = useMemo(() => ['All', ...Array.from(new Set(data.map(d => d.mcaPriority).filter(p => p && p !== '-'))).sort()], [data]);
  const activeData = useMemo(() => selectedAM !== 'All' ? data.filter(d => d.amName === selectedAM) : data, [data, selectedAM]);

  const campaignStats = useMemo(() => {
    let zeroInvest = 0, gmsOnly = 0, gmsLocal = 0, boosterPlus = 0, localOnly = 0, joiners = 0; const counts = {};
    activeData.forEach(d => {
      const seg = getMerchantSegment(d.campaigns);
      if (seg === '0 Invest') zeroInvest++;
      else { joiners++; const camps = String(d.campaigns || '').split(/[|,]/).map(x => x.trim()).filter(Boolean); camps.forEach(c => counts[c] = (counts[c] || 0) + 1); }
      if (seg === 'Booster+') boosterPlus++; else if (seg === 'GMS & Local') gmsLocal++; else if (seg === 'GMS Only') gmsOnly++; else if (seg === 'Local Only') localOnly++;
    });
    return { joiners, zeroInvest, classification: [ { name: 'GMS Only', count: gmsOnly, fill: '#0ea5e9' }, { name: 'GMS & Local', count: gmsLocal, fill: '#8b5cf6' }, { name: 'Booster+', count: boosterPlus, fill: '#f59e0b' }, { name: 'Local Only', count: localOnly, fill: '#10b981' }, { name: '0 Invest', count: zeroInvest, fill: '#cbd5e1' } ], list: Object.entries(counts).map(([name, count]) => ({ name, count })) };
  }, [activeData]);

  const filteredSegmentMerchants = useMemo(() => activeSegmentModal ? activeData.filter(m => getMerchantSegment(m.campaigns) === activeSegmentModal).sort((a, b) => b.mtdBs - a.mtdBs) : [], [activeData, activeSegmentModal]);
  const disbursedMerchants = useMemo(() => activeData.filter(m => m.mcaAmount > 0 && ((m.disbursedDate && String(m.disbursedDate).trim() !== '-') || (m.mcaDisburseStatus && String(m.mcaDisburseStatus).toLowerCase().includes('pending')))).sort((a, b) => new Date(b.disbursedDate || 0) - new Date(a.disbursedDate || 0)), [activeData]);
  const inactiveMerchants = useMemo(() => activeData.filter(m => !m.zeusStatus || String(m.zeusStatus).toUpperCase() !== 'ACTIVE').sort((a,b) => b.lmBs - a.lmBs), [activeData]);
  const zeroTrxMerchants = useMemo(() => activeData.filter(m => m.mtdBs <= 0).sort((a,b) => b.lmBs - a.lmBs), [activeData]);

  const optInList = useMemo(() => activeData.filter(m => m.gmsOptIn && m.gmsOptIn !== '-' && m.gmsOptIn !== '0' && m.gmsOptIn !== 'FALSE' && m.gmsOptIn !== '#N/A').sort((a,b) => {
      const getSortableDate = (dateStr) => {
          if (!dateStr || dateStr === '-' || dateStr === '#N/A') return 0;
          return new Date(parseSafeDate(dateStr)).getTime();
      };
      const dateA = getSortableDate(a.gmsOptInDate);
      const dateB = getSortableDate(b.gmsOptInDate);
      if (dateA !== dateB) return dateB - dateA; 
      return b.rowNum - a.rowNum; 
  }), [activeData]);
  
  const optOutList = useMemo(() => activeData.filter(m => m.gmsOptOut && m.gmsOptOut !== '-' && m.gmsOptOut !== '0' && m.gmsOptOut !== 'FALSE' && m.gmsOptOut !== '#N/A').sort((a,b) => {
      const getSortableDate = (dateStr) => {
          if (!dateStr || dateStr === '-' || dateStr === '#N/A') return 0;
          return new Date(parseSafeDate(dateStr)).getTime();
      };
      const dateA = getSortableDate(a.gmsOptOutDate);
      const dateB = getSortableDate(b.gmsOptOutDate);
      if (dateA !== dateB) return dateB - dateA; 
      return b.rowNum - a.rowNum; 
  }), [activeData]);

  const kpi = useMemo(() => {
    if (!activeData.length) return null;
    let act = 0, inact = 0, zTrx = 0;
    activeData.forEach(d => { if (String(d.zeusStatus).toUpperCase() === 'ACTIVE') act++; else inact++; if (d.mtdBs <= 0) zTrx++; });
    const totPts = activeData.reduce((a, c) => a + (c.campaignPoint || 0), 0);
    
    // NEW: Hitung otomatis bulan berjalan untuk data MCA Disbursed
    const today = new Date();
    const curEn = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'][today.getMonth()];
    const curId = ['jan','feb','mar','apr','mei','jun','jul','agu','sep','okt','nov','des'][today.getMonth()];
    const curNum2 = String(today.getMonth() + 1).padStart(2, '0');

    const disbursedCurrent = activeData.filter(c => {
        if (!(c.mcaAmount > 0)) return false;
        if (!c.disbursedDate || String(c.disbursedDate).trim() === '-') return false;
        const dStr = String(c.disbursedDate).toLowerCase();
        // Cek berbagai format: "Mar", "Maret", "-03-", "/03/", ".03."
        return dStr.includes(curEn) || dStr.includes(curId) || dStr.includes(`-${curNum2}-`) || dStr.includes(`/${curNum2}/`) || dStr.includes(`.${curNum2}.`);
    });

    return {
      lm: activeData.reduce((a, c) => a + c.lmBs, 0), rr: activeData.reduce((a, c) => a + c.rrBs, 0), mtd: activeData.reduce((a, c) => a + c.mtdBs, 0),
      miLm: activeData.reduce((a, c) => a + (c.lmMi || 0), 0), miRr: activeData.reduce((a, c) => a + (c.rrMi || 0), 0), miMtd: activeData.reduce((a, c) => a + (c.mtdMi || 0), 0),
      adsLm: activeData.reduce((a, c) => a + c.adsLM, 0), adsMtd: activeData.reduce((a, c) => a + c.adsTotal, 0), adsRr: activeData.reduce((a, c) => a + c.adsRR, 0),
      adsMobMtd: activeData.reduce((a, c) => a + (c.adsMob || 0), 0), adsWebMtd: activeData.reduce((a, c) => a + (c.adsWeb || 0), 0), adsDirMtd: activeData.reduce((a, c) => a + (c.adsDir || 0), 0),
      mcaDis: disbursedCurrent.reduce((a, c) => a + c.mcaAmount, 0), mcaDisCount: disbursedCurrent.length, 
      mcaEli: activeData.reduce((a, c) => a + (c.mcaWlLimit > 0 && !String(c.mcaWlClass).includes('Not') ? c.mcaWlLimit : 0), 0),
      joiners: campaignStats.joiners, totalMex: activeData.length, activeMex: act, inactiveMex: inact, zeroTrxMex: zTrx, totalPoints: totPts, avgPtsPerJoiner: campaignStats.joiners > 0 ? Math.round(totPts / campaignStats.joiners) : 0
    };
  }, [activeData, campaignStats]);

  const chartsData = useMemo(() => {
    let g = 0, d = 0, s = 0; activeData.forEach(x => { if (x.rrBs > x.lmBs * 1.05) g++; else if (x.rrBs < x.lmBs * 0.95) d++; else s++; });
    const tot = Math.max(1, g + d + s);
    return { mtd: [...activeData].sort((a, b) => b.mtdBs - a.mtdBs).slice(0, 10), ads: [...activeData].sort((a, b) => b.adsLM - a.adsLM).slice(0, 10), health: [ { name: 'Growing', count: g, percentage: ((g/tot)*100).toFixed(0), color: '#00B14F' }, { name: 'Declining', count: d, percentage: ((d/tot)*100).toFixed(0), color: COLORS.decline }, { name: 'Stable', count: s, percentage: ((s/tot)*100).toFixed(0), color: COLORS.finance } ] };
  }, [activeData]);

  const compareChartData = useMemo(() => {
    if (!selectedMex || !selectedMex.history) return [];
    return compareMonths.map(m => selectedMex.history.find(h => h.month === m)).filter(Boolean).sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [selectedMex, compareMonths]);

  const filtered = useMemo(() => {
    let res = activeData.filter(d => (String(d.name).toLowerCase().includes(searchTerm.toLowerCase()) || String(d.id).toLowerCase().includes(searchTerm.toLowerCase())) && (selectedPriority === 'All' || d.mcaPriority === selectedPriority));
    if (sortConfig) {
      res.sort((a, b) => {
        let aV = a[sortConfig.key], bV = b[sortConfig.key];
        if (typeof aV === 'string') { aV = aV.toLowerCase(); bV = bV.toLowerCase(); }
        
        if (sortConfig.key === 'campaigns') { 
            const checkCamp = (c) => c && c !== '-' && c !== '0' && !String(c).toLowerCase().includes('no campaign') ? 1 : 0;
            aV = checkCamp(a.campaigns); 
            bV = checkCamp(b.campaigns); 
        }
        
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
    if (!campaignStr || campaignStr === '-' || campaignStr === '0' || String(campaignStr).toLowerCase().includes('no campaign')) { 
      if (hideEmpty) return null; return <span className="text-slate-400 text-[10px] font-semibold italic block mt-1">Tidak ada partisipasi campaign.</span>; 
    }
    const camps = String(campaignStr).split(/[|,]/).map(c => c.trim()).filter(Boolean);
    return (
        <div className="flex flex-wrap gap-1 mt-1.5">
            {camps.map((camp, idx) => (
                <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 shadow-sm max-w-full">
                    <Zap className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{camp}</span>
                </span>
            ))}
        </div>
    );
  };

  // 3. EARLY RETURNS
  if (isInitializing) return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'dark-theme' : 'bg-[#f8fafc]'}`}>
          <ThemeStyles />
          <div className="animate-pulse flex flex-col items-center">
              <Activity className="w-12 h-12 text-[#00B14F] mb-4" />
              <h2 className="font-bold text-slate-500 uppercase tracking-widest">Menyiapkan Dashboard...</h2>
          </div>
      </div>
  );

  if (data.length === 0 || isForceUpload) {
      return (
        <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans ${isDarkMode ? 'dark-theme' : 'bg-slate-900 text-slate-800'}`}>
          <ThemeStyles />
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

  if (showPresentation && selectedMex) {
      const lastHist = selectedMex.history && selectedMex.history.length > 0 ? selectedMex.history[selectedMex.history.length-1] : null;

      return (
          <div className={`fixed inset-0 z-[9999] overflow-y-auto font-sans flex flex-col hide-scrollbar animate-in slide-in-from-bottom-full duration-500 ease-out ${isDarkMode ? 'dark-theme' : 'bg-slate-50'}`}>
              <ThemeStyles />
              <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#00B14F] rounded-lg md:rounded-xl flex items-center justify-center shadow-md shrink-0">
                        <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="min-w-0 pr-2">
                        <h1 className="text-sm md:text-lg font-black text-slate-900 leading-tight truncate">Laporan Partner Grab</h1>
                        <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest truncate">{selectedMex.name}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2 shrink-0">
                     {selectedMex.phone && selectedMex.phone !== '-' && (
                         <button onClick={handleShareReport} disabled={isCapturing} className="hidden sm:flex px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded-xl transition-colors items-center gap-2 shadow-md shadow-[#25D366]/20 active:scale-95 disabled:opacity-70">
                             {isCapturing ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                             {isCapturing ? 'Memotret...' : 'Kirim WA'}
                         </button>
                     )}
                     <button onClick={() => setShowPresentation(false)} className="px-3 md:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] md:text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center gap-1.5 md:gap-2">
                         <X size={16} /> <span className="hidden sm:inline">Tutup</span>
                     </button>
                 </div>
              </div>

              <div className="max-w-6xl mx-auto w-full p-4 md:p-10 flex-1 flex flex-col">
                 
                 {/* KONTEN YANG AKAN DI-SCREENSHOT */}
                 <div ref={presentationRef} className="space-y-6 md:space-y-8 bg-slate-50 p-2 md:p-6 rounded-3xl">
                     <div className="text-center space-y-3 mb-8 pt-4">
                         <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Halo, {selectedMex.ownerName !== '-' ? selectedMex.ownerName : 'Kak'}</h2>
                         <p className="text-sm text-slate-500 font-medium max-w-2xl mx-auto">Berikut adalah ringkasan performa <strong className="text-slate-700">{selectedMex.name}</strong> saat ini.</p>
                     </div>

                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                         {/* Card 1: Omset */}
                         <MetricCard 
                            title="Estimasi Omset" 
                            value={formatCurrencyFull(selectedMex.rrBs)} 
                            icon={Activity} 
                            colorClass="bg-emerald-50 text-emerald-600" 
                            gradientClass="from-emerald-400 to-teal-500" 
                            subText={selectedMex.rrBs > selectedMex.lmBs ? 'Naik' : 'Turun'} 
                            subValue={`${Math.abs(((selectedMex.rrBs - selectedMex.lmBs)/selectedMex.lmBs)*100 || 0).toFixed(1)}% vs Bulan Lalu`} 
                         />
                         
                         {/* Card 2: Pesanan */}
                         <MetricCard 
                            title="Total Pesanan" 
                            value={lastHist ? `${lastHist.completed_orders} Orders` : '-'} 
                            icon={ShoppingBag} 
                            colorClass="bg-blue-50 text-blue-600" 
                            gradientClass="from-blue-400 to-indigo-500" 
                            subText="Bulan lalu" 
                         />

                         {/* Card 3: AOV */}
                         <MetricCard 
                            title="Rata-rata Nilai Pesanan" 
                            value={lastHist ? formatCurrencyFull(lastHist.aov) : '-'} 
                            icon={Target} 
                            colorClass="bg-purple-50 text-purple-600" 
                            gradientClass="from-purple-400 to-pink-500" 
                            subText="Nilai per transaksi" 
                         />
                         
                         {/* Card 4: Minat Promo */}
                         <MetricCard 
                            title="Tingkat Minat Promo" 
                            value={lastHist ? `${lastHist.promo_order_pct}%` : '-'} 
                            icon={ThumbsUp} 
                            colorClass="bg-amber-50 text-amber-600" 
                            gradientClass="from-amber-400 to-orange-500" 
                            subText="Pesanan dengan diskon" 
                         />

                         {/* Card 5: ROAS Iklan (BARU) */}
                         <MetricCard 
                            title="Return On Ad Spend" 
                            value={lastHist && lastHist.ads_total_hist > 0 ? `${(lastHist.ads_sales / lastHist.ads_total_hist).toFixed(1)}x` : '-'} 
                            icon={Megaphone} 
                            colorClass="bg-rose-50 text-rose-600" 
                            gradientClass="from-rose-400 to-red-500" 
                            subText="Performa iklan bulan lalu" 
                         />

                         {/* Card 6: Pesanan dari Iklan (BARU) */}
                         <MetricCard 
                            title="Pesanan dari Iklan" 
                            value={lastHist && lastHist.ads_orders > 0 ? `${lastHist.ads_orders} Orders` : '-'} 
                            icon={MousePointer} 
                            colorClass="bg-cyan-50 text-cyan-600" 
                            gradientClass="from-cyan-400 to-blue-500" 
                            subText={lastHist && lastHist.completed_orders > 0 && lastHist.ads_orders > 0 ? `${((lastHist.ads_orders / lastHist.completed_orders) * 100).toFixed(1)}% dari total pesanan` : 'Bulan lalu'} 
                         />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-4">
                         {/* PENAWARAN 1: GRAB MODAL (Muncul jika punya limit) */}
                         {selectedMex.mcaWlLimit > 0 && !String(selectedMex.mcaWlClass).includes('Not') && (
                             <div className="bg-white rounded-[28px] p-6 border border-amber-200 shadow-[0_8px_30px_rgb(245,158,11,-0.15)] flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                 <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-bl-full opacity-60 -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                                 
                                 <div className="flex items-start gap-4 mb-6 relative z-10">
                                     <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                                         <Database size={28} />
                                     </div>
                                     <div className="flex-1">
                                         <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-lg mb-2">Penawaran Spesial</span>
                                         <h4 className="text-lg md:text-xl font-black text-slate-900 leading-tight mb-1">Grab Modal Mantul</h4>
                                         <p className="text-xs text-slate-500 font-medium leading-relaxed">Toko Anda terpilih mendapatkan fasilitas dana siaga untuk ekspansi bisnis.</p>
                                     </div>
                                 </div>
                                 
                                 <div className="mt-auto bg-amber-50/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-amber-100 relative z-10">
                                     <div>
                                         <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-0.5">Limit Maksimal</p>
                                         <p className="text-[10px] text-amber-600/80 font-medium">Bisa dicairkan kapan saja</p>
                                     </div>
                                     <div className="text-xl md:text-2xl font-black text-amber-600 text-left sm:text-right">
                                         {formatCurrencyFull(selectedMex.mcaWlLimit)}
                                     </div>
                                 </div>
                             </div>
                         )}

                         {/* PENAWARAN 2: CAMPAIGN / ADS (Beradaptasi otomatis 4 Level Funneling) */}
                         {(() => {
                             const campsRaw = (!selectedMex.campaigns || selectedMex.campaigns === '-' || selectedMex.campaigns === '0' || String(selectedMex.campaigns).toLowerCase().includes('no'))
                                 ? []
                                 : String(selectedMex.campaigns).split(/[|,]/).map(c => c.trim().toLowerCase()).filter(Boolean);

                             const isMainCamp = (c) => c.includes('booster') || c.includes('cuan') || c.includes('gms');
                             const hasMainCampaign = campsRaw.some(isMainCamp);
                             const hasLocalCampaign = campsRaw.some(c => !isMainCamp(c));
                             const isNoAds = (selectedMex.adsTotal || 0) <= 0 && (selectedMex.adsLM || 0) <= 0;
                             
                             let title = ''; let desc = ''; let statusLabel = ''; let statusValue = ''; let icon = null; let theme = {};

                             if (!hasMainCampaign) {
                                 title = 'Gabung Diskon Puas'; desc = 'Tingkatkan visibilitas toko & pikat lebih banyak pelanggan baru di kota Anda.'; statusLabel = 'Status Campaign'; statusValue = 'Belum Aktif'; icon = <Zap size={28} />;
                                 theme = { from: 'from-purple-500', to: 'to-pink-500', shadow: 'shadow-purple-500/30', glow: 'shadow-[0_8px_30px_rgba(168,85,247,0.15)]', border: 'border-purple-200', tagBg: 'bg-purple-100', tagText: 'text-purple-700', boxBg: 'bg-purple-50/80', boxBorder: 'border-purple-100', valText: 'text-purple-600', valLabel: 'text-purple-500' };
                             } else if (!hasLocalCampaign) {
                                 title = 'Ikuti Local Campaign'; desc = 'Maksimalkan momentum dengan promo taktis khusus wilayah sekitar restoran Anda.'; statusLabel = 'Local Promo'; statusValue = 'Belum Aktif'; icon = <Target size={28} />;
                                 theme = { from: 'from-blue-500', to: 'to-cyan-500', shadow: 'shadow-blue-500/30', glow: 'shadow-[0_8px_30px_rgba(59,130,246,0.15)]', border: 'border-blue-200', tagBg: 'bg-blue-100', tagText: 'text-blue-700', boxBg: 'bg-blue-50/80', boxBorder: 'border-blue-100', valText: 'text-blue-600', valLabel: 'text-blue-500' };
                             } else if (isNoAds) {
                                 title = 'Maksimalkan Iklan (Ads)'; desc = 'Toko Anda sudah punya promo menarik lengkap, yuk boost posisi agar selalu tampil teratas!'; statusLabel = 'Status Iklan'; statusValue = 'Belum Aktif'; icon = <Megaphone size={28} />;
                                 theme = { from: 'from-orange-400', to: 'to-red-500', shadow: 'shadow-orange-500/30', glow: 'shadow-[0_8px_30px_rgba(249,115,22,0.15)]', border: 'border-orange-200', tagBg: 'bg-orange-100', tagText: 'text-orange-700', boxBg: 'bg-orange-50/80', boxBorder: 'border-orange-100', valText: 'text-orange-600', valLabel: 'text-orange-500' };
                             } else {
                                 title = 'Top Performance Partner 🏆'; desc = 'Luar biasa! Anda telah memaksimalkan Campaign & Iklan. Pertahankan momentum juara ini.'; statusLabel = 'Status Toko'; statusValue = 'All-Star Active'; icon = <Award size={28} />;
                                 theme = { from: 'from-emerald-400', to: 'to-teal-500', shadow: 'shadow-emerald-500/30', glow: 'shadow-[0_8px_30px_rgba(16,185,129,0.15)]', border: 'border-emerald-200', tagBg: 'bg-emerald-100', tagText: 'text-emerald-700', boxBg: 'bg-emerald-50/80', boxBorder: 'border-emerald-100', valText: 'text-emerald-600', valLabel: 'text-emerald-500' };
                             }

                             return (
                                 <div className={`bg-white rounded-[28px] p-6 border ${theme.border} ${theme.glow} flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${(!selectedMex.mcaWlLimit || String(selectedMex.mcaWlClass).includes('Not')) ? 'md:col-span-2 md:w-2/3 md:mx-auto' : ''}`}>
                                     <div className={`absolute top-0 right-0 w-40 h-40 ${theme.boxBg} rounded-bl-full opacity-60 -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform duration-700`}></div>
                                     
                                     <div className="flex items-start gap-4 mb-6 relative z-10">
                                         <div className={`w-14 h-14 bg-gradient-to-br ${theme.from} ${theme.to} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${theme.shadow}`}>
                                             {icon}
                                         </div>
                                         <div className="flex-1">
                                             <span className={`inline-block px-2.5 py-1 ${theme.tagBg} ${theme.tagText} text-[9px] font-black uppercase tracking-widest rounded-lg mb-2`}>
                                                Rekomendasi Utama
                                             </span>
                                             <h4 className="text-lg md:text-xl font-black text-slate-900 leading-tight mb-1">{title}</h4>
                                             <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
                                         </div>
                                     </div>

                                     <div className={`mt-auto ${theme.boxBg} rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border ${theme.boxBorder} relative z-10`}>
                                         <div>
                                             <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.valLabel} mb-0.5`}>{statusLabel}</p>
                                             <p className={`text-[10px] ${theme.valText} opacity-80 font-medium`}>Tinjauan performa saat ini</p>
                                         </div>
                                         <div className={`text-base md:text-lg font-black ${theme.valText} text-left sm:text-right`}>
                                             {statusValue}
                                         </div>
                                     </div>
                                 </div>
                             );
                         })()}
                     </div>

                     {selectedMex.history && selectedMex.history.length > 0 && (
                         <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 mt-8">
                             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6"><TrendingUp className="text-[#00B14F] w-5 h-5"/> Perjalanan Bisnis (12 Bulan)</h3>
                             <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={selectedMex.history.slice(-12)}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00B14F" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#00B14F" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" tickFormatter={formatMonth} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis tickFormatter={(v) => `${(v/1000000).toFixed(0)}Jt`} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} axisLine={false} tickLine={false} dx={-10} />
                                        <RechartsTooltip cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}} formatter={(v) => formatCurrencyFull(v)} labelFormatter={formatMonth}/>
                                        <Area type="monotone" dataKey="basket_size" name="Total Omset" stroke="#00B14F" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                             </div>
                         </div>
                     )}
                 </div>

                  {/* BOTTOM ACTION BUTTON */}
                  <div className="flex justify-center mt-12 pb-8">
                      {selectedMex.phone && selectedMex.phone !== '-' ? (
                          <button onClick={handleShareReport} disabled={isCapturing} className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 md:px-10 py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-[#25D366]/30 flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-95 w-full sm:w-auto disabled:opacity-70 disabled:hover:-translate-y-0 disabled:cursor-wait">
                              {isCapturing ? <Loader2 size={24} className="animate-spin" /> : <Camera size={24} />} 
                              {isCapturing ? 'Memproses Visual...' : 'Unduh Visual & Kirim WA'}
                          </button>
                      ) : (
                          <div className="bg-slate-100 text-slate-400 px-6 md:px-10 py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest border border-slate-200 flex items-center justify-center gap-3 w-full sm:w-auto text-center">
                              <Phone size={24} /> Nomor WhatsApp Tidak Tersedia
                          </div>
                      )}
                  </div>

              </div>
          </div>
      );
  }
  // --- END PRESENTATION MODE ---

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark-theme' : ''} bg-[#f8fafc] text-slate-900 flex flex-col font-sans overflow-hidden relative transition-colors duration-300`}>
      <ThemeStyles />
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center overflow-hidden">
         <div className="absolute inset-0 bg-grid-pattern"></div>
         <div className="absolute left-0 right-0 top-[-10%] md:top-[-20%] -z-10 m-auto h-[300px] w-[300px] md:h-[600px] md:w-[600px] rounded-full blur-[100px] glow-effect"></div>
         <div className="absolute inset-x-0 bottom-0 h-[40vh] fade-bottom"></div>
      </div>

      {/* --- ALL MODALS --- */}
      <Modal isOpen={!!(showWaModal && selectedMex)} onClose={() => setShowWaModal(false)} title="Pesan WhatsApp" icon={MessageCircle} iconColor="text-[#00B14F]" maxWidth="max-w-md" subtitle="*Teks dipilih acak (Anti-Spam)">
          <div className="p-5 md:p-6 bg-[#f8fafc] space-y-3">
             <button onClick={() => handleSendWA('general')} className="w-full text-left p-4 bg-white border border-slate-200 hover:border-[#00B14F] hover:shadow-md rounded-2xl transition-all group">
                 <p className="font-bold text-sm text-slate-800 group-hover:text-[#00B14F] mb-1">Review Performa (General)</p>
                 <p className="text-xs text-slate-500 line-clamp-2">Ada 5 variasi pesan sapaan untuk diskusi performa secara umum dengan owner...</p>
             </button>
             <button onClick={() => handleSendWA('promo')} className="w-full text-left p-4 bg-white border border-slate-200 hover:border-[#00B14F] hover:shadow-md rounded-2xl transition-all group">
                 <p className="font-bold text-sm text-slate-800 group-hover:text-[#00B14F] mb-1 flex items-center gap-1.5"><Zap size={14} className="text-amber-500"/> Penawaran Promo</p>
                 <p className="text-xs text-slate-500 line-clamp-2">Ada 5 variasi pesan untuk mengajak merchant mengikuti program promo/campaign...</p>
             </button>
             {selectedMex?.mcaWlLimit > 0 && !String(selectedMex?.mcaWlClass).includes('Not') && (
                 <button onClick={() => handleSendWA('mca')} className="w-full text-left p-4 bg-blue-50 border border-blue-200 hover:border-blue-500 hover:shadow-md rounded-2xl transition-all group">
                     <p className="font-bold text-sm text-blue-800 group-hover:text-blue-600 mb-1 flex items-center gap-1.5"><Database size={14} className="text-blue-500"/> Info Limit MCA</p>
                     <p className="text-xs text-blue-600/80 line-clamp-2">Ada 5 variasi pesan untuk menginfokan fasilitas pinjaman senilai {formatCurrency(selectedMex?.mcaWlLimit || 0)}...</p>
                 </button>
             )}
             {selectedMex?.zeusStatus !== 'ACTIVE' && (
                 <button onClick={() => handleSendWA('inactive')} className="w-full text-left p-4 bg-rose-50 border border-rose-200 hover:border-rose-500 hover:shadow-md rounded-2xl transition-all group">
                     <p className="font-bold text-sm text-rose-800 group-hover:text-rose-600 mb-1 flex items-center gap-1.5"><AlertCircle size={14} className="text-rose-500"/> Follow-up Toko Offline</p>
                     <p className="text-xs text-rose-600/80 line-clamp-2">Ada 5 variasi sapaan untuk menanyakan kendala toko yang sedang inactive/offline...</p>
                 </button>
             )}
          </div>
      </Modal>

      <Modal isOpen={activeSegmentModal !== null} onClose={() => setActiveSegmentModal(null)} title={`Segmen: ${activeSegmentModal}`} icon={Target} iconColor="text-[#00B14F]" subtitle={`Daftar ${filteredSegmentMerchants.length} merchant dalam kategori ini`}>
          <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar bg-[#f8fafc]">
             {filteredSegmentMerchants.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200"><Store className="w-10 h-10 mb-3 opacity-30" /><p className="text-xs font-bold uppercase tracking-widest">Kosong</p></div>
             ) : (
               <div className="grid grid-cols-1 gap-3">
                  {filteredSegmentMerchants.map((mex, idx) => (
                     <div key={mex.id} style={{ animationDelay: `${idx * 30}ms` }} onClick={() => { setSelectedMex(mex); setActiveSegmentModal(null); setActiveTab('overview'); }} className="animate-fade-in-up flex justify-between items-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#00B14F] hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer transition-all duration-300 group">
                        <div className="min-w-0 pr-4">
                           <p className="font-bold text-sm md:text-base text-slate-800 group-hover:text-[#00B14F] truncate transition-colors">{mex.name}</p>
                           <div className="-mt-0.5">{renderMerchantCampaigns(mex.campaigns)}</div>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end">
                           <p className="font-black text-sm md:text-base text-slate-800">{formatCurrency(mex.mtdBs)}</p>
                           <div className="flex items-center gap-1.5 mt-1">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">MTD Sales</p>
                              <span className={`flex items-center gap-0.5 px-1 py-0.5 rounded-md text-[8px] font-black border ${mex.campaignPoint > 0 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`} title="Campaign Points"><Award size={10} /> {mex.campaignPoint || 0}</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
             )}
          </div>
      </Modal>

      <Modal isOpen={showMcaModal} onClose={() => setShowMcaModal(false)} title="Merchant Pencairan MCA" icon={Database} iconColor="text-amber-500" subtitle={`Daftar ${disbursedMerchants.length} merchant yang telah mencairkan dana`}>
          <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar bg-[#f8fafc]">
             {disbursedMerchants.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200"><Store className="w-10 h-10 mb-3 opacity-30" /><p className="text-xs font-bold uppercase tracking-widest">Belum ada pencairan</p></div>
             ) : (
               <div className="grid grid-cols-1 gap-3">
                  {disbursedMerchants.map((mex, idx) => {
                     const isPending = mex.mcaDisburseStatus && String(mex.mcaDisburseStatus).toLowerCase().includes('pending');
                     return (
                     <div key={mex.id} style={{ animationDelay: `${idx * 30}ms` }} onClick={() => { setSelectedMex(mex); setShowMcaModal(false); setActiveTab('overview'); }} className={`animate-fade-in-up flex justify-between items-center p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer transition-all duration-300 group ${isPending ? 'hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10' : 'hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10'}`}>
                        <div className="min-w-0 pr-4 flex-1">
                           <div className="flex items-center gap-2 min-w-0">
                              {mex.mcaPriority && mex.mcaPriority !== '-' && (<span className={`px-1.5 py-0.5 rounded text-[9px] font-black shrink-0 border ${getPriorityBadgeClass(mex.mcaPriority)}`}>{mex.mcaPriority}</span>)}
                              <p className={`font-bold text-sm md:text-base text-slate-800 truncate transition-colors ${isPending ? 'group-hover:text-blue-600' : 'group-hover:text-amber-600'}`}>{mex.name}</p>
                           </div>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] font-black text-white bg-indigo-600/[0.65] border border-indigo-700/[0.65] px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1 shadow-sm backdrop-blur-sm"><Users size={10} className="text-indigo-100" /> {getShortAMName(mex.amName)}</span>
                              {mex.disbursedDate && String(mex.disbursedDate).trim() !== '-' && (<span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest text-white shadow-sm backdrop-blur-sm ${isPending ? 'bg-blue-600/[0.65] border-blue-700/[0.65]' : 'bg-amber-600/[0.65] border-amber-700/[0.65]'}`}>{mex.disbursedDate}</span>)}
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
      </Modal>

      <Modal isOpen={!!(showMiModal && kpi)} onClose={() => setShowMiModal(false)} title="Investment Ratio (MI/BS)" icon={Percent} iconColor="text-teal-500" subtitle="Detail persentase beban promo terhadap omset merchant">
          <div className="p-4 md:p-6 bg-[#f8fafc] space-y-5 custom-scrollbar overflow-y-auto max-h-[75vh]">
             <div className="bg-white rounded-[28px] p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-6 animate-fade-in-up stagger-1">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full opacity-50 -mr-8 -mt-8 pointer-events-none"></div>
                 <div className="flex-1 w-full relative z-10 text-center md:text-left">
                     <p className="text-[11px] font-black text-teal-600 uppercase tracking-widest mb-2 flex items-center justify-center md:justify-start gap-1.5"><Activity size={14}/> Projected Ratio</p>
                     <div className="flex items-baseline justify-center md:justify-start gap-1 mb-2">
                         <span className="text-6xl font-black text-slate-800 tracking-tighter">{kpi?.rr ? ((kpi.miRr / kpi.rr) * 100).toFixed(1) : 0}</span>
                         <span className="text-3xl font-black text-slate-400">%</span>
                     </div>
                     <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
                         Diproyeksikan bahwa beban investasi (MI) akan memakan <strong className="text-slate-700">{kpi?.rr ? ((kpi.miRr / kpi.rr) * 100).toFixed(1) : 0}%</strong> dari total Omset bulan ini.
                     </p>
                 </div>
                 <div className="flex-1 w-full flex flex-col gap-4 relative z-10 border-t md:border-t-0 md:border-l border-slate-100 pt-5 md:pt-0 md:pl-6">
                     <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><TrendingUp size={12}/> Projected Sales (BS)</p>
                         <p className="text-xl md:text-2xl font-black text-slate-800">{formatCurrency(kpi?.rr || 0)}</p>
                     </div>
                     <div>
                         <p className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mb-1 flex items-center gap-1"><DollarSign size={12}/> Projected Invest (MI)</p>
                         <p className="text-xl md:text-2xl font-black text-teal-600">{formatCurrency(kpi?.miRr || 0)}</p>
                     </div>
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in-up stagger-2">
                 <div className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-colors">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Last Month</p>
                     <div className="flex justify-between items-end mb-2"><span className="text-4xl font-black text-slate-700 tracking-tight">{kpi?.lm ? ((kpi.miLm / kpi.lm) * 100).toFixed(1) : 0}%</span></div>
                     <div className="w-full bg-slate-100 rounded-full h-2.5 mb-5 overflow-hidden"><div className="bg-slate-400 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, kpi?.lm ? ((kpi.miLm / kpi.lm) * 100) : 0)}%` }}></div></div>
                     <div className="space-y-2.5 pt-4 border-t border-slate-50">
                         <div className="flex justify-between items-center text-xs"><span className="text-slate-500 font-medium">Sales (BS)</span><span className="font-bold text-slate-800">{formatCurrency(kpi?.lm || 0)}</span></div>
                         <div className="flex justify-between items-center text-xs"><span className="text-slate-500 font-medium">Invest (MI)</span><span className="font-bold text-slate-600">{formatCurrency(kpi?.miLm || 0)}</span></div>
                     </div>
                 </div>
                 <div className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-teal-300 transition-colors">
                     <div className="flex justify-between items-center mb-3"><p className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12}/> MTD Actual</p></div>
                     <div className="flex justify-between items-end mb-2"><span className="text-4xl font-black text-teal-600 tracking-tight">{kpi?.mtd ? ((kpi.miMtd / kpi.mtd) * 100).toFixed(1) : 0}%</span></div>
                     <div className="w-full bg-teal-50 rounded-full h-2.5 mb-5 overflow-hidden"><div className="bg-teal-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, kpi?.mtd ? ((kpi.miMtd / kpi.mtd) * 100) : 0)}%` }}></div></div>
                     <div className="space-y-2.5 pt-4 border-t border-slate-50">
                         <div className="flex justify-between items-center text-xs"><span className="text-slate-500 font-medium">Sales (BS)</span><span className="font-bold text-slate-800">{formatCurrency(kpi?.mtd || 0)}</span></div>
                         <div className="flex justify-between items-center text-xs"><span className="text-slate-500 font-medium">Invest (MI)</span><span className="font-bold text-teal-600">{formatCurrency(kpi?.miMtd || 0)}</span></div>
                     </div>
                 </div>
             </div>
          </div>
      </Modal>

      <Modal isOpen={!!(showAdsModal && (kpi || selectedMex))} onClose={() => setShowAdsModal(false)} title="Ads Spend Breakdown" icon={Megaphone} iconColor="text-rose-500" subtitle={`Rincian alokasi biaya iklan ${selectedMex ? selectedMex.name : 'berdasarkan platform'}`}>
          <div className="p-4 md:p-6 bg-[#f8fafc] space-y-5 custom-scrollbar overflow-y-auto max-h-[75vh]">
             <div className="bg-white rounded-[28px] p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col gap-6 animate-fade-in-up stagger-1">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full opacity-50 -mr-8 -mt-8 pointer-events-none"></div>
                 {(() => {
                     const adsData = selectedMex ? { total: selectedMex.adsTotal || 0, rr: selectedMex.adsRR || 0, lm: selectedMex.adsLM || 0, mob: selectedMex.adsMob || 0, web: selectedMex.adsWeb || 0, dir: selectedMex.adsDir || 0 } : { total: kpi?.adsMtd || 0, rr: kpi?.adsRr || 0, lm: kpi?.adsLm || 0, mob: kpi?.adsMobMtd || 0, web: kpi?.adsWebMtd || 0, dir: kpi?.adsDirMtd || 0 };
                     
                     // MENARIK DATA MI (MERCHANT INVESTMENT)
                     const miData = selectedMex ? { lm: selectedMex.lmMi || 0, mtd: selectedMex.mtdMi || 0, rr: selectedMex.rrMi || 0 } : { lm: kpi?.miLm || 0, mtd: kpi?.miMtd || 0, rr: kpi?.miRr || 0 };
                     
                     const totalAds = adsData.total || 1; 
                     const mobPct = ((adsData.mob / totalAds) * 100).toFixed(1); const webPct = ((adsData.web / totalAds) * 100).toFixed(1); const dirPct = ((adsData.dir / totalAds) * 100).toFixed(1);

                     return (
                         <Fragment>
                             <div className="flex-1 w-full relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-slate-50/50 p-4 rounded-3xl border border-slate-100/50">
                                 <div className="flex-1 text-center">
                                     <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2 flex items-center justify-center gap-1.5"><Clock size={14}/> Last Month</p>
                                     <p className="text-2xl md:text-3xl font-black text-slate-400 tracking-tight">{formatCurrency(adsData.lm)}</p>
                                 </div>
                                 <div className="hidden sm:block w-px h-12 bg-slate-200"></div>
                                 <div className="flex-1 text-center scale-105">
                                     <p className="text-[11px] md:text-xs font-black text-rose-600 uppercase tracking-widest mb-1 md:mb-2 flex items-center justify-center gap-1.5"><Activity size={16}/> Total Ads (MTD)</p>
                                     <p className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{formatCurrency(adsData.total)}</p>
                                 </div>
                                 <div className="hidden sm:block w-px h-12 bg-slate-200"></div>
                                 <div className="flex-1 text-center">
                                     <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2 flex items-center justify-center gap-1.5"><TrendingUp size={14}/> Runrate</p>
                                     <p className="text-2xl md:text-3xl font-black text-slate-400 tracking-tight">{formatCurrency(adsData.rr)}</p>
                                 </div>
                             </div>

                             {/* BARIS BARU: RINGKASAN MERCHANT INVESTMENT (MI) */}
                             <div className="flex-1 w-full relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50 -mt-2">
                                 <div className="flex-1 text-center">
                                     <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 flex items-center justify-center gap-1"><Clock size={12}/> MI Last Month</p>
                                     <p className="text-lg md:text-xl font-black text-slate-500 tracking-tight">{formatCurrency(miData.lm)}</p>
                                 </div>
                                 <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
                                 <div className="flex-1 text-center">
                                     <p className="text-[10px] md:text-[11px] font-black text-teal-600 uppercase tracking-widest mb-0.5 flex items-center justify-center gap-1"><DollarSign size={14}/> Total MI (MTD)</p>
                                     <p className="text-xl md:text-2xl font-black text-teal-600 tracking-tight">{formatCurrency(miData.mtd)}</p>
                                 </div>
                                 <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
                                 <div className="flex-1 text-center">
                                     <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 flex items-center justify-center gap-1"><TrendingUp size={12}/> MI Runrate</p>
                                     <p className="text-lg md:text-xl font-black text-slate-500 tracking-tight">{formatCurrency(miData.rr)}</p>
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
      </Modal>

      <Modal isOpen={!!(showCampaignModal && selectedMex)} onClose={() => setShowCampaignModal(false)} title="Active Campaigns" icon={Award} iconColor="text-amber-500" subtitle={`Daftar program promo yang diikuti ${selectedMex?.name}`}>
          <div className="p-4 md:p-6 bg-[#f8fafc] custom-scrollbar overflow-y-auto max-h-[75vh]">
              {(() => {
                  const campsRaw = (!selectedMex?.campaigns || selectedMex.campaigns === '-' || selectedMex.campaigns === '0' || String(selectedMex.campaigns).toLowerCase().includes('no'))
                               ? []
                               : String(selectedMex.campaigns).split(/[|,]/).map(c => c.trim()).filter(Boolean);

                  if (campsRaw.length === 0) {
                      return (
                          <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-white rounded-[24px] border border-dashed border-slate-200">
                              <Award className="w-10 h-10 mb-3 opacity-20 text-amber-500" />
                              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Tidak ada campaign aktif</p>
                          </div>
                      );
                  }

                  return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {campsRaw.map((camp, idx) => (
                              <div key={idx} className="bg-white border border-slate-200 hover:border-amber-300 p-4 rounded-2xl shadow-sm flex items-center gap-3 animate-fade-in-up transition-colors group" style={{ animationDelay: `${idx * 50}ms` }}>
                                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 border border-amber-100 group-hover:bg-amber-100 transition-colors">
                                      <Zap className="w-5 h-5 text-amber-500" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                      <p className="font-bold text-slate-800 text-sm truncate">{camp}</p>
                                      <p className="text-[9px] font-black text-amber-50 uppercase tracking-widest mt-0.5">Active Program</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  );
              })()}
          </div>
      </Modal>

      <Modal isOpen={!!(showNotesModal && selectedMex)} onClose={() => setShowNotesModal(false)} title="Activity Log & Notes" icon={StickyNote} iconColor="text-amber-500" subtitle={`Catatan kunjungan untuk ${selectedMex?.name}`}>
          <div className="flex-1 flex flex-col sm:flex-row h-[75vh] md:h-[65vh] bg-[#f8fafc]">
              <div className="w-full sm:w-2/5 md:w-1/3 bg-white border-b sm:border-b-0 sm:border-r border-slate-200 p-4 md:p-6 flex flex-col gap-3 shrink-0 relative z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-2"><Plus className="w-4 h-4 text-amber-500"/> Tambah Catatan</h4>
                  <textarea 
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      placeholder="Tulis hasil meeting, keluhan merchant, atau rencana follow-up di sini..."
                      className="w-full flex-1 min-h-[120px] sm:min-h-0 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 font-medium focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all resize-none custom-scrollbar"
                  />
                  <button 
                      onClick={handleSaveNote}
                      disabled={!noteText.trim()}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 active:scale-95 shrink-0"
                  >
                      <Plus size={16}/> Simpan Catatan
                  </button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-slate-50/50 relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-bl-full opacity-40 pointer-events-none"></div>
                  {(!selectedMex?.notes || selectedMex.notes.length === 0) ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <FileText className="w-12 h-12 mb-3 opacity-20 text-amber-500" />
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Belum ada log aktivitas.</p>
                          <p className="text-sm text-slate-400 mt-1.5 font-medium text-center max-w-[250px]">Rekam jejak kunjungan dan kendala toko ini agar tidak lupa.</p>
                      </div>
                  ) : (
                      <div className="flex flex-col gap-3 relative z-10">
                          {selectedMex.notes.map((note, idx) => (
                              <div key={note.id} style={{ animationDelay: `${idx * 50}ms` }} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex gap-3.5 group hover:border-amber-300 transition-all hover:shadow-md animate-fade-in-up">
                                  <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center shrink-0 border border-amber-100 shadow-inner group-hover:bg-amber-100 transition-colors">
                                      <Calendar size={16} className="text-amber-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start mb-1 gap-2">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                              <Clock size={10}/> {new Date(note.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                          </p>
                                          <button onClick={() => handleDeleteNote(note.id)} className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg p-1.5 transition-colors sm:opacity-0 sm:group-hover:opacity-100 -mt-1 -mr-1" title="Hapus catatan">
                                              <Trash2 size={14}/>
                                          </button>
                                      </div>
                                      <p className="text-sm text-slate-700 font-medium whitespace-pre-wrap leading-relaxed break-words">{note.text}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      </Modal>

      <Modal isOpen={showOutletsModal} onClose={() => setShowOutletsModal(false)} title="Outlets Attention" icon={Store} iconColor="text-blue-500" subtitle="Daftar merchant yang perlu perhatian khusus">
          <div className="flex px-5 pt-4 gap-2 bg-[#f8fafc] border-b border-slate-100 shrink-0">
              <button onClick={() => setOutletModalTab('inactive')} className={`px-4 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-t-xl transition-all border-b-2 ${outletModalTab === 'inactive' ? 'border-slate-800 text-slate-800 bg-white shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Inactive ({kpi?.inactiveMex || 0})</button>
              <button onClick={() => setOutletModalTab('zerotrx')} className={`px-4 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-t-xl transition-all border-b-2 ${outletModalTab === 'zerotrx' ? 'border-rose-500 text-rose-600 bg-rose-50' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>0-Trx MTD ({kpi?.zeroTrxMex || 0})</button>
          </div>
          <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar bg-[#f8fafc]">
             {(() => {
                 const displayList = outletModalTab === 'inactive' ? inactiveMerchants : zeroTrxMerchants;
                 if (displayList.length === 0) return (<div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200"><CheckCircle className="w-10 h-10 mb-3 opacity-30 text-emerald-500" /><p className="text-[11px] font-bold uppercase tracking-widest">Semua Aman!</p></div>);
                 return (
                     <div className="grid grid-cols-1 gap-3">
                        {displayList.map((mex, idx) => (
                            <div key={mex.id} style={{ animationDelay: `${idx * 30}ms` }} onClick={() => { setSelectedMex(mex); setShowOutletsModal(false); setActiveTab('overview'); }} className={`animate-fade-in-up flex justify-between items-center p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer transition-all duration-300 group hover:shadow-lg ${outletModalTab === 'inactive' ? 'hover:border-slate-400 hover:shadow-slate-500/10' : 'hover:border-rose-400 hover:shadow-rose-500/10'}`}>
                                <div className="min-w-0 pr-4 flex-1">
                                    <p className={`font-bold text-sm md:text-base text-slate-800 truncate transition-colors ${outletModalTab === 'inactive' ? 'group-hover:text-blue-600' : 'group-hover:text-rose-600'}`}>{mex.name}</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className="text-[9px] font-black text-white bg-indigo-600/[0.65] border border-indigo-700/[0.65] px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1 shadow-sm backdrop-blur-sm"><Users size={10} className="text-indigo-100" /> {getShortAMName(mex.amName)}</span>
                                        {outletModalTab === 'zerotrx' && (<span className="text-[9px] font-bold text-white bg-slate-600/[0.65] px-1.5 py-0.5 rounded border border-slate-700/[0.65] uppercase tracking-widest shadow-sm backdrop-blur-sm" title="Omset Bulan Lalu">LM: {formatCurrency(mex.lmBs)}</span>)}
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
      </Modal>

      <Modal isOpen={!!(showCompareModal && selectedMex)} onClose={() => setShowCompareModal(false)} title="Performance Comparison" icon={BarChart2} iconColor="text-indigo-500" subtitle={selectedMex?.name} maxWidth="max-w-4xl">
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 custom-scrollbar flex flex-col">
              {compareChartData.length > 0 && (
                  <div className="mb-4 md:mb-6 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm animate-fade-in-up shrink-0" style={{ animationDelay: '100ms' }}>
                      <h4 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2"><Activity className="text-[#00B14F] w-4 h-4"/> Grafik Tren Sales, Invest, AOV & Orders</h4>
                      <div className="h-[200px] md:h-[250px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={compareChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} dy={5} />
                                  <YAxis yAxisId="left" tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(0)}M` : `${(v/1000).toFixed(0)}K`} tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} width={40} />
                                  <YAxis yAxisId="aov" orientation="right" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} tick={{ fill: '#3b82f6', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} width={35} />
                                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#f59e0b', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} width={25} />
                                  <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v, name) => [name === 'Orders' ? v : formatCurrency(v), name]} labelFormatter={formatMonth}/>
                                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold' }} iconType="circle" />
                                  
                                  <Bar yAxisId="left" dataKey="net_sales" stackId="a" name="Net Sales" fill="#10b981" maxBarSize={40} />
                                  <Bar yAxisId="left" dataKey="total_investment" stackId="a" name="Total Invest" fill="#f43f5e" radius={[4,4,0,0]} maxBarSize={40} />
                                  <Bar yAxisId="aov" dataKey="aov" name="AOV" fill="#3b82f6" radius={[4,4,0,0]} maxBarSize={40} />
                                  <Bar yAxisId="right" dataKey="completed_orders" name="Orders" fill="#f59e0b" radius={[4,4,0,0]} maxBarSize={40} />
                              </ComposedChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              )}

              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 text-center md:hidden animate-pulse flex items-center justify-center gap-1.5"><ChevronLeft size={12}/> Geser kartu untuk membandingkan <ChevronRight size={12}/></p>
              <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-3 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 hide-scrollbar shrink-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {[0, 1, 2].map((idx) => {
                      const selectedMonth = compareMonths[idx];
                      const hist = selectedMex?.history?.find(h => h.month === selectedMonth);
                      const getGrowth = (current, previous) => { if (!previous || previous === 0) return 0; return ((current - previous) / previous) * 100; };
                      let prev = null;
                      if (hist) {
                          const currentIndex = selectedMex.history.findIndex(h => h.month === selectedMonth);
                          if (currentIndex > 0) prev = selectedMex.history[currentIndex - 1];
                      }
                      const renderGrowthBadge = (val, invert = false) => {
                          if (!val || val === 0) return null; const isUp = val > 0; const isGood = invert ? !isUp : isUp;
                          return (<span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-black shadow-sm ${isGood ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>{isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {Math.abs(val).toFixed(1)}%</span>);
                      };

                      return (
                          <div key={idx} className="w-[200px] sm:w-[240px] md:w-auto md:flex-1 shrink-0 snap-center bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-3 md:p-5 shadow-sm flex flex-col relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${300 + (idx * 100)}ms` }}>
                              <div className="mb-3 md:mb-5 relative z-10">
                                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 md:mb-2">Bulan {idx + 1}</label>
                                  <select 
                                      value={selectedMonth}
                                      onChange={(e) => { const newMonths = [...compareMonths]; newMonths[idx] = e.target.value; setCompareMonths(newMonths); }}
                                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs md:text-sm font-bold rounded-lg md:rounded-xl px-2 py-1.5 md:px-3 md:py-2 focus:outline-none focus:border-indigo-400 transition-colors cursor-pointer"
                                  >
                                      <option value="">-- Pilih Bulan --</option>
                                      {selectedMex && [...selectedMex.history].reverse().map(h => (<option key={h.month} value={h.month}>{formatMonth(h.month)}</option>))}
                                  </select>
                              </div>

                              {hist ? (
                                  <div className="relative z-10 flex flex-col mt-auto gap-2.5 md:gap-4">
                                      <div className="bg-emerald-600/70 border border-emerald-500/50 rounded-xl md:rounded-2xl p-2.5 md:p-4 flex flex-col items-center justify-center text-center shadow-inner backdrop-blur-sm relative overflow-hidden">
                                          <div className="absolute top-0 right-0 w-12 h-12 md:w-16 h-16 bg-white/10 rounded-bl-full opacity-50 -mr-2 -mt-2 pointer-events-none"></div>
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
      </Modal>

      {/* HEADER SECTION - DIPERBAIKI UNTUK MENCEGAH AUTO DARK MODE */}
      <header className="header-main flex-none relative z-50 w-full bg-white border-b border-slate-200 transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
             <div className="flex items-center gap-2.5 cursor-pointer group shrink-0" onClick={() => { setSelectedMex(null); setActiveTab('overview'); setSearchTerm(''); }}>
               <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#00B14F] to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all">
                 <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
               </div>
               <div className="flex flex-col">
                 <h1 className={`text-sm md:text-base lg:text-lg font-black text-slate-900 tracking-tight leading-none group-hover:text-[#00B14F] transition-colors header-title ${globalLastUpdate && !selectedMex ? 'hidden md:block' : ''}`}>
                   AM DASHBOARD <span className="text-[#00B14F] header-pro-text">PRO</span>
                 </h1>
                 {globalLastUpdate && !selectedMex && (
                   <div className="flex flex-col md:hidden animate-in fade-in zoom-in-95 duration-300">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 header-lastsync-label">Last Sync</span>
                      <span className="text-[11px] font-bold text-[#00B14F] leading-none flex items-center gap-1 header-pro-text"><Clock size={10} /> {globalLastUpdate}</span>
                   </div>
                 )}
               </div>
             </div>
             <div className="hidden md:block w-px h-6 bg-slate-200 shrink-0 header-divider"></div>
             <div className="hidden md:flex items-center flex-1 min-w-0 relative">
                 {!selectedMex ? (
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner header-nav-bg">
                        <button onClick={() => { setActiveTab('overview'); setSearchTerm(''); }} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-white text-[#00B14F] shadow-sm border border-slate-200/50 header-nav-active' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 header-nav-inactive'}`}>
                            <LayoutDashboard className="w-4 h-4" /> Overview
                        </button>
                        <button onClick={() => setActiveTab('data')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'data' ? 'bg-white text-[#00B14F] shadow-sm border border-slate-200/50 header-nav-active' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 header-nav-inactive'}`}>
                            <Table className="w-4 h-4" /> Directory
                        </button>
                    </div>
                 ) : (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 truncate animate-in slide-in-from-left-4 fade-in duration-300">
                        <button onClick={() => setSelectedMex(null)} className="hover:text-[#00B14F] transition-colors flex items-center gap-1 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm active:scale-95 header-nav-bg header-nav-btn"><ArrowLeft className="w-3.5 h-3.5" /> Beranda</button>
                        <span className="text-slate-300 header-breadcrumb-sep">/</span>
                        <span className="text-slate-800 truncate header-breadcrumb-text">{selectedMex.name}</span>
                    </div>
                 )}
             </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
             {!selectedMex && (
                 <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg lg:rounded-xl px-2.5 lg:px-3 h-9 sm:h-10 hover:border-[#00B14F] transition-colors header-filter">
                     <Filter className="w-3.5 h-3.5 text-emerald-500 mr-1.5 hidden sm:block" />
                     <select value={selectedAM} onChange={(e) => { setSelectedAM(e.target.value); setSelectedMex(null); setCurrentPage(1); }} className="bg-transparent text-slate-700 text-[10px] lg:text-xs font-bold focus:outline-none w-[70px] sm:w-[90px] lg:w-28 cursor-pointer appearance-none truncate header-select">
                        {amOptions.map(am => <option key={am} value={am}>{am}</option>)}
                     </select>
                     <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 header-select-icon" />
                 </div>
             )}

             {selectedMex && (
                 <div className="hidden sm:flex items-center gap-1.5 lg:gap-2 bg-slate-50 border border-slate-200 rounded-lg lg:rounded-xl px-2.5 lg:px-3 py-1.5 lg:py-2 shadow-sm animate-in fade-in zoom-in-95 duration-300 header-am-badge">
                    <Users className="w-3.5 h-3.5 text-[#00B14F]" />
                    <span className="text-slate-500 text-[9px] lg:text-[10px] font-bold tracking-widest uppercase header-am-label">AM <span className="text-slate-800 ml-1 font-black header-am-val">{selectedMex.amName}</span></span>
                 </div>
             )}

             <div className="flex items-center gap-1 border-l border-slate-200 pl-3 md:pl-4 header-divider-left">
                 {globalLastUpdate && !selectedMex && (
                     <div className="flex flex-col justify-center px-2 lg:px-3 text-right hidden md:flex">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 header-lastsync-label">Last Sync</span>
                         <span className="text-[10px] font-bold text-[#00B14F] leading-none flex items-center gap-1 justify-end header-pro-text"><Clock size={10} /> {globalLastUpdate}</span>
                     </div>
                 )}
                 {!selectedMex && <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block header-divider"></div>}
                 <button onClick={() => setIsForceUpload(true)} className="flex items-center justify-center text-slate-500 hover:text-[#00B14F] w-8 h-8 md:w-9 md:h-9 rounded-lg hover:bg-slate-100 transition-colors group shadow-sm border border-slate-200/50 active:scale-95 header-icon-btn" title="Update Data">
                     <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                 </button>
                 <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center justify-center text-slate-500 hover:text-indigo-500 w-8 h-8 md:w-9 md:h-9 rounded-lg hover:bg-slate-100 transition-colors group shadow-sm border border-slate-200/50 active:scale-95 header-icon-btn" title={isDarkMode ? "Beralih ke Light Mode" : "Beralih ke Dark Mode"}>
                     {isDarkMode ? <Sun className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500 text-amber-500" /> : <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-500" />}
                 </button>
             </div>
          </div>
        </div>

        {/* MOBILE SUB-NAV */}
        {!selectedMex && (
            <div className="md:hidden border-t border-slate-200 bg-slate-50 header-mobile-sub">
                <div className="flex flex-col px-4 py-2.5 gap-2">
                    <div className="flex w-full gap-2">
                        <button onClick={() => { setActiveTab('overview'); setSearchTerm(''); }} className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'overview' ? 'bg-white text-[#00B14F] shadow-sm border border-slate-200 header-nav-active' : 'text-slate-500 hover:bg-slate-100 header-nav-inactive'}`}>
                            <LayoutDashboard className="w-3.5 h-3.5" /> Overview
                        </button>
                        <button onClick={() => setActiveTab('data')} className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'data' ? 'bg-white text-[#00B14F] shadow-sm border border-slate-200 header-nav-active' : 'text-slate-500 hover:bg-slate-100 header-nav-inactive'}`}>
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
                      <DashboardCard title="Basketsize" value={formatCurrency(kpi?.mtd || 0)} subLabel="Last Month" subValue={formatCurrency(kpi?.lm || 0)} icon={Activity} color="emerald" trend={kpi?.lm > 0 ? ((kpi.rr - kpi.lm) / kpi.lm) * 100 : (kpi?.rr > 0 ? 100 : 0)} borderClass="emerald-300" />
                      <DashboardCard title="Invest" value={formatCurrency(kpi?.miMtd || 0)} subLabel="Last Month" subValue={formatCurrency(kpi?.miLm || 0)} icon={DollarSign} color="teal" onClick={() => setShowMiModal(true)} trend={kpi?.miLm > 0 ? ((kpi.miRr - kpi.miLm) / kpi.miLm) * 100 : (kpi?.miRr > 0 ? 100 : 0)} borderClass="teal-300" />
                      <DashboardCard title="Ads" value={formatCurrency(kpi?.adsMtd || 0)} subLabel="Last Month" subValue={formatCurrency(kpi?.adsLm || 0)} icon={Megaphone} color="rose" onClick={() => setShowAdsModal(true)} trend={kpi?.adsLm > 0 ? ((kpi.adsRr - kpi.adsLm) / kpi.adsLm) * 100 : (kpi?.adsRr > 0 ? 100 : 0)} borderClass="rose-300" />
                      <DashboardCard title="MCA Config" value={formatCurrency(kpi?.mcaDis || 0)} subLabel="Total Toko" subValue={`${kpi?.mcaDisCount || 0} Toko`} icon={Database} color="amber" onClick={() => setShowMcaModal(true)} borderClass="amber-300" />
                      <DashboardCard title="Campaigns" value={(kpi?.totalPoints || 0).toLocaleString('id-ID')} subLabel="Avg Points" subValue={`${kpi?.avgPtsPerJoiner || 0} pts`} icon={Award} color="indigo" borderClass="indigo-300" />
                      <DashboardCard title="Outlets" value={kpi?.totalMex || 0} subLabel="Inactive" subValue={kpi?.inactiveMex || 0} icon={Store} color="blue" onClick={() => setShowOutletsModal(true)} borderClass="blue-300" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mt-6">
                      <div className="animate-fade-in-up stagger-7 bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 shrink-0 min-h-[44px]">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="text-[#00B14F] w-5 h-5"/> Top 10 Merchants <span className="text-slate-400 font-bold normal-case text-xs bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 hidden sm:inline-block">(MTD Sales)</span></h3>
                        </div>
                        <div className="h-[280px] md:h-[360px] w-full mt-auto">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartsData.mtd} onClick={onChartClick} margin={{ top: 20, right: 30, left: -15, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                              <XAxis dataKey="name" tick={{ fill: COLORS.slate500, fontSize: 9, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={(v) => String(v).substring(0, 6)+'.'} height={20} dy={5} />
                              <YAxis tick={{ fill: COLORS.slate400, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} width={45} />
                              <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v, name) => [formatCurrency(v), name]} />
                              <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '24px', paddingBottom: '0', fontSize: '11px', fontWeight: 'bold', width: '100%', left: 0, display: 'flex', justifyContent: 'center' }} iconType="circle"/>
                              <Bar dataKey="lmBs" name="LM Sales" fill={COLORS.slate500} radius={[6,6,0,0]} maxBarSize={28} cursor="pointer" />
                              <Bar dataKey="mtdBs" name="MTD Sales" fill={COLORS.primary} radius={[6,6,0,0]} maxBarSize={28} cursor="pointer" />
                              <Line type="monotone" dataKey="rrBs" name="Runrate" stroke={COLORS.growth} strokeWidth={4} dot={{r:4, fill: '#ffffff', strokeWidth: 3}} activeDot={{r: 6}} cursor="pointer">
                                  <LabelList 
                                      dataKey="rrVsLm" position="top" offset={12}
                                      content={(props) => {
                                          const { x, y, value } = props; if (value === undefined || value === null) return null;
                                          const numVal = parseFloat(value); const isPositive = numVal >= 0; const fill = isPositive ? '#10b981' : '#ef4444';
                                          const textStr = `${isPositive ? '+' : ''}${numVal.toFixed(0)}%`;
                                          return ( <g><text x={x} y={y - 12} fill="none" stroke="#ffffff" strokeWidth={4} strokeLinejoin="round" fontSize={10} fontWeight="900" textAnchor="middle">{textStr}</text><text x={x} y={y - 12} fill={fill} fontSize={10} fontWeight="900" textAnchor="middle">{textStr}</text></g> );
                                      }}
                                  />
                              </Line>
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="animate-fade-in-up stagger-9 bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                        <div className="flex justify-between items-center mb-8 shrink-0 min-h-[44px]">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Megaphone className="text-rose-500 w-5 h-5"/> Top 10 Ads Spender <span className="text-slate-400 font-bold normal-case text-xs bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">(vs LM & RR)</span></h3>
                        </div>
                        <div className="h-[280px] md:h-[360px] w-full mt-auto">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartsData.ads} onClick={onChartClick} margin={{ top: 20, right: 30, left: -15, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                              <XAxis dataKey="name" tick={{ fill: COLORS.slate500, fontSize: 9, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={(v) => String(v).substring(0, 8)+'.'} height={20} dy={5} />
                              <YAxis tick={{ fill: COLORS.slate400, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} width={45} />
                              <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding:'12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v) => formatCurrency(v)} />
                              <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '24px', paddingBottom: '0', fontSize: '11px', fontWeight: 'bold', width: '100%', left: 0, display: 'flex', justifyContent: 'center' }} iconType="circle" />
                              <Bar dataKey="adsLM" name="Ads LM" fill={COLORS.slate500} radius={[6,6,0,0]} maxBarSize={32} cursor="pointer" />
                              <Bar dataKey="adsTotal" name="Ads MTD" fill="#fb923c" radius={[6,6,0,0]} maxBarSize={32} cursor="pointer" />
                              <Line type="monotone" dataKey="adsRR" name="Ads RR" stroke="#2dd4bf" strokeWidth={4} dot={{r:4, fill: '#ffffff', strokeWidth: 3}} activeDot={{r: 6}} cursor="pointer">
                                 <LabelList 
                                      dataKey="adsTotal" position="top" offset={12}
                                      content={(props) => {
                                          const { x, y, index } = props; const item = chartsData.ads[index]; if (!item) return null;
                                          let adsTrend = 0; if (item.adsLM > 0) adsTrend = ((item.adsRR - item.adsLM) / item.adsLM) * 100; else if (item.adsRR > 0) adsTrend = 100;
                                          const isPositive = adsTrend >= 0; const fill = isPositive ? '#ef4444' : '#10b981'; const textStr = `${isPositive ? '+' : ''}${adsTrend.toFixed(0)}%`;
                                          return ( <g><text x={x} y={y - 12} fill="none" stroke="#ffffff" strokeWidth={4} strokeLinejoin="round" fontSize={10} fontWeight="900" textAnchor="middle">{textStr}</text><text x={x} y={y - 12} fill={fill} fontSize={10} fontWeight="900" textAnchor="middle">{textStr}</text></g> );
                                      }}
                                  />
                              </Line>
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mt-6">
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
                                <Pie data={chartsData.health} cx="50%" cy="50%" innerRadius="65%" outerRadius="90%" paddingAngle={5} dataKey="count" stroke="none">
                                  {chartsData.health.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.color} cursor="pointer" className="hover:opacity-80 transition-all duration-300" /> ))}
                                </Pie>
                                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border:'none', padding: '10px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(value, name, props) => [`${value} Toko (${props.payload.percentage}%)`, name]} />
                              </PieChart>
                           </ResponsiveContainer>
                           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-in zoom-in-95 duration-700 delay-300">
                              <span className="text-3xl font-black text-[#00B14F] leading-none drop-shadow-sm">{chartsData.health[0]?.percentage || 0}%</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Growing</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 relative z-10 mt-4 shrink-0">
                            {chartsData.health.map((h, i) => (
                                <div key={i} className="flex items-center justify-between text-sm bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors">
                                    <div className="flex items-center gap-3"><div className="w-3.5 h-3.5 rounded-md shadow-sm" style={{ backgroundColor: h.color }} /><span className="font-bold text-slate-700 text-xs">{h.name}</span></div>
                                    <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100">{h.count} <span className="text-[10px] text-slate-400 font-bold ml-1.5">({h.percentage}%)</span></span>
                                </div>
                            ))}
                        </div>
                      </div>

                      <div className="animate-fade-in-up stagger-11 bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full opacity-50 -mr-8 -mt-8 pointer-events-none transition-transform duration-700 hover:scale-110"></div>
                        <div className="flex justify-between items-end mb-4 relative z-10 shrink-0 min-h-[44px]">
                            <div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Zap className="text-amber-500 w-5 h-5"/> Campaign Segments</h3>
                                <p className="text-[11px] font-bold text-slate-500 mt-1">Distribusi & Popularitas Program</p>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative min-h-[180px] my-2">
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={campaignStats.classification} cx="50%" cy="50%" innerRadius="65%" outerRadius="90%" paddingAngle={5} dataKey="count" stroke="none">
                                  {campaignStats.classification.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.fill} cursor="pointer" onClick={() => setActiveSegmentModal(entry.name)} className="hover:opacity-80 transition-all duration-300 outline-none" /> ))}
                                </Pie>
                                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border:'none', padding: '10px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(value, name) => [`${value} Toko`, name]} />
                              </PieChart>
                           </ResponsiveContainer>
                           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-in zoom-in-95 duration-700 delay-300">
                              <span className="text-3xl font-black text-amber-500 leading-none drop-shadow-sm">{campaignStats.joiners}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Joiners</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 md:gap-3 relative z-10 mt-4 shrink-0 pt-4 border-t border-slate-50">
                            <div className="bg-blue-50/80 border border-blue-100 p-2 md:p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-0.5">GMS</span>
                                <span className="text-base font-black text-blue-700">{campaignStats.list.filter(c => String(c.name).toLowerCase().includes('gms')).reduce((a, b) => a + b.count, 0)}</span>
                            </div>
                            <div className="bg-amber-50/80 border border-amber-100 p-2 md:p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-0.5">Booster</span>
                                <span className="text-base font-black text-amber-700">{campaignStats.list.filter(c => String(c.name).toLowerCase().includes('booster') && !String(c.name).toLowerCase().includes('booster+')).reduce((a, b) => a + b.count, 0)}</span>
                            </div>
                            <div className="bg-emerald-50/80 border border-emerald-100 p-2 md:p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">Cuan</span>
                                <span className="text-base font-black text-emerald-700">{campaignStats.list.filter(c => String(c.name).toLowerCase().includes('cuan')).reduce((a, b) => a + b.count, 0)}</span>
                            </div>
                        </div>
                      </div>
                    </div>

                    {/* GMS OPT-IN & OPT-OUT CARDS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mt-6">
                      {/* OPT IN CARD */}
                      <div className="animate-fade-in-up stagger-12 bg-white p-5 md:p-6 lg:p-7 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                          <div className="flex justify-between items-end mb-4 md:mb-5 shrink-0">
                              <div>
                                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><UserPlus className="text-emerald-500 w-5 h-5"/> GMS Opt-In</h3>
                                  <p className="text-[10px] md:text-[11px] font-bold text-slate-500 mt-1">Merchant join GMS terbaru</p>
                              </div>
                              <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-black border border-emerald-100">{optInList.length} Toko</span>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[340px] flex flex-col gap-2.5">
                              {optInList.length === 0 ? (
                                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-6 min-h-[160px]">
                                      <UserPlus className="w-8 h-8 mb-2 opacity-20 text-emerald-500" />
                                      <p className="text-[10px] font-bold uppercase tracking-widest">Belum ada Opt-In</p>
                                  </div>
                              ) : (
                                  optInList.map(mex => (
                                      <div key={mex.id} onClick={() => setSelectedMex(mex)} className="bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-colors group shrink-0">
                                          <div className="min-w-0 flex-1">
                                              <p className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 truncate transition-colors">{mex.name}</p>
                                              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 md:gap-2">
                                                  {mex.gmsOptInDate && mex.gmsOptInDate !== '-' && mex.gmsOptInDate !== '#N/A' && (
                                                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-white border border-slate-200 text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm group-hover:border-slate-300 truncate max-w-full" title="Tanggal Join">
                                                          <Calendar size={12} className="shrink-0 text-slate-400"/> 
                                                          {new Date(parseSafeDate(mex.gmsOptInDate)).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                      </span>
                                                  )}
                                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm group-hover:border-emerald-200 truncate max-w-full" title={mex.gmsOptIn}>
                                                      <Package size={12} className="shrink-0 text-emerald-500" /> {mex.gmsOptIn}
                                                  </span>
                                              </div>
                                          </div>
                                          <div className="text-right shrink-0 px-1 md:px-2">
                                              <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                          </div>
                                      </div>
                                  ))
                              )}
                          </div>
                      </div>

                      {/* OPT OUT CARD */}
                      <div className="animate-fade-in-up stagger-13 bg-white p-5 md:p-6 lg:p-7 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                          <div className="flex justify-between items-end mb-4 md:mb-5 shrink-0">
                              <div>
                                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><UserMinus className="text-rose-500 w-5 h-5"/> GMS Opt-Out</h3>
                                  <p className="text-[10px] md:text-[11px] font-bold text-slate-500 mt-1">Merchant keluar GMS terbaru</p>
                              </div>
                              <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg text-xs font-black border border-rose-100">{optOutList.length} Toko</span>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[340px] flex flex-col gap-2.5">
                              {optOutList.length === 0 ? (
                                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-6 min-h-[160px]">
                                      <UserMinus className="w-8 h-8 mb-2 opacity-20 text-rose-500" />
                                      <p className="text-[10px] font-bold uppercase tracking-widest">Belum ada Opt-Out</p>
                                  </div>
                              ) : (
                                  optOutList.map(mex => (
                                      <div key={mex.id} onClick={() => setSelectedMex(mex)} className="bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-colors group shrink-0">
                                          <div className="min-w-0 flex-1">
                                              <p className="font-bold text-sm text-slate-800 group-hover:text-rose-700 truncate transition-colors">{mex.name}</p>
                                              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 md:gap-2">
                                                  {mex.gmsOptOutDate && mex.gmsOptOutDate !== '-' && mex.gmsOptOutDate !== '#N/A' && (
                                                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-white border border-slate-200 text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm group-hover:border-slate-300 truncate max-w-full" title="Tanggal Keluar">
                                                          <Calendar size={12} className="shrink-0 text-slate-400"/> 
                                                          {new Date(parseSafeDate(mex.gmsOptOutDate)).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                      </span>
                                                  )}
                                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-rose-50 border border-rose-100 text-rose-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm group-hover:border-rose-200 truncate max-w-full" title={mex.gmsOptOut}>
                                                      <XCircle size={12} className="shrink-0 text-rose-500" /> {mex.gmsOptOut}
                                                  </span>
                                              </div>
                                          </div>
                                          <div className="text-right shrink-0 px-1 md:px-2">
                                              <ChevronRight size={16} className="text-slate-300 group-hover:text-rose-500 transition-colors" />
                                          </div>
                                      </div>
                                  ))
                              )}
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
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm flex-1 sm:flex-none hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-colors">
                           <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
                           <select value={selectedPriority} onChange={(e) => { setSelectedPriority(e.target.value); setSelectedMex(null); setCurrentPage(1); }} className="bg-transparent text-slate-700 text-xs font-bold focus:outline-none w-full sm:w-32 cursor-pointer appearance-none">
                              {priorityOptions.map(p => <option key={p} value={p}>{p === 'All' ? 'Semua Priority' : `Priority: ${p}`}</option>)}
                           </select>
                           <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 pointer-events-none" />
                        </div>
                        <div className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-xl text-xs font-black shadow-sm shrink-0 transition-transform hover:scale-105">{filtered.length} Toko</div>
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
                             <th className="px-4 py-4 cursor-pointer hover:text-slate-700 select-none group" onClick={() => requestSort('name')}>
                               <div className="flex items-center gap-1">Merchant {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#00B14F]" /> : <ArrowDown className="w-3 h-3 text-[#00B14F]" />)}</div>
                             </th>
                             <th className="px-4 py-4 text-center hidden md:table-cell cursor-pointer hover:text-slate-700 select-none group" onClick={() => requestSort('campaigns')}>
                               <div className="flex items-center justify-center gap-1">Campaign {sortConfig.key === 'campaigns' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#00B14F]" /> : <ArrowDown className="w-3 h-3 text-[#00B14F]" />)}</div>
                             </th>
                             <th className="px-4 py-4 text-center cursor-pointer hover:text-slate-700 select-none group" onClick={() => requestSort('rrVsLm')}>
                               <div className="flex items-center justify-center gap-1">Trend {sortConfig.key === 'rrVsLm' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#00B14F]" /> : <ArrowDown className="w-3 h-3 text-[#00B14F]" />)}</div>
                             </th>
                             <th className="px-4 py-4 text-center hidden lg:table-cell cursor-pointer hover:text-slate-700 select-none group" onClick={() => requestSort('mcaPriority')}>
                               <div className="flex items-center justify-center gap-1">Priority {sortConfig.key === 'mcaPriority' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#00B14F]" /> : <ArrowDown className="w-3 h-3 text-[#00B14F]" />)}</div>
                             </th>
                             <th className="px-5 py-4 text-right cursor-pointer hover:text-slate-700 select-none group" onClick={() => requestSort('mtdBs')}>
                               <div className="flex items-center justify-end gap-1">MTD Sales {sortConfig.key === 'mtdBs' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#00B14F]" /> : <ArrowDown className="w-3 h-3 text-[#00B14F]" />)}</div>
                             </th>
                             <th className="px-5 py-4 text-center cursor-pointer hover:text-slate-700 select-none group" onClick={() => requestSort('zeusStatus')}>
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
                                  <div className="flex items-center gap-2 mt-0.5"><p className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded group-hover:bg-emerald-50 transition-colors">{r.id}</p></div>
                                </td>
                                <td className="px-4 py-3 text-center hidden md:table-cell">
                                  {r.campaigns && r.campaigns !== '-' && !String(r.campaigns).toLowerCase().includes('no campaign') ? (<div className="inline-flex items-center justify-center bg-indigo-50 p-1 rounded-md border border-indigo-100 shadow-sm group-hover:scale-110 transition-transform"><Check className="w-4 h-4 text-indigo-600" strokeWidth={3} /></div>) : (<span className="text-slate-300 font-bold">-</span>)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                   <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black shadow-sm transition-transform group-hover:scale-105 ${r.rrBs > r.lmBs ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                      {r.rrBs > r.lmBs ? <ArrowUpRight className="w-3.5 h-3.5"/> : <ArrowDownRight className="w-3.5 h-3.5"/>} {Math.abs(r.rrVsLm).toFixed(0)}%
                                   </span>
                                </td>
                                <td className="px-4 py-3 text-center hidden lg:table-cell">
                                   <span className={`text-[10px] font-black px-2 py-1 rounded-md border ${getPriorityBadgeClass(r.mcaPriority)}`}>{r.mcaPriority}</span>
                                </td>
                                <td className="px-5 py-3 font-mono text-slate-800 font-black text-right text-xs md:text-sm">{formatCurrency(r.mtdBs)}</td>
                                <td className="px-5 py-3 text-center">
                                   <div className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-colors ${String(r.zeusStatus).toUpperCase() === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200' : 'bg-slate-100 text-slate-500'}`}>{r.zeusStatus}</div>
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
                          <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">Menampilkan <span className="text-slate-800">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)}</span> dari {filtered.length} Toko</span>
                          <div className="flex items-center gap-2">
                              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl bg-white border border-slate-200 hover:border-[#00B14F] hover:text-[#00B14F] disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
                              <span className="text-xs font-black text-slate-700 bg-white shadow-sm px-4 py-2 rounded-xl border border-slate-200">{currentPage} <span className="text-slate-400 font-bold mx-1">/</span> {totalPages}</span>
                              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl bg-white border border-slate-200 hover:border-[#00B14F] hover:text-[#00B14F] disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed shadow-sm"><ChevronRight className="w-4 h-4" /></button>
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
               
               {/* KARTU 1: MERCHANT INFO HEADER (FULL WIDTH) */}
               <div className="panel-info-backdrop bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100/50 p-6 md:p-8 flex flex-col relative overflow-hidden h-full transition-shadow hover:shadow-2xl animate-fade-in-up stagger-1">
                  <div className="panel-info-blob absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-slate-100/50 to-transparent rounded-bl-full opacity-60 -mr-16 -mt-16 pointer-events-none transition-transform duration-700 hover:scale-110"></div>
                  
                  <div className="relative z-10 flex flex-col lg:flex-row gap-5 lg:gap-6">
                     {/* KIRI: PROFIL & INFO (GROUPED BADGES) */}
                     <div className="panel-profile-card flex-1 min-w-0 flex flex-col justify-center bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-100 rounded-[24px] p-6 lg:p-8 relative overflow-hidden shadow-sm">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00B14F]"></div>
                        <div className="panel-profile-blob absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                        
                        <div className="relative z-10 pr-2">
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 leading-tight tracking-tight">{selectedMex.name}</h2>
                            
                            <div className="flex flex-col xl:flex-row gap-3 mt-5">
                                {/* KOTAK KIRI: Kota, Status/ID, Owner */}
                                <div className="panel-badge flex-1 inline-flex flex-wrap items-center gap-x-4 gap-y-2.5 px-4 md:px-5 py-3 bg-white/60 backdrop-blur-sm border border-emerald-100/50 rounded-2xl shadow-sm">
                                    {/* City */}
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={14} className="panel-icon-primary text-[#00B14F]"/> 
                                        <span className="panel-badge-text text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-600">{selectedMex.city || 'Tidak diketahui'}</span>
                                    </div>
                                    
                                    <div className="w-1 h-1 rounded-full bg-emerald-200 panel-divider hidden sm:block"></div>
                                    
                                    {/* Status & ID */}
                                    <div className="flex items-center gap-1.5" title={String(selectedMex.zeusStatus).toUpperCase() === 'ACTIVE' ? 'Status: Aktif' : 'Status: Inactive'}>
                                       {String(selectedMex.zeusStatus).toUpperCase() === 'ACTIVE' ? <CheckCircle className="panel-icon-primary w-4 h-4 text-[#00B14F]" /> : <AlertCircle className="w-4 h-4 text-slate-400" />}
                                       <span className="panel-badge-text text-[10px] md:text-[11px] font-bold uppercase tracking-widest font-mono text-slate-600">{selectedMex.id}</span>
                                    </div>

                                    <div className="w-1 h-1 rounded-full bg-emerald-200 panel-divider hidden sm:block"></div>

                                    {/* Owner */}
                                    <div className="flex items-center gap-1.5">
                                       <Users className="panel-icon-primary w-4 h-4 text-[#00B14F]" />
                                       <span className="panel-badge-text text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-600 truncate max-w-[150px] sm:max-w-[200px]">{selectedMex.ownerName !== '-' ? selectedMex.ownerName : 'Unknown Owner'}</span>
                                    </div>
                                </div>

                                {/* KOTAK KANAN: Komisi & Photo Penetration */}
                                <div className="panel-badge inline-flex flex-wrap items-center gap-x-4 gap-y-2.5 px-4 md:px-5 py-3 bg-white/60 backdrop-blur-sm border border-emerald-100/50 rounded-2xl shadow-sm shrink-0">
                                    {/* Komisi */}
                                    <div className="flex items-center gap-1.5">
                                       <Percent size={14} className="panel-icon-primary text-[#00B14F]"/> 
                                       <span className="panel-badge-text text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-600">Komisi: {selectedMex.commission || '-'}</span>
                                    </div>

                                    <div className="w-1 h-1 rounded-full bg-emerald-200 panel-divider hidden sm:block"></div>
                                    
                                    {/* Photo Penetration */}
                                    <div className="flex items-center gap-1.5" title="Menu Photo Penetration">
                                       <Camera size={14} className={`panel-icon-primary ${selectedMex.latest_penetration >= 0.8 ? 'text-[#00B14F]' : selectedMex.latest_penetration >= 0.5 ? 'text-amber-500' : 'text-rose-500'}`}/> 
                                       <span className="panel-badge-text text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-600">Foto: {(selectedMex.latest_penetration * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>

                     {/* KANAN: RECENT NOTES & ACTION */}
                     <div className="panel-notes-card w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col bg-slate-50 rounded-[24px] border border-slate-200 p-5 md:p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="panel-notes-title text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><StickyNote className="w-4 h-4 text-amber-500"/> Recent Notes</h3>
                            <button onClick={() => setShowNotesModal(true)} className="panel-notes-btn bg-amber-50 hover:bg-amber-100 text-amber-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors border border-amber-200 shadow-sm flex items-center gap-1.5 active:scale-95">
                                <Plus size={12}/> {selectedMex.notes?.length > 0 ? 'See All' : 'Add Note'}
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                            {(!selectedMex.notes || selectedMex.notes.length === 0) ? (
                                <div className="panel-notes-empty flex-1 flex flex-col items-center justify-center text-slate-400 py-6 border border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                                    <FileText className="w-8 h-8 mb-2 opacity-20" />
                                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-center">Belum ada catatan.</p>
                                </div>
                            ) : (
                                selectedMex.notes.slice(0, 2).map((note, idx) => (
                                    <div key={note.id} className="panel-note-item bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm flex gap-3 group">
                                        <div className="panel-note-icon w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center shrink-0 border border-amber-100">
                                            <Calendar size={14} className="text-amber-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="panel-note-date text-[9px] font-black text-slate-400 mb-1 flex items-center gap-1.5 uppercase tracking-widest">
                                                {new Date(note.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                            <p className="panel-note-text text-xs text-slate-700 font-medium whitespace-pre-wrap leading-relaxed line-clamp-3">{note.text}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                            
                            {selectedMex.notes && selectedMex.notes.length > 2 && (
                                <div className="text-center pt-2">
                                    <span className="panel-note-more text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-amber-500 transition-colors" onClick={() => setShowNotesModal(true)}>
                                        + {selectedMex.notes.length - 2} catatan lainnya
                                    </span>
                                </div>
                            )}
                        </div>
                     </div>
                  </div>
               </div>

               {/* REWORKED: 2 Columns on Mobile, 4 on Desktop */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  <DashboardCard title="Sales" value={formatCurrency(selectedMex.mtdBs)} subLabel="Last Month" subValue={formatCurrency(selectedMex.lmBs)} icon={Activity} color="emerald" trend={selectedMex.lmBs > 0 ? ((selectedMex.rrBs - selectedMex.lmBs) / selectedMex.lmBs) * 100 : (selectedMex.rrBs > 0 ? 100 : 0)} borderClass="emerald-300" />
                  
                  <div onClick={() => setShowCampaignModal(true)} className="bg-white rounded-[28px] border border-slate-200 p-5 lg:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300 hover:-translate-y-1 group animate-fade-in-up stagger-3 h-full cursor-pointer">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
                      <Award className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                      
                      {/* DIPERBAIKI */}
                      <div className="flex justify-between items-start gap-2 mb-4 lg:mb-5 pl-2 relative z-10 shrink-0 h-[44px] lg:h-[48px]">
                          <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0"><Zap size={18} strokeWidth={2.5} /></div>
                              <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 truncate">Campaigns <MousePointer size={10} className="text-slate-300 group-hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1"/></p>
                          </div>
                      </div>
                      
                      <div className="pl-2 relative z-10 flex-1 flex flex-col justify-start">
                          <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Points</p>
                          <p className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 lg:mb-4">{selectedMex.campaignPoint || 0}</p>
                      </div>
                      <div className="mt-auto pt-3 lg:pt-4 border-t border-slate-100 pl-2 relative z-10 shrink-0 min-w-0">
                          <div className="max-h-[42px] overflow-hidden relative">
                              {renderMerchantCampaigns(selectedMex.campaigns)}
                              {selectedMex.campaigns && String(selectedMex.campaigns).split(/[|,]/).length > 2 && (
                                  <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-white to-transparent dark:from-[#121212] pointer-events-none"></div>
                              )}
                          </div>
                      </div>
                  </div>

                  <div onClick={() => setShowAdsModal(true)} className="bg-white rounded-[28px] border border-slate-200 p-5 lg:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10 hover:border-rose-300 hover:-translate-y-1 group animate-fade-in-up stagger-4 h-full cursor-pointer">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
                      <Megaphone className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                      
                      {/* DIPERBAIKI */}
                      <div className="flex justify-between items-start gap-2 mb-4 lg:mb-5 pl-2 relative z-10 shrink-0 h-[44px] lg:h-[48px]">
                          <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0"><Megaphone size={18} strokeWidth={2.5}/></div>
                              <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 truncate">Ads Spend <MousePointer size={10} className="text-slate-300 group-hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1"/></p>
                          </div>
                      </div>
                      
                      <div className="pl-2 relative z-10 flex-1 flex flex-col justify-start">
                          <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">MTD Total Ads</p>
                          <p className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 lg:mb-4">{formatCurrency(selectedMex.adsTotal)}</p>
                      </div>
                      <div className="mt-auto flex flex-col gap-1.5 pl-2 relative z-10 shrink-0 min-h-[40px] lg:min-h-[44px]">
                          <div className="pt-3 lg:pt-4 border-t border-slate-100 flex justify-between items-center">
                              <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase truncate pr-2">Last Month</span>
                              <span className="text-[10px] lg:text-xs font-black text-slate-700">{formatCurrency(selectedMex.adsLM)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase truncate pr-2">Runrate</span>
                              <span className="text-[10px] lg:text-xs font-black text-slate-700">{formatCurrency(selectedMex.adsRR)}</span>
                          </div>
                      </div>
                  </div>

                  <div className="bg-white rounded-[28px] border border-slate-200 p-5 lg:p-6 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group animate-fade-in-up stagger-5 h-full">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                      <Database className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-900 opacity-5 rotate-[-15deg] pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                      
                      {/* DIPERBAIKI */}
                      <div className="flex justify-between items-start gap-2 mb-4 lg:mb-5 pl-2 relative z-10 shrink-0 h-[44px] lg:h-[48px]">
                          <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Database size={18} strokeWidth={2.5}/></div>
                              <p className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 truncate">MCA Config</p>
                          </div>
                      </div>
                      
                      <div className="pl-2 relative z-10 flex-1 flex flex-col justify-start">
                          <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Disbursed Amount</p>
                          <p className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 lg:mb-4">{formatCurrency(selectedMex.mcaAmount)}</p>
                      </div>
                      <div className="mt-auto flex flex-col gap-1.5 pl-2 relative z-10 shrink-0 min-h-[40px] lg:min-h-[44px]">
                          <div className="pt-3 lg:pt-4 border-t border-slate-100 flex justify-between items-center">
                              <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase truncate pr-2">Limit Tersedia</span>
                              <span className="text-[10px] lg:text-xs font-black text-slate-700">{formatCurrency(selectedMex.mcaWlLimit)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase truncate pr-2">Drop Off</span>
                              <span className={`text-[9px] lg:text-[10px] font-black px-2 py-0.5 rounded-md ${(!selectedMex.mcaDropOff || selectedMex.mcaDropOff === '-' || String(selectedMex.mcaDropOff).trim() === '0') ? 'bg-slate-100 text-slate-500' : 'bg-rose-100 text-rose-700'}`}>{(!selectedMex.mcaDropOff || selectedMex.mcaDropOff === '-' || String(selectedMex.mcaDropOff).trim() === '0') ? '-Not Yet-' : selectedMex.mcaDropOff}</span>
                          </div>
                      </div>
                  </div>
               </div>

               {selectedMex.history && selectedMex.history.length > 0 && (
                   <div className="space-y-5 md:space-y-6 mt-2 md:mt-4">
                       
                       <div className="animate-fade-in-up stagger-6 w-full bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 flex flex-col hover:shadow-2xl transition-shadow duration-500">
                           <div className="flex justify-between items-start md:items-center mb-8 gap-2 shrink-0 min-h-[44px]">
                              <div><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="text-blue-500 w-5 h-5"/> 12-Month Review</h3></div>
                              {selectedMex.lastUpdate && (
                                  <div className="bg-slate-50 border border-slate-100 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm" title="Data terakhir diperbarui">
                                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                                      <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{selectedMex.lastUpdate}</span>
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
                                   <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v, n) => [String(n).includes('%') ? `${v}%` : formatCurrency(v), n]} labelFormatter={formatMonth}/>
                                   <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '24px', paddingBottom: '0', fontSize: '11px', fontWeight: 'bold' }} />
                                   <Bar yAxisId="left" dataKey="net_sales" stackId="a" name="Net Sales" fill={COLORS.netSales} maxBarSize={40} radius={[4,4,0,0]} />
                                   <Bar yAxisId="left" dataKey="total_investment" stackId="a" name="MI (Rp)" fill="#f43f5e" radius={[4,4,0,0]} maxBarSize={40} />
                                   <Line yAxisId="right" type="monotone" dataKey="mi_percentage" name="MI %" stroke="#f97316" strokeWidth={2} strokeDasharray="4 4" dot={{r:3, fill: '#ffffff', strokeWidth: 2}} activeDot={{r: 5}} />
                                   <Line yAxisId="left" type="monotone" dataKey="basket_size" name="Total Basket Size" stroke={COLORS.basketSize} strokeWidth={2} strokeDasharray="4 4" dot={{r:3, fill: '#ffffff', strokeWidth: 2}} activeDot={{r: 5}} />
                                 </ComposedChart>
                               </ResponsiveContainer>
                            </div>
                       </div>

                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
                           <div className="animate-fade-in-up stagger-7 bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                                <div className="flex items-center mb-8 shrink-0 min-h-[44px]"><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><DollarSign className="text-rose-500 w-5 h-5"/> Investment (MI) Breakdown</h3></div>
                                <div className="h-[280px] md:h-[360px] w-full mt-auto">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={selectedMex.history.slice(-12)} margin={{ top: 20, right: 0, left: -5, bottom: 5 }}>
                                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                          <XAxis dataKey="month" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={formatMonth} height={20} dy={5} />
                                          <YAxis tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} width={60} />
                                          <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v) => formatCurrency(v)} labelFormatter={formatMonth}/>
                                          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '24px', paddingBottom: '0', fontSize: '11px', fontWeight: 'bold' }} iconType="circle" />
                                          <Bar dataKey="mfp" stackId="a" name="Local Promo" fill="#3b82f6" maxBarSize={32} />
                                          <Bar dataKey="mfc" stackId="a" name="Harga Coret" fill="#22c55e" maxBarSize={32} />
                                          <Bar dataKey="cpo" stackId="a" name="GMS" fill="#f97316" maxBarSize={32} />
                                          <Bar dataKey="ads_total_hist" stackId="a" name="Iklan" fill="#ef4444" radius={[6,6,0,0]} maxBarSize={32} />
                                      </BarChart>
                                  </ResponsiveContainer>
                                </div>
                           </div>

                            <div className="animate-fade-in-up stagger-8 bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                                <div className="flex items-start gap-2 mb-8 shrink-0 min-h-[44px]"><ShoppingBag className="w-5 h-5 text-indigo-500 shrink-0"/><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-tight">Completed Orders</h3></div>
                                <div className="h-[280px] md:h-[360px] w-full mt-auto">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={selectedMex.history.slice(-12)} margin={{ top: 30, right: 0, left: -5, bottom: 5 }}>
                                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                          <XAxis dataKey="month" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={formatMonth} height={20} dy={5} />
                                          <YAxis tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} width={45} />
                                          <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} labelFormatter={formatMonth}/>
                                          <Bar dataKey="completed_orders" name="Completed Orders" fill="#10b981" radius={[4,4,0,0]} maxBarSize={32}>
                                              <LabelList dataKey="completed_orders" position="top" offset={10} fontSize={10} fontWeight={800} fill="#10b981" />
                                          </Bar>
                                      </BarChart>
                                  </ResponsiveContainer>
                                </div>
                            </div>
                       </div>

                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
                            <div className="animate-fade-in-up stagger-9 bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                                <div className="flex items-start gap-2 mb-8 shrink-0 min-h-[44px]"><Target className="w-5 h-5 text-teal-500 shrink-0"/><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-tight">AOV & Promo Usage</h3></div>
                                <div className="h-[280px] md:h-[360px] w-full mt-auto">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <ComposedChart data={selectedMex.history.slice(-12)} margin={{ top: 30, right: 0, left: -5, bottom: 5 }}>
                                          <defs><linearGradient id="colorAov" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                          <XAxis dataKey="month" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={formatMonth} height={20} dy={5} />
                                          <YAxis yAxisId="left" domain={['auto', 'auto']} tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} width={45} />
                                          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={40} />
                                          <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(v, n) => [String(n).includes('%') ? `${v}%` : formatCurrency(v), n]} labelFormatter={formatMonth}/>
                                          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '24px', paddingBottom: '0', fontSize: '11px', fontWeight: 'bold' }} iconType="circle" />
                                          <Area yAxisId="left" type="monotone" dataKey="aov" name="AOV" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAov)">
                                              <LabelList dataKey="aov" position="top" offset={10} fontSize={9} fontWeight={800} fill="#6366f1" formatter={(v) => `${(v/1000).toFixed(0)}K`} />
                                          </Area>
                                          <Line yAxisId="right" type="monotone" dataKey="promo_order_pct" name="% Promo Usage" stroke="#14b8a6" strokeWidth={4} dot={{r:4, fill: '#ffffff', strokeWidth: 3}} activeDot={{r:6}} />
                                      </ComposedChart>
                                  </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div className="animate-fade-in-up stagger-10 bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 p-6 md:p-8 flex flex-col h-full hover:shadow-2xl transition-shadow duration-500">
                               <div className="flex items-start gap-2 mb-8 shrink-0 min-h-[44px]">
                                   <Clock className="w-5 h-5 text-amber-500 shrink-0"/>
                                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-tight">Jam Operasional (Bulanan)</h3>
                               </div>
                               <div className="h-[280px] md:h-[360px] w-full mt-auto">
                                 <ResponsiveContainer width="100%" height="100%">
                                     <BarChart data={selectedMex.history.slice(-12)} margin={{ top: 30, right: 0, left: -5, bottom: 5 }}>
                                         <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                         <XAxis dataKey="month" tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={formatMonth} height={20} dy={5} />
                                         <YAxis tick={{ fill: COLORS.slate500, fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} width={45} />
                                         <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border:'none', padding: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} labelFormatter={formatMonth}/>
                                         <Bar dataKey="operational_hours" name="Total Jam Online" fill="#f59e0b" radius={[4,4,0,0]} maxBarSize={32}>
                                             <LabelList dataKey="operational_hours" position="top" offset={10} fontSize={10} fontWeight={800} fill="#f59e0b" />
                                         </Bar>
                                     </BarChart>
                                 </ResponsiveContainer>
                               </div>
                           </div>
                       </div>
                   </div>
               )}

               <div className="animate-fade-in-up stagger-10 bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 mt-6 hover:shadow-2xl transition-shadow duration-500">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100"><Info className="w-5 h-5 text-indigo-500"/><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Informasi Kontak & Lokasi</h3></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                        <div className="w-10 h-10 bg-white text-indigo-500 rounded-xl flex items-center justify-center shadow-sm shrink-0"><Phone size={18}/></div>
                        <div className="min-w-0">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Telepon (Zeus)</p>
                           <p className="text-sm font-bold text-slate-800 truncate select-all">{selectedMex.phone || '-'}</p>
                        </div>
                     </div>
                     <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                        <div className="w-10 h-10 bg-white text-indigo-500 rounded-xl flex items-center justify-center shadow-sm shrink-0"><Mail size={18}/></div>
                        <div className="min-w-0">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                           <p className="text-sm font-bold text-slate-800 truncate select-all">{selectedMex.email || '-'}</p>
                        </div>
                     </div>
                     <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors sm:col-span-2 lg:col-span-1">
                        <div className="w-10 h-10 bg-white text-indigo-500 rounded-xl flex items-center justify-center shadow-sm shrink-0"><MapPin size={18}/></div>
                        <div className="min-w-0">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alamat</p>
                           <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-3">{selectedMex.address || '-'}</p>
                           {selectedMex.latitude && selectedMex.longitude && (
                               <a href={`https://www.google.com/maps?q=${selectedMex.latitude},${selectedMex.longitude}`} target="_blank" rel="noreferrer" className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 mt-2 inline-flex items-center gap-1">Buka di Maps <ExternalLink size={10}/></a>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className={`fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out flex items-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-2 md:p-3 rounded-[32px] panel-floating-nav ${showFloatingBar ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-32 opacity-0 scale-95 pointer-events-none'}`}>
                   <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4">
                       <button onClick={() => setSelectedMex(null)} className="panel-floating-btn w-12 h-12 flex items-center justify-center text-white hover:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-all duration-300 active:scale-90" title="Kembali">
                           <ArrowLeft className="w-5 h-5" />
                       </button>
                       <div className="w-px h-6 bg-slate-700/80 shrink-0 panel-floating-nav-divider"></div>
                       <button onClick={() => setShowPresentation(true)} className="panel-floating-btn w-12 h-12 flex items-center justify-center text-white hover:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-all duration-300 active:scale-90" title="Mode Presentasi">
                           <MonitorPlay className="w-5 h-5 text-emerald-400" />
                       </button>
                       {selectedMex.history && selectedMex.history.length > 0 && (
                           <Fragment>
                               <div className="w-px h-6 bg-slate-700/80 shrink-0 panel-floating-nav-divider"></div>
                               <button onClick={() => { const hist = selectedMex.history || []; const defaultMonths = [ hist.length > 2 ? hist[hist.length - 3].month : '', hist.length > 1 ? hist[hist.length - 2].month : '', hist.length > 0 ? hist[hist.length - 1].month : '' ]; setCompareMonths(defaultMonths); setShowCompareModal(true); }} className="panel-floating-btn w-12 h-12 flex items-center justify-center text-white hover:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-all duration-300 active:scale-90" title="Bandingkan Performa">
                                   <BarChart2 className="w-5 h-5" />
                               </button>
                           </Fragment>
                       )}
                       <div className="w-px h-6 bg-slate-700/80 shrink-0 panel-floating-nav-divider"></div>
                       <a href="https://mex-calculator.vercel.app/" target="_blank" rel="noopener noreferrer" className="panel-floating-btn w-12 h-12 flex items-center justify-center text-white hover:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-all duration-300 active:scale-90" title="Buka MEX Calculator">
                           <Calculator className="w-5 h-5" />
                       </a>
                       <div className="w-px h-6 bg-slate-700/80 shrink-0 panel-floating-nav-divider"></div>
                       <button onClick={() => { if (selectedMex.phone && selectedMex.phone !== '-') setShowWaModal(true); }} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 active:scale-90 ${selectedMex.phone && selectedMex.phone !== '-' ? 'bg-[#00B14F] text-white hover:bg-emerald-600 shadow-[0_0_20px_-5px_rgba(0,177,79,0.5)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed panel-floating-btn-disabled'}`} title="Hubungi via WhatsApp">
                           <MessageCircle className="w-5 h-5" />
                       </button>
                   </div>
               </div>

            </div>
          )}
        </div>
      </div>
    </main>
  </div>
  );
}
