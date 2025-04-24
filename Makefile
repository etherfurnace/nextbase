PROJECT_REF=jncufdfmnvmicdcirtmr

supabase-login:
	supabase login

supabase-projects:
	supabase projects list

supabase-api-keys:
	supabase projects api-keys --project-ref $(PROJECT_REF)

link-db:
	supabase link

list-db-migrations:
	supabase migration list --linked

reset-db:
	supabase db reset  --linked

migrate:
	supabase migration up --linked

push:
	git add . && codegpt commit . && git push