import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ScanLine,
  ShieldAlert,
  Sparkles,
  BotMessageSquare,
  Globe,
  History,
  Landmark,
  CircleDollarSign,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Users,
  Clock,
  HelpCircle,
  Sprout,
  Activity
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CROPS_LIST } from '../data/mockDiseases';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const problemPoints = [
    {
      icon: HelpCircle,
      title: 'Difficult Disease Identification',
      desc: 'Subtle fungal and bacterial symptoms are frequently misdiagnosed as nutrient deficiencies or heat stress, leading to erroneous remedies.'
    },
    {
      icon: Users,
      title: 'Limited Agricultural Expert Access',
      desc: 'Agronomists and extension officers cannot be present in every village immediately during sudden post-rain disease outbreaks.'
    },
    {
      icon: Clock,
      title: 'Delayed Treatment Decisions',
      desc: 'Fungal pathogens like Late Blight double their infection perimeter in 48 hours; waiting days for manual diagnosis often ruins harvests.'
    },
    {
      icon: AlertTriangle,
      title: 'Lack of Personalized Guidance',
      desc: 'Over-the-counter chemical recommendations can be hazardous, inappropriate for the specific crop stage, or cost-prohibitive.'
    }
  ];

  const solutionFeatures = [
    {
      icon: ScanLine,
      title: 'AI Disease Detection',
      desc: 'Computer vision algorithms pinpoint pathogenetic symptoms from simple leaf photos in seconds.',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
    },
    {
      icon: Activity,
      title: 'Severity Analysis',
      desc: 'Classifies infections into Healthy, Low, Moderate, or Severe to prioritize urgent field containment.',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
    },
    {
      icon: ShieldAlert,
      title: 'Treatment Recommendations',
      desc: 'Immediate field hygiene actions, bio-fungicides, and safe preventive crop rotation protocols.',
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
    },
    {
      icon: BotMessageSquare,
      title: 'AI Agriculture Assistant',
      desc: '24/7 conversational companion answering specific queries regarding fertilizers, pest traps, and spraying.',
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400'
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      desc: 'Designed for Indian farmers with full regional translation in English, தமிழ் (Tamil), తెలుగు (Telugu), and हिन्दी (Hindi).',
      color: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400'
    },
    {
      icon: History,
      title: 'Disease History',
      desc: 'Maintain chronological crop records, track plot recovery, and download previous diagnostic summaries.',
      color: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
    },
    {
      icon: Landmark,
      title: 'Government Schemes',
      desc: 'Discover verified agricultural subsidies, PM-KISAN, crop insurance (PMFBY), and farm mechanization grants.',
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
    },
    {
      icon: CircleDollarSign,
      title: 'Profit Tracking',
      desc: 'Track seed, fertilizer, labor, and pesticide expenses in ₹ to calculate precise net harvest profits.',
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Upload Crop Image',
      desc: 'Capture or upload a clear smartphone photo of the affected leaf showing both sides.'
    },
    {
      num: '02',
      title: 'AI Analyzes Image',
      desc: 'Our vision model extracts morphological leaf contours and pathological color signatures.'
    },
    {
      num: '03',
      title: 'Disease & Severity Detected',
      desc: 'Get an accurate diagnosis with percentage confidence meter and infection grading.'
    },
    {
      num: '04',
      title: 'Receive Treatment Guidance',
      desc: 'Follow immediate biological, chemical, and field hygiene action steps to save your harvest.'
    }
  ];

  return (
    <div className="space-y-24 py-6 sm:py-12 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <Badge variant="emerald" icon={<Sparkles className="w-3.5 h-3.5" />}>
              Next-Generation Agricultural AI
            </Badge>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-forest dark:text-stone-50 leading-[1.15]">
              Protect Your Crops with <br className="hidden sm:inline" />
              <span className="text-agri-600 dark:text-agri-400">AI-Powered</span> Intelligence
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
              Detect crop diseases early, understand their severity, and get personalized treatment
              guidance with AgriSense. Built to safeguard harvests and increase farmer prosperity.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                onClick={() => navigate('/detect')}
                icon={<ScanLine className="w-5 h-5" />}
              >
                Detect Crop Disease
              </Button>

              <a href="#how-it-works">
                <Button variant="outline" size="lg">
                  Explore AgriSense
                </Button>
              </a>
            </div>

            {/* Micro proof points */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-200 dark:border-darkbg-border">
              <div>
                <p className="text-xl sm:text-2xl font-black text-forest dark:text-agri-400">98%</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Accuracy Rate</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-forest dark:text-agri-400">&lt; 3s</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Scan Time</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-forest dark:text-agri-400">4 Languages</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Farmer-friendly</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Leaf with AI Scan HUD */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-darkbg-card bg-stone-900 group">
              <img
                src="https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80"
                alt="Tomato Leaf Under AI Scan"
                className="w-full aspect-4/5 object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />

              {/* Laser Scanning Line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] animate-scan-laser" />

              {/* HUD Graphics */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-xs font-mono text-emerald-400 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  AGRISENSE_SCANNER
                </span>
                <span>MATCH: 94.5%</span>
              </div>

              {/* Floating Diagnosis Result Card */}
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-white/95 dark:bg-darkbg-card/95 backdrop-blur-md border border-emerald-500/30 shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-agri-700 dark:text-agri-400">
                    Diagnosis Complete
                  </span>
                  <Badge variant="amber" size="sm">
                    Moderate Severity
                  </Badge>
                </div>
                <h4 className="text-base font-extrabold text-stone-900 dark:text-white">
                  Tomato — Early Blight
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                  Pathogen: Alternaria solani. Target-like lesions detected on lower canopy.
                </p>
                <div className="pt-1 flex items-center justify-between text-xs text-agri-600 dark:text-agri-400 font-semibold">
                  <span>Action plan formulated</span>
                  <span>View Details →</span>
                </div>
              </div>
            </div>

            {/* Decorative background blur ring */}
            <div className="absolute -inset-4 bg-agri-400/20 rounded-3xl filter blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="bg-stone-100/60 dark:bg-darkbg-surface/50 border-y border-stone-200/80 dark:border-darkbg-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              The Agricultural Dilemma
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              Early Detection Can Save Your Harvest
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Crops face relentless fungal, bacterial, and viral threats. Without immediate diagnostic certainty, small outbreaks turn into catastrophic field loss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problemPoints.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-6 shadow-xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="emerald">Comprehensive Ecosystem</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest dark:text-stone-100 tracking-tight">
            One Smart Platform for Smarter Farming
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            From initial leaf scan to treatment plans, expert chatbot assistance, government subsidies, and farm profit tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutionFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="bg-earth-100/50 dark:bg-darkbg-surface/60 py-16 border-y border-stone-200 dark:border-darkbg-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-agri-700 dark:text-agri-400">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-forest dark:text-stone-100 tracking-tight">
              How AgriSense Works in the Field
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Fast, accessible, and works right from your mobile device directly in your field.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-6 shadow-xs space-y-3"
              >
                <span className="text-3xl font-black text-agri-200 dark:text-agri-950 font-mono">
                  {step.num}
                </span>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {step.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SUPPORTED CROPS SECTION */}
      <section id="supported-crops" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="blue">Broad Agronomic Coverage</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest dark:text-stone-100 tracking-tight">
            Supported Agricultural Crops
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Trained on thousands of certified plant pathology sample records.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Tomato', emoji: '🍅', diseases: 'Early Blight, Late Blight, Healthy' },
            { name: 'Potato', emoji: '🥔', diseases: 'Early Blight, Late Blight, Healthy' },
            { name: 'Rice', emoji: '🌾', diseases: 'Brown Spot, Leaf Blight, Healthy' },
            { name: 'Apple', emoji: '🍎', diseases: 'Apple Scab, Black Rot, Healthy' },
            { name: 'Cotton', emoji: '🌿', diseases: 'Bacterial Blight, Leaf Curl, Healthy' },
            { name: 'Maize', emoji: '🌽', diseases: 'Common Rust, Leaf Blight, Healthy' },
            { name: 'Pepper', emoji: '🫑', diseases: 'Bacterial Spot, Early Blight, Healthy' },
            { name: 'Grape', emoji: '🍇', diseases: 'Black Rot, Powdery Mildew, Healthy' }
          ].map((crop, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border flex flex-col items-center text-center space-y-2 hover:border-agri-500 transition-colors shadow-2xs"
            >
              <span className="text-3xl">{crop.emoji}</span>
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">{crop.name}</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">{crop.diseases}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION (CTA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-forest via-agri-800 to-forest-dark text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-300">
              Start Protecting Today
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Give Your Crops a Smarter Future
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Detect diseases before they devastate yields. Join farmers who make smarter decisions with AgriSense.
            </p>
            <div className="pt-2">
              <Button
                size="lg"
                onClick={() => navigate('/detect')}
                className="bg-white text-forest hover:bg-emerald-50 focus:ring-white shadow-xl"
                icon={<ArrowRight className="w-5 h-5 text-agri-600" />}
              >
                Start Detection
              </Button>
            </div>
          </div>

          {/* Background decorative leaf */}
          <Sprout className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 pointer-events-none" />
        </div>
      </section>
    </div>
  );
};
