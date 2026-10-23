import type { ChangeEvent, ReactNode } from 'react';

type Common = {
  id: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onBlur?: () => void;
};

type Props =
  | (Common & {
      kind: 'input';
      label: string;
      type: 'text' | 'email' | 'tel';
      value: string;
      autoComplete?: string;
      inputMode?: 'text' | 'email' | 'tel';
      maxLength?: number;
      onChange: (value: string) => void;
    })
  | (Common & { kind: 'select'; label: string; value: string; options: string[]; onChange: (value: string) => void })
  | (Common & { kind: 'checkbox'; label: ReactNode; checked: boolean; onChange: (checked: boolean) => void });

// Label, optional hint and error message are always wired to the control via aria-describedby.
export default function FormField(props: Props) {
  const { id, name, error, hint, required, disabled, readOnly, onBlur } = props;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const shared = { id, name, required, disabled, onBlur, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy };

  const message = error && (
    <p id={errorId} className="field__error">
      <svg viewBox="0 0 20 20" aria-hidden="true" width="18" height="18"><circle cx="10" cy="10" r="9" fill="currentColor" /><path d="M10 5.5v5.5M10 14v.5" stroke="var(--brand-primary)" strokeWidth="2.4" strokeLinecap="round" /></svg>
      <span><span className="sr-only">Error: </span>{error}</span>
    </p>
  );

  if (props.kind === 'checkbox') {
    return (
      <div className={`field field--check${error ? ' field--error' : ''}`}>
        <div className="field__check-row">
          <input
            {...shared}
            type="checkbox"
            checked={props.checked}
            onChange={(e: ChangeEvent<HTMLInputElement>) => !readOnly && props.onChange(e.target.checked)}
          />
          <label htmlFor={id}>{props.label}</label>
        </div>
        {message}
      </div>
    );
  }

  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {props.label}
        {!required && <span className="field__optional"> (optional)</span>}
      </label>
      {hint && <p id={hintId} className="field__hint">{hint}</p>}
      {props.kind === 'select' ? (
        <div className="field__select">
          <select {...shared} value={props.value} onChange={(e) => !readOnly && props.onChange(e.target.value)}>
            {props.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <svg viewBox="0 0 16 16" aria-hidden="true" width="16" height="16"><path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      ) : (
        <input
          {...shared}
          type={props.type}
          value={props.value}
          readOnly={readOnly}
          autoComplete={props.autoComplete}
          inputMode={props.inputMode}
          maxLength={props.maxLength}
          onChange={(e) => props.onChange(e.target.value)}
        />
      )}
      {message}
    </div>
  );
}
