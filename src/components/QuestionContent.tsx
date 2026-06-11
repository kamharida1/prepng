interface QuestionContentProps {
  text: string;
  imageUrl?: string;
  className?: string;
}

export function QuestionContent({ text, imageUrl, className = "" }: QuestionContentProps) {
  return (
    <div className={className}>
      {imageUrl ? (
        <figure className="mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Question diagram"
            className="mx-auto max-h-80 w-auto max-w-full rounded-lg border border-gray-200 bg-white object-contain"
            loading="lazy"
          />
        </figure>
      ) : null}
      <p className="whitespace-pre-wrap leading-relaxed text-gray-900">{text}</p>
    </div>
  );
}
