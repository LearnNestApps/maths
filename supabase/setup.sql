-- Pip Maths: family accounts
-- Run once in Supabase: SQL Editor → New query → paste all of this → Run.
-- Safe to run again (it updates what is already there).
--
-- What it stores (kept small on purpose, for children's privacy):
--   families  one row per parent account: app settings (country, sound, voice)
--   learners  one row per child: first name or nickname, age, colour, progress, stickers
--   admins    which accounts may open the admin page (only the owner)
-- No child emails, no surnames, no photos, no location.

-- All Pip Maths tables live in their own schema, "Math_schema".
-- (Mixed-case name, so it is always written in double quotes in SQL.)
-- After running this, add Math_schema in Supabase: Project Settings → Data API → Exposed schemas.
create schema if not exists "Math_schema";
grant usage on schema "Math_schema" to anon, authenticated;

-- ---------- Tables ----------
create table if not exists "Math_schema".families (
  id          uuid primary key references auth.users(id) on delete cascade,
  settings    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists "Math_schema".learners (
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

create table if not exists "Math_schema".admins (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  added_at    timestamptz not null default now()
);

-- Keep updated_at honest (set by the server, not the device).
create or replace function "Math_schema".touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists families_touch on "Math_schema".families;
create trigger families_touch before insert or update on "Math_schema".families for each row execute function "Math_schema".touch_updated_at();
drop trigger if exists learners_touch on "Math_schema".learners;
create trigger learners_touch before insert or update on "Math_schema".learners for each row execute function "Math_schema".touch_updated_at();

-- ---------- Security: each family sees only its own rows ----------
alter table "Math_schema".families enable row level security;
alter table "Math_schema".learners enable row level security;
alter table "Math_schema".admins   enable row level security;   -- no policies: not readable or writable from the app at all

drop policy if exists "family owns its row" on "Math_schema".families;
create policy "family owns its row" on "Math_schema".families for all to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "family owns its learners" on "Math_schema".learners;
create policy "family owns its learners" on "Math_schema".learners for all to authenticated
  using (family_id = (select auth.uid())) with check (family_id = (select auth.uid()));

revoke all on "Math_schema".families, "Math_schema".learners, "Math_schema".admins from anon;
grant select, insert, update, delete on "Math_schema".families, "Math_schema".learners to authenticated;
revoke all on "Math_schema".admins from authenticated;

-- ---------- Functions the app calls ----------
-- Is the signed-in account an admin? (The admin page opens only if this says yes.)
create or replace function "Math_schema".is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from "Math_schema".admins where user_id = (select auth.uid()))
$$;

-- Owner's overview across all families: totals only, no names.
create or replace function "Math_schema".admin_overview() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if not "Math_schema".is_admin() then raise exception 'Only the owner can see this' using errcode = '42501'; end if;
  select jsonb_build_object(
    'families',      (select count(*) from "Math_schema".families),
    'learners',      (select count(*) from "Math_schema".learners where not deleted),
    'active7',       (select count(*) from "Math_schema".learners where not deleted and updated_at > now() - interval '7 days'),
    'active30',      (select count(*) from "Math_schema".learners where not deleted and updated_at > now() - interval '30 days'),
    'newFamilies30', (select count(*) from "Math_schema".families where created_at > now() - interval '30 days'),
    'byMode',        (select coalesce(jsonb_object_agg(m, n), '{}'::jsonb) from (
                        select coalesce(data->>'mode', 'unknown') m, count(*) n from "Math_schema".learners where not deleted group by 1) x),
    'byCountry',     (select coalesce(jsonb_object_agg(c, n), '{}'::jsonb) from (
                        select coalesce(settings->>'region', 'unknown') c, count(*) n from "Math_schema".families group by 1) x),
    'topLessons',    (select coalesce(jsonb_agg(jsonb_build_object('id', k, 'learners', n) order by n desc), '[]'::jsonb) from (
                        select k, count(*) n from "Math_schema".learners l, jsonb_object_keys(coalesce(l.data->'progress', '{}'::jsonb)) k
                        where not l.deleted and jsonb_typeof(l.data->'progress') = 'object' group by k order by n desc limit 15) x)
  ) into result;
  return result;
end $$;

-- A parent can delete their whole account and all their children's data.
create or replace function "Math_schema".delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null then raise exception 'Not signed in' using errcode = '42501'; end if;
  delete from auth.users where id = (select auth.uid());   -- families and learners go with it (on delete cascade)
end $$;

revoke execute on function "Math_schema".is_admin(), "Math_schema".admin_overview(), "Math_schema".delete_my_account() from public, anon;
revoke execute on function "Math_schema".touch_updated_at() from public, anon, authenticated;
grant  execute on function "Math_schema".is_admin(), "Math_schema".admin_overview(), "Math_schema".delete_my_account() to authenticated;

-- ---------- Make yourself the admin ----------
-- After you have signed up in the app with your own email, run this one line
-- (with your email) in the SQL Editor:
--
--   insert into "Math_schema".admins (user_id) select id from auth.users where email = 'YOUR-EMAIL@example.com' on conflict do nothing;
