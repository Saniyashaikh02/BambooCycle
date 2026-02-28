/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Leaf, Recycle, Factory, TrendingUp, ShieldAlert, Globe, 
  Package, ShoppingBag, Coffee, Briefcase, Zap, BarChart3,
  ChevronRight, Info, CheckCircle2, AlertTriangle, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Data Constants ---

const PLASTIC_DATA = [
  { name: 'Packaging', value: 141, color: '#ef4444' },
  { name: 'Textiles', value: 42, color: '#f97316' },
  { name: 'Consumer Products', value: 42, color: '#f59e0b' },
  { name: 'Transportation', value: 27, color: '#eab308' },
  { name: 'Construction', value: 65, color: '#84cc16' },
  { name: 'Other', value: 31, color: '#10b981' },
];

const MATERIAL_COMPARISON = [
  { 
    material: 'Bamboo', 
    decomp: '90-180 Days', 
    co2: -1.2, // Negative co2 (sequestration)
    water: 'Low', 
    reusability: 'High', 
    scalability: 'High', 
    cost: 'Medium' 
  },
  { 
    material: 'Plastic', 
    decomp: '450+ Years', 
    co2: 6.0, 
    water: 'High', 
    reusability: 'Low', 
    scalability: 'Extreme', 
    cost: 'Low' 
  },
  { 
    material: 'Paper', 
    decomp: '30-60 Days', 
    co2: 1.5, 
    water: 'Extreme', 
    reusability: 'Low', 
    scalability: 'High', 
    cost: 'Medium' 
  },
  { 
    material: 'Bioplastic', 
    decomp: '3-6 Months*', 
    co2: 2.5, 
    water: 'Medium', 
    reusability: 'Medium', 
    scalability: 'Medium', 
    cost: 'High' 
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: 'BambuFiber Food Trays',
    category: 'Food Service',
    description: 'Heat-pressed bamboo fiber trays for prepared meals and takeout.',
    complexity: 'Medium',
    cost: '$0.12 - $0.18',
    impact: 'High',
    diff: 'Microwave safe, oil resistant without PFAS coatings.'
  },
  {
    id: 2,
    name: 'Flexi-Bamboo Retail Bags',
    category: 'Retail Packaging',
    description: 'Woven bamboo cellulose bags with high tensile strength for grocery use.',
    complexity: 'Medium',
    cost: '$0.08 - $0.15',
    impact: 'Medium',
    diff: '10x stronger than paper, 100% home compostable.'
  },
  {
    id: 3,
    name: 'BambuBristle Oral Care',
    category: 'Personal Care',
    description: 'Ergonomic bamboo handles with castor-oil based bio-bristles.',
    complexity: 'Low',
    cost: '$0.40 - $0.60',
    impact: 'High',
    diff: 'Zero-plastic assembly, antimicrobial properties.'
  },
  {
    id: 4,
    name: 'Eco-Cushion Mailers',
    category: 'E-commerce',
    description: 'Bamboo-pulp padded envelopes for fragile shipping.',
    complexity: 'Medium',
    cost: '$0.25 - $0.45',
    impact: 'High',
    diff: 'Replaces bubble wrap mailers; lightweight yet protective.'
  },
  {
    id: 5,
    name: 'Institutional Cutlery Sets',
    category: 'Institutional',
    description: 'Bulk-manufactured bamboo cutlery for universities and hospitals.',
    complexity: 'Low',
    cost: '$0.03 - $0.05',
    impact: 'Extreme',
    diff: 'Lower carbon footprint than PLA; splinter-free finish.'
  },
  {
    id: 6,
    name: 'BambuLid Beverage Caps',
    category: 'Food Service',
    description: 'Universal fit lids for coffee cups and cold drinks.',
    complexity: 'High',
    cost: '$0.04 - $0.07',
    impact: 'High',
    diff: 'Precision molded for leak-proof seal without plastic liners.'
  },
  {
    id: 7,
    name: 'Bio-Bamboo Clamshells',
    category: 'Food Service',
    description: 'Hinged containers for burgers and salads.',
    complexity: 'Medium',
    cost: '$0.15 - $0.22',
    impact: 'High',
    diff: 'Stackable design, superior moisture barrier.'
  },
  {
    id: 8,
    name: 'BambuWrap Stretch Film',
    category: 'E-commerce',
    description: 'Bamboo-cellulose based industrial stretch wrap for pallets.',
    complexity: 'High',
    cost: '$12.00 / roll',
    impact: 'Extreme',
    diff: 'First industrial-grade bio-stretch wrap with 200% elongation.'
  },
  {
    id: 9,
    name: 'Hotel Amenity Kits',
    category: 'Personal Care',
    description: 'Bamboo-based combs, razors, and vanity kits.',
    complexity: 'Low',
    cost: '$1.20 / kit',
    impact: 'Medium',
    diff: 'Luxury feel, eliminates 15+ plastic items per guest stay.'
  },
  {
    id: 10,
    name: 'Agro-Bamboo Seedling Pots',
    category: 'Institutional',
    description: 'Biodegradable pots for commercial nurseries.',
    complexity: 'Low',
    cost: '$0.05 - $0.10',
    impact: 'Medium',
    diff: 'Plantable directly into soil; eliminates plastic pot waste.'
  }
];

