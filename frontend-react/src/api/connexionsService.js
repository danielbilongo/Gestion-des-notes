import apiClient from './client'

/**
 * Service de gestion de l'historique des connexions
 */
const connexionsService = {
  /**
   * Récupérer tous les enregistrements de connexion
   */
  obtenirTous: async () => {
    const response = await apiClient.get('/api/audit/login-records')
    return response.data
  },

  /**
   * Récupérer l'historique de connexion d'un utilisateur
   */
  obtenirParUtilisateur: async (userId) => {
    const response = await apiClient.get(`/api/audit/login-records/user/${userId}`)
    return response.data
  },

  /**
   * Récupérer les connexions récentes
   */
  obtenirRecentes: async (limit = 50) => {
    const response = await apiClient.get(`/api/audit/login-records?limit=${limit}`)
    return response.data
  }
}

export default connexionsService
