import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import classesService from '../../api/classesService'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import ModalClasse from '../../components/modals/ModalClasse'

/**
 * Page de gestion des classes (Admin)
 */
const GestionClasses = () => {
  const queryClient = useQueryClient()
  const [modalOuvert, setModalOuvert] = useState(false)
  const [classeSelectionnee, setClasseSelectionnee] = useState(null)

  // Récupération des classes
  const { data: classes = [], isLoading, error, refetch } = useQuery({
    queryKey: ['classes'],
    queryFn: classesService.obtenirTous
  })

  // Mutation suppression
  const suppressionMutation = useMutation({
    mutationFn: classesService.supprimer,
    onSuccess: () => {
      queryClient.invalidateQueries(['classes'])
      toast.success('Classe supprimée avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    }
  })

  const handleNouvelle = () => {
    setClasseSelectionnee(null)
    setModalOuvert(true)
  }

  const handleModifier = (classe) => {
    setClasseSelectionnee(classe)
    setModalOuvert(true)
  }

  const handleSupprimer = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      suppressionMutation.mutate(id)
    }
  }

  if (isLoading) return <Loader message="Chargement des classes..." />
  if (error) return <ErrorMessage message="Erreur lors du chargement" onRetry={refetch} />

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Classes</h1>
        <p className="text-gray-600 mt-1">Gérer les classes et années académiques</p>
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
          Nouvelle Classe
        </button>
      </div>

      {/* Grille des classes */}
      {classes.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="mt-4 text-gray-600">Aucune classe créée</p>
          <button onClick={handleNouvelle} className="mt-4 btn-primary">
            Créer la première classe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classe) => (
            <div key={classe.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{classe.name}</h3>
                    <p className="text-sm text-gray-500">{classe.academicYear}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleModifier(classe)}
                  className="flex-1 btn-secondary text-sm"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleSupprimer(classe.id)}
                  className="flex-1 btn-danger text-sm"
                  disabled={suppressionMutation.isLoading}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOuvert && (
        <ModalClasse
          ouvert={modalOuvert}
          onFermer={() => setModalOuvert(false)}
          classe={classeSelectionnee}
        />
      )}
    </div>
  )
}

export default GestionClasses
