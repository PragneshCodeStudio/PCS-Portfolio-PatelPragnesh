import { useEffect, useMemo, useRef, useState } from 'react'
import { RiArrowDownSLine } from 'react-icons/ri'

const normalizeOption = (option) => {
  if (typeof option === 'string') {
    return { value: option, label: option }
  }

  return option
}

const Select = ({
  id,
  value,
  onChange,
  options = [],
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(null)
  const rootRef = useRef(null)
  const normalizedOptions = useMemo(() => options.map(normalizeOption), [options])
  const selectedIndex = normalizedOptions.findIndex((option) => option.value === value)
  const selectedOption = normalizedOptions[selectedIndex] || normalizedOptions[0]
  const activeIndex = highlightedIndex ?? Math.max(selectedIndex, 0)

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  const selectOption = (option) => {
    onChange?.({
      target: {
        id,
        value: option.value,
      },
    })
    setIsOpen(false)
    setHighlightedIndex(null)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()

      if (isOpen) {
        selectOption(normalizedOptions[activeIndex])
      } else {
        setIsOpen(true)
        setHighlightedIndex(activeIndex)
      }

      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((currentIndex) => {
        const safeCurrentIndex = currentIndex ?? activeIndex
        const direction = event.key === 'ArrowDown' ? 1 : -1
        const nextIndex = safeCurrentIndex + direction

        if (nextIndex < 0) {
          return normalizedOptions.length - 1
        }

        if (nextIndex >= normalizedOptions.length) {
          return 0
        }

        return nextIndex
      })
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        className="pp-select-trigger border-btn relative inline-flex h-10 md:h-11 w-full cursor-pointer items-center justify-between gap-3 border-0 bg-main-bg px-4 pr-3 font-body text-xs lg:text-sm font-semibold uppercase tracking-[0.08em] text-primary-text transition focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-listbox`}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span>{selectedOption?.label}</span>
        <RiArrowDownSLine
          className={`transition duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`}
          size={24}
          aria-hidden="true"
        />
      </button>

      <div
        id={`${id}-listbox`}
        role="listbox"
        tabIndex={-1}
        className={`absolute right-0 top-full z-30 mt-2 w-full min-w-full border border-white bg-card-bg p-1 transition duration-200 ${
          isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
      >
        {normalizedOptions.map((option, index) => {
          const isSelected = option.value === selectedOption?.value
          const isActive = index === activeIndex

          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={`block w-full cursor-pointer px-3 py-2 text-left font-body text-xs font-semibold uppercase tracking-[0.08em] transition ${
                isSelected || isActive ? 'bg-elevated-bg text-white' : 'text-secondary-text hover:bg-elevated-bg hover:text-primary-text'
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => selectOption(option)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Select
