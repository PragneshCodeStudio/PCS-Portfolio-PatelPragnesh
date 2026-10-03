import { useEffect, useState } from 'react'

const ImageWithFallback = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  loading,
  decoding = 'async',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(fallbackSrc || src)

  useEffect(() => {
    if (!src || src === fallbackSrc) {
      return undefined
    }

    let isMounted = true
    const image = new Image()

    image.onload = () => {
      if (isMounted) {
        setCurrentSrc(src)
      }
    }

    image.onerror = () => {
      if (isMounted) {
        setCurrentSrc(fallbackSrc || src)
      }
    }

    image.src = src

    return () => {
      isMounted = false
    }
  }, [src, fallbackSrc])

  const handleError = () => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc)
    }
  }

  return (
    <img
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
