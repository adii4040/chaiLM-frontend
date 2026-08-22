import { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, Layers, ListChecks } from 'lucide-react';
import type { StudyGuideData } from '../../modules/studio/dto/studioDto';

interface StudyGuideViewProps {
  data: StudyGuideData;
}

export default function StudyGuideView({ data }: StudyGuideViewProps) {
  const [openThemes, setOpenThemes] = useState<number[]>([0]);

  const toggleTheme = (index: number) => {
    setOpenThemes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* 1. Executive Summary */}
      <div className="bg-chailm-panel border border-chailm-border rounded-3xl p-6 space-y-3 shadow-sm relative overflow-hidden">
        <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-chailm-accentBlue uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Executive Summary</span>
        </div>
        <p className="text-xs md:text-sm text-chailm-textMain leading-relaxed whitespace-pre-wrap">
          {data.executiveSummary}
        </p>
      </div>

      {/* 2. Key Thematic Modules */}
      {data.keyThemes && data.keyThemes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-chailm-textMuted uppercase tracking-wider">
            <Layers className="w-4 h-4 text-chailm-accentBlue" />
            <span>Core Themes & Modules ({data.keyThemes.length})</span>
          </div>

          <div className="space-y-3">
            {data.keyThemes.map((theme, idx) => {
              const isOpen = openThemes.includes(idx);
              return (
                <div
                  key={idx}
                  className="bg-chailm-panel border border-chailm-border rounded-2xl overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleTheme(idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-chailm-hover/50 transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-chailm-card border border-chailm-border text-[11px] font-mono font-semibold text-chailm-accentBlue flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h3 className="text-xs md:text-sm font-medium text-chailm-textMain">
                        {theme.themeTitle}
                      </h3>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-chailm-textMuted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-chailm-textMuted" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-chailm-border/60 space-y-4 text-xs">
                      <p className="text-chailm-textMuted leading-relaxed pt-3">
                        {theme.overview}
                      </p>

                      {theme.keyPoints && theme.keyPoints.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-[11px] font-mono text-chailm-accentBlue uppercase font-semibold">
                            Core Takeaways:
                          </span>
                          <ul className="space-y-1.5 pl-2">
                            {theme.keyPoints.map((point, pIdx) => (
                              <li
                                key={pIdx}
                                className="flex items-start space-x-2 text-chailm-textMain leading-relaxed"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-chailm-accentBlue mt-1.5 shrink-0"></span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Domain Terminology Glossary */}
      {data.glossary && data.glossary.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-chailm-textMuted uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-chailm-accentBlue" />
            <span>High-Yield Terminology & Glossary ({data.glossary.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.glossary.map((item, idx) => (
              <div
                key={idx}
                className="bg-chailm-panel border border-chailm-border rounded-2xl p-4 space-y-1.5 shadow-xs"
              >
                <span className="font-mono text-xs font-semibold text-chailm-accentBlue">
                  {item.term}
                </span>
                <p className="text-xs text-chailm-textMuted leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Key Takeaways Summary */}
      {data.keyTakeaways && data.keyTakeaways.length > 0 && (
        <div className="bg-chailm-panel border border-chailm-border rounded-3xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Essential Key Takeaways</span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {data.keyTakeaways.map((takeaway, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 bg-chailm-card/60 p-3 rounded-xl border border-chailm-border/60 text-xs text-chailm-textMain leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Review & Self-Assessment Checklist */}
      {data.reviewChecklist && data.reviewChecklist.length > 0 && (
        <div className="bg-chailm-panel border border-chailm-border rounded-3xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <ListChecks className="w-4 h-4" />
            <span>Comprehension Review Checklist</span>
          </div>
          <p className="text-xs text-chailm-textMuted leading-relaxed">
            Test your understanding with these essential self-assessment prompts:
          </p>
          <div className="space-y-2 pt-2">
            {data.reviewChecklist.map((item, idx) => (
              <label
                key={idx}
                className="flex items-start space-x-3 p-3 rounded-xl bg-chailm-card/40 border border-chailm-border/60 text-xs text-chailm-textMain cursor-pointer hover:bg-chailm-hover/40 transition"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 rounded border-chailm-border bg-chailm-panel text-chailm-accentBlue focus:ring-0 h-4 w-4 cursor-pointer shrink-0"
                />
                <span className="leading-relaxed">{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
