import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import inscriptionsService from '../../api/inscriptionsService'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'

const MesMatieres = () => {
  const { utilisateur } = useAuth()

  const { data: inscriptions = [], isLoading, error, refetch } = useQuery({
    queryKey: ['mes-matieres', utilisateur?.studentIdNum],
    queryFn: () => inscriptionsService.obtenirParEtudiant(utilisateur?.studentIdNum || ''),
    enabled: !!utilisateur?.studentIdNum
  })

  if (isLoading) return <Loader message="Chargement de vos matières..." />
  if (error) return <ErrorMessage message="Erreur lors du chargement" onRetry={refetch} />

  const inscriptionsParClasse = inscriptions.reduce((acc, inscription) => {
    const classe = inscription.classEntity?.name || 'Sans classe'
    if (!acc[classe]) acc[classe] = []
    acc[classe].push(inscription)
    return acc
  }, {})

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes Matières</h1>
        <p className="text-gray-600 mt-1">Liste de vos matières inscrites</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Total Matières</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{inscriptions.length}</p>
        </div>
        <div className="card bg-green-50 border border-green-200">
          <p className="text-sm text-green-600 font-medium">Classes</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{Object.keys(inscriptionsParClasse).length}</p>
        </div>
        <div className="card bg-purple-50 border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Statut</p>
          <p className="text-lg font-bold text-purple-900 mt-1">Actif</p>
        </div>
      </div>

      {Object.keys(inscriptionsParClasse).length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">Aucune matière inscrite</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(inscriptionsParClasse).map(([classe, matieresClasse]) => (
            <div key={classe} className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{classe}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matieresClasse.map((inscription) => (
                  <div key={inscription.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h4 className="font-semibold text-gray-900">{inscription.subject?.name || 'Matière inconnue'}</h4>
                    <p className="text-sm text-gray-500">Code: {inscription.subject?.subjectCode || '-'}</p>
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Semestre: </span>
                      {inscription.subject?.semester ? (
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          inscription.subject.semester === 'S1' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {inscription.subject.semester}
                        </span>
                      ) : (
                        <span className="text-gray-400">Non défini</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MesMatieres
