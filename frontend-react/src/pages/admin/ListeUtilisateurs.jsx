import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import utilisateursService from '../../api/utilisateursService'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import ModalUtilisateur from '../../components/modals/ModalUtilisateur'

/**
 * Page de gestion des utilisateurs (Admin)
 */
const ListeUtilisateurs = () => {
  const queryClient = useQueryClient()
  const [modalOuvert, setModalOuvert] = useState(false)
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState(null)
  const [typeUtilisateur, setTypeUtilisateur] = useState('student') // student ou teacher
  const [filtreRole, setFiltreRole] = useState('tous')

  // Récupération des utilisateurs
  const { data: utilisateurs = [], isLoading, error, refetch } = useQuery({
    queryKey: ['utilisateurs'],
    queryFn: async () => {
      console.log('Fetching users...')
      try {
        const result = await utilisateursService.obtenirTous()
        console.log('Users fetched:', result)
        return result
      } catch (err) {
        console.error('Error fetching users:', err)
        throw err
      }
    }
  })

  // Mutation suppression
  const suppressionMutation = useMutation({
    mutationFn: utilisateursService.supprimer,
    onSuccess: () => {
      queryClient.invalidateQueries(['utilisateurs'])
      toast.success('Utilisateur supprimé avec succès')
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression')
    }
  })

  const handleNouvelUtilisateur = (type) => {
    setTypeUtilisateur(type)
    setUtilisateurSelectionne(null)
    setModalOuvert(true)
  }

  const handleModifier = (utilisateur) => {
    setUtilisateurSelectionne(utilisateur)
    setTypeUtilisateur(utilisateur.role === 'TEACHER' ? 'teacher' : 'student')
    setModalOuvert(true)
  }

  const handleSupprimer = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      suppressionMutation.mutate(id)
    }
  }

  // Filtrage
  const utilisateursFiltres = utilisateurs.filter(u => {
    if (filtreRole === 'tous') return true
    return u.role === filtreRole
  })

  console.log('ListeUtilisateurs render:', { isLoading, error, utilisateurs })
  
  if (isLoading) return <Loader message="Chargement des utilisateurs..." />
  
  if (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    })
    
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-red-600 mb-4">Erreur de chargement</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Status:</strong> {error.response?.status || 'N/A'}</p>
          <p><strong>Message:</strong> {error.message}</p>
          <p><strong>URL:</strong> {error.config?.url}</p>
          <p><strong>Data:</strong> {JSON.stringify(error.response?.data)}</p>
        </div>
        <button onClick={refetch} className="btn-primary mt-4">Réessayer</button>
      </div>
    )
  }

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <p className="text-gray-600 mt-1">Gérer les étudiants et enseignants</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => handleNouvelUtilisateur('student')}
            className="btn-primary flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvel Étudiant
          </button>
          <button
            onClick={() => handleNouvelUtilisateur('teacher')}
            className="btn-secondary flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvel Enseignant
          </button>
        </div>

        {/* Filtre */}
        <select
          value={filtreRole}
          onChange={(e) => setFiltreRole(e.target.value)}
          className="input-field w-full sm:w-48"
        >
          <option value="tous">Tous les rôles</option>
          <option value="STUDENT">Étudiants</option>
          <option value="TEACHER">Enseignants</option>
          <option value="ADMIN">Administrateurs</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {utilisateursFiltres.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                utilisateursFiltres.map((utilisateur) => (
                  <tr key={utilisateur.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {utilisateur.firstname?.charAt(0)}{utilisateur.lastname?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {utilisateur.firstname} {utilisateur.lastname}
                          </div>
                          <div className="text-sm text-gray-500">{utilisateur.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{utilisateur.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        utilisateur.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        utilisateur.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {utilisateur.role === 'ADMIN' && 'Admin'}
                        {utilisateur.role === 'TEACHER' && 'Enseignant'}
                        {utilisateur.role === 'STUDENT' && 'Étudiant'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {utilisateur.studentIdNum || utilisateur.teacherIdNum || '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleModifier(utilisateur)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Modifier
                      </button>
                      {utilisateur.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleSupprimer(utilisateur.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={suppressionMutation.isLoading}
                        >
                          Supprimer
                        </button>
                      )}
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
        <ModalUtilisateur
          ouvert={modalOuvert}
          onFermer={() => setModalOuvert(false)}
          utilisateur={utilisateurSelectionne}
          type={typeUtilisateur}
        />
      )}
    </div>
  )
}

export default ListeUtilisateurs
