import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Page de connexion
 * Permet à l'utilisateur de s'authentifier avec username et password
 */
const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { seConnecter, estAuthentifie } = useAuth()

  // État du formulaire
  const [identifiants, setIdentifiants] = useState({
    username: '',
    password: ''
  })
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')

  // Redirection si déjà authentifié
  useEffect(() => {
    if (estAuthentifie) {
      const destination = location.state?.from?.pathname || '/dashboard'
      navigate(destination, { replace: true })
    }
  }, [estAuthentifie, navigate, location])

  /**
   * Gestion du changement des champs du formulaire
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setIdentifiants(prev => ({
      ...prev,
      [name]: value
    }))
    // Réinitialisation de l'erreur lors de la saisie
    if (erreur) setErreur('')
  }

  /**
   * Gestion de la soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')

    // Validation basique
    if (!identifiants.username || !identifiants.password) {
      setErreur('Veuillez remplir tous les champs')
      return
    }

    setChargement(true)

    try {
      const resultat = await seConnecter(identifiants)

      if (resultat.succes) {
        // Redirection selon le rôle
        const destination = location.state?.from?.pathname || '/dashboard'
        navigate(destination, { replace: true })
      } else {
        setErreur(resultat.erreur || 'Échec de la connexion')
      }
    } catch (err) {
      setErreur('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setChargement(false)
    }
  }

  /**
   * Remplissage rapide pour les tests (à retirer en production)
   */
  const remplirIdentifiants = (role) => {
    const identifiantsTest = {
      admin: { username: 'admin', password: 'adminpass' },
      teacher: { username: 'teacher1', password: 'teacher123' },
      student: { username: 'student1', password: 'student123' }
    }
    setIdentifiants(identifiantsTest[role])
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* En-tête */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Gestion de Notes
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Formulaire de connexion */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          {/* Message d'erreur */}
          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{erreur}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Champ Username */}
            <div>
              <label htmlFor="username" className="label">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input-field"
                placeholder="Entrez votre nom d'utilisateur"
                value={identifiants.username}
                onChange={handleChange}
                disabled={chargement}
              />
            </div>

            {/* Champ Password */}
            <div>
              <label htmlFor="password" className="label">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field"
                placeholder="Entrez votre mot de passe"
                value={identifiants.password}
                onChange={handleChange}
                disabled={chargement}
              />
            </div>
          </div>

          {/* Bouton de connexion */}
          <div>
            <button
              type="submit"
              disabled={chargement}
              className="w-full btn-primary flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {chargement ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>

          {/* Boutons de test rapide (environnement de développement uniquement) */}
          {import.meta.env.DEV && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-3 text-center">Connexion rapide (dev uniquement)</p>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => remplirIdentifiants('admin')}
                  className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                >
                  Admin
                </button>
                {/* <button
                  type="button"
                  onClick={() => remplirIdentifiants('teacher')}
                  className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Enseignant
                </button>
                <button
                  type="button"
                  onClick={() => remplirIdentifiants('student')}
                  className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Étudiant
                </button> */}
              </div>
            </div>
          )}
        </form>

        {/* Pied de page */}
        <p className="text-center text-sm text-gray-600">
          Système de Gestion Académique © 2025
        </p>
      </div>
    </div>
  )
}

export default Login
