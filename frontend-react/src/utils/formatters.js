/**
 * Fonctions utilitaires de formatage
 */

/**
 * Formate une date au format français
 * @param {Date|string} date - Date à formater
 * @returns {string} Date formatée (ex: "30/09/2025")
 */
export const formaterDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR')
}

/**
 * Formate une date avec l'heure
 * @param {Date|string} date - Date à formater
 * @returns {string} Date et heure formatées (ex: "30/09/2025 16:30")
 */
export const formaterDateHeure = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleString('fr-FR')
}

/**
 * Formate une note sur 20
 * @param {number} note - Note à formater
 * @returns {string} Note formatée (ex: "15,50/20")
 */
export const formaterNote = (note) => {
  if (note === null || note === undefined) return '-'
  return `${note.toFixed(2).replace('.', ',')}/20`
}

/**
 * Formate un rôle pour l'affichage
 * @param {string} role - Rôle à formater
 * @returns {string} Rôle formaté
 */
export const formaterRole = (role) => {
  const roles = {
    'ADMIN': 'Administrateur',
    'TEACHER': 'Enseignant',
    'STUDENT': 'Étudiant'
  }
  return roles[role] || role
}
