interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
  editable?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  size = 'sm',
  editable = false,
  onChange,
}: StarRatingProps) {
  const sizeClass = size === 'md' ? 'text-lg' : 'text-sm';

  return (
    <span className={`inline-flex items-center gap-0.5 ${sizeClass}`}>
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= Math.round(rating);
        return (
          <span
            key={i}
            className={`${filled ? 'text-accent' : 'text-border'} ${
              editable ? 'cursor-pointer hover:text-accent transition-colors' : ''
            }`}
            onClick={editable ? () => onChange?.(starValue) : undefined}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}
