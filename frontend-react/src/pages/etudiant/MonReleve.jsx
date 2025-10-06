import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import releveService from '../../api/releveService'

/**
 * Page de téléchargement du relevé de notes
 */
const MonReleve = () => {
  const { utilisateur } = useAuth()
  const [chargement, setChargement] = useState(false)

  const handleTelecharger = async () => {
    if (!utilisateur?.studentIdNum) {
      toast.error('Numéro étudiant non trouvé')
      return
    }

    setChargement(true)
    try {
      await releveService.telechargerPDF(utilisateur.studentIdNum)
      toast.success('Relevé téléchargé avec succès')
    } catch (error) {
      toast.error('Erreur lors du téléchargement du relevé')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mon Relevé de Notes</h1>
        <p className="text-gray-600 mt-1">Téléchargez votre relevé officiel au format PDF</p>
      </div>

      <div className="card max-w-2xl mx-auto text-center py-12">
        <svg className="mx-auto h-20 w-20 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        
        <h2 className="mt-6 text-xl font-semibold text-gray-900">Relevé de Notes Officiel</h2>
        <p className="mt-2 text-gray-600">
          Document PDF contenant toutes vos notes et moyennes
        </p>

        <div className="mt-8">
          <button
            onClick={handleTelecharger}
            disabled={chargement}
            className="btn-primary px-8 py-3 text-lg"
          >
            {chargement ? (
              <>
                <svg className="animate-spin inline-block h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Génération en cours...
              </>
            ) : (
              <>
                <svg className="inline-block h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Télécharger le Relevé PDF
              </>
            )}
          </button>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4 text-left">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Contenu du relevé :</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Informations personnelles</li>
            <li>✓ Notes par matière</li>
            <li>✓ Moyennes détaillées</li>
            <li>✓ Moyenne générale</li>
            <li>✓ Date de génération</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MonReleve
