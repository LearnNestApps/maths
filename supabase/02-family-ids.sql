-- Pip Maths: every account gets a row in "Math_schema".families straight away.
-- Run once in Supabase → SQL Editor (after setup.sql). Safe to run again.

-- The parent's email, kept next to the account ID (handy for the owner; families still see only their own row).
alter table "Math_schema".families add column if not exists email text;

-- When someone signs up (or changes their email), create or update their family row.
create or replace function "Math_schema".handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into "Math_schema".families (id, email) values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end $$;
revoke execute on function "Math_schema".handle_new_user() from public, anon, authenticated;

drop trigger if exists pipmaths_new_user on auth.users;
create trigger pipmaths_new_user after insert or update of email on auth.users
  for each row execute function "Math_schema".handle_new_user();

-- Fill in accounts that already exist.
insert into "Math_schema".families (id, email)
select id, email from auth.users
on conflict (id) do update set email = excluded.email;

-- Show the result.
select id, email, created_at from "Math_schema".families order by created_at;
