type LoadingDotsProps = {
  className?: string;
};

export function LoadingDots({ className = "" }: LoadingDotsProps) {
  return (
    <div className={`loading-dots ${className}`.trim()} aria-hidden="true">
      <span className="loading-dot dot-1" />
      <span className="loading-dot dot-2" />
      <span className="loading-dot dot-3" />
      <span className="loading-dot dot-4" />
    </div>
  );
}
