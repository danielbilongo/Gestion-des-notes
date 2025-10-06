import React, { useState, useEffect } from 'react'

/**
 * Composant de champ de saisie avec validation en temps réel
 */
const ValidatedInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  validator,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  helpText = '',
  autoComplete = 'off'
}) => {
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  // Validation en temps réel
  useEffect(() => {
    if (touched && validator && value !== undefined) {
      const validation = validator(value)
      setError(validation.isValid ? '' : validation.message)
    }
  }, [value, validator, touched])

  const handleBlur = (e) => {
    setTouched(true)
    if (onBlur) {
      onBlur(e)
    }
  }

  const handleChange = (e) => {
    if (onChange) {
      onChange(e)
    }
  }

  const hasError = touched && error

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
          ${hasError 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      />
      
      {/* Message d'aide */}
      {helpText && !hasError && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      
      {/* Message d'erreur */}
      {hasError && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export default ValidatedInput
