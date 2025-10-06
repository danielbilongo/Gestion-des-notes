import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../api/authService'
import { toast } from 'react-toastify'

// Création du contexte d'authentification
const AuthContext = createContext(null)

/**
 * Provider d'authentification
 * Gère l'état global de l'authentification dans l'application
 */
export const AuthProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [estAuthentifie, setEstAuthentifie] = useState(false)

  // Vérification de l'authentification au chargement
  useEffect(() => {
    verifierAuthentification()
  }, [])

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  const verifierAuthentification = () => {
    try {
      const utilisateurStocke = authService.getCurrentUser()
      const token = authService.getToken()

      if (utilisateurStocke && token) {
        setUtilisateur(utilisateurStocke)
        setEstAuthentifie(true)
      } else {
        setUtilisateur(null)
        setEstAuthentifie(false)
      }
    } catch (erreur) {
      console.error('Erreur lors de la vérification de l\'authentification:', erreur)
      setUtilisateur(null)
      setEstAuthentifie(false)
    } finally {
      setChargement(false)
    }
  }

  /**
   * Connexion utilisateur
   * @param {Object} identifiants - { username, password }
   */
  const seConnecter = async (identifiants) => {
    try {
      setChargement(true)
      const reponse = await authService.login(identifiants)
      
      // Récupération de l'utilisateur depuis le localStorage (mis à jour par authService)
      const utilisateurConnecte = authService.getCurrentUser()
      
      setUtilisateur(utilisateurConnecte)
      setEstAuthentifie(true)
      
      toast.success(`Bienvenue ${utilisateurConnecte.username} !`)
      
      return { succes: true, utilisateur: utilisateurConnecte }
    } catch (erreur) {
      console.error('Erreur de connexion:', erreur)
      setUtilisateur(null)
      setEstAuthentifie(false)
      
      const messageErreur = erreur.response?.data?.message || 
                           'Identifiants incorrects. Veuillez réessayer.'
      toast.error(messageErreur)
      
      return { succes: false, erreur: messageErreur }
    } finally {
      setChargement(false)
    }
  }

  /**
   * Déconnexion utilisateur
   */
  const seDeconnecter = () => {
    authService.logout()
    setUtilisateur(null)
    setEstAuthentifie(false)
    toast.info('Vous avez été déconnecté avec succès')
  }

  /**
   * Vérification du rôle utilisateur
   * @param {string|string[]} roles - Rôle(s) à vérifier
   * @returns {boolean}
   */
  const aLeRole = (roles) => {
    if (!utilisateur) return false
    
    if (Array.isArray(roles)) {
      return roles.includes(utilisateur.role)
    }
    return utilisateur.role === roles
  }

  /**
   * Vérification si l'utilisateur est admin
   * @returns {boolean}
   */
  const estAdmin = () => {
    return utilisateur?.role === 'ADMIN'
  }

  /**
   * Vérification si l'utilisateur est enseignant
   * @returns {boolean}
   */
  const estEnseignant = () => {
    return utilisateur?.role === 'TEACHER'
  }

  /**
   * Vérification si l'utilisateur est étudiant
   * @returns {boolean}
   */
  const estEtudiant = () => {
    return utilisateur?.role === 'STUDENT'
  }

  // Valeur du contexte
  const valeurContexte = {
    utilisateur,
    chargement,
    estAuthentifie,
    seConnecter,
    seDeconnecter,
    aLeRole,
    estAdmin,
    estEnseignant,
    estEtudiant,
    verifierAuthentification
  }

  return (
    <AuthContext.Provider value={valeurContexte}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * @returns {Object} Contexte d'authentification
 */
export const useAuth = () => {
  const contexte = useContext(AuthContext)
  
  if (!contexte) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider')
  }
  
  return contexte
}

export default AuthContext
