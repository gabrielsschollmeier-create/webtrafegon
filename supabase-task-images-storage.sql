-- Cria o bucket task-images como público (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-images', 'task-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Permite que qualquer um leia as imagens (necessário para outros usuários verem)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'task-images public read'
  ) THEN
    EXECUTE 'CREATE POLICY "task-images public read" ON storage.objects
      FOR SELECT USING (bucket_id = ''task-images'')';
  END IF;
END $$;

-- Permite que usuários autenticados façam upload
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'task-images authenticated upload'
  ) THEN
    EXECUTE 'CREATE POLICY "task-images authenticated upload" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = ''task-images'')';
  END IF;
END $$;
