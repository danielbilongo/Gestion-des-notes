import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import classesService from '../../api/classesService'

/**
 * Modal de création/modification de classe
 */
const ModalClasse = ({ ouvert, onFermer, classe }) => {
  const queryClient = useQueryClient()
  const estModification = !!classe

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: classe || {
      name: '',
      academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
    }
  })

  // Mutation création
  const creationMutation = useMutation({
    mutationFn: classesService.creer,
    onSuccess: () => {
      queryClient.invalidateQueries(['classes'])
      toast.success('Classe créée avec succès')
      onFermer()
    },
    onError: () => {
      toast.error('Erreur lors de la création')
    }
  })

  // Mutation modification
  const modificationMutation = useMutation({
    mutationFn: (data) => classesService.modifier(classe.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['classes'])
      toast.success('Classe modifiée avec succès')
      onFermer()
    },
    onError: () => {
      toast.error('Erreur lors de la modification')
    }
  })

  const onSubmit = (data) => {
    if (estModification) {
      modificationMutation.mutate(data)
    } else {
      creationMutation.mutate(data)
    }
  }

  if (!ouvert) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onFermer} />

        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {estModification ? 'Modifier' : 'Nouvelle'} Classe
            </h3>
            <button onClick={onFermer} className="text-gray-400 hover:text-gray-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nom */}
            <div>
              <label className="label">Nom de la classe *</label>
              <input
                {...register('name', { required: 'Champ requis' })}
                className={`input-field ${errors.name ? 'input-error' : ''}`}
                placeholder="Ex: 6ème A, Terminale S1"
              />
              {errors.name && <p className="error-message">{errors.name.message}</p>}
            </div>

            {/* Année académique */}
            <div>
              <label className="label">Année académique *</label>
              <input
                {...register('academicYear', { required: 'Champ requis' })}
                className={`input-field ${errors.academicYear ? 'input-error' : ''}`}
                placeholder="Ex: 2024-2025"
              />
              {errors.academicYear && <p className="error-message">{errors.academicYear.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="label">Description</label>
              <textarea
                {...register('description')}
                className="input-field"
                rows="3"
                placeholder="Description optionnelle de la classe..."
              />
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onFermer} className="btn-secondary">
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={creationMutation.isLoading || modificationMutation.isLoading}
              >
                {(creationMutation.isLoading || modificationMutation.isLoading) ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalClasse
