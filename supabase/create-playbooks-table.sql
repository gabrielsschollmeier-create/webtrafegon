-- Tabela de playbooks — persiste edições e sincroniza entre todos os usuários
CREATE TABLE IF NOT EXISTS playbooks (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL DEFAULT '',
  category    TEXT DEFAULT 'Geral',
  description TEXT DEFAULT '',
  steps       JSONB DEFAULT '[]',
  milestones  JSONB DEFAULT NULL,
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "playbooks_all_access" ON playbooks
  FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_playbooks_category ON playbooks(category);
CREATE INDEX IF NOT EXISTS idx_playbooks_active    ON playbooks(active);
