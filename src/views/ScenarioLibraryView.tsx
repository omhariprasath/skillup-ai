import React, { useState } from 'react';
import { Scenario, ScenarioCategory } from '../types';
import { 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  DollarSign, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Search,
  CheckCircle,
  X
} from 'lucide-react';

interface ScenarioLibraryViewProps {
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
  onAddCustomScenario: (scenario: Scenario) => void;
}

export const ScenarioLibraryView: React.FC<ScenarioLibraryViewProps> = ({
  scenarios,
  onSelectScenario,
  onAddCustomScenario,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New scenario form state
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPersona, setNewPersona] = useState('');
  const [newTemperament, setNewTemperament] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState<ScenarioCategory>('executive');

  const categories = [
    { id: 'all', label: 'All Scenarios' },
    { id: 'academic', label: 'Academic Defense', icon: GraduationCap },
    { id: 'executive', label: 'Executive Briefing', icon: Briefcase },
    { id: 'negotiation', label: 'Negotiation', icon: DollarSign },
    { id: 'conflict', label: 'Conflict Resolution', icon: Users },
    { id: 'interview', label: 'Case Interview', icon: Sparkles },
  ];

  const filteredScenarios = scenarios.filter(s => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesQuery =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.personaName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleCreateScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuestion.trim()) return;

    const created: Scenario = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      subtitle: `Custom behavioral drill with ${newPersona || 'Advisor'}`,
      category: newCategory,
      difficulty: 'High-Stakes',
      estimatedMinutes: 4,
      personaName: newPersona || 'Executive Partner',
      personaRole: newRole || 'Senior Decision Maker',
      personaAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      personaTemperament: newTemperament || 'Rigorous, pragmatic, direct',
      description: `Practice handling high-stakes inquiries from ${newPersona || 'Executive Partner'}.`,
      contextPrompt: `Custom simulation for ${newTitle}.`,
      initialQuestion: newQuestion,
      keySkills: ['Composure Under Pressure', 'Clear Argumentation', 'Direct Delivery'],
      suggestedOpening: 'Thank you for the prompt. The core conclusion we must prioritize is...',
    };

    onAddCustomScenario(created);
    setIsModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewRole('');
    setNewPersona('');
    setNewTemperament('');
    setNewQuestion('');
  };

  return (
    <div className="space-y-7 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#3525cd]">
            <BookOpen className="w-4 h-4" />
            <span>Scenario Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Curated High-Stakes Communication Drills
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Select a high-pressure scenario to practice with AI interlocutors designed to emulate skeptical committee chairs, impatient executives, and negotiation partners.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-xs transition-transform active:scale-[0.99] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Scenario</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Filter Buttons (Functional segmented buttons) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by topic or role..."
            className="w-full bg-white pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenarios.map(scenario => {
          return (
            <div
              key={scenario.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    {scenario.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {scenario.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#3525cd] transition-colors leading-snug">
                  {scenario.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {scenario.description}
                </p>

                {/* Persona Info */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={scenario.personaAvatar}
                    alt={scenario.personaName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div className="text-xs truncate">
                    <div className="font-semibold text-slate-900 truncate">{scenario.personaName}</div>
                    <div className="text-slate-400 text-[11px] truncate">{scenario.personaRole}</div>
                  </div>
                </div>

                {/* Initial Question Preview */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 italic">
                  "{scenario.initialQuestion.slice(0, 100)}..."
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">~{scenario.estimatedMinutes} mins drill</span>
                <button
                  onClick={() => onSelectScenario(scenario)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-2xs transition-all active:scale-[0.99]"
                >
                  <span>Select & Practice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Custom Scenario Builder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 max-w-lg w-full shadow-xl relative animate-scale-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#3525cd]">Custom Simulation</span>
              <h2 className="text-lg font-bold text-slate-900">Build Your Custom Practice Scenario</h2>
              <p className="text-xs text-slate-500 mt-0.5">Define your persona, inquiry, and stakes to simulate custom workplace conversations.</p>
            </div>

            <form onSubmit={handleCreateScenario} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-800 mb-1">Scenario Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Q4 Budget Defense with CFO"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-800 mb-1">Persona Name</label>
                  <input
                    type="text"
                    value={newPersona}
                    onChange={e => setNewPersona(e.target.value)}
                    placeholder="e.g. Rachel Sterling"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:bg-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-800 mb-1">Persona Role</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    placeholder="e.g. VP Finance"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-800 mb-1">Persona Temperament</label>
                <input
                  type="text"
                  value={newTemperament}
                  onChange={e => setNewTemperament(e.target.value)}
                  placeholder="e.g. Skeptical of marketing spend, insists on ROI metrics"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-800 mb-1">Opening Challenge Question *</label>
                <textarea
                  required
                  rows={3}
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  placeholder="What is the opening hard question they will ask you?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl shadow-xs"
                >
                  Create & Launch Drill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
