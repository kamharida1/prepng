"use client";

interface QuestionPaletteProps {
  total: number;
  currentIndex: number;
  answers: Record<string, string>;
  questionIds: string[];
  markedForReview: string[];
  onSelect: (index: number) => void;
}

export function QuestionPalette({
  total,
  currentIndex,
  answers,
  questionIds,
  markedForReview,
  onSelect,
}: QuestionPaletteProps) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
      {Array.from({ length: total }).map((_, index) => {
        const id = questionIds[index];
        const answered = Boolean(answers[id]);
        const marked = markedForReview.includes(id);
        const current = index === currentIndex;

        let classes =
          "flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors";

        if (current) {
          classes += " border-green-700 bg-green-700 text-white";
        } else if (answered) {
          classes += " border-green-500 bg-green-50 text-green-800";
        } else if (marked) {
          classes += " border-amber-400 bg-amber-50 text-amber-800";
        } else {
          classes += " border-gray-200 bg-white text-gray-600 hover:border-green-300";
        }

        return (
          <button key={id} type="button" className={classes} onClick={() => onSelect(index)}>
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
