# Agendamento Nails

SaaS de agendamento para Nail Designers (multi-tenant por slug).

## Requisitos
- Node.js 18+
- PostgreSQL

## Configuracao
1) Instale dependencias
```
npm install
```

2) Crie `.env` baseado no exemplo
```
copy .env.example .env
```

3) Rode migrations e seed
```
npm run prisma:migrate
npm run prisma:seed
```

4) Inicie o projeto
```
npm run dev
```

## Contas seed
- Admin: `admin@local.dev` / `Admin123!`
- Profissional: `maria@local.dev` / `Profissional123!`
- Cliente: `cliente@local.dev` / `Cliente123!`

Slug da profissional: `maria-nails`

## Rotas
Publicas:
- `/{slug}`
- `/{slug}/agendar`
- `/{slug}/sucesso`
- `/{slug}/agendamentos`
- `/auth/login`
- `/auth/register`
- `/auth/verificar`

Dashboard:
- `/dashboard`
- `/dashboard/agenda`
- `/dashboard/servicos`
- `/dashboard/disponibilidade`
- `/dashboard/bloqueios`
- `/dashboard/clientes`
- `/dashboard/configuracoes`

Admin:
- `/admin`
- `/admin/profissionais`
- `/admin/profissionais/[id]`

## Checklist mobile
- iPhone SE / iPhone 14+ (360-430px)
- Android 360x800

## Testes
```
npm test
```
