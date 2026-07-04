-- =============================================================
-- Vincula o Customer ID do Google Ads ao cliente Temoos / Intime Sistemas.
-- Depende de add-google-ads-id.sql (coluna google_ads_id) já aplicado.
-- Substitua SEU_CUSTOMER_ID pelo ID da conta (com ou sem hífens).
-- Idempotente: pode rodar quantas vezes quiser.
-- =============================================================

update public.erp_clients
   set google_ads_id = '5376240782'
 where id = 'intime';

-- Conferência:
-- select id, name, google_ads_id from public.erp_clients where id = 'intime';
