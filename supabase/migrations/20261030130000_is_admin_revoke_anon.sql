-- is_admin() solo se evalúa en políticas `to authenticated`; los anónimos no la necesitan
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
