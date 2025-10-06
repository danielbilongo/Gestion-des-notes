import React, { useState, useEffect } from 'react'
import { validateGrade } from '../../utils/validation'

/**
 * Composant de saisie de note avec validation
 */
const ValidatedGradeInput = ({
  label = "Note",
  name = "grade",
  value,
  onChange,
  onBlur,
  placeholder = "ex: 15.5",
  required = false,
  disabled = false,
  className = '',
  min = 0,
  max = 20,
  step = 0.5
}) => {
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  // Validation en temps réel
  useEffect(() => {
    if (touched && value !== undefined && value !== '') {
      const validation = validateGrade(value)
      if (!validation.isValid) {
        setError(validation.message)
      } else {
        // Vérification des limites spécifiques
        const numValue = parseFloat(value)
        if (numValue < min) {
          setError(`La note ne peut pas être inférieure à ${min}`)
        } else if (numValue > max) {
          setError(`La note ne peut pas être supérieure à ${max}`)
        } else {
          setError('')
        }
      }
    }
  }, [value, touched, min, max])

  const handleBlur = (e) => {
    setTouched(true)
    if (onBlur) {
      onBlur(e)
    }
  }

  const handleChange = (e) => {
    const newValue = e.target.value
    
    // Permettre la saisie de nombres décimaux
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      if (onChange) {
        onChange(e)
      }
    }
  }

  const hasError = touched && error

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        <span className="text-gray-500 text-xs ml-2">({min} - {max})</span>
      </label>
      
      <div className="relative">
        <input
          id={name}
          name={name}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
            ${hasError 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
        />
        
        {/* Indicateur de note sur 20 */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-400 text-sm">/ {max}</span>
        </div>
      </div>
      
      {/* Barre de progression visuelle */}
      {value && !hasError && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                (value / max) >= 0.8 ? 'bg-green-500' :
                (value / max) >= 0.6 ? 'bg-yellow-500' :
                (value / max) >= 0.4 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{min}</span>
            <span className="font-medium">
              {value}/{max} ({((value / max) * 100).toFixed(0)}%)
            </span>
            <span>{max}</span>
          </div>
        </div>
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
      
      {/* Aide contextuelle */}
      {!hasError && !value && (
        <p className="mt-1 text-sm text-gray-500">
          Saisissez une note entre {min} et {max}
        </p>
      )}
    </div>
  )
}

export default ValidatedGradeInput
