interface ToggleProps {
  on: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      style={{
        width: 46,
        height: 26,
        borderRadius: 999,
        border: 0,
        cursor: 'pointer',
        flexShrink: 0,
        background: on ? 'var(--ww-blue)' : 'var(--ww-navy-100)',
        position: 'relative',
        transition: 'background 150ms var(--ww-ease)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 23 : 3,
          width: 20,
          height: 20,
          borderRadius: 999,
          background: '#fff',
          boxShadow: 'var(--ww-shadow-sm)',
          transition: 'left 150ms var(--ww-ease)',
        }}
      />
    </button>
  );
}
