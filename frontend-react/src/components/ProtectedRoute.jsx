import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Composant de route protégée
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Composants enfants à protéger
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children }) => {
  const { estAuthentifie, chargement } = useAuth()
  const location = useLocation()

  // Affichage d'un loader pendant la vérification
  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Redirection vers login si non authentifié
  if (!estAuthentifie) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Affichage du contenu protégé
  return children
}

export default ProtectedRoute
