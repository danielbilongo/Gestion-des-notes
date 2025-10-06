import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import inscriptionsService from '../../api/inscriptionsService'
import utilisateursService from '../../api/utilisateursService'
import classesService from '../../api/classesService'
import matieresService from '../../api/matieresService'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import ModalInscription from '../../components/modals/ModalInscription'
import ModalModificationInscription from '../../components/modals/ModalModificationInscription'

/**
 * Page de gestion des inscriptions (Admin)
 */
const GestionInscriptions = () => {
  const queryClient = useQueryClient()
  const [modalOuvert, setModalOuvert] = useState(false)
  const [modalModificationOuvert, setModalModificationOuvert] = useState(false)
  const [inscriptionAModifier, setInscriptionAModifier] = useState(null)
  const [filtreClasse, setFiltreClasse] = useState('tous')

  // Récupération des données
  const { data: inscriptions = [], isLoading, error, refetch } = useQuery({
    queryKey: ['inscriptions'],
    queryFn: inscriptionsService.obtenirTous
  })

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: classesService.obtenirTous
  })

  // Mutation suppression
  const suppressionMutation = useMutation({
    mutationFn: inscriptionsService.supprimer,
    onSuccess: () => {
      queryClient.invalidateQueries(['inscriptions'])
      console.log('Inscription supprimée avec succès')
    },
    onError: () => {
      console.error('Erreur lors de la suppression')
    }
  })

  const handleNouvelle = () => {
    setModalOuvert(true)
  }

  const handleModifier = (inscription) => {
    setInscriptionAModifier(inscription)
    setModalModificationOuvert(true)
  }

  const handleSupprimer = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
      suppressionMutation.mutate(id)
    }
  }

  // Filtrage
  const inscriptionsFiltrees = inscriptions.filter(i => {
    if (filtreClasse === 'tous') return true
    return i.classEntity?.id === parseInt(filtreClasse)
  })

  if (isLoading) return <Loader message="Chargement des inscriptions..." />
  if (error) return <ErrorMessage message="Erreur lors du chargement" onRetry={refetch} />

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Inscriptions</h1>
        <p className="text-gray-600 mt-1">Inscrire les étudiants aux classes et matières</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button
          onClick={handleNouvelle}
          className="btn-primary flex items-center"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle Inscription
        </button>

        {/* Filtre */}
        <select
          value={filtreClasse}
          onChange={(e) => setFiltreClasse(e.target.value)}
          className="input-field w-full sm:w-48"
        >
          <option value="tous">Toutes les classes</option>
          {classes.map(classe => (
            <option key={classe.id} value={classe.id}>
              {classe.name} - {classe.academicYear}
            </option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matière</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semestre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inscriptionsFiltrees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Aucune inscription trouvée
                  </td>
                </tr>
              ) : (
                inscriptionsFiltrees.map((inscription) => (
                  <tr key={inscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {inscription.student ? 
                        `${inscription.student.firstname} ${inscription.student.lastname}` : 
                        'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {inscription.classEntity?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {inscription.subject?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
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
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {inscription.enrollmentDate ? 
                        new Date(inscription.enrollmentDate).toLocaleDateString('fr-FR') : 
                        '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => handleModifier(inscription)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleSupprimer(inscription.id)}
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
        <ModalInscription
          ouvert={modalOuvert}
          onFermer={() => setModalOuvert(false)}
        />
      )}

      {modalModificationOuvert && (
        <ModalModificationInscription
          ouvert={modalModificationOuvert}
          onFermer={() => {
            setModalModificationOuvert(false)
            setInscriptionAModifier(null)
          }}
          inscription={inscriptionAModifier}
        />
      )}
    </div>
  )
}

export default GestionInscriptions
