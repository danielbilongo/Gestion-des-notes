import apiClient from './client'

/**
 * Service de gestion des utilisateurs
 * Endpoints Admin uniquement
 */
const utilisateursService = {
  /**
   * Créer un étudiant
   */
  creerEtudiant: async (data) => {
    const response = await apiClient.post('/api/admin/users/students', data)
    return response.data
  },

  /**
   * Créer un enseignant
   */
  creerEnseignant: async (data) => {
    const response = await apiClient.post('/api/admin/users/teachers', data)
    return response.data
  },

  /**
   * Récupérer tous les utilisateurs
   */
  obtenirTous: async () => {
    const response = await apiClient.get('/api/admin/users/users')
    return response.data
  },

  /**
   * Récupérer tous les étudiants avec studentIdNum
   */
  obtenirEtudiants: async () => {
    const response = await apiClient.get('/api/admin/users/students/all')
    return response.data
  },

  /**
   * Récupérer les étudiants inscrits à une matière spécifique
   */
  obtenirEtudiantsParMatiere: async (subjectCode) => {
    const response = await apiClient.get(`/api/admin/users/students/by-subject/${subjectCode}`)
    return response.data
  },

  /**
   * Récupérer tous les enseignants avec teacherIdNum
   */
  obtenirEnseignants: async () => {
    const response = await apiClient.get('/api/admin/users/teachers/all')
    return response.data
  },

  /**
   * Récupérer un utilisateur par ID
   */
  obtenirParId: async (id) => {
    const response = await apiClient.get(`/api/admin/users/${id}`)
    return response.data
  },

  /**
   * Rechercher par username
   */
  rechercherParUsername: async (username) => {
    const response = await apiClient.get(`/api/admin/users/username/${username}`)
    return response.data
  },

  /**
   * Rechercher par email
   */
  rechercherParEmail: async (email) => {
    const response = await apiClient.get(`/api/admin/users/email/${email}`)
    return response.data
  },

  /**
   * Modifier un utilisateur
   */
  modifier: async (id, data) => {
    const response = await apiClient.put(`/api/admin/users/update/${id}`, data)
    return response.data
  },

  /**
   * Supprimer un utilisateur
   */
  supprimer: async (id) => {
    const response = await apiClient.delete(`/api/admin/users/delete/${id}`)
    return response.data
  }
}

export default utilisateursService
