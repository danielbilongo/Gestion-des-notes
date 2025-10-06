import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

/**
 * Guide de démarrage rapide pour les nouveaux utilisateurs
 */
const QuickStartGuide = ({ onClose }) => {
  const { utilisateur } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)

  const getStepsForRole = () => {
    switch (utilisateur?.role) {
      case 'ADMIN':
        return [
          {
            title: "Bienvenue, Administrateur !",
            content: "Vous avez accès à toutes les fonctionnalités du système.",
            icon: "👋",
            actions: []
          },
          {
            title: "1. Initialiser les données",
            content: "Cliquez sur 'Initialiser les données' pour créer des utilisateurs, matières et classes de test.",
            icon: "🚀",
            actions: ["Aller au Dashboard"]
          },
          {
            title: "2. Gérer les utilisateurs",
            content: "Créez des enseignants et étudiants via le menu 'Utilisateurs'.",
            icon: "👥",
            actions: ["Aller aux Utilisateurs"]
          },
          {
            title: "3. Créer des inscriptions",
            content: "Inscrivez les étudiants aux matières via le menu 'Inscriptions'.",
            icon: "📝",
            actions: ["Aller aux Inscriptions"]
          },
          {
            title: "4. Suivre l'activité",
            content: "Consultez les rapports et l'historique des connexions.",
            icon: "📊",
            actions: ["Voir les Rapports"]
          }
        ]
      
      case 'TEACHER':
        return [
          {
            title: "Bienvenue, Enseignant !",
            content: "Vous pouvez saisir et consulter les notes de vos étudiants.",
            icon: "👨‍🏫",
            actions: []
          },
          {
            title: "1. Saisir des notes",
            content: "Utilisez le menu 'Saisie Notes' pour attribuer des notes aux étudiants.",
            icon: "✏️",
            actions: ["Aller à Saisie Notes"]
          },
          {
            title: "2. Consulter les résultats",
            content: "Visualisez les moyennes et statistiques de vos étudiants.",
            icon: "📈",
            actions: ["Voir le Dashboard"]
          }
        ]
      
      case 'STUDENT':
        return [
          {
            title: "Bienvenue, Étudiant !",
            content: "Consultez vos notes et suivez votre progression.",
            icon: "👨‍🎓",
            actions: []
          },
          {
            title: "1. Consulter vos notes",
            content: "Accédez à toutes vos notes via le menu 'Mes Notes'.",
            icon: "📚",
            actions: ["Voir Mes Notes"]
          },
          {
            title: "2. Suivre votre progression",
            content: "Le dashboard affiche vos moyennes et graphiques de progression.",
            icon: "📊",
            actions: ["Voir le Dashboard"]
          },
          {
            title: "3. Télécharger votre relevé",
            content: "Générez un relevé de notes PDF via 'Relevé de Notes'.",
            icon: "📄",
            actions: ["Télécharger Relevé"]
          }
        ]
      
      default:
        return []
    }
  }

  const steps = getStepsForRole()
  const currentStepData = steps[currentStep]

  if (!currentStepData) return null

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <span className="text-2xl mr-2">{currentStepData.icon}</span>
              <h3 className="text-lg font-semibold text-gray-900">
                Guide de démarrage
              </h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Étape {currentStep + 1} sur {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              {currentStepData.title}
            </h4>
            <p className="text-gray-600 leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          {/* Actions */}
          {currentStepData.actions.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Actions suggérées :</p>
              <div className="space-y-2">
                {currentStepData.actions.map((action, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Précédent
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Passer
              </button>
              <button
                onClick={nextStep}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
              >
                {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickStartGuide
