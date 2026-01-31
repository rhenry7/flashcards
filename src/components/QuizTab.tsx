import { ChevronLeft, ChevronRight, RotateCw, Check, X } from 'lucide-react';
import type { QuizQuestion } from '../types';

interface QuizTabProps {
  quizQuestions: QuizQuestion[];
  quizIndex: number;
  quizAnswers: number[];
  showQuizResult: boolean;
  onAnswer: (answerIndex: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  onReset: () => void;
  onNewQuiz: () => void;
}

export default function QuizTab({
  quizQuestions,
  quizIndex,
  quizAnswers,
  showQuizResult,
  onAnswer,
  onPrev,
  onNext,
  onFinish,
  onReset,
  onNewQuiz,
}: QuizTabProps) {
  const calculateScore = () => {
    return quizAnswers.reduce((score, answer, index) => {
      return score + (answer === quizQuestions[index]?.correct ? 1 : 0);
    }, 0);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quiz</h2>
        <button
          onClick={onNewQuiz}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <RotateCw size={20} /> New Quiz
        </button>
      </div>

      {quizQuestions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No flashcards available for quiz.</p>
          <p className="text-sm mt-2">Try adjusting your filters or add more flashcards.</p>
        </div>
      ) : !showQuizResult ? (
        <>
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">
              Question {quizIndex + 1} of {quizQuestions.length}
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-600 rounded-full transition-all"
                style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="mb-6">
            <p className="text-xl font-semibold mb-4">{quizQuestions[quizIndex].question}</p>
            <div className="space-y-3">
              {quizQuestions[quizIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onAnswer(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    quizAnswers[quizIndex] === index
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            {quizIndex > 0 && (
              <button
                onClick={onPrev}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                <ChevronLeft size={20} /> Back
              </button>
            )}
            <button
              onClick={() => (quizIndex < quizQuestions.length - 1 ? onNext() : onFinish())}
              disabled={quizAnswers[quizIndex] === undefined}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {quizIndex < quizQuestions.length - 1 ? 'Next' : 'Finish'}{' '}
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            <div className="text-6xl font-bold text-indigo-600 mb-2">
              {calculateScore()} / {quizQuestions.length}
            </div>
            <p className="text-xl text-gray-600">
              {calculateScore() === quizQuestions.length
                ? 'Perfect!'
                : calculateScore() >= quizQuestions.length * 0.7
                  ? 'Great job!'
                  : 'Keep practicing!'}
            </p>
          </div>
          <div className="space-y-3 mb-6">
            {quizQuestions.map((q, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {quizAnswers[index] === q.correct ? (
                  <Check className="text-green-600" size={24} />
                ) : (
                  <X className="text-red-600" size={24} />
                )}
                <div className="flex-1">
                  <span className="text-sm font-medium">{q.question}</span>
                  {quizAnswers[index] !== q.correct && (
                    <div className="text-xs text-gray-500 mt-1">Correct: {q.options[q.correct]}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mx-auto"
          >
            <RotateCw size={20} /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}
