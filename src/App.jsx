import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端（若未配置环境变量则自动降级为 Mock 数据模式）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 假数据：奢华包袋与腕表商品
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Vintage Hermès Birkin 30',
    category: 'Handbags',
    priceUSD: 18500,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    description: 'Classic Togo leather with gold hardware. Excellent vintage condition.',
  },
  {
    id: 2,
    name: 'Rolex Daytona 116500LN',
    category: 'Watches',
    priceUSD: 28000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    description: 'Black dial, Oystersteel bracelet, ceramic bezel. Full set box & papers.',
  },
  {
    id: 3,
    name: 'Chanel Classic Double Flap Medium',
    category: 'Handbags',
    priceUSD: 9800,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
    description: 'Black caviar skin with gold-tone metal hardware.',
  },
  {
    id: 4,
    name: 'Patek Philippe Nautilus 5711/1A',
    category: 'Watches',
    priceUSD: 115000,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
    description: 'Iconic blue dial stainless steel luxury sports watch.',
  }
];

const CURRENCY_RATES = {
  USD: { symbol: '$', rate: 1 },
  MYR: { symbol: 'RM', rate: 4.7 },
  SGD: { symbol: 'S$', rate: 1.35 },
  EUR: { symbol: '€', rate: 0.92 }
};

export default function App() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 尝试从 Supabase 获取数据，若失败或没准备好则显示假数据
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (data && data.length > 0 && !error) {
          setProducts(data);
        }
      } catch (e) {
        // 使用默认 Mock 数据
      }
    }
    fetchProducts();
  }, []);

  const formatPrice = (priceInUSD) => {
    const { symbol, rate } = CURRENCY_RATES[selectedCurrency];
    const converted = (priceInUSD * rate).toLocaleString(undefined, {
      maximumFractionDigits: 0
    });
    return `${symbol} ${converted}`;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* 顶栏 Navigation */}
      <nav className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-serif tracking-widest text-amber-400">CCC LUXURY</div>
        <div className="flex items-center gap-4">
          <label className="text-xs text-neutral-400 uppercase">Currency:</label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="bg-neutral-800 text-amber-200 border border-neutral-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-amber-500"
          >
            {Object.keys(CURRENCY_RATES).map((curr) => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>
      </nav>

      {/* Hero Banner */}
      <header className="py-16 text-center px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-neutral-100 mb-4 tracking-tight">
          Curated Luxury Timepieces & Leather Goods
        </h1>
        <p className="text-neutral-400 text-sm md:text-base">
          Exclusive collection of high-end luxury assets, authenticated and preserved.
        </p>
      </header>

      {/* 商品列表 Product Grid */}
      <main className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedProduct(item)}
            className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all group flex flex-col justify-between"
          >
            <div className="aspect-square overflow-hidden bg-neutral-800">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-400/80 font-medium">
                  {item.category}
                </span>
                <h3 className="font-medium text-neutral-200 text-base mt-1 line-clamp-1">{item.name}</h3>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-between items-center">
                <span className="text-amber-300 font-semibold">{formatPrice(item.priceUSD)}</span>
                <span className="text-xs text-neutral-400 group-hover:text-amber-400 transition-colors">View Details →</span>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* 商品详情 Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-lg w-full overflow-hidden relative p-6">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <span className="text-xs text-amber-400 uppercase tracking-wider">{selectedProduct.category}</span>
            <h2 className="text-2xl font-serif text-neutral-100 mt-1">{selectedProduct.name}</h2>
            <p className="text-amber-300 text-xl font-bold mt-2">{formatPrice(selectedProduct.priceUSD)}</p>
            <p className="text-neutral-400 text-sm mt-3">{selectedProduct.description}</p>

            <div className="mt-6 flex gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hi, I am interested in ${selectedProduct.name} (${formatPrice(selectedProduct.priceUSD)})`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-center py-3 rounded-lg font-medium transition-colors"
              >
                Inquire via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
