-- Adiciona cliente Tecnoeletro ao hub
INSERT INTO erp_clients (id, name, color, manager_id, status, niche, since_month, monthly_value)
VALUES (
  'tecnoeletro',
  'Tecnoeletro',
  '#06b6d4',
  'tochiro',
  'active',
  'Eletroeletrônicos',
  '2026-07',
  0
)
ON CONFLICT (id) DO NOTHING;
