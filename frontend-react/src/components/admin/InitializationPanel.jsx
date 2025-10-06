import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { initializeDefaultData } from '../../utils/defaultData'
import matieresService from '../../api/matieresService'
import classesService from '../../api/classesService'
import utilisateursService from '../../api/utilisateursService'
import inscriptionsService from '../../api/inscriptionsService'
import notesService from '../../api/notesService'

/**
 * Panneau d'initialisation des données par défaut
 */
const InitializationPanel = ({ onDataInitialized }) => {
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const handleInitialize = async () => {
    setLoading(true)
    
    try {
      const services = {
        matieresService,
        classesService,
        utilisateursService,
        inscriptionsService,
        notesService
      }

      const result = await initializeDefaultData(services)
      
      if (result.success) {
        setInitialized(true)
        toast.success('Données initialisées avec succès!')
        if (onDataInitialized) {
          onDataInitialized()
        }
      } else {
        toast.error('Erreur lors de l\'initialisation des données')
      }
    } catch (error) {
      console.error('Erreur initialisation:', error)
      toast.error('Erreur lors de l\'initialisation des données')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-blue-900">
            Initialisation des données de démonstration
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              Pour tester l'application, vous pouvez initialiser des données par défaut qui incluent :
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li><strong>5 matières</strong> : Mathématiques, Informatique, Physique, Algorithmique, Base de Données</li>
              <li><strong>3 classes</strong> : L1, L2, L3 Informatique</li>
              <li><strong>2 enseignants</strong> : prof_math, prof_info (mot de passe: prof123)</li>
              <li><strong>3 étudiants</strong> : etudiant1, etudiant2, etudiant3 (mot de passe: etud123)</li>
            </ul>
          </div>
          <div className="mt-4">
            <button
              onClick={handleInitialize}
              disabled={loading || initialized}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${loading || initialized
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Initialisation...' : initialized ? 'Données initialisées ✓' : 'Initialiser les données'}
            </button>
          </div>
          {initialized && (
            <div className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
              <strong>Données créées avec succès !</strong> Vous pouvez maintenant :
              <ul className="mt-1 list-disc list-inside">
                <li>Créer des inscriptions (Inscriptions)</li>
                <li>Saisir des notes en tant qu'enseignant</li>
                <li>Consulter les notes en tant qu'étudiant</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InitializationPanel
