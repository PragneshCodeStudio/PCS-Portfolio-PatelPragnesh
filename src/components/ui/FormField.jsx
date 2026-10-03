const FormField = ({
  id,
  label,
  labelHidden = false,
  helpText,
  error,
  className = '',
  children,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={
            labelHidden
              ? 'sr-only'
              : 'font-body text-xs font-semibold uppercase tracking-[0.12em] text-secondary-text'
          }
        >
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      {!error && helpText && (
        <p className="text-sm text-muted-text">{helpText}</p>
      )}
    </div>
  )
}

export default FormField
