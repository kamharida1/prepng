-- Block authenticated users from changing subscription or usage fields directly.
-- Server API routes use the service role to update these after Paystack verification.

create or replace function public.profiles_guard_sensitive_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') = 'service_role' then
    return NEW;
  end if;

  if NEW.plan is distinct from OLD.plan
    or NEW.plan_expires_at is distinct from OLD.plan_expires_at
    or NEW.paystack_reference is distinct from OLD.paystack_reference
    or NEW.daily_usage_date is distinct from OLD.daily_usage_date
    or NEW.daily_usage_count is distinct from OLD.daily_usage_count
  then
    raise exception 'permission denied for profile field update'
      using hint = 'Subscription and usage fields can only be updated by the server.';
  end if;

  return NEW;
end;
$$;

drop trigger if exists profiles_guard_sensitive_fields on public.profiles;
create trigger profiles_guard_sensitive_fields
  before update on public.profiles
  for each row
  execute function public.profiles_guard_sensitive_fields();
