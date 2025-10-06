/**
 * Données par défaut pour initialiser l'application
 */

// Matières par défaut
export const DEFAULT_SUBJECTS = [
  {
    subjectCode: 'MATH101',
    name: 'Mathématiques',
    coefficient: 3,
    description: 'Mathématiques niveau 1'
  },
  {
    subjectCode: 'INFO101',
    name: 'Informatique',
    coefficient: 3,
    description: 'Introduction à l\'informatique'
  },
  {
    subjectCode: 'PHYS101',
    name: 'Physique',
    coefficient: 2,
    description: 'Physique générale'
  },
  {
    subjectCode: 'ALGO101',
    name: 'Algorithmique',
    coefficient: 2,
    description: 'Algorithmes et structures de données'
  },
  {
    subjectCode: 'BDD101',
    name: 'Base de Données',
    coefficient: 2,
    description: 'Introduction aux bases de données'
  }
]

// Classes par défaut
export const DEFAULT_CLASSES = [
  {
    name: 'L1 Informatique',
    academicYear: '2024-2025',
    description: 'Licence 1 Informatique'
  },
  {
    name: 'L2 Informatique',
    academicYear: '2024-2025',
    description: 'Licence 2 Informatique'
  },
  {
    name: 'L3 Informatique',
    academicYear: '2024-2025',
    description: 'Licence 3 Informatique'
  }
]

// Utilisateurs de test
export const DEFAULT_USERS = {
  teachers: [
    {
      username: 'prof_math',
      password: 'prof123',
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@ecole.fr',
      teacherIdNum: 'T0001'
    },
    {
      username: 'prof_info',
      password: 'prof123',
      firstname: 'Marie',
      lastname: 'Martin',
      email: 'marie.martin@ecole.fr',
      teacherIdNum: 'T0002'
    }
  ],
  students: [
    {
      username: 'etudiant1',
      password: 'etud123',
      firstname: 'Pierre',
      lastname: 'Durand',
      email: 'pierre.durand@ecole.fr',
      studentIdNum: 'S0001'
    },
    {
      username: 'etudiant2',
      password: 'etud123',
      firstname: 'Sophie',
      lastname: 'Bernard',
      email: 'sophie.bernard@ecole.fr',
      studentIdNum: 'S0002'
    },
    {
      username: 'etudiant3',
      password: 'etud123',
      firstname: 'Lucas',
      lastname: 'Petit',
      email: 'lucas.petit@ecole.fr',
      studentIdNum: 'S0003'
    }
  ]
}

// Notes d'exemple
export const DEFAULT_GRADES = [
  // Étudiant 1 - Pierre Durand (S0001)
  {
    studentIdNum: 'S0001',
    subjectCode: 'MATH101',
    value: 15.5,
    date: '2024-09-15',
    comment: 'Très bon travail'
  },
  {
    studentIdNum: 'S0001',
    subjectCode: 'INFO101',
    value: 16.0,
    date: '2024-09-20',
    comment: 'Excellent'
  },
  {
    studentIdNum: 'S0001',
    subjectCode: 'PHYS101',
    value: 14.0,
    date: '2024-09-25',
    comment: 'Bien'
  },
  
  // Étudiant 2 - Sophie Bernard (S0002)
  {
    studentIdNum: 'S0002',
    subjectCode: 'MATH101',
    value: 12.5,
    date: '2024-09-15',
    comment: 'Peut mieux faire'
  },
  {
    studentIdNum: 'S0002',
    subjectCode: 'INFO101',
    value: 17.5,
    date: '2024-09-20',
    comment: 'Très bon niveau'
  },
  {
    studentIdNum: 'S0002',
    subjectCode: 'ALGO101',
    value: 13.0,
    date: '2024-09-28',
    comment: 'Satisfaisant'
  },
  
  // Étudiant 3 - Lucas Petit (S0003)
  {
    studentIdNum: 'S0003',
    subjectCode: 'MATH101',
    value: 18.0,
    date: '2024-09-15',
    comment: 'Excellent travail'
  },
  {
    studentIdNum: 'S0003',
    subjectCode: 'BDD101',
    value: 16.5,
    date: '2024-09-30',
    comment: 'Très bien'
  }
]

/**
 * Fonction pour initialiser les données par défaut
 * @param {Object} services - Services API
 * @returns {Promise} Promesse de création des données
 */
export const initializeDefaultData = async (services) => {
  const { 
    matieresService, 
    classesService, 
    utilisateursService, 
    inscriptionsService,
    notesService 
  } = services

  try {
    console.log('🚀 Initialisation des données par défaut...')

    // 1. Créer les matières
    console.log('📚 Création des matières...')
    const matieres = []
    for (const matiere of DEFAULT_SUBJECTS) {
      try {
        const created = await matieresService.creer(matiere)
        matieres.push(created)
        console.log(`✅ Matière créée: ${matiere.name}`)
      } catch (error) {
        if (error.response?.status !== 400) { // Ignore si déjà existe
          console.warn(`⚠️ Erreur création matière ${matiere.name}:`, error.message)
        }
      }
    }

    // 2. Créer les classes
    console.log('🏫 Création des classes...')
    const classes = []
    for (const classe of DEFAULT_CLASSES) {
      try {
        const created = await classesService.creer(classe)
        classes.push(created)
        console.log(`✅ Classe créée: ${classe.name}`)
      } catch (error) {
        if (error.response?.status !== 400) {
          console.warn(`⚠️ Erreur création classe ${classe.name}:`, error.message)
        }
      }
    }

    // 3. Créer les enseignants
    console.log('👨‍🏫 Création des enseignants...')
    for (const teacher of DEFAULT_USERS.teachers) {
      try {
        await utilisateursService.creerEnseignant(teacher)
        console.log(`✅ Enseignant créé: ${teacher.firstname} ${teacher.lastname}`)
      } catch (error) {
        if (error.response?.status !== 400) {
          console.warn(`⚠️ Erreur création enseignant ${teacher.firstname}:`, error.message)
        }
      }
    }

    // 4. Créer les étudiants
    console.log('👨‍🎓 Création des étudiants...')
    for (const student of DEFAULT_USERS.students) {
      try {
        await utilisateursService.creerEtudiant(student)
        console.log(`✅ Étudiant créé: ${student.firstname} ${student.lastname}`)
      } catch (error) {
        if (error.response?.status !== 400) {
          console.warn(`⚠️ Erreur création étudiant ${student.firstname}:`, error.message)
        }
      }
    }

    console.log('✅ Initialisation des données terminée!')
    return { success: true }

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des données:', error)
    return { success: false, error }
  }
}
