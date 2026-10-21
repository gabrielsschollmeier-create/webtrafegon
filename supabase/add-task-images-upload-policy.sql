-- Libera upload no bucket task-images para usuários LOGADOS (role authenticated).
-- Aditivo: não altera nem remove nenhuma regra, arquivo ou dado existente.
-- Corrige o anexo de imagem nos comentários das tarefas e as referências do "Gerar com IA".
-- Rodar no Supabase > SQL Editor.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'task-images upload logados'
  ) THEN
    EXECUTE 'CREATE POLICY "task-images upload logados" ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (bucket_id = ''task-images'')';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'task-images public read'
  ) THEN
    EXECUTE 'CREATE POLICY "task-images public read" ON storage.objects
      FOR SELECT USING (bucket_id = ''task-images'')';
  END IF;
END $$;

-- Conferência: deve listar as regras do bucket task-images.
SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
  AND (qual ILIKE '%task-images%' OR with_check ILIKE '%task-images%');
