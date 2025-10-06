import React, { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import utilisateursService from '../../api/utilisateursService'
import ValidatedInput from '../forms/ValidatedInput'
import {
  validateUsername,
  validatePassword,
  validateName,
  validateEmail,
  validateUserForm
} from '../../utils/validation'

/**
 * Modal de création/modification d'utilisateur
 */
const ModalUtilisateur = ({ ouvert, onFermer, utilisateur, type }) => {
  const queryClient = useQueryClient()
  const estModification = !!utilisateur

  // État du formulaire
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: ''
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Initialisation du formulaire
  useEffect(() => {
    
    if (utilisateur) {
      setFormData({
        username: utilisateur.username || '',
        password: '', // Ne pas pré-remplir le mot de passe
        firstname: utilisateur.firstname || '',
        lastname: utilisateur.lastname || '',
        email: utilisateur.email || ''
      })
    } else {
      // Formulaire vide pour nouveau utilisateur (ID généré automatiquement)
      setFormData({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        email: ''
      })
    }
  }, [utilisateur])

  // Gestion des changements de champs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Mutation création
  const creationMutation = useMutation({
    mutationFn: (data) => {
      return type === 'student' 
        ? utilisateursService.creerEtudiant(data)
        : utilisateursService.creerEnseignant(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['utilisateurs'])
      console.log(`${type === 'student' ? 'Étudiant' : 'Enseignant'} créé avec succès`)
      onFermer()
    },
    onError: (error) => {
      console.error('Erreur lors de la création')
    }
  })

  // Mutation modification
  const modificationMutation = useMutation({
    mutationFn: (data) => {
      console.log('🔧 Mutation modifier - ID:', utilisateur?.id)
      if (!utilisateur?.id) {
        throw new Error('ID utilisateur manquant pour la modification')
      }
      return utilisateursService.modifier(utilisateur.id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['utilisateurs'])
      console.log('✅ Utilisateur modifié avec succès')
      onFermer()
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la modification:', error)
    }
  })

  // Soumission du formulaire avec validation
  const handleSubmit = (e) => {
    e.preventDefault()
    
    console.log('🔍 DEBUG - Soumission formulaire:', {
      estModification,
      utilisateur: utilisateur?.id,
      formData
    })
    
    // Validation complète du formulaire - SEULEMENT pour création
    if (!estModification) {
      const validation = validateUserForm(formData, type)
      
      if (!validation.isValid) {
        setErrors(validation.errors)
        console.error('Veuillez corriger les erreurs dans le formulaire')
        console.log('Erreurs de validation:', validation.errors)
        return
      }
    } else {
      // Pour modification, validation plus souple
      const requiredFields = ['firstname', 'lastname', 'email']
      const missingFields = requiredFields.filter(field => !formData[field]?.trim())
      
      if (missingFields.length > 0) {
        console.error('❌ Champs manquants pour modification:', missingFields)
        console.log('FormData actuel:', formData)
        return
      }
      
      // Si un mot de passe est fourni, il doit être valide
      if (formData.password && formData.password.trim() && formData.password.length < 6) {
        console.error('❌ Le mot de passe doit faire au moins 6 caractères')
        setErrors({ password: 'Le mot de passe doit faire au moins 6 caractères' })
        return
      }
      
      console.log('✅ Validation modification OK')
    }
    
    // Réinitialiser les erreurs
    setErrors({})
    
    // Préparer les données (IDs générés automatiquement côté backend)
    const dataToSend = {
      username: formData.username,
      password: formData.password,
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email
    }
    
    console.log('📤 Données à envoyer:', dataToSend)
    
    // Soumettre
    if (estModification) {
      console.log('🔄 Lancement mutation modification...')
      
      if (!utilisateur?.id) {
        console.error('❌ ERREUR: Pas d\'ID utilisateur pour la modification!')
        return
      }
      
      modificationMutation.mutate(dataToSend)
    } else {
      console.log('➕ Lancement mutation création...')
      creationMutation.mutate(dataToSend)
    }
  }

  if (!ouvert) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onFermer} />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {estModification ? 'Modifier' : 'Nouveau'} {type === 'student' ? 'Étudiant' : 'Enseignant'}
            </h3>
            <button onClick={onFermer} className="text-gray-400 hover:text-gray-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <ValidatedInput
              label="Nom d'utilisateur"
              name="username"
              value={formData.username}
              onChange={handleChange}
              validator={validateUsername}
              required
              disabled={estModification}
              placeholder="ex: admin, prof1, etudiant1"
              helpText="3-50 caractères (lettres, chiffres, _)"
            />

            {/* Password */}
            <ValidatedInput
              label={estModification ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              validator={estModification ? null : validatePassword}
              required={!estModification}
              placeholder={estModification ? "Laisser vide pour conserver l'actuel" : "Minimum 6 caractères"}
              helpText={estModification ? "Laisser vide pour ne pas modifier" : "Au moins 6 caractères"}
            />

            {/* Prénom */}
            <ValidatedInput
              label="Prénom"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              validator={(value) => validateName(value, 'Le prénom')}
              required
              placeholder="ex: Jean, Marie"
            />

            {/* Nom */}
            <ValidatedInput
              label="Nom"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              validator={(value) => validateName(value, 'Le nom')}
              required
              placeholder="ex: Dupont, Martin"
            />

            {/* Email */}
            <ValidatedInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              validator={validateEmail}
              required
              placeholder="ex: jean.dupont@ecole.fr"
            />

            {/* Note: L'ID est maintenant généré automatiquement côté backend */}

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

export default ModalUtilisateur
