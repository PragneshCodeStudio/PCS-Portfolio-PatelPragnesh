import { useEffect, useRef, useState } from 'react'

const ImageWithFallback = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  loading,
  decoding = 'async',
  onSourceReady,
  onSourceError,
  ...props
}) => {
  const imageRef = useRef(null)
  const readyCallbackRef = useRef(onSourceReady)
  const errorCallbackRef = useRef(onSourceError)
  const [readySrc, setReadySrc] = useState(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const shouldPreload = loading !== 'lazy' || isNearViewport || typeof IntersectionObserver === 'undefined'
  const currentSrc = !fallbackSrc || readySrc === src ? src : fallbackSrc

  useEffect(() => {
    readyCallbackRef.current = onSourceReady
    errorCallbackRef.current = onSourceError
  }, [onSourceReady, onSourceError])

  useEffect(() => {
    if (loading !== 'lazy' || typeof IntersectionObserver === 'undefined') return undefined

    const target = imageRef.current
    if (!target) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNearViewport(true)
        observer.disconnect()
      }
    }, { rootMargin: '300px' })

    observer.observe(target)
    return () => observer.disconnect()
  }, [loading])

  useEffect(() => {
    if (!shouldPreload || !fallbackSrc || !src || src === fallbackSrc) return undefined

    let active = true
    const image = new Image()
    image.decoding = decoding
    image.onload = () => {
      const reveal = () => {
        if (!active) return
        setReadySrc(src)
        readyCallbackRef.current?.()
      }

      if (typeof image.decode === 'function') {
        image.decode().then(reveal, reveal)
      } else {
        reveal()
      }
    }
    image.onerror = () => {
      if (!active) return
      setReadySrc(null)
      errorCallbackRef.current?.()
    }
    image.src = src

    return () => {
      active = false
      image.onload = null
      image.onerror = null
    }
  }, [src, fallbackSrc, decoding, shouldPreload])

  const handleError = () => {
    if (currentSrc === src && fallbackSrc && src !== fallbackSrc) {
      setReadySrc(null)
      errorCallbackRef.current?.()
    }
  }

  return (
    <img
      ref={imageRef}
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      onError={handleError}
      {...props}
    />
  )
}

export default ImageWithFallback
