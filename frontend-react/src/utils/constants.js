/**
 * Constantes de l'application
 */

// Rôles utilisateurs
export const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT'
}

// Messages d'erreur
export const MESSAGES_ERREUR = {
  CONNEXION_ECHOUEE: 'Échec de la connexion. Vérifiez vos identifiants.',
  SESSION_EXPIREE: 'Votre session a expiré. Veuillez vous reconnecter.',
  ACCES_REFUSE: 'Vous n\'avez pas les permissions nécessaires.',
  ERREUR_SERVEUR: 'Erreur serveur. Veuillez réessayer plus tard.',
  ERREUR_RESEAU: 'Erreur de connexion. Vérifiez votre connexion internet.'
}

// Messages de succès
export const MESSAGES_SUCCES = {
  CONNEXION_REUSSIE: 'Connexion réussie !',
  DECONNEXION_REUSSIE: 'Déconnexion réussie.',
  SAUVEGARDE_REUSSIE: 'Enregistrement réussi.',
  SUPPRESSION_REUSSIE: 'Suppression réussie.'
}

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  NON_AUTORISE: '/non-autorise',
  ADMIN: '/admin',
  ENSEIGNANT: '/enseignant',
  ETUDIANT: '/etudiant'
}