// --- Components ---

const SectionHeader = ({ title, icon: Icon, id }: { title: string, icon: any, id?: string }) => (
  <div id={id} className="flex items-center gap-3 mb-8 border-b border-zinc-200 pb-4">
    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
      <Icon size={24} />
    </div>
    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight uppercase">{title}</h2>
  </div>
);

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white border border-zinc-200 rounded-xl p-6 shadow-sm", className)}>
    {children}
  </div>
);

const Stat = ({ label, value, subValue, icon: Icon }: { label: string, value: string, subValue?: string, icon?: any }) => (
  <div className="flex flex-col">
    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
      {Icon && <Icon size={12} />} {label}
    </span>
    <span className="text-3xl font-bold text-zinc-900 leading-none">{value}</span>
    {subValue && <span className="text-sm text-emerald-600 font-medium mt-1">{subValue}</span>}
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('problem');
  const [impactUsers, setImpactUsers] = useState(10000);

  const impactStats = useMemo(() => {
    const plasticPerUserYear = 35; // kg
    const co2PerKgPlastic = 6; // kg
    
    const plasticSaved = impactUsers * plasticPerUserYear;
    const co2Saved = plasticSaved * co2PerKgPlastic;
    const persistenceAvoided = plasticSaved * 450; // kg-years

    return {
      plastic: (plasticSaved / 1000).toFixed(1) + ' Tons',
      co2: (co2Saved / 1000).toFixed(1) + ' Tons',
      persistence: (persistenceAvoided / 1000000).toFixed(1) + 'M kg-yrs'
    };
  }, [impactUsers]);

  const navItems = [
    { id: 'problem', label: 'Problem', icon: Globe },
    { id: 'material', label: 'Material', icon: Leaf },
    { id: 'products', label: 'Innovation', icon: Package },
    { id: 'circular', label: 'Circular', icon: Recycle },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'impact', label: 'Impact', icon: BarChart3 },
    { id: 'bonus', label: 'Pitch', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold text-xl tracking-tight">BambuLogic</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                  activeTab === item.id 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                    : "text-zinc-600 hover:bg-zinc-100"
                )}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>
          <button className="bg-zinc-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-colors">
            Download Proposal
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Hackathon Proposal 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
              BAMBOO AS A <span className="text-emerald-600">SCALABLE</span> ALTERNATIVE TO PLASTICS.
            </h1>
            <p className="text-xl text-zinc-600 leading-relaxed mb-8">
              A systems-level engineering approach to replacing high-volume single-use plastics with high-performance, carbon-negative bamboo biomaterials.
            </p>
            <div className="flex flex-wrap gap-8">
              <Stat label="Global Plastic Waste" value="380M" subValue="Tons per year" icon={Globe} />
              <Stat label="Bamboo Growth" value="35in" subValue="Per 24 hours" icon={TrendingUp} />
              <Stat label="Carbon Sequestration" value="4x" subValue="More than trees" icon={Leaf} />
            </div>
          </motion.div>
        </section>

        {/* 1. Global Problem Analysis */}
        <section id="problem" className="mb-24 scroll-mt-24">
          <SectionHeader title="Global Problem Analysis" icon={Globe} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShieldAlert className="text-red-500" size={20} />
                The Plastic Lifecycle Crisis
              </h3>
              <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
                <p>
                  <strong className="text-zinc-900">Production:</strong> 99% of plastics are derived from fossil fuels. The extraction and refining process releases millions of tons of CO₂ and toxic pollutants.
                </p>
                <p>
                  <strong className="text-zinc-900">Usage:</strong> Single-use plastics (SUPs) have a functional lifespan of minutes but an environmental persistence of centuries.
                </p>
                <p>
                  <strong className="text-zinc-900">Disposal:</strong> Globally, only 9% of plastic is recycled. The rest ends up in landfills (overflowing), incinerators (releasing toxins), or the ocean.
                </p>
                <p>
                  <strong className="text-zinc-900">Persistence:</strong> Fragmentation leads to microplastic contamination in soil, water, and human bloodstreams, with unknown long-term biological consequences.
                </p>
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-bold mb-4">Plastic Waste by Sector (Million Tons)</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PLASTIC_DATA} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {PLASTIC_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-zinc-400 mt-4 italic">Source: UN Environment Programme (UNEP) Data Synthesis.</p>
            </Card>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-zinc-900 text-white rounded-xl">
              <h4 className="font-bold mb-2 text-emerald-400">Why Paper Fails</h4>
              <p className="text-sm opacity-80 leading-relaxed">High water usage, chemical bleaching, and low structural integrity for liquids. Leads to deforestation if not managed.</p>
            </div>
            <div className="p-6 bg-zinc-900 text-white rounded-xl">
              <h4 className="font-bold mb-2 text-emerald-400">Why Bioplastics Fail</h4>
              <p className="text-sm opacity-80 leading-relaxed">Most (like PLA) require industrial composting facilities to degrade. They contaminate traditional recycling streams.</p>
            </div>
            <div className="p-6 bg-zinc-900 text-white rounded-xl">
              <h4 className="font-bold mb-2 text-emerald-400">Why Metal Fails</h4>
              <p className="text-sm opacity-80 leading-relaxed">High energy intensity for extraction and manufacturing. Heavy for logistics, increasing transportation carbon footprint.</p>
            </div>
          </div>
        </section>

        {/* 2. Bamboo Analysis */}
        <section id="material" className="mb-24 scroll-mt-24">
          <SectionHeader title="Scientific & Economic Analysis" icon={Leaf} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Renewability Rate</h4>
                    <p className="text-sm text-zinc-600">Bamboo reaches maturity in 3-5 years, compared to 20-50 years for hardwood trees. It regenerates from its own roots after harvesting.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Mechanical Strength</h4>
                    <p className="text-sm text-zinc-600">Tensile strength of 28,000 psi (comparable to mild steel). High flexibility allows for diverse manufacturing processes.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                    <Recycle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Biodegradability</h4>
                    <p className="text-sm text-zinc-600">100% home compostable. Breaks down into nutrient-rich organic matter within 180 days in soil conditions.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Land Use Efficiency</h4>
                    <p className="text-sm text-zinc-600">Produces 35% more oxygen and sequesters 4x more CO₂ than an equivalent stand of trees. Requires zero pesticides.</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="bg-emerald-50 border-emerald-100">
              <h3 className="font-bold text-emerald-900 mb-4">Carbon Sequestration Potential</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Bamboo', co2: 62 },
                    { name: 'Hardwood', co2: 15 },
                    { name: 'Grass', co2: 8 }
                  ]}>
                    <XAxis dataKey="name" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="co2" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-emerald-700 mt-4">Tons of CO₂ sequestered per hectare per year.</p>
            </Card>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-zinc-900">Material</th>
                    <th className="px-6 py-4 font-bold text-zinc-900">Decomposition</th>
                    <th className="px-6 py-4 font-bold text-zinc-900">CO₂ Footprint</th>
                    <th className="px-6 py-4 font-bold text-zinc-900">Water Usage</th>
                    <th className="px-6 py-4 font-bold text-zinc-900">Reusability</th>
                    <th className="px-6 py-4 font-bold text-zinc-900">Cost Efficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {MATERIAL_COMPARISON.map((m) => (
                    <tr key={m.material} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 font-semibold">{m.material}</td>
                      <td className="px-6 py-4 text-zinc-600">{m.decomp}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-bold",
                          m.co2 < 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                          {m.co2 > 0 ? `+${m.co2}` : m.co2} kg/kg
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-600">{m.water}</td>
                      <td className="px-6 py-4 text-zinc-600">{m.reusability}</td>
                      <td className="px-6 py-4 text-zinc-600">{m.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* 3. Product Innovation Portfolio */}
        <section id="products" className="mb-24 scroll-mt-24">
          <SectionHeader title="Product Innovation Portfolio" icon={Package} />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {PRODUCTS.map((p) => (
              <motion.div 
                key={p.id}
                whileHover={{ y: -5 }}
                className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded text-[10px] font-bold uppercase tracking-wider">
                    {p.category}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-2 py-1 rounded",
                    p.impact === 'Extreme' ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"
                  )}>
                    {p.impact} Impact
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{p.name}</h3>
                <p className="text-sm text-zinc-500 mb-6 flex-grow">{p.description}</p>
                <div className="space-y-3 pt-4 border-t border-zinc-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Complexity</span>
                    <span className="font-semibold">{p.complexity}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Unit Cost</span>
                    <span className="font-semibold">{p.cost}</span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Differentiation</span>
                    <p className="text-[11px] leading-tight text-zinc-600">{p.diff}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Circular Economy Model */}
        <section id="circular" className="mb-24 scroll-mt-24">
          <SectionHeader title="Circular Economy Model" icon={Recycle} />
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-50 rounded-3xl -z-10 opacity-50" />
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Connector Lines (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-emerald-200 -translate-y-1/2 -z-10" />
                
                {[
                  { step: '01', title: 'Regenerative Sourcing', desc: 'Contract farming with smallholders using agroforestry techniques.', icon: Leaf },
                  { step: '02', title: 'Zero-Waste Processing', desc: 'Mechanical pulping; offcuts used for bio-energy or particle board.', icon: Factory },
                  { step: '03', title: 'Product Utility', desc: 'High-performance SUP replacement in food, retail, and logistics.', icon: ShoppingBag },
                  { step: '04', title: 'Bio-Return', desc: 'Home/industrial composting returning nutrients to the soil.', icon: Recycle },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-lg mb-4">
                      <item.icon size={24} />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 mb-1">{item.step}</span>
                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/80 backdrop-blur">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Zap className="text-yellow-500" size={18} />
                    The Sustainability Loop
                  </h4>
                  <ul className="space-y-3 text-sm text-zinc-600">
                    <li className="flex gap-2">
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
                      <span><strong className="text-zinc-900">Waste Valorization:</strong> Production scrap is converted into bio-char to enhance soil fertility in bamboo groves.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
                      <span><strong className="text-zinc-900">Energy Autonomy:</strong> Lignin extracted during processing can be used as a carbon-neutral fuel for manufacturing.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
                      <span><strong className="text-zinc-900">Water Recycling:</strong> Closed-loop water systems in pulping reduce freshwater demand by 85%.</span>
                    </li>
                  </ul>
                </Card>
                <Card className="bg-white/80 backdrop-blur">
                  <h4 className="font-bold mb-4">End-of-Life Strategy</h4>
                  <p className="text-sm text-zinc-600 mb-4">Unlike bioplastics that require specific conditions, our bamboo products are designed for <span className="font-bold text-zinc-900">Universal Degradation</span>.</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[90%]" />
                    </div>
                    <span className="text-xs font-bold">90 Days (Soil)</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[60%]" />
                    </div>
                    <span className="text-xs font-bold">120 Days (Marine)</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Business Model */}
        <section id="business" className="mb-24 scroll-mt-24">
          <SectionHeader title="Business Model & Scalability" icon={Briefcase} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h4 className="font-bold mb-4 text-emerald-600">Revenue Streams</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-zinc-50 pb-2">
                      <span>B2B Bulk Supply</span>
                      <span className="font-bold">65%</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-50 pb-2">
                      <span>Gov/Institutional Contracts</span>
                      <span className="font-bold">20%</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-50 pb-2">
                      <span>White-labeling for Brands</span>
                      <span className="font-bold">10%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>D2C Subscription</span>
                      <span className="font-bold">5%</span>
                    </li>
                  </ul>
                </Card>
                <Card>
                  <h4 className="font-bold mb-4 text-emerald-600">Cost Structure</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-zinc-50 pb-2">
                      <span>Raw Materials (Sourcing)</span>
                      <span className="font-bold">30%</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-50 pb-2">
                      <span>Manufacturing & R&D</span>
                      <span className="font-bold">40%</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-50 pb-2">
                      <span>Logistics & Distribution</span>
                      <span className="font-bold">20%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Marketing & Admin</span>
                      <span className="font-bold">10%</span>
                    </li>
                  </ul>
                </Card>
              </div>
              <Card>
                <h4 className="font-bold mb-4">Scalability Strategy</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-50 rounded-lg">
                    <span className="text-xs font-bold text-zinc-400 block mb-2">Phase 1: Local</span>
                    <p className="text-xs text-zinc-600">Establish 5 regional processing hubs near bamboo clusters to minimize transport emissions.</p>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-lg">
                    <span className="text-xs font-bold text-zinc-400 block mb-2">Phase 2: National</span>
                    <p className="text-xs text-zinc-600">Partner with major food delivery platforms (UberEats, DoorDash) for exclusive packaging supply.</p>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-lg">
                    <span className="text-xs font-bold text-zinc-400 block mb-2">Phase 3: Global</span>
                    <p className="text-xs text-zinc-600">License manufacturing technology to global FMCG companies for localized production.</p>
                  </div>
                </div>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="bg-zinc-900 text-white">
                <h4 className="font-bold mb-4 text-emerald-400">Break-Even Analysis</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs opacity-60 block">Initial Investment</span>
                    <span className="text-2xl font-bold">$2.5M</span>
                  </div>
                  <div>
                    <span className="text-xs opacity-60 block">Monthly OpEx</span>
                    <span className="text-2xl font-bold">$180k</span>
                  </div>
                  <div>
                    <span className="text-xs opacity-60 block">Projected Break-Even</span>
                    <span className="text-2xl font-bold text-emerald-400">Month 18</span>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-[10px] opacity-50 leading-tight">Assumes 15% month-over-month growth in B2B accounts and 20% reduction in unit costs through automation by Year 2.</p>
                  </div>
                </div>
              </Card>
              <Card>
                <h4 className="font-bold mb-4">Strategic Partnerships</h4>
                <div className="flex flex-wrap gap-2">
                  {['QSR Chains', 'Universities', 'Airports', 'Hospitals', 'Retail Giants'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-zinc-100 rounded-full text-xs font-medium">{tag}</span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* 8. Impact Simulation */}
        <section id="impact" className="mb-24 scroll-mt-24">
          <SectionHeader title="Impact Simulation Model" icon={BarChart3} />
          <Card className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">Simulate Your Impact</h3>
                <p className="text-zinc-600 mb-8">Adjust the number of active users to see the projected annual environmental savings of switching to BambuLogic solutions.</p>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="font-bold text-sm">Number of Users / Daily Consumers</label>
                      <span className="text-emerald-600 font-bold">{impactUsers.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1000" 
                      max="1000000" 
                      step="1000"
                      value={impactUsers}
                      onChange={(e) => setImpactUsers(parseInt(e.target.value))}
                      className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400 mt-2 font-bold uppercase tracking-widest">
                      <span>1k</span>
                      <span>500k</span>
                      <span>1M</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Plastic Saved</span>
                      <span className="text-xl font-bold text-zinc-900">{impactStats.plastic}</span>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">CO₂ Reduced</span>
                      <span className="text-xl font-bold text-zinc-900">{impactStats.co2}</span>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Persistence Avoided</span>
                      <span className="text-xl font-bold text-zinc-900">{impactStats.persistence}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200">
                <h4 className="font-bold mb-4 text-center">Environmental Persistence Avoided</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { year: 0, value: 0 },
                      { year: 1, value: parseFloat(impactStats.persistence) * 0.2 },
                      { year: 2, value: parseFloat(impactStats.persistence) * 0.5 },
                      { year: 3, value: parseFloat(impactStats.persistence) * 0.8 },
                      { year: 4, value: parseFloat(impactStats.persistence) * 1.2 },
                      { year: 5, value: parseFloat(impactStats.persistence) * 2.0 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                      <YAxis hide />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-zinc-400 mt-4 text-center italic">Cumulative impact over 5 years assuming 20% annual adoption growth.</p>
              </div>
            </div>
          </Card>
        </section>

        {/* 9. Risks & Mitigation */}
        <section className="mb-24">
          <SectionHeader title="Risks & Mitigation Strategy" icon={ShieldAlert} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { risk: 'Cost Barriers', desc: 'Bamboo products are currently 15-30% more expensive than virgin plastic.', mitigation: 'Economies of scale and carbon credit monetization to offset unit costs.' },
              { risk: 'Moisture Resistance', desc: 'Natural fibers can absorb moisture, affecting structural integrity.', mitigation: 'Proprietary bio-wax coatings derived from plant resins for superior barriers.' },
              { risk: 'Supply Instability', desc: 'Reliance on specific geographic regions for raw bamboo.', mitigation: 'Diversified sourcing across SE Asia, Latin America, and Africa; local stockpiling.' },
              { risk: 'Consumer Adoption', desc: 'Resistance to change in tactile experience (e.g., straws).', mitigation: 'Precision engineering to match plastic mouthfeel and durability during use.' },
            ].map((item, i) => (
              <Card key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 text-red-500">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-1">{item.risk}</h4>
                  <p className="text-xs text-zinc-500 mb-2">{item.desc}</p>
                  <div className="p-2 bg-emerald-50 rounded border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">Mitigation</span>
                    <p className="text-[11px] text-emerald-800 leading-tight">{item.mitigation}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 10. Conclusion */}
        <section className="mb-24">
          <div className="bg-emerald-900 text-white rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-400 blur-[120px] rounded-full" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400 blur-[120px] rounded-full" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Systems-Level Sustainability.</h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Bamboo is not just a material replacement; it is a catalyst for a regenerative economy. By aligning biology with industrial engineering, we can eliminate plastic waste at the source.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button className="bg-emerald-500 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-400 transition-all flex items-center gap-2">
                Join the Revolution <ArrowRight size={20} />
              </button>
              <div className="text-left">
                <p className="text-sm font-bold">Investment Ready</p>
                <p className="text-xs opacity-60">Series A Funding Round Open Q3 2026</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bonus Section */}
        <section id="bonus" className="mb-24 scroll-mt-24">
          <SectionHeader title="Bonus: Startup Branding & Pitch" icon={Zap} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Branding</h4>
                <div className="p-6 bg-zinc-50 rounded-xl border border-zinc-100">
                  <h3 className="text-3xl font-black text-emerald-600 mb-1">BambuLogic</h3>
                  <p className="text-zinc-500 font-medium italic">"Nature's Engineering, Scaled."</p>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">2-Minute Pitch Script</h4>
                <div className="text-sm text-zinc-600 italic leading-relaxed bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                  "Every minute, a truckload of plastic enters our oceans. We've tried paper—it gets soggy. We've tried bioplastics—they don't degrade. At BambuLogic, we've engineered the ultimate solution. Using the world's fastest-growing plant, we've created a portfolio of products that match plastic's performance but return to the earth as nutrients in 90 days. We aren't just selling straws; we're building a carbon-negative supply chain for the world's biggest brands. Join us in making plastic history."
                </div>
              </div>
            </Card>
            <Card>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">5-Slide Presentation Outline</h4>
              <div className="space-y-4">
                {[
                  { slide: '01', title: 'The Plastic Trap', desc: 'The $400B problem of environmental persistence.' },
                  { slide: '02', title: 'The Bamboo Advantage', desc: 'Why biology beats chemistry in material science.' },
                  { slide: '03', title: 'Product-Market Fit', desc: 'Our 10-product portfolio replacing high-volume SUPs.' },
                  { slide: '04', title: 'The Circular Engine', desc: 'How our zero-waste model drives profitability.' },
                  { slide: '05', title: 'The Roadmap', desc: 'Scaling from regional hubs to a global standard.' },
                ].map((s) => (
                  <div key={s.slide} className="flex gap-4 items-center">
                    <span className="text-lg font-black text-emerald-200">{s.slide}</span>
                    <div>
                      <h5 className="font-bold text-sm">{s.title}</h5>
                      <p className="text-xs text-zinc-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-100">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Innovation Highlights</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <Zap size={14} /> AI-Driven Supply Chain Optimization
                  </li>
                  <li className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <Zap size={14} /> Blockchain Impact Tracking (Seed-to-Soil)
                  </li>
                  <li className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <Zap size={14} /> Proprietary Bio-Resin Moisture Barriers
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-900 rounded flex items-center justify-center text-white text-xs font-bold">B</div>
            <span className="font-bold tracking-tight">BambuLogic Systems</span>
          </div>
          <p className="text-xs text-zinc-400">© 2026 BambuLogic. All rights reserved. Designed for the Global Sustainability Hackathon.</p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-400 hover:text-emerald-600 transition-colors"><Globe size={18} /></a>
            <a href="#" className="text-zinc-400 hover:text-emerald-600 transition-colors"><Briefcase size={18} /></a>
            <a href="#" className="text-zinc-400 hover:text-emerald-600 transition-colors"><Info size={18} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
