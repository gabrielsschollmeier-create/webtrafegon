-- ──────────────────────────────────────────────────────────────────────
--  Playbooks: garantir que toda a equipe consegue criar, editar e salvar
--
--  O hub usa autenticação do Supabase, então cada pessoa acessa com o
--  papel "authenticated". Sem uma política que permita escrita para esse
--  papel, só quem tiver política própria consegue salvar — e os demais
--  recebem erro ao clicar em Salvar.
--
--  SEGURANÇA:
--  - Aditivo. Não remove nem altera nenhuma política existente.
--  - Políticas permissivas se somam: adicionar uma nova concede acesso,
--    nunca tira o que já funciona.
--  - Não toca em nenhuma linha de dado.
-- ──────────────────────────────────────────────────────────────────────

-- PASSO 1 — Ver o que existe hoje. Rode sozinho primeiro e leia o resultado.
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'playbooks'
order by cmd, policyname;

-- Confirmar que o RLS está ligado na tabela:
select relrowsecurity as rls_ligado
from pg_class where relname = 'playbooks';


-- ──────────────────────────────────────────────────────────────────────
-- PASSO 2 — Só rode daqui para baixo depois de ler o resultado acima.
-- Se já existir política de escrita para authenticated, não precisa.
-- ──────────────────────────────────────────────────────────────────────

alter table playbooks enable row level security;

-- Ler: qualquer pessoa logada enxerga todos os playbooks
drop policy if exists playbooks_auth_select on playbooks;
create policy playbooks_auth_select
  on playbooks for select
  to authenticated
  using (true);

-- Criar: qualquer pessoa logada pode criar um playbook novo
drop policy if exists playbooks_auth_insert on playbooks;
create policy playbooks_auth_insert
  on playbooks for insert
  to authenticated
  with check (true);

-- Editar: qualquer pessoa logada pode salvar alterações
drop policy if exists playbooks_auth_update on playbooks;
create policy playbooks_auth_update
  on playbooks for update
  to authenticated
  using (true)
  with check (true);

-- Apagar: deixei separado de propósito.
-- Descomente apenas se quiser que qualquer pessoa possa apagar playbook.
-- Sem esta política, o botão de lixeira falha para quem não for admin —
-- o que costuma ser desejável, já que apagar não tem desfazer.
--
-- drop policy if exists playbooks_auth_delete on playbooks;
-- create policy playbooks_auth_delete
--   on playbooks for delete
--   to authenticated
--   using (true);


-- PASSO 3 — Conferir como ficou
select policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename = 'playbooks'
order by cmd, policyname;
