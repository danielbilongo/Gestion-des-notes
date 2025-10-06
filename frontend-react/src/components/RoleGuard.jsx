import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Composant de protection basée sur les rôles
 * Redirige vers une page d'erreur si l'utilisateur n'a pas le rôle requis
 * 
 * @param {Object} props
 * @param {string|string[]} props.rolesAutorises - Rôle(s) autorisé(s) (ADMIN, TEACHER, STUDENT)
 * @param {React.ReactNode} props.children - Composants enfants à protéger
 * @param {string} props.redirectTo - Page de redirection (par défaut: /non-autorise)
 * @returns {React.ReactNode}
 */
const RoleGuard = ({ 
  rolesAutorises, 
  children, 
  redirectTo = '/non-autorise' 
}) => {
  const { utilisateur, aLeRole, chargement } = useAuth()

  // Affichage d'un loader pendant la vérification
  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  // Vérification du rôle
  const aAcces = aLeRole(rolesAutorises)

  if (!aAcces) {
    return <Navigate to={redirectTo} replace />
  }

  // Affichage du contenu si autorisé
  return children
}

export default RoleGuard
