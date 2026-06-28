-- Adiciona suporte a milestones vinculados a playbooks
-- milestoneGroupId: chave que agrupa milestone + suas tasks (ex: pb_assessoria_aceleracao_ms_onboarding_rca)
-- playbookId: referência ao playbook de origem

ALTER TABLE milestones
  ADD COLUMN IF NOT EXISTS milestone_group_id TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS playbook_id        TEXT DEFAULT NULL;

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS milestone_group_id TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS playbook_id        TEXT DEFAULT NULL;

-- Índices para buscas rápidas por grupo
CREATE INDEX IF NOT EXISTS idx_milestones_group_id ON milestones(milestone_group_id);
CREATE INDEX IF NOT EXISTS idx_tasks_group_id      ON tasks(milestone_group_id);
