import apiClient from './client'

/**
 * Service de gestion des notes
 */
const notesService = {
  /**
   * Ajouter une note
   */
  ajouter: async (data) => {
    const response = await apiClient.post('/api/grades/add', data)
    return response.data
  },

  /**
   * Récupérer toutes les notes
   */
  obtenirTous: async () => {
    const response = await apiClient.get('/api/grades')
    return response.data
  },

  /**
   * Récupérer une note par ID
   */
  obtenirParId: async (id) => {
    const response = await apiClient.get(`/api/grades/${id}`)
    return response.data
  },

  /**
   * Récupérer les notes d'un étudiant
   */
  obtenirParEtudiant: async (studentIdNum) => {
    const response = await apiClient.get(`/api/grades/student/${studentIdNum}`)
    return response.data
  },

  /**
   * Récupérer les notes d'une matière
   */
  obtenirParMatiere: async (subjectCode) => {
    const response = await apiClient.get(`/api/grades/subject/${subjectCode}`)
    return response.data
  },

  /**
   * Récupérer les notes d'un étudiant pour une matière
   */
  obtenirParEtudiantEtMatiere: async (studentIdNum, subjectCode) => {
    const response = await apiClient.get(`/api/grades/student/${studentIdNum}/subject/${subjectCode}`)
    return response.data
  },

  /**
   * Calculer la moyenne d'un étudiant pour une matière
   */
  calculerMoyenneEtudiantMatiere: async (studentIdNum, subjectCode) => {
    const response = await apiClient.get(`/api/grades/averages/student/${studentIdNum}/subject/${subjectCode}`)
    return response.data
  },

  /**
   * Calculer la moyenne générale d'un étudiant
   */
  calculerMoyenneGenerale: async (studentIdNum) => {
    const response = await apiClient.get(`/api/grades/averages/student/overall/${studentIdNum}`)
    return response.data
  },

  /**
   * Calculer la moyenne d'une matière
   */
  calculerMoyenneMatiere: async (subjectCode) => {
    const response = await apiClient.get(`/api/grades/averages/subject/${subjectCode}`)
    return response.data
  },

  /**
   * Modifier une note
   */
  modifier: async (id, data) => {
    const response = await apiClient.put(`/api/grades/${id}`, data)
    return response.data
  },

  /**
   * Supprimer une note
   */
  supprimer: async (id) => {
    const response = await apiClient.delete(`/api/grades/${id}`)
    return response.data
  }
}

export default notesService
