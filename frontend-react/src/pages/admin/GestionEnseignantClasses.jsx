import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import enseignantClassesService from '../../api/enseignantClassesService'
import utilisateursService from '../../api/utilisateursService'
import classesService from '../../api/classesService'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import ModalAssignationEnseignant from '../../components/modals/ModalAssignationEnseignant'
import ModalModificationAssignation from '../../components/modals/ModalModificationAssignation'

/**
 * Page de gestion des assignations enseignant-classes (Admin)
 */
const GestionEnseignantClasses = () => {
  const queryClient = useQueryClient()
  const [modalOuvert, setModalOuvert] = useState(false)
  const [modalModificationOuvert, setModalModificationOuvert] = useState(false)
  const [assignationAModifier, setAssignationAModifier] = useState(null)
  const [filtreClasse, setFiltreClasse] = useState('tous')

  // Récupération des données
  const { data: assignations = [], isLoading, error, refetch } = useQuery({
    queryKey: ['enseignant-classes'],
    queryFn: enseignantClassesService.obtenirTous
  })

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: classesService.obtenirTous
  })

  // Mutation suppression
  const suppressionMutation = useMutation({
    mutationFn: enseignantClassesService.supprimer,
    onSuccess: () => {
      queryClient.invalidateQueries(['enseignant-classes'])
      console.log('Assignation supprimée avec succès')
    },
    onError: () => {
      console.error('Erreur lors de la suppression')
    }
  })

  const handleNouvelle = () => {
    setModalOuvert(true)
  }

  const handleModifier = (assignation) => {
    setAssignationAModifier(assignation)
    setModalModificationOuvert(true)
  }

  const handleSupprimer = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette assignation ?')) {
      suppressionMutation.mutate(id)
    }
  }

  // Filtrage
  const assignationsFiltrees = assignations.filter(a => {
    if (filtreClasse === 'tous') return true
    return a.classEntity?.id === parseInt(filtreClasse)
  })

  if (isLoading) return <Loader message="Chargement des assignations..." />
  if (error) return <ErrorMessage message="Erreur lors du chargement" onRetry={refetch} />

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion Enseignants-Classes</h1>
          <p className="text-gray-600">Gérer les assignations des enseignants aux classes</p>
        </div>
        <button
          onClick={handleNouvelle}
          className="btn-primary"
        >
          + Nouvelle Assignation
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Assignations</h3>
          <p className="text-3xl font-bold text-blue-600">{assignations.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Classes Couvertes</h3>
          <p className="text-3xl font-bold text-green-600">
            {new Set(assignations.map(a => a.classEntity?.id)).size}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Enseignants Actifs</h3>
          <p className="text-3xl font-bold text-purple-600">
            {new Set(assignations.map(a => a.teacher?.teacherIdNum)).size}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
        </div>
        <div className="flex space-x-4">
          <select
            value={filtreClasse}
            onChange={(e) => setFiltreClasse(e.target.value)}
            className="input-field"
          >
            <option value="tous">Toutes les classes</option>
            {classes.map(classe => (
              <option key={classe.id} value={classe.id}>
                {classe.name} - {classe.academicYear}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des assignations */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Assignations ({assignationsFiltrees.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Enseignant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Classe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Année Académique
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignationsFiltrees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Aucune assignation trouvée
                  </td>
                </tr>
              ) : (
                assignationsFiltrees.map((assignation) => (
                  <tr key={assignation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {assignation.teacher ? 
                        `${assignation.teacher.firstname} ${assignation.teacher.lastname}` : 
                        'N/A'}
                      <div className="text-xs text-gray-500">
                        {assignation.teacher?.teacherIdNum || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {assignation.classEntity?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {assignation.classEntity?.academicYear || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => handleModifier(assignation)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleSupprimer(assignation.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={suppressionMutation.isLoading}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modalOuvert && (
        <ModalAssignationEnseignant
          ouvert={modalOuvert}
          onFermer={() => setModalOuvert(false)}
        />
      )}

      {modalModificationOuvert && (
        <ModalModificationAssignation
          ouvert={modalModificationOuvert}
          onFermer={() => {
            setModalModificationOuvert(false)
            setAssignationAModifier(null)
          }}
          assignation={assignationAModifier}
        />
      )}
    </div>
  )
}

export default GestionEnseignantClasses
