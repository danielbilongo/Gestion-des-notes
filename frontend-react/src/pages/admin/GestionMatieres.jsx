import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import matieresService from '../../api/matieresService'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import ModalMatiere from '../../components/modals/ModalMatiere'

/**
 * Page de gestion des matières (Admin)
 */
const GestionMatieres = () => {
  const queryClient = useQueryClient()
  const [modalOuvert, setModalOuvert] = useState(false)
  const [matiereSelectionnee, setMatiereSelectionnee] = useState(null)

  // Récupération des matières
  const { data: matieres = [], isLoading, error, refetch } = useQuery({
    queryKey: ['matieres'],
    queryFn: matieresService.obtenirTous
  })

  // Mutation suppression
  const suppressionMutation = useMutation({
    mutationFn: matieresService.supprimer,
    onSuccess: () => {
      queryClient.invalidateQueries(['matieres'])
      toast.success('Matière supprimée avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    }
  })

  const handleNouvelle = () => {
    setMatiereSelectionnee(null)
    setModalOuvert(true)
  }

  const handleModifier = (matiere) => {
    setMatiereSelectionnee(matiere)
    setModalOuvert(true)
  }

  const handleSupprimer = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      suppressionMutation.mutate(id)
    }
  }

  if (isLoading) return <Loader message="Chargement des matières..." />
  if (error) return <ErrorMessage message="Erreur lors du chargement" onRetry={refetch} />

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Matières</h1>
        <p className="text-gray-600 mt-1">Gérer les matières et leurs coefficients</p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleNouvelle}
          className="btn-primary flex items-center"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle Matière
        </button>
      </div>

      {/* Tableau */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coefficient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semestre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matieres.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Aucune matière créée
                  </td>
                </tr>
              ) : (
                matieres.map((matiere) => (
                  <tr key={matiere.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {matiere.subjectCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {matiere.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="font-semibold text-blue-600">
                        {matiere.coefficient || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {matiere.semester ? (
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          matiere.semester === 'S1' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {matiere.semester}
                        </span>
                      ) : (
                        <span className="text-gray-400">Non défini</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {matiere.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleModifier(matiere)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleSupprimer(matiere.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={suppressionMutation.isLoading}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOuvert && (
        <ModalMatiere
          ouvert={modalOuvert}
          onFermer={() => setModalOuvert(false)}
          matiere={matiereSelectionnee}
        />
      )}
    </div>
  )
}

export default GestionMatieres
