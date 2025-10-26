export function PasswordCharacter({ isTyping, showPassword }) {
  // Open eyes only when showPassword is truthy.
  const eyesOpen = Boolean(showPassword);

  return (
    <div className="flex justify-center mb-6">
      <svg width="80" height="80" viewBox="0 0 100 100" className="transition-all duration-300">
        {/* Head */}
        <circle cx="50" cy="40" r="25" fill="#64ffda" opacity="0.2" stroke="#64ffda" strokeWidth="2" />

        {/* Eyes */}
        {eyesOpen ? (
          <>
            {/* Open eyes */}
            <circle cx="42" cy="38" r="3" fill="#64ffda" className="transition-all duration-200" />
            <circle cx="58" cy="38" r="3" fill="#64ffda" className="transition-all duration-200" />
          </>
        ) : (
          <>
            {/* Closed eyes (lines) */}
            <line x1="40" y1="38" x2="44" y2="38" stroke="#64ffda" strokeWidth="2" strokeLinecap="round" className="transition-all duration-200" />
            <line x1="56" y1="38" x2="60" y2="38" stroke="#64ffda" strokeWidth="2" strokeLinecap="round" className="transition-all duration-200" />
          </>
        )}

        {/* Smile */}
        <path
          d="M 40 48 Q 50 53 60 48"
          fill="none"
          stroke="#64ffda"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}