-- ──────────────────────────────────────────────────────────────────────
--  Data de início da tarefa
--
--  Hoje a tarefa só tem due_date, e o playbook usa o "D" como vencimento.
--  Resultado: tarefa nasce vencendo no dia em que entra para execução, e
--  o time vê um mar de vermelho em tarefas que deveriam estar em andamento.
--
--  Esta coluna guarda quando a atividade DEVE COMEÇAR. O due_date passa a
--  ser quando ela DEVE SER ENTREGUE.
--
--  SEGURANÇA:
--  - Aditivo. Não altera, não apaga e não reescreve nenhuma linha.
--  - Nullable. Todas as tarefas existentes ficam com start_date vazio e
--    continuam se comportando exatamente como antes.
--  - IF NOT EXISTS: pode rodar mais de uma vez sem erro.
--
--  Rodar no SQL Editor do Supabase.
-- ──────────────────────────────────────────────────────────────────────

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS start_date date;

COMMENT ON COLUMN tasks.start_date IS
  'Quando a atividade deve comecar. Vazio = comportamento antigo, so due_date.';

-- Conferência: deve listar start_date junto de due_date.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tasks' AND column_name IN ('start_date', 'due_date');
