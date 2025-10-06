-- Migration pour ajouter la colonne semester à la table subjects
-- Date: 2025-10-02
-- Description: Ajout du champ semestre (S1 ou S2) aux matières

ALTER TABLE subjects 
ADD COLUMN semester VARCHAR(2) NOT NULL DEFAULT 'S1' 
CHECK (semester IN ('S1', 'S2'));

-- Commentaire sur la colonne
COMMENT ON COLUMN subjects.semester IS 'Semestre de la matière (S1 ou S2)';
