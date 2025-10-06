import React from 'react'

/**
 * Composant de chargement amélioré
 * @param {Object} props
 * @param {string} props.message - Message à afficher
 * @param {string} props.size - Taille du loader (small, medium, large)
 * @param {boolean} props.overlay - Afficher en overlay
 */
const Loader = ({ 
  message = 'Chargement...', 
  size = 'medium',
  overlay = false 
}) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  }

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  const content = (
    <div className="text-center">
      <div className={`inline-block animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-primary-600`}>
      </div>
      {message && (
        <p className={`mt-4 text-gray-600 ${textSizeClasses[size]}`}>
          {message}
        </p>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  )
}

export default Loader
