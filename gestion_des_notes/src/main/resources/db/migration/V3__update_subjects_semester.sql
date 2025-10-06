-- Migration pour corriger les semestres des matières existantes
-- Date: 2025-10-03
-- Description: Mise à jour des semestres pour les matières existantes

-- Mise à jour des matières avec leur semestre approprié
UPDATE subjects SET semester = 'S1' WHERE subject_code IN ('MATH101', 'PHYS101', 'INFO101', 'FRAN101', 'ANG101');
UPDATE subjects SET semester = 'S2' WHERE subject_code IN ('MATH102', 'PHYS102', 'INFO102', 'FRAN102', 'ANG102');

-- Si certaines matières n'ont pas de semestre défini, les mettre en S1 par défaut
UPDATE subjects SET semester = 'S1' WHERE semester IS NULL OR semester = '';

-- Vérification que toutes les matières ont un semestre
-- Cette requête ne devrait retourner aucune ligne après la migration
-- SELECT * FROM subjects WHERE semester IS NULL OR semester NOT IN ('S1', 'S2');
