const Tag = ({ children, className = 'border-border' }) => {
  return (
    <span className={`inline-flex border px-[6px] lg:px-[8px] py-[4px] font-body text-[10px] font-medium uppercase tracking-[0.08em] leading-[140%] text-secondary-text ${className}`}>
      {children}
    </span>
  )
}

export default Tag
