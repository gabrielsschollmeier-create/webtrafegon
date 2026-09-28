-- Entregáveis criados pela própria equipe.
-- Ficam sempre com peso 1 e pendente = true: o objetivo é descobrir o que
-- falta na lista oficial sem abrir brecha para alguém se autoatribuir peso.
-- Depois do ciclo de observação, o gestor promove (vira entregável oficial
-- em erp-mock.js) ou funde num existente.
CREATE TABLE IF NOT EXISTS custom_task_types (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  icon        TEXT DEFAULT '🏷️',
  color       TEXT DEFAULT '#8890b5',
  ons         INT  DEFAULT 1,
  pendente    BOOLEAN DEFAULT true,
  created_by  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE custom_task_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "custom_task_types_all_access" ON custom_task_types
  FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_ctt_pendente ON custom_task_types(pendente);
