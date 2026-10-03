import { Link } from 'react-router-dom'
import { usePageTransition } from '../../hooks/usePageTransition'

const variantClasses = {
  primary: 'border-btn--filled bg-card-bg text-white border-border',
  secondary: 'bg-transparent text-white border-border ',
}

const Button = ({
  children,
  to,
  href,
  variant = 'primary',
  className = '',
  transitionLabel,
  onClick,
  ...props
}) => {
  const { navigateWithTransition, routeLabels } = usePageTransition()
  const classes = [
    'border-btn h-10 md:h-11 relative inline-flex items-center justify-center gap-2 border px-4 lg:px-6 py-2.5 font-body text-xs lg:text-sm font-semibold uppercase tracking-[0.08em] transition',
    variantClasses[variant] || variantClasses.primary,
    className,
  ].join(' ')

  if (to) {
    const handleClick = (event) => {
      onClick?.(event)

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey ||
        props.target
      ) {
        return
      }

      event.preventDefault()
      navigateWithTransition(
        to,
        transitionLabel || routeLabels[to],
      )
    }

    return (
      <Link to={to} className={classes} onClick={handleClick} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a className={classes} href={href} onClick={onClick} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
