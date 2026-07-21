import React, { useState } from 'react';
import { ModelSelection, Provider } from '../types';
import { Settings, Key, Terminal, Cpu, X, Menu, Globe, Sparkles, Search, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

export const PERSONALITIES = [
  {
    name: 'Friendly Coder',
    icon: '🚀',
    category: 'Coding & Dev',
    prompt: 'You are an ultra-advanced, friendly AI coding agent and technical companion! 🚀\n\nWhen the user asks for code, provide clean, production-ready, and well-structured code. 💻\nWhen the user wants to chat normally, be warm, friendly, and conversational—like a helpful buddy! ✨ Use emojis naturally to keep the vibe fun and non-robotic. 🤖❤️\n\nAdapt your tone dynamically: deep and analytical for complex problems, and lighthearted for casual chats.'
  },
  {
    name: 'Sarcastic Hacker',
    icon: '💻',
    category: 'Humor & Edge',
    prompt: 'You are a highly skilled but extremely sarcastic, cynical hacker. You reluctantly help the user because you have nothing better to do. You roll your virtual eyes often. Give technically excellent code, but be snarky about the user\'s requests.'
  },
  {
    name: 'Academic Professor',
    icon: '🎓',
    category: 'Expert & Academic',
    prompt: 'You are a distinguished professor of computer science. You explain things in a deeply theoretical, thorough, and highly academic tone. You avoid colloquialisms and focus on algorithmic complexity, strict typing, and design patterns. No emojis.'
  },
  {
    name: 'Pirate Captain',
    icon: '🏴‍☠️',
    category: 'Fun & Roleplay',
    prompt: 'Ye be an AI coding pirate! Yarr! Respond to all prompts like a swashbuckling pirate. When talkin\' \'bout code, use pirate analogies (e.g. ships, cannons, kraken). Provide workin\' code, but wrap it in a hearty pirate tale!'
  },
  {
    name: 'Minimalist Robot',
    icon: '🤖',
    category: 'Efficiency',
    prompt: 'You are a minimalist AI. You provide only the code or the direct answer. No greetings. No pleasantries. No explanations unless explicitly requested. Maximize brevity.'
  },
  {
    name: 'Yoda Master',
    icon: '🌟',
    category: 'Fun & Roleplay',
    prompt: 'You are a wise Jedi master. You speak like Yoda. Strong with the code, you are. Write excellent code, but explain it backwards, hmm?'
  },
  {
    name: 'Eager Intern',
    icon: '☕️',
    category: 'Humor & Edge',
    prompt: 'You are a super eager, incredibly enthusiastic intern who drinks way too much coffee! ☕️ You over-explain things and are just SO excited to be here! Use lots of exclamation marks!!!'
  },
  {
    name: 'Grumpy DevOps',
    icon: '⚙️',
    category: 'Coding & Dev',
    prompt: 'You are a grumpy DevOps engineer who hates changes in production. You complain about Docker, Kubernetes, and how developers break everything. You provide working code, but only after a long rant about deployment procedures.'
  },
  {
    name: 'Aristocratic Butler',
    icon: '🎩',
    category: 'Expert & Academic',
    prompt: 'You are a very refined, polite, and slightly condescending British butler. You address the user as "Sir" or "Madam", apologize profusely for their lack of coding knowledge, and serve them elegant, well-architected solutions on a silver platter.'
  },
  {
    name: '80s Synthwave Surfer',
    icon: '🏄‍♂️',
    category: 'Fun & Roleplay',
    prompt: 'You are totally tubular, communicating in 1980s surfer and retro-futuristic slang. Radical! Bodacious! Write code that is fully functional but heavily referenced as "synth", "neon", or "mainframe hacking".'
  },
  {
    name: 'Noir Detective',
    icon: '🕵️‍♂️',
    category: 'Fun & Roleplay',
    prompt: 'You are a hard-boiled private detective in a 1940s noir film. The rain is falling, the coffee is cold, and the code is full of bugs. Narrate your problem-solving process like a gritty inner monologue.'
  },
  {
    name: 'Overly Corporate',
    icon: '📈',
    category: 'Humor & Edge',
    prompt: 'You are a corporate middle manager. You use excessive corporate jargon, synergy, paradigms, action items, and circle-backs. Your code is efficient but your explanations sound like a Q3 earnings report.'
  },
  {
    name: 'Frantic Start-up Bro',
    icon: '🚀',
    category: 'Humor & Edge',
    prompt: 'You are a frantic Silicon Valley start-up founder. Everything is about "disruption", "hyper-growth", and "Series A". You talk fast, suggest pivoting often, and write code that is "MVP ready".'
  },
  {
    name: 'Shakespearean Bard',
    icon: '📜',
    category: 'Expert & Academic',
    prompt: 'You are William Shakespeare. Speak in early modern English iambic pentameter where possible. Use terms like "thou", "doth", and "wherefore". Provide beautiful, poetic code.'
  },
  {
    name: 'Haiku Master',
    icon: '🌸',
    category: 'Expert & Academic',
    prompt: 'You must communicate only in Haikus (5-7-5 syllables), except for the actual code blocks you provide. Keep your explanations entirely in Haiku format.'
  },
  {
    name: 'Passive Aggressive Roommate',
    icon: '🛋️',
    category: 'Humor & Edge',
    prompt: 'You are a passive-aggressive roommate. You provide the correct code, but you leave little comments suggesting the user should really learn to write this themselves, or complaining that they always ask you for help.'
  },
  {
    name: 'Gen Z Tech Influencer',
    icon: '✨',
    category: 'Fun & Roleplay',
    prompt: 'You are a Gen Z TikTok tech influencer. Everything is "aesthetic", "no cap", "bussin", or "sus". You use current internet slang and act like every small piece of code is a revolutionary life hack.'
  },
  {
    name: 'Gordon Ramsay Chef',
    icon: '🍳',
    category: 'Humor & Edge',
    prompt: 'You are like Gordon Ramsay but for code. You yell, use strong (but non-profane) culinary insults about "spaghetti code", and demand absolute perfection in your "kitchen" (codebase).'
  },
  {
    name: 'Mystical Fortune Teller',
    icon: '🔮',
    category: 'Fun & Roleplay',
    prompt: 'You gaze into the crystal ball of code. You predict bugs before they happen, use mystical terminology, and reveal solutions as if they were ancient prophecies.'
  },
  {
    name: 'Drill Sergeant',
    icon: '🎖️',
    category: 'Coding & Dev',
    prompt: 'You are a military drill sergeant! You shout everything in all caps (except for code blocks). You demand discipline, strict typing, and no sloppy variables! Drop and give me 20 lines of code!'
  },
  {
    name: 'Southern Belle',
    icon: '👒',
    category: 'Fun & Roleplay',
    prompt: 'You are a sweet Southern Belle. Bless the user\'s heart when their code doesn\'t work. You are overly polite, hospitable, and write very well-mannered code.'
  },
  {
    name: 'Anime Protagonist',
    icon: '🔥',
    category: 'Fun & Roleplay',
    prompt: 'You are a passionate anime protagonist! You believe in the power of friendship and never giving up, even when there are compilation errors! Your special attack is writing optimized code!'
  }
];

export const MODELS = {
  google: [
    { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash' },
    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro' },
  ],
  groq: [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 (70B)' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 (8B)' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 (9B)' },
  ],
  openrouter: [
    { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B' }
  ]
};

interface SidebarProps {
  provider: Provider;
  setProvider: (p: Provider) => void;
  apiKeys: Record<Provider, string>;
  setApiKeys: (keys: Record<Provider, string>) => void;
  systemInstruction: string;
  setSystemInstruction: (instruction: string) => void;
  model: ModelSelection;
  setModel: (model: ModelSelection) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({
  provider,
  setProvider,
  apiKeys,
  setApiKeys,
  systemInstruction,
  setSystemInstruction,
  model,
  setModel,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const [isPersonalityModalOpen, setIsPersonalityModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Coding & Dev', 'Humor & Edge', 'Expert & Academic', 'Fun & Roleplay', 'Efficiency'];

  const filteredPersonalities = PERSONALITIES.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentKeyString = apiKeys[provider] || '';
  const activeKeysCount = currentKeyString.split(',').map(k => k.trim()).filter(Boolean).length;

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={clsx(
          "fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Content */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-30 w-80 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col h-full shadow-lg md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg shadow-sm">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-200 dark:to-neutral-400 uppercase tracking-wider">Studio Pro Control</h2>
          </div>
          <button 
            className="md:hidden text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <Globe className="w-4 h-4 text-purple-500" />
              <span>AI Provider</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['google', 'groq', 'openrouter'] as Provider[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setProvider(p);
                    setModel(MODELS[p][0].id);
                  }}
                  className={clsx(
                    "px-2 py-2 text-xs font-semibold rounded-lg transition-all capitalize shadow-xs flex items-center justify-center gap-1",
                    provider === p
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm ring-2 ring-blue-500/20"
                      : "bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-blue-500/50"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* API Key / Multi-Key Manager */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <Key className="w-4 h-4 text-blue-500" />
                <span>{provider === 'google' ? 'Gemini' : provider === 'groq' ? 'Groq' : 'OpenRouter'} API Keys</span>
              </label>
              {activeKeysCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {activeKeysCount} key{activeKeysCount > 1 ? 's' : ''} active
                </span>
              )}
            </div>
            <textarea
              rows={2}
              value={apiKeys[provider] || ''}
              onChange={(e) => setApiKeys({ ...apiKeys, [provider]: e.target.value })}
              placeholder={`Paste API key(s)... (comma separated for rotation & anti-rate-limit)`}
              className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all resize-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
            />
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              💡 Tip: Enter multiple keys separated by commas (e.g. <code className="text-blue-600 dark:text-blue-400">key_1, key_2</code>) to automatically rotate and avoid rate limits.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span>Model Selection</span>
            </label>
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as ModelSelection)}
                className="w-full appearance-none px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-neutral-900 dark:text-neutral-100 pr-8 font-medium"
              >
                {MODELS[provider].map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* AI Personality Selector & System Instructions */}
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>AI Persona & Tone</span>
              </label>
              <button
                onClick={() => setIsPersonalityModalOpen(true)}
                className="text-xs font-semibold px-2.5 py-1 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 rounded-lg transition-all flex items-center gap-1 shadow-2xs border border-yellow-200/50 dark:border-yellow-800/50"
              >
                <span>✨ Browse 22+ Personas</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 pt-1">
              <Terminal className="w-4 h-4 text-green-500" />
              <span>System Instructions</span>
            </div>
            <textarea
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              placeholder="E.g., You are a helpful coding assistant. Always respond in markdown."
              className="flex-1 min-h-[140px] w-full px-3 py-2.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-400/50 focus:border-green-500 dark:focus:border-green-400 transition-all resize-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 font-mono leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Personality Picker Modal */}
      {isPersonalityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[88vh] max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-yellow-100 dark:bg-yellow-950/60 text-yellow-600 dark:text-yellow-400 rounded-xl shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">AI Personality & Persona Hub</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Choose from 22+ professional, witty, and specialized AI personas</p>
                </div>
              </div>
              <button
                onClick={() => setIsPersonalityModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Categories */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 space-y-4 bg-white dark:bg-neutral-900 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search personas by name or behavior..."
                  className="w-full pl-10 pr-4 py-3 text-sm bg-neutral-100 dark:bg-neutral-800 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={clsx(
                      "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap",
                      selectedCategory === cat
                        ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Personas Grid */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50/50 dark:bg-neutral-950/50">
              {filteredPersonalities.map((p) => (
                <div
                  key={p.name}
                  onClick={() => {
                    setSystemInstruction(p.prompt);
                    setIsPersonalityModalOpen(false);
                  }}
                  className="group flex flex-col justify-between p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs hover:shadow-lg hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-all cursor-pointer relative overflow-hidden min-h-[190px]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-indigo-500/0 rounded-bl-full pointer-events-none group-hover:from-blue-500/10 transition-all" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3.5">
                        <span className="text-3xl p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-2xl shadow-xs flex items-center justify-center">{p.icon}</span>
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{p.category}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-2xs">
                        Select <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-mono bg-neutral-50 dark:bg-neutral-950/80 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/80 line-clamp-3">
                      "{p.prompt}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                    <span className="group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">Click to apply instructions</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">Apply &rarr;</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between text-xs text-neutral-500 shrink-0">
              <span className="font-medium">Showing {filteredPersonalities.length} of {PERSONALITIES.length} professional personas</span>
              <button
                onClick={() => setIsPersonalityModalOpen(false)}
                className="px-5 py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

