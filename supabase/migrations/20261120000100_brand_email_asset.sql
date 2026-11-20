-- Logo institucional de leitura pública para e-mails de autenticação.
-- O bucket separado mantém os avatares privados.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values (
  'brand-assets',
  'brand-assets',
  true,
  524288,
  array['image/png']
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy brand_assets_public_read
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'brand-assets');
