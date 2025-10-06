import React from 'react'

/**
 * Composant d'état de chargement avec différents styles
 */
const LoadingState = ({ 
  message = "Chargement...", 
  size = "medium", 
  variant = "spinner",
  className = "" 
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8", 
    large: "h-12 w-12"
  }

  const SpinnerIcon = () => (
    <svg 
      className={`animate-spin ${sizeClasses[size]} text-primary-600`} 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  const DotsIcon = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${size === 'small' ? 'h-2 w-2' : size === 'large' ? 'h-4 w-4' : 'h-3 w-3'} bg-primary-600 rounded-full animate-pulse`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </div>
  )

  const PulseIcon = () => (
    <div className={`${sizeClasses[size]} bg-primary-600 rounded-full animate-ping`} />
  )

  const renderIcon = () => {
    switch (variant) {
      case 'dots':
        return <DotsIcon />
      case 'pulse':
        return <PulseIcon />
      default:
        return <SpinnerIcon />
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      {renderIcon()}
      {message && (
        <p className={`mt-2 text-gray-600 ${size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'}`}>
          {message}
        </p>
      )}
    </div>
  )
}

/**
 * Composant de chargement pleine page
 */
export const FullPageLoading = ({ message = "Chargement de l'application..." }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <LoadingState message={message} size="large" />
    </div>
  </div>
)

/**
 * Composant de chargement inline
 */
export const InlineLoading = ({ message, size = "small" }) => (
  <LoadingState message={message} size={size} variant="dots" className="py-2" />
)

/**
 * Composant de chargement pour boutons
 */
export const ButtonLoading = ({ message = "Chargement..." }) => (
  <div className="flex items-center">
    <LoadingState message="" size="small" className="p-0 mr-2" />
    <span>{message}</span>
  </div>
)

/**
 * Hook pour gérer l'état de chargement global
 */
export const useGlobalLoading = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [loadingMessage, setLoadingMessage] = React.useState('')

  const showLoading = (message = "Chargement...") => {
    setLoadingMessage(message)
    setIsLoading(true)
  }

  const hideLoading = () => {
    setIsLoading(false)
    setLoadingMessage('')
  }

  return {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading
  }
}

export default LoadingState
