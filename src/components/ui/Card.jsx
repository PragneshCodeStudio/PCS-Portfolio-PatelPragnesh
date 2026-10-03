import { createElement } from 'react'

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-4',
  lg: 'p-6',
}

const Card = ({
  as = 'article',
  padding = 'md',
  className = '',
  children,
  ...props
}) => {
  const paddingClass = paddingClasses[padding] ?? paddingClasses.md

  return createElement(
    as,
    {
      className: `border-box ${paddingClass} ${className}`,
      ...props,
    },
    children,
  )
}

export default Card
