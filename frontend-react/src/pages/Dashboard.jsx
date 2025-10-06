import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

/**
 * Page Dashboard principale
 * Redirige vers le dashboard spécifique selon le rôle
 */
const Dashboard = () => {
  const { utilisateur, estAdmin, estEnseignant, estEtudiant } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (estAdmin()) {
      navigate('/admin/dashboard', { replace: true })
    } else if (estEnseignant()) {
      navigate('/enseignant/dashboard', { replace: true })
    } else if (estEtudiant()) {
      navigate('/etudiant/dashboard', { replace: true })
    }
  }, [estAdmin, estEnseignant, estEtudiant, navigate])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenue, {utilisateur?.username} !
          </h1>
          <p className="mt-2 text-gray-600">
            Rôle: <span className="font-semibold text-primary-600">
              {utilisateur?.role === 'ADMIN' && 'Administrateur'}
              {utilisateur?.role === 'TEACHER' && 'Enseignant'}
              {utilisateur?.role === 'STUDENT' && 'Étudiant'}
            </span>
          </p>
        </div>

        {/* Contenu selon le rôle */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte Admin */}
          {estAdmin() && (
            <>
              <div className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Gestion Utilisateurs</h3>
                </div>
                <p className="text-gray-600">Gérer les étudiants et enseignants</p>
              </div>

              <div className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Classes & Matières</h3>
                </div>
                <p className="text-gray-600">Configurer les classes et matières</p>
              </div>

              <div className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Rapports</h3>
                </div>
                <p className="text-gray-600">Générer des rapports et statistiques</p>
              </div>
            </>
          )}

          {/* Carte Enseignant */}
          {estEnseignant() && (
            <>
              <div className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Mes Classes</h3>
                </div>
                <p className="text-gray-600">Consulter mes classes assignées</p>
              </div>

              <div className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Saisie Notes</h3>
                </div>
                <p className="text-gray-600">Enregistrer les notes des étudiants</p>
              </div>

              <div className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Mes Étudiants</h3>
                </div>
                <p className="text-gray-600">Voir la liste de mes étudiants</p>
              </div>
            </>
          )}

          {/* Carte Étudiant */}
          {estEtudiant() && (
            <>
              <div className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Mes Notes</h3>
                </div>
                <p className="text-gray-600">Consulter mes notes et moyennes</p>
              </div>

              <div className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Mes Matières</h3>
                </div>
                <p className="text-gray-600">Voir mes matières inscrites</p>
              </div>

              <div className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Relevé de Notes</h3>
                </div>
                <p className="text-gray-600">Télécharger mon relevé PDF</p>
              </div>
            </>
          )}
        </div>

        {/* Message d'information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Itération 1 - Authentification</h3>
              <p className="mt-1 text-sm text-blue-700">
                Cette page est temporaire. Les fonctionnalités complètes seront ajoutées dans les prochaines itérations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
