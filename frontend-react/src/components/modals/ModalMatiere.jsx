import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import matieresService from '../../api/matieresService'

/**
 * Modal de création/modification de matière
 */
const ModalMatiere = ({ ouvert, onFermer, matiere }) => {
  const queryClient = useQueryClient()
  const estModification = !!matiere

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: matiere || {
      subjectCode: '',
      name: '',
      coefficient: 1,
      description: '',
      semester: 'S1' // Valeur par défaut
    }
  })

  // Mutation création
  const creationMutation = useMutation({
    mutationFn: matieresService.creer,
    onSuccess: () => {
      queryClient.invalidateQueries(['matieres'])
      toast.success('Matière créée avec succès')
      onFermer()
    },
    onError: () => {
      toast.error('Erreur lors de la création')
    }
  })

  // Mutation modification
  const modificationMutation = useMutation({
    mutationFn: (data) => matieresService.modifier(matiere.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['matieres'])
      toast.success('Matière modifiée avec succès')
      onFermer()
    },
    onError: () => {
      toast.error('Erreur lors de la modification')
    }
  })

  const onSubmit = (data) => {
    // Conversion du coefficient en nombre
    data.coefficient = parseFloat(data.coefficient)
    
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
              {estModification ? 'Modifier' : 'Nouvelle'} Matière
            </h3>
            <button onClick={onFermer} className="text-gray-400 hover:text-gray-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Code matière */}
            <div>
              <label className="label">Code matière *</label>
              <input
                {...register('subjectCode', { required: 'Champ requis' })}
                className={`input-field ${errors.subjectCode ? 'input-error' : ''}`}
                placeholder="Ex: MATH101, INFO201"
                disabled={estModification}
              />
              {errors.subjectCode && <p className="error-message">{errors.subjectCode.message}</p>}
            </div>

            {/* Nom */}
            <div>
              <label className="label">Nom de la matière *</label>
              <input
                {...register('name', { required: 'Champ requis' })}
                className={`input-field ${errors.name ? 'input-error' : ''}`}
                placeholder="Ex: Mathématiques, Informatique"
              />
              {errors.name && <p className="error-message">{errors.name.message}</p>}
            </div>

            {/* Coefficient */}
            <div>
              <label className="label">Coefficient *</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="10"
                {...register('coefficient', { 
                  required: 'Champ requis',
                  min: { value: 0.5, message: 'Min 0.5' },
                  max: { value: 10, message: 'Max 10' }
                })}
                className={`input-field ${errors.coefficient ? 'input-error' : ''}`}
              />
              {errors.coefficient && <p className="error-message">{errors.coefficient.message}</p>}
            </div>

            {/* Semestre */}
            <div>
              <label className="label">Semestre *</label>
              <select
                {...register('semester', { required: 'Champ requis' })}
                className={`input-field ${errors.semester ? 'input-error' : ''}`}
              >
                <option value="">Sélectionner un semestre</option>
                <option value="S1">Semestre 1 (S1)</option>
                <option value="S2">Semestre 2 (S2)</option>
              </select>
              {errors.semester && <p className="error-message">{errors.semester.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="label">Description</label>
              <textarea
                {...register('description')}
                className="input-field"
                rows="3"
                placeholder="Description optionnelle..."
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

export default ModalMatiere
