import { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, Award } from 'lucide-react';
import type { QuizData } from '../../modules/studio/dto/studioDto';

interface QuizViewProps {
  data: QuizData;
}

export default function QuizView({ data }: QuizViewProps) {
  const questions = data.questions || [];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center bg-chailm-panel border border-chailm-border rounded-3xl text-chailm-textMuted text-xs">
        No quiz questions found.
      </div>
    );
  }

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    // If already selected, do not allow re-selection
    if (selectedAnswers[questionIndex] !== undefined) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
  };

  // Calculate score
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, ansIdx]) => questions[Number(qIdx)]?.correctAnswerIndex === ansIdx
  ).length;

  const scorePercentage = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Quiz Score Summary Banner */}
      <div className="bg-chailm-panel border border-chailm-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>

        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <HelpCircle className="w-4 h-4 text-chailm-accentBlue" />
            <h2 className="text-sm font-semibold text-chailm-textMain">{data.quizTitle}</h2>
          </div>
          <p className="text-xs text-chailm-textMuted">
            {answeredCount} of {questions.length} questions answered
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-xl font-bold font-mono text-chailm-accentBlue">
              {correctCount} / {questions.length}
            </span>
            <span className="block text-[10px] font-mono text-chailm-textMuted">
              {scorePercentage}% Accuracy
            </span>
          </div>

          <button
            type="button"
            onClick={handleResetQuiz}
            className="px-3.5 py-2 rounded-2xl bg-chailm-card hover:bg-chailm-hover border border-chailm-border text-xs text-chailm-textMuted hover:text-chailm-textMain transition flex items-center space-x-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      {answeredCount === questions.length && (
        <div className="bg-chailm-panel border border-chailm-accentBlue/30 rounded-3xl p-6 text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-10 h-10 rounded-full bg-chailm-accentBlue/10 border border-chailm-accentBlue/20 text-chailm-accentBlue mx-auto flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-chailm-textMain">Quiz Completed!</h3>
          <p className="text-xs text-chailm-textMuted max-w-md mx-auto">
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
              className={`p-6 rounded-3xl border transition-all space-y-4 bg-chailm-panel ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-500/30'
                    : 'border-rose-500/30'
                  : 'border-chailm-border'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-chailm-card border border-chailm-border text-[11px] font-mono font-semibold text-chailm-accentBlue flex items-center justify-center shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <h4 className="text-xs md:text-sm font-medium text-chailm-textMain leading-relaxed">
                    {q.question}
                  </h4>
                </div>

                {q.sourceReference && (
                  <span className="text-[10px] font-mono text-chailm-textMuted bg-chailm-card px-2 py-0.5 rounded-full border border-chailm-border shrink-0">
                    {q.sourceReference}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2 pl-9">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  const isThisCorrect = optIdx === q.correctAnswerIndex;

                  let optClass = 'bg-chailm-card/70 border-chailm-border text-chailm-textMain hover:border-chailm-accentBlue/40';

                  if (isAnswered) {
                    if (isThisCorrect) {
                      optClass = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300';
                    } else if (isThisSelected && !isThisCorrect) {
                      optClass = 'bg-rose-500/10 border-rose-500/40 text-rose-300';
                    } else {
                      optClass = 'bg-chailm-card/40 border-chailm-border/40 text-chailm-textMuted opacity-60';
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
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswered && (
                        <div>
                          {isThisCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {isThisSelected && !isThisCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Section */}
              {isAnswered && q.explanation && (
                <div className="ml-9 p-4 rounded-2xl bg-chailm-card/50 border border-chailm-border text-xs space-y-1 animate-in fade-in duration-200">
                  <span className="font-mono text-[11px] font-semibold text-chailm-accentBlue uppercase">
                    Explanation:
                  </span>
                  <p className="text-chailm-textMuted leading-relaxed">
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
