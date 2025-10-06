import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import inscriptionsService from '../../api/inscriptionsService'
import utilisateursService from '../../api/utilisateursService'
import classesService from '../../api/classesService'
import matieresService from '../../api/matieresService'

/**
 * Modal de modification d'inscription
 */
const ModalModificationInscription = ({ ouvert, onFermer, inscription }) => {
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      studentIdNum: '',
      classId: '',
      subjectCode: ''
    }
  })

  // Pré-remplir le formulaire avec les données de l'inscription
  useEffect(() => {
    if (inscription) {
      reset({
        studentIdNum: inscription.student?.studentIdNum || '',
        classId: inscription.classEntity?.id || '',
        subjectCode: inscription.subject?.subjectCode || ''
      })
    }
  }, [inscription, reset])

  // Récupération des données
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

  // Mutation modification
  const modificationMutation = useMutation({
    mutationFn: (data) => inscriptionsService.modifier(inscription.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['inscriptions'])
      console.log('Inscription modifiée avec succès')
      onFermer()
    },
    onError: (error) => {
      console.error('Erreur lors de la modification:', error)
      const message = error.response?.data?.message || error.message || 'Erreur inconnue'
      if (message.includes('already enrolled')) {
        console.error('Cet étudiant est déjà inscrit à cette matière dans cette classe')
      }
    }
  })

  const onSubmit = (data) => {
    // Conversion de classId en nombre
    const dataToSend = {
      studentIdNum: data.studentIdNum,
      classId: parseInt(data.classId),
      subjectCode: data.subjectCode
    }
    
    console.log('Données de modification à envoyer:', dataToSend)
    modificationMutation.mutate(dataToSend)
  }

  if (!ouvert) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Modifier l'inscription</h2>
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
          {/* Sélection de l'étudiant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Étudiant
            </label>
            <select
              {...register('studentIdNum', { required: 'Veuillez sélectionner un étudiant' })}
              className="input-field"
            >
              <option value="">Sélectionner un étudiant</option>
              {etudiants.map(etudiant => (
                <option key={etudiant.id} value={etudiant.studentIdNum}>
                  {etudiant.firstname} {etudiant.lastname} ({etudiant.studentIdNum})
                </option>
              ))}
            </select>
            {errors.studentIdNum && (
              <p className="text-red-500 text-sm mt-1">{errors.studentIdNum.message}</p>
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

          {/* Sélection de la matière */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matière
            </label>
            <select
              {...register('subjectCode', { required: 'Veuillez sélectionner une matière' })}
              className="input-field"
            >
              <option value="">Sélectionner une matière</option>
              {matieres.map(matiere => (
                <option key={matiere.id} value={matiere.subjectCode}>
                  {matiere.name} ({matiere.subjectCode})
                </option>
              ))}
            </select>
            {errors.subjectCode && (
              <p className="text-red-500 text-sm mt-1">{errors.subjectCode.message}</p>
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
              disabled={modificationMutation.isPending}
              className="btn-primary"
            >
              {modificationMutation.isPending ? 'Modification...' : 'Modifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalModificationInscription
