-- =============================================================
-- Adiciona o Customer ID do Google Ads ao cadastro de cliente.
-- Permite que o Ton resolva a conta de anúncios de QUALQUER cliente
-- criado no sistema, sem depender do mapa fixo (GADS_MAP) no código.
-- Idempotente: pode rodar quantas vezes quiser.
-- =============================================================

alter table public.erp_clients
  add column if not exists google_ads_id text;

comment on column public.erp_clients.google_ads_id is
  'Customer ID Google Ads do cliente (com ou sem hífens). Usado pelas ferramentas do Ton.';
