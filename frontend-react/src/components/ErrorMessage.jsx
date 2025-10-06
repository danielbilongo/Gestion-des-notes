import React from 'react'

/**
 * Composant d'affichage d'erreur
 * @param {Object} props
 * @param {string} props.message - Message d'erreur
 * @param {Function} props.onRetry - Fonction de réessai
 */
const ErrorMessage = ({ message = 'Une erreur est survenue', onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex items-start">
        <svg className="h-5 w-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Réessayer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage
