import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Page d'accès non autorisé
 * Affichée quand l'utilisateur n'a pas les permissions nécessaires
 */
const NonAutorise = () => {
  const navigate = useNavigate()
  const { utilisateur } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Icône d'erreur */}
        <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg className="h-16 w-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Message d'erreur */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Accès Refusé
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Votre rôle actuel: <span className="font-semibold text-primary-600">
            {utilisateur?.role === 'ADMIN' && 'Administrateur'}
            {utilisateur?.role === 'TEACHER' && 'Enseignant'}
            {utilisateur?.role === 'STUDENT' && 'Étudiant'}
          </span>
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            <svg className="inline-block h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            <svg className="inline-block h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Tableau de bord
          </button>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur système.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NonAutorise
