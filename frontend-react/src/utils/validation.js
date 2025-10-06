/**
 * Utilitaires de validation pour les formulaires
 */

// Expressions régulières pour validation
export const REGEX_PATTERNS = {
  STUDENT_ID: /^S\d{4}$/,
  TEACHER_ID: /^T\d{4}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,50}$/,
  PASSWORD: /^.{6,100}$/,
  SUBJECT_CODE: /^[A-Z0-9]{3,10}$/,
  GRADE_VALUE: /^(100(\.0{1,2})?|[0-9]{1,2}(\.[0-9]{1,2})?)$/
}

// Messages d'erreur
export const VALIDATION_MESSAGES = {
  STUDENT_ID: "L'ID étudiant doit commencer par 'S' suivi de 4 chiffres (ex: S0001)",
  TEACHER_ID: "L'ID enseignant doit commencer par 'T' suivi de 4 chiffres (ex: T0001)",
  EMAIL: "Format d'email invalide",
  USERNAME: "Le nom d'utilisateur doit contenir 3-50 caractères (lettres, chiffres, _)",
  PASSWORD: "Le mot de passe doit contenir au moins 6 caractères",
  SUBJECT_CODE: "Le code matière doit contenir 3-10 caractères majuscules/chiffres",
  GRADE_VALUE: "La note doit être entre 0 et 100 (ex: 15.5)",
  REQUIRED: "Ce champ est obligatoire",
  MIN_LENGTH: (min) => `Minimum ${min} caractères requis`,
  MAX_LENGTH: (max) => `Maximum ${max} caractères autorisés`
}

// Les fonctions validateStudentId et validateTeacherId ont été supprimées
// car les IDs sont maintenant générés automatiquement côté backend

/**
 * Valide un email
 * @param {string} email - Email à valider
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED }
  }
  
  if (!REGEX_PATTERNS.EMAIL.test(email)) {
    return { isValid: false, message: VALIDATION_MESSAGES.EMAIL }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Valide un nom d'utilisateur
 * @param {string} username - Nom d'utilisateur à valider
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED }
  }
  
  if (!REGEX_PATTERNS.USERNAME.test(username)) {
    return { isValid: false, message: VALIDATION_MESSAGES.USERNAME }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Valide un mot de passe
 * @param {string} password - Mot de passe à valider
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED }
  }
  
  if (!REGEX_PATTERNS.PASSWORD.test(password)) {
    return { isValid: false, message: VALIDATION_MESSAGES.PASSWORD }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Valide un nom/prénom
 * @param {string} name - Nom à valider
 * @param {string} fieldName - Nom du champ pour le message d'erreur
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateName = (name, fieldName = 'Ce champ') => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: `${fieldName} est obligatoire` }
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: `${fieldName} doit contenir au moins 2 caractères` }
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, message: `${fieldName} ne peut pas dépasser 50 caractères` }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Valide une note
 * @param {string|number} grade - Note à valider
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateGrade = (grade) => {
  if (grade === '' || grade === null || grade === undefined) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED }
  }
  
  const gradeStr = grade.toString()
  if (!REGEX_PATTERNS.GRADE_VALUE.test(gradeStr)) {
    return { isValid: false, message: VALIDATION_MESSAGES.GRADE_VALUE }
  }
  
  const gradeNum = parseFloat(gradeStr)
  if (gradeNum < 0 || gradeNum > 100) {
    return { isValid: false, message: 'La note doit être entre 0 et 100' }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Valide un formulaire utilisateur complet
 * @param {Object} userData - Données utilisateur
 * @param {string} userType - Type d'utilisateur ('student' ou 'teacher')
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateUserForm = (userData, userType) => {
  const errors = {}
  let isValid = true
  
  // Validation commune
  const usernameValidation = validateUsername(userData.username)
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.message
    isValid = false
  }
  
  const passwordValidation = validatePassword(userData.password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message
    isValid = false
  }
  
  const firstnameValidation = validateName(userData.firstname, 'Le prénom')
  if (!firstnameValidation.isValid) {
    errors.firstname = firstnameValidation.message
    isValid = false
  }
  
  const lastnameValidation = validateName(userData.lastname, 'Le nom')
  if (!lastnameValidation.isValid) {
    errors.lastname = lastnameValidation.message
    isValid = false
  }
  
  const emailValidation = validateEmail(userData.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message
    isValid = false
  }
  
  // Note: Les IDs sont maintenant générés automatiquement côté backend
  // Plus besoin de validation des studentIdNum/teacherIdNum
  
  return { isValid, errors }
}

/**
 * Génère le prochain ID disponible
 * @param {Array} existingUsers - Liste des utilisateurs existants
 * @param {string} userType - Type d'utilisateur ('student' ou 'teacher')
 * @returns {string} Prochain ID disponible
 */
// Cette fonction n'est plus utilisée - IDs générés automatiquement côté backend
// export const generateNextId = ...
