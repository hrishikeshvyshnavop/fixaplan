type IntroProps = {
  text: string;
};

/**
 * Full-screen panel shown on page load: the words blur in one by one,
 * then the panel collapses upward to reveal the page.
 */
export default function Intro({ text }: IntroProps) {
  const words = text.split(" ");

  return (
    <div
      aria-hidden="true"
      className="intro-panel pointer-events-none fixed inset-x-0 top-0 z-[100] flex h-[104vh] items-center justify-center bg-[rgb(234,234,234)]"
    >
      <p className="intro-text text-[42px] font-medium tracking-[-0.04em] whitespace-pre text-[rgb(38,38,38)]">
        {words.map((word, i) => (
          <span key={i}>
            <span className="intro-word inline-block" style={{ animationDelay: `${i * 0.2}s` }}>
              {word}
            </span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </p>
    </div>
  );
}
