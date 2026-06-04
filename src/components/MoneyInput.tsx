interface MoneyInputProps {
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  big?: boolean;
}

export function MoneyInput({ value, onChange, onEnter, disabled, autoFocus, big }: MoneyInputProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: '100%' }}>
      <span
        style={{
          position: 'absolute',
          left: 16,
          fontFamily: "'Montserrat',sans-serif",
          fontWeight: 700,
          fontSize: big ? 22 : 16,
          color: 'var(--ww-navy-300)',
          pointerEvents: 'none',
        }}
      >
        $
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) onEnter();
        }}
        placeholder="0"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: big ? '14px 16px 14px 34px' : '12px 14px 12px 30px',
          fontFamily: "'Montserrat',sans-serif",
          fontWeight: 700,
          fontSize: big ? 22 : 16,
          color: 'var(--ww-navy)',
          background: '#fff',
          border: '1.5px solid var(--ww-navy-100)',
          borderRadius: 'var(--ww-radius-md)',
          outline: 'none',
        }}
      />
    </div>
  );
}
