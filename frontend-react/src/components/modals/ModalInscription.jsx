import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import inscriptionsService from '../../api/inscriptionsService'
import utilisateursService from '../../api/utilisateursService'
import classesService from '../../api/classesService'
import matieresService from '../../api/matieresService'

/**
 * Modal de création d'inscription
 */
const ModalInscription = ({ ouvert, onFermer }) => {
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      studentIdNum: '',
      classId: '',
      subjectCode: ''
    }
  })

  // Récupération des étudiants avec le nouvel endpoint
  const { data: etudiants = [] } = useQuery({
    queryKey: ['etudiants'],
    queryFn: utilisateursService.obtenirEtudiants
  })

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: classesService.obtenirTous
  })

  const { data: matieres = [] } = useQuery({
    queryKey: ['matieres'],
    queryFn: matieresService.obtenirTous
  })

  // Debug: Vérifier les données des étudiants
  console.log('Étudiants disponibles:', etudiants)
  console.log('StudentIdNums disponibles:', etudiants.map(e => e.studentIdNum))

  // Mutation création
  const creationMutation = useMutation({
    mutationFn: inscriptionsService.creer,
    onSuccess: () => {
      queryClient.invalidateQueries(['inscriptions'])
      console.log('Inscription créée avec succès')
      onFermer()
    },
    onError: (error) => {
      console.error('Erreur lors de la création:', error)
      const message = error.response?.data?.message || error.message || 'Erreur inconnue'
      if (message.includes('already enrolled')) {
        console.error('Cet étudiant est déjà inscrit à cette matière dans cette classe')
      }
    }
  })

  const onSubmit = (data) => {
    // Debug: Vérifier les données du formulaire
    console.log('Données du formulaire:', data)
    
    // Conversion de classId en nombre (les autres restent en string)
    const dataToSend = {
      studentIdNum: data.studentIdNum,
      classId: parseInt(data.classId),
      subjectCode: data.subjectCode
    }
    
    console.log('Données à envoyer:', dataToSend)
    creationMutation.mutate(dataToSend)
  }

  if (!ouvert) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onFermer} />

        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Nouvelle Inscription
            </h3>
            <button onClick={onFermer} className="text-gray-400 hover:text-gray-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Étudiant */}
            <div>
              <label className="label">Étudiant *</label>
              <select
                {...register('studentIdNum', { required: 'Champ requis' })}
                className={`input-field ${errors.studentIdNum ? 'input-error' : ''}`}
              >
                <option value="">Sélectionner un étudiant</option>
                {etudiants.map(etudiant => (
                  <option key={etudiant.id} value={etudiant.studentIdNum}>
                    {etudiant.firstname} {etudiant.lastname} ({etudiant.studentIdNum})
                  </option>
                ))}
              </select>
              {errors.studentIdNum && <p className="error-message">{errors.studentIdNum.message}</p>}
            </div>

            {/* Classe */}
            <div>
              <label className="label">Classe *</label>
              <select
                {...register('classId', { required: 'Champ requis' })}
                className={`input-field ${errors.classId ? 'input-error' : ''}`}
              >
                <option value="">Sélectionner une classe</option>
                {classes.map(classe => (
                  <option key={classe.id} value={classe.id}>
                    {classe.name} - {classe.academicYear}
                  </option>
                ))}
              </select>
              {errors.classId && <p className="error-message">{errors.classId.message}</p>}
            </div>

            {/* Matière */}
            <div>
              <label className="label">Matière *</label>
              <select
                {...register('subjectCode', { required: 'Champ requis' })}
                className={`input-field ${errors.subjectCode ? 'input-error' : ''}`}
              >
                <option value="">Sélectionner une matière</option>
                {matieres.map(matiere => (
                  <option key={matiere.id} value={matiere.subjectCode}>
                    {matiere.name} ({matiere.subjectCode})
                  </option>
                ))}
              </select>
              {errors.subjectCode && <p className="error-message">{errors.subjectCode.message}</p>}
            </div>

            {/* Note: Seuls studentIdNum, classId et subjectCode sont supportés par le backend */}

            {/* Boutons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onFermer} className="btn-secondary">
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={creationMutation.isLoading}
              >
                {creationMutation.isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalInscription
