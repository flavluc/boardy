steps:

- create apps/api/.env:
  `DATABASE_URL=postgresql://postgres:<PASSWORD>@db.<PROJECT>.supabase.co:5432/postgres`

- create `.vscode/settings.json`

```
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
   "source.organizeImports": "explicit",
   "source.fixAll.eslint": "explicit"
  }
}
```
