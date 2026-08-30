import { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, Award } from 'lucide-react';
import type { QuizData } from '../../modules/studio/dto/studioDto';
import { colors, mono } from '../landing/tokens';

interface QuizViewProps {
  data: QuizData;
}

export default function QuizView({ data }: QuizViewProps) {
  const questions = data.questions || [];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  if (questions.length === 0) {
    return (
      <div
        className="p-10 text-center bg-white rounded-3xl text-[#5C6169] text-xs shadow-xs"
        style={{ border: `1px dashed ${colors.hairlineStrong}` }}
      >
        No quiz questions found.
      </div>
    );
  }

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (selectedAnswers[questionIndex] !== undefined) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, ansIdx]) => questions[Number(qIdx)]?.correctAnswerIndex === ansIdx
  ).length;

  const scorePercentage = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Quiz Score Summary Banner */}
      <div
        className="bg-white rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden"
        style={{ border: `1px solid ${colors.hairlineStrong}` }}
      >
        <div className="h-1 w-full bg-[#1F7A5C] absolute top-0 left-0 right-0" />

        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <HelpCircle className="w-4 h-4 text-[#1F7A5C]" />
            <h2 className="text-sm font-bold text-[#14171A]">{data.quizTitle}</h2>
          </div>
          <p className="text-xs text-[#5C6169]">
            {answeredCount} of {questions.length} questions answered
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-xl font-bold font-mono text-[#1F7A5C]" style={mono}>
              {correctCount} / {questions.length}
            </span>
            <span className="block text-[10px] font-mono font-bold text-[#5C6169]" style={mono}>
              {scorePercentage}% Accuracy
            </span>
          </div>

          <button
            type="button"
            onClick={handleResetQuiz}
            className="px-3.5 py-2 rounded-full bg-[#F5F6F4] hover:bg-[#E2E4E1] border border-[#CBCFC9] text-xs font-semibold text-[#14171A] transition flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#1F7A5C]" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      {answeredCount === questions.length && (
        <div
          className="bg-emerald-50 rounded-3xl p-6 text-center space-y-2 animate-in fade-in zoom-in-95 duration-200 border border-emerald-200"
        >
          <div className="w-10 h-10 rounded-full bg-white border border-emerald-300 text-[#1F7A5C] mx-auto flex items-center justify-center shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-emerald-950">Quiz Completed!</h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            You scored {correctCount} out of {questions.length} ({scorePercentage}%). Review the detailed explanations below.
          </p>
        </div>
      )}

      {/* Question Cards */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const selectedOption = selectedAnswers[qIdx];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = selectedOption === q.correctAnswerIndex;

          return (
            <div
              key={q.id || qIdx}
              className={`p-6 rounded-3xl border transition-all space-y-4 bg-white shadow-xs ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                    : 'border-rose-400 ring-1 ring-rose-400/20'
                  : 'border-[#CBCFC9]'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-[#F5F6F4] border border-[#CBCFC9] text-[11px] font-mono font-bold text-[#14171A] flex items-center justify-center shrink-0 mt-0.5" style={mono}>
                    {qIdx + 1}
                  </span>
                  <h4 className="text-xs md:text-sm font-bold text-[#14171A] leading-relaxed">
                    {q.question}
                  </h4>
                </div>

                {q.sourceReference && (
                  <span className="text-[10px] font-mono text-[#5C6169] bg-[#F5F6F4] px-2.5 py-0.5 rounded-full border border-[#CBCFC9] shrink-0" style={mono}>
                    {q.sourceReference}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2 pl-9">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  const isThisCorrect = optIdx === q.correctAnswerIndex;

                  let optClass = 'bg-[#FAFBF9] border-[#CBCFC9] text-[#14171A] hover:border-[#1F7A5C] hover:bg-white';

                  if (isAnswered) {
                    if (isThisCorrect) {
                      optClass = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                    } else if (isThisSelected && !isThisCorrect) {
                      optClass = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                    } else {
                      optClass = 'bg-[#FAFBF9] border-[#E2E4E1] text-[#93968F] opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs font-sans transition-all flex items-center justify-between cursor-pointer disabled:cursor-default ${optClass}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono shrink-0 font-bold" style={mono}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswered && (
                        <div>
                          {isThisCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />}
                          {isThisSelected && !isThisCorrect && <XCircle className="w-4 h-4 text-rose-600 stroke-[2.5]" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Section */}
              {isAnswered && q.explanation && (
                <div className="ml-9 p-4 rounded-2xl bg-[#F5F6F4] border border-[#CBCFC9] text-xs space-y-1 animate-in fade-in duration-200">
                  <span className="font-mono text-[11px] font-bold text-[#1F7A5C] uppercase" style={mono}>
                    Explanation:
                  </span>
                  <p className="text-[#5C6169] leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
