-- Transfere todas as tarefas atribuídas a Geovana (adm_at = Érica)
-- Altera APENAS o campo assignee — nenhum outro dado é modificado.
-- Execute no Supabase > SQL Editor antes de rodar.

UPDATE public.tasks
SET assignee = 'adm_at'
WHERE assignee = 'geovana';

-- Confirme quantas linhas foram afetadas após executar.
-- Resultado esperado: todas as tarefas da Geovana agora estão com assignee = 'adm_at' (Érica).
SELECT COUNT(*) AS tarefas_transferidas
FROM public.tasks
WHERE assignee = 'adm_at';
