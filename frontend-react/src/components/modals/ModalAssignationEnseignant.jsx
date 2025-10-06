import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import enseignantClassesService from '../../api/enseignantClassesService'
import utilisateursService from '../../api/utilisateursService'
import classesService from '../../api/classesService'

/**
 * Modal d'assignation d'enseignant à une classe
 */
const ModalAssignationEnseignant = ({ ouvert, onFermer }) => {
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      teacherIdNum: '',
      classId: ''
    }
  })

  // Récupération des enseignants
  const { data: enseignants = [] } = useQuery({
    queryKey: ['enseignants'],
    queryFn: utilisateursService.obtenirEnseignants
  })

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: classesService.obtenirTous
  })

  // Mutation création
  const creationMutation = useMutation({
    mutationFn: enseignantClassesService.assigner,
    onSuccess: () => {
      queryClient.invalidateQueries(['enseignant-classes'])
      console.log('Assignation créée avec succès')
      onFermer()
    },
    onError: (error) => {
      console.error('Erreur lors de la création:', error)
      const message = error.response?.data?.message || error.message || 'Erreur inconnue'
      if (message.includes('already assigned')) {
        console.error('Cet enseignant est déjà assigné à cette classe')
      }
    }
  })

  const onSubmit = (data) => {
    // Conversion de classId en nombre
    const dataToSend = {
      teacherIdNum: data.teacherIdNum,
      classId: parseInt(data.classId)
    }
    
    console.log('Données d\'assignation à envoyer:', dataToSend)
    creationMutation.mutate(dataToSend)
  }

  if (!ouvert) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Nouvelle Assignation</h2>
          <button
            onClick={onFermer}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Sélection de l'enseignant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enseignant
            </label>
            <select
              {...register('teacherIdNum', { required: 'Veuillez sélectionner un enseignant' })}
              className="input-field"
            >
              <option value="">Sélectionner un enseignant</option>
              {enseignants.map(enseignant => (
                <option key={enseignant.id} value={enseignant.teacherIdNum}>
                  {enseignant.firstname} {enseignant.lastname} ({enseignant.teacherIdNum})
                </option>
              ))}
            </select>
            {errors.teacherIdNum && (
              <p className="text-red-500 text-sm mt-1">{errors.teacherIdNum.message}</p>
            )}
          </div>

          {/* Sélection de la classe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classe
            </label>
            <select
              {...register('classId', { required: 'Veuillez sélectionner une classe' })}
              className="input-field"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map(classe => (
                <option key={classe.id} value={classe.id}>
                  {classe.name} - {classe.academicYear}
                </option>
              ))}
            </select>
            {errors.classId && (
              <p className="text-red-500 text-sm mt-1">{errors.classId.message}</p>
            )}
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onFermer}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={creationMutation.isPending}
              className="btn-primary"
            >
              {creationMutation.isPending ? 'Assignation...' : 'Assigner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalAssignationEnseignant
