import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import utilisateursService from '../../api/utilisateursService'
import matieresService from '../../api/matieresService'
import notesService from '../../api/notesService'
import authService from '../../api/authService'

/**
 * Page de saisie des notes (Enseignant)
 */
const SaisieNotes = () => {
  const queryClient = useQueryClient()
  const [etudiantSelectionne, setEtudiantSelectionne] = useState('')
  const [matiereSelectionnee, setMatiereSelectionnee] = useState('')
  const [noteAModifier, setNoteAModifier] = useState(null)
  const [modalModificationOuvert, setModalModificationOuvert] = useState(false)
  
  // Récupération de l'utilisateur connecté
  const utilisateurConnecte = authService.getCurrentUser()

  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { register: registerModif, handleSubmit: handleSubmitModif, reset: resetModif, setValue: setValueModif, formState: { errors: errorsModif } } = useForm()

  // Récupération des matières (DOIT être déclaré en premier)
  const { data: matieres = [] } = useQuery({
    queryKey: ['matieres'],
    queryFn: matieresService.obtenirTous
  })

  // Récupération des étudiants (filtrés par matière si sélectionnée)
  const { data: etudiants = [] } = useQuery({
    queryKey: ['etudiants-par-matiere', matiereSelectionnee],
    queryFn: () => {
      if (!matiereSelectionnee) {
        return utilisateursService.obtenirEtudiants()
      }
      const matiere = matieres.find(m => m.id === parseInt(matiereSelectionnee))
      return utilisateursService.obtenirEtudiantsParMatiere(matiere?.subjectCode || '')
    },
    enabled: !!matieres.length // Attendre que les matières soient chargées
  })

  // Récupération des notes de l'étudiant sélectionné
  const { data: notes = [], refetch: refetchNotes } = useQuery({
    queryKey: ['notes-etudiant', etudiantSelectionne],
    queryFn: () => {
      const etudiant = etudiants.find(e => e.id === parseInt(etudiantSelectionne))
      return notesService.obtenirParEtudiant(etudiant?.studentIdNum || '')
    },
    enabled: !!etudiantSelectionne
  })

  // Mutation ajout note
  const ajoutNoteMutation = useMutation({
    mutationFn: notesService.ajouter,
    onSuccess: () => {
      queryClient.invalidateQueries(['notes-etudiant'])
      toast.success('Note ajoutée avec succès')
      reset()
      refetchNotes()
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout de la note')
    }
  })

  // Mutation modification note
  const modificationNoteMutation = useMutation({
    mutationFn: ({ id, data }) => notesService.modifier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['notes-etudiant'])
      toast.success('Note modifiée avec succès')
      fermerModalModification()
      refetchNotes()
    },
    onError: () => {
      toast.error('Erreur lors de la modification de la note')
    }
  })

  const onSubmit = (data) => {
    const etudiant = etudiants.find(e => e.id === parseInt(etudiantSelectionne))
    const matiere = matieres.find(m => m.id === parseInt(matiereSelectionnee))

    if (!etudiant || !matiere) {
      toast.error('Veuillez sélectionner un étudiant et une matière')
      return
    }

    // Vérifier si l'étudiant a déjà une note pour cette matière
    const noteExistante = notes.find(note => 
      note.studentIdNum === etudiant.studentIdNum && 
      note.subjectCode === matiere.subjectCode
    )

    if (noteExistante) {
      toast.error(`Cet étudiant a déjà une note pour ${matiere.name}. Utilisez la fonction "Modifier" pour changer la note existante.`)
      return
    }

    const noteData = {
      studentIdNum: etudiant.studentIdNum,
      subjectCode: matiere.subjectCode,
      value: parseFloat(data.value),
      comment: data.comment || '',
      date: data.date,
      recordedBy: utilisateurConnecte?.teacherIdNum || utilisateurConnecte?.username
    }

    ajoutNoteMutation.mutate(noteData)
  }

  // Fonctions pour la modification
  const ouvrirModalModification = (note) => {
    setNoteAModifier(note)
    setModalModificationOuvert(true)
    
    // Pré-remplir le formulaire
    setValueModif('value', note.value)
    setValueModif('date', note.date)
    setValueModif('comment', note.comment || '')
  }

  const fermerModalModification = () => {
    setModalModificationOuvert(false)
    setNoteAModifier(null)
    resetModif()
  }

  const onSubmitModification = (data) => {
    if (!noteAModifier) return

    const noteData = {
      studentIdNum: noteAModifier.studentIdNum,
      subjectCode: noteAModifier.subjectCode,
      value: parseFloat(data.value),
      comment: data.comment || '',
      date: data.date,
      recordedBy: utilisateurConnecte?.teacherIdNum || utilisateurConnecte?.username
    }

    modificationNoteMutation.mutate({ id: noteAModifier.id, data: noteData })
  }

  // Fonction pour vérifier si une note existe déjà
  const noteExistePourEtudiantMatiere = () => {
    if (!etudiantSelectionne || !matiereSelectionnee) return false
    
    const etudiant = etudiants.find(e => e.id === parseInt(etudiantSelectionne))
    const matiere = matieres.find(m => m.id === parseInt(matiereSelectionnee))
    
    if (!etudiant || !matiere) return false
    
    return notes.find(note => 
      note.studentIdNum === etudiant.studentIdNum && 
      note.subjectCode === matiere.subjectCode
    )
  }

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Saisie des Notes</h1>
        <p className="text-gray-600 mt-1">Enregistrer les notes des étudiants</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Nouvelle Note</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Sélection matière */}
            <div>
              <label className="label">Matière *</label>
              <select
                value={matiereSelectionnee}
                onChange={(e) => {
                  setMatiereSelectionnee(e.target.value)
                  setEtudiantSelectionne('') // Réinitialiser la sélection d'étudiant
                }}
                className="input-field"
                required
              >
                <option value="">Sélectionner une matière</option>
                {matieres.map(matiere => (
                  <option key={matiere.id} value={matiere.id}>
                    {matiere.name} ({matiere.subjectCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Sélection étudiant */}
            <div>
              <label className="label">Étudiant *</label>
              <select
                value={etudiantSelectionne}
                onChange={(e) => setEtudiantSelectionne(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Sélectionner un étudiant</option>
                {etudiants.map(etudiant => (
                  <option key={etudiant.id} value={etudiant.id}>
                    {etudiant.firstname} {etudiant.lastname} ({etudiant.studentIdNum})
                  </option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="label">Note (sur 20) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="20"
                {...register('value', { 
                  required: 'Champ requis',
                  min: { value: 0, message: 'Min 0' },
                  max: { value: 20, message: 'Max 20' }
                })}
                className={`input-field ${errors.value ? 'input-error' : ''}`}
              />
              {errors.value && <p className="error-message">{errors.value.message}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="label">Date *</label>
              <input
                type="date"
                {...register('date', { required: 'Champ requis' })}
                className={`input-field ${errors.date ? 'input-error' : ''}`}
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              {errors.date && <p className="error-message">{errors.date.message}</p>}
            </div>

            {/* Commentaire */}
            <div>
              <label className="label">Commentaire</label>
              <textarea
                {...register('comment')}
                className="input-field"
                rows="3"
                placeholder="Commentaire optionnel..."
              />
            </div>

            {/* Avertissement si note existe déjà */}
            {noteExistePourEtudiantMatiere() && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-yellow-800">
                    <strong>Attention :</strong> Cet étudiant a déjà une note pour cette matière. 
                    Utilisez le bouton "Modifier" dans l'historique pour la changer.
                  </p>
                </div>
              </div>
            )}

            {/* Boutons */}
            <div className="flex space-x-3">
              <button 
                type="submit" 
                className="btn-primary flex-1"
                disabled={ajoutNoteMutation.isLoading}
              >
                {ajoutNoteMutation.isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button 
                type="button" 
                onClick={() => reset()}
                className="btn-secondary"
              >
                Réinitialiser
              </button>
            </div>
          </form>
        </div>

        {/* Historique des notes */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Historique</h2>
          
          {!etudiantSelectionne ? (
            <p className="text-gray-500 text-center py-8">
              Sélectionnez un étudiant pour voir ses notes
            </p>
          ) : notes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune note enregistrée
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notes.map(note => (
                <div key={note.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {note.subjectName}
                        </span>
                        <p className="font-medium text-gray-900">{note.subjectCode}</p>
                      </div>
                      <p className="text-sm text-gray-600">{new Date(note.date).toLocaleDateString('fr-FR')}</p>
                      {note.comment && (
                        <p className="text-sm text-gray-500 mt-1 italic">"{note.comment}"</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <button
                        onClick={() => ouvrirModalModification(note)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        title="Modifier cette note"
                      >
                        Modifier
                      </button>
                      <span className={`text-lg font-bold ${
                        note.value >= 16 ? 'text-green-600' :
                        note.value >= 12 ? 'text-blue-600' :
                        note.value >= 10 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {note.value.toFixed(2)}/20
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de modification */}
      {modalModificationOuvert && noteAModifier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Modifier la note</h3>
              <button
                onClick={fermerModalModification}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Informations de la note */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="font-medium text-gray-900">{noteAModifier.subjectName}</p>
              <p className="text-sm text-gray-600">
                Étudiant: {noteAModifier.firstname} {noteAModifier.lastname}
              </p>
            </div>

            {/* Formulaire de modification */}
            <form onSubmit={handleSubmitModif(onSubmitModification)} className="space-y-4">
              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (sur 20) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="20"
                  {...registerModif('value', { 
                    required: 'La note est obligatoire',
                    min: { value: 0, message: 'La note doit être positive' },
                    max: { value: 20, message: 'La note ne peut pas dépasser 20' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errorsModif.value && (
                  <p className="text-red-500 text-sm mt-1">{errorsModif.value.message}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  {...registerModif('date', { required: 'La date est obligatoire' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errorsModif.date && (
                  <p className="text-red-500 text-sm mt-1">{errorsModif.date.message}</p>
                )}
              </div>

              {/* Commentaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaire
                </label>
                <textarea
                  rows="3"
                  {...registerModif('comment')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Commentaire optionnel..."
                />
              </div>

              {/* Boutons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={modificationNoteMutation.isLoading}
                >
                  {modificationNoteMutation.isLoading ? 'Modification...' : 'Modifier'}
                </button>
                <button
                  type="button"
                  onClick={fermerModalModification}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SaisieNotes
