import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import connexionsService from '../../api/connexionsService'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import { formaterDateHeure } from '../../utils/formatters'

/**
 * Page d'historique des connexions (Admin)
 */
const HistoriqueConnexions = () => {
  const [limite, setLimite] = useState(50)

  // Récupération de l'historique
  const { data: connexions = [], isLoading, error, refetch } = useQuery({
    queryKey: ['connexions', limite],
    queryFn: () => connexionsService.obtenirRecentes(limite)
  })

  if (isLoading) return <Loader message="Chargement de l'historique..." />
  if (error) return <ErrorMessage message="Erreur lors du chargement" onRetry={refetch} />

  // Statistiques
  const connexionsAujourdhui = connexions.filter(c => {
    const date = new Date(c.logIn)
    const aujourdhui = new Date()
    return date.toDateString() === aujourdhui.toDateString()
  }).length

  const utilisateursUniques = new Set(connexions.map(c => c.userId)).size

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historique des Connexions</h1>
        <p className="text-gray-600 mt-1">Suivi des connexions utilisateurs</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Connexions</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{connexions.length}</p>
            </div>
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>

        <div className="card bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Aujourd'hui</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{connexionsAujourdhui}</p>
            </div>
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="card bg-purple-50 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Utilisateurs Uniques</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{utilisateursUniques}</p>
            </div>
            <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex justify-between items-center mb-4">
        <select
          value={limite}
          onChange={(e) => setLimite(parseInt(e.target.value))}
          className="input-field w-48"
        >
          <option value="25">25 dernières</option>
          <option value="50">50 dernières</option>
          <option value="100">100 dernières</option>
          <option value="200">200 dernières</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Connexion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Déconnexion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {connexions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Aucune connexion enregistrée
                  </td>
                </tr>
              ) : (
                connexions.map((connexion) => {
                  const duree = connexion.logOut 
                    ? Math.round((new Date(connexion.logOut) - new Date(connexion.logIn)) / 60000)
                    : null
                  
                  // Formatage intelligent de la durée
                  const formaterDuree = (minutes) => {
                    if (!minutes) return '-'
                    if (minutes < 60) return `${minutes} min`
                    const heures = Math.floor(minutes / 60)
                    const mins = minutes % 60
                    return mins > 0 ? `${heures}h ${mins}min` : `${heures}h`
                  }

                  return (
                    <tr key={connexion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {connexion.user ? 
                          `${connexion.user.firstname} ${connexion.user.lastname} (${connexion.user.username})` : 
                          `User #${connexion.user?.id || 'Unknown'}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formaterDateHeure(connexion.logIn)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {connexion.logOut ? formaterDateHeure(connexion.logOut) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formaterDuree(duree)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {connexion.ipAddress || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {connexion.logOut ? (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                            Déconnecté
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            En ligne
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default HistoriqueConnexions
