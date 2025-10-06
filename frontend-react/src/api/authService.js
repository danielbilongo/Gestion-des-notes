import apiClient from './client'

/**
 * Service d'authentification
 * Adapté au backend Spring Boot avec endpoint /api/auth/signin
 */
const authService = {
  /**
   * Connexion utilisateur
   * @param {Object} credentials - { username, password }
   * @returns {Promise} Response avec JWT et informations utilisateur
   */
  login: async (credentials) => {
    const response = await apiClient.post('/api/auth/signin', credentials)
    
    // Le backend retourne "token" au lieu de "jwt"
    const token = response.data.token || response.data.jwt
    
    if (token) {
      // Stocker le token JWT
      localStorage.setItem('gestion_notes_token', token)
      
      // Stocker les infos utilisateur
      const roles = response.data.roles || response.data.authorities || []
      let role = 'STUDENT' // Rôle par défaut
      
      if (roles.length > 0) {
        // Nettoyer le rôle (enlever ROLE_ si présent)
        role = roles[0].replace('ROLE_', '')
      }
      
      const utilisateur = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: role,
        studentIdNum: response.data.studentIdNum || null,
        teacherIdNum: response.data.teacherIdNum || null
      }
      localStorage.setItem('gestion_notes_user', JSON.stringify(utilisateur))
      
      return { token, utilisateur }
    }
    
    throw new Error('Authentification échouée')
  },

  /**
   * Déconnexion
   */
  logout: () => {
    localStorage.removeItem('gestion_notes_token')
    localStorage.removeItem('gestion_notes_user')
  },

  /**
   * Récupération de l'utilisateur courant depuis le localStorage
   * @returns {Object|null} Utilisateur ou null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('gestion_notes_user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (e) {
        return null
      }
    }
    return null
  },

  /**
   * Vérification si l'utilisateur est authentifié
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('gestion_notes_token')
    const user = authService.getCurrentUser()
    return !!(token && user)
  },

  /**
   * Récupération du token JWT
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('gestion_notes_token')
  },

  /**
   * Vérification du rôle utilisateur
   * @param {string|string[]} roles - Rôle(s) à vérifier
   * @returns {boolean}
   */
  hasRole: (roles) => {
    const user = authService.getCurrentUser()
    if (!user || !user.role) return false
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role)
    }
    return user.role === roles
  }
}

export default authService
