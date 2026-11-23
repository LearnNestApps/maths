-- Pip Maths: family accounts
-- Run once in Supabase: SQL Editor → New query → paste all of this → Run.
-- Safe to run again (it updates what is already there).
--
-- What it stores (kept small on purpose, for children's privacy):
--   families  one row per parent account: app settings (country, sound, voice)
--   learners  one row per child: first name or nickname, age, colour, progress, stickers
--   admins    which accounts may open the admin page (only the owner)
-- No child emails, no surnames, no photos, no location.

-- ---------- Tables ----------
create table if not exists public.families (
  id          uuid primary key references auth.users(id) on delete cascade,
  settings    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.learners (
  family_id   uuid not null default auth.uid() references auth.users(id) on delete cascade,
  id          text not null,                          -- the app's own id for this child
  name        text not null check (char_length(name) between 1 and 40),
  data        jsonb not null default '{}'::jsonb,     -- age, colour, mode, progress, stickers, sessions
  deleted     boolean not null default false,         -- removed on one device: other devices remove it too
  updated_at  timestamptz not null default now(),
  primary key (family_id, id),
  constraint learner_id_ok check (char_length(id) between 1 and 64),
  constraint learner_data_size check (pg_column_size(data) < 300000)
);

create table if not exists public.admins (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  added_at    timestamptz not null default now()
);

-- Keep updated_at honest (set by the server, not the device).
create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists families_touch on public.families;
create trigger families_touch before insert or update on public.families for each row execute function public.touch_updated_at();
drop trigger if exists learners_touch on public.learners;
create trigger learners_touch before insert or update on public.learners for each row execute function public.touch_updated_at();

-- ---------- Security: each family sees only its own rows ----------
alter table public.families enable row level security;
alter table public.learners enable row level security;
alter table public.admins   enable row level security;   -- no policies: not readable or writable from the app at all

drop policy if exists "family owns its row" on public.families;
create policy "family owns its row" on public.families for all to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "family owns its learners" on public.learners;
create policy "family owns its learners" on public.learners for all to authenticated
  using (family_id = (select auth.uid())) with check (family_id = (select auth.uid()));

revoke all on public.families, public.learners, public.admins from anon;
grant select, insert, update, delete on public.families, public.learners to authenticated;
revoke all on public.admins from authenticated;

-- ---------- Functions the app calls ----------
-- Is the signed-in account an admin? (The admin page opens only if this says yes.)
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()))
$$;

-- Owner's overview across all families: totals only, no names.
create or replace function public.admin_overview() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if not public.is_admin() then raise exception 'Only the owner can see this' using errcode = '42501'; end if;
  select jsonb_build_object(
    'families',      (select count(*) from public.families),
    'learners',      (select count(*) from public.learners where not deleted),
    'active7',       (select count(*) from public.learners where not deleted and updated_at > now() - interval '7 days'),
    'active30',      (select count(*) from public.learners where not deleted and updated_at > now() - interval '30 days'),
    'newFamilies30', (select count(*) from public.families where created_at > now() - interval '30 days'),
    'byMode',        (select coalesce(jsonb_object_agg(m, n), '{}'::jsonb) from (
                        select coalesce(data->>'mode', 'unknown') m, count(*) n from public.learners where not deleted group by 1) x),
    'byCountry',     (select coalesce(jsonb_object_agg(c, n), '{}'::jsonb) from (
                        select coalesce(settings->>'region', 'unknown') c, count(*) n from public.families group by 1) x),
    'topLessons',    (select coalesce(jsonb_agg(jsonb_build_object('id', k, 'learners', n) order by n desc), '[]'::jsonb) from (
                        select k, count(*) n from public.learners l, jsonb_object_keys(coalesce(l.data->'progress', '{}'::jsonb)) k
                        where not l.deleted and jsonb_typeof(l.data->'progress') = 'object' group by k order by n desc limit 15) x)
  ) into result;
  return result;
end $$;

-- A parent can delete their whole account and all their children's data.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then raise exception 'Not signed in' using errcode = '42501'; end if;
  delete from auth.users where id = (select auth.uid());   -- families and learners go with it (on delete cascade)
end $$;

revoke execute on function public.is_admin(), public.admin_overview(), public.delete_my_account() from public, anon;
grant  execute on function public.is_admin(), public.admin_overview(), public.delete_my_account() to authenticated;

-- ---------- Make yourself the admin ----------
-- After you have signed up in the app with your own email, run this one line
-- (with your email) in the SQL Editor:
--
--   insert into public.admins (user_id) select id from auth.users where email = 'YOUR-EMAIL@example.com' on conflict do nothing;
