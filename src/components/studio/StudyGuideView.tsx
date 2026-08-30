import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Layers, ListChecks, CheckCircle2 } from 'lucide-react';
import type { StudyGuideData } from '../../modules/studio/dto/studioDto';
import { colors, mono } from '../landing/tokens';

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
      {/* 1. Executive Summary Card */}
      <div
        className="bg-white rounded-3xl p-7 space-y-3.5 shadow-sm relative overflow-hidden"
        style={{ border: `1px solid ${colors.hairlineStrong}` }}
      >
        <div className="h-1 w-full bg-blue-600 absolute top-0 left-0 right-0" />
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider" style={mono}>
          <BookOpen className="w-4 h-4" />
          <span>EXECUTIVE SUMMARY</span>
        </div>
        <p className="text-xs md:text-sm text-[#14171A] leading-relaxed whitespace-pre-wrap">
          {data.executiveSummary}
        </p>
      </div>

      {/* 2. Key Thematic Modules */}
      {data.keyThemes && data.keyThemes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#5C6169] uppercase tracking-wider" style={mono}>
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Core Themes & Modules ({data.keyThemes.length})</span>
          </div>

          <div className="space-y-3">
            {data.keyThemes.map((theme, idx) => {
              const isOpen = openThemes.includes(idx);
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl overflow-hidden transition-all shadow-xs border"
                  style={{ borderColor: isOpen ? colors.hairlineStrong : colors.hairline }}
                >
                  <button
                    type="button"
                    onClick={() => toggleTheme(idx)}
                    className="w-full p-4.5 flex items-center justify-between text-left hover:bg-[#F5F6F4] transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-blue-700 flex items-center justify-center shrink-0" style={mono}>
                        {idx + 1}
                      </span>
                      <h3 className="text-xs md:text-sm font-bold text-[#14171A]">
                        {theme.themeTitle}
                      </h3>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#5C6169]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#5C6169]" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 border-t space-y-4 text-xs" style={{ borderColor: colors.hairline }}>
                      <p className="text-[#5C6169] leading-relaxed pt-3">
                        {theme.overview}
                      </p>

                      {theme.keyPoints && theme.keyPoints.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-[11px] font-mono text-blue-700 uppercase font-bold" style={mono}>
                            Core Takeaways:
                          </span>
                          <ul className="space-y-1.5 pl-2">
                            {theme.keyPoints.map((point, pIdx) => (
                              <li
                                key={pIdx}
                                className="flex items-start space-x-2 text-[#14171A] leading-relaxed"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
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

      {/* 3. Key Takeaways */}
      {data.keyTakeaways && data.keyTakeaways.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#5C6169] uppercase tracking-wider" style={mono}>
            <ListChecks className="w-4 h-4 text-[#1F7A5C]" />
            <span>Key Takeaways ({data.keyTakeaways.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.keyTakeaways.map((takeaway, tIdx) => (
              <div
                key={tIdx}
                className="bg-white rounded-2xl p-4.5 space-y-2 text-xs shadow-xs border hover:border-[#1F7A5C] transition-all flex items-start space-x-2.5"
                style={{ borderColor: colors.hairlineStrong }}
              >
                <CheckCircle2 className="w-4 h-4 text-[#1F7A5C] shrink-0 mt-0.5" />
                <p className="font-semibold text-[#14171A] leading-relaxed">{takeaway}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Domain Glossary */}
      {data.glossary && data.glossary.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#5C6169] uppercase tracking-wider" style={mono}>
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Domain Glossary ({data.glossary.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.glossary.map((item, gIdx) => (
              <div
                key={gIdx}
                className="bg-white rounded-2xl p-4.5 space-y-1.5 text-xs shadow-xs border hover:border-blue-300 transition-all"
                style={{ borderColor: colors.hairlineStrong }}
              >
                <span className="font-bold text-[#14171A] text-xs font-mono" style={mono}>{item.term}</span>
                <p className="text-[#5C6169] leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
