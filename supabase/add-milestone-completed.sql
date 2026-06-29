-- Adiciona coluna completed na tabela milestones
-- Marcos agora são concluídos apenas quando o admin confirmar manualmente,
-- não mais automaticamente quando a data planejada passa.
ALTER TABLE milestones ADD COLUMN IF NOT EXISTS completed boolean DEFAULT false;
