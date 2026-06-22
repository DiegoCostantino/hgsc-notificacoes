# HGSC — Portal de Notificação de Segurança do Paciente

Portal público e **anônimo** para registro de eventos de segurança do paciente,
conectado ao Supabase (projeto `hgsc-notificacoes-seguranca`, região São Paulo).

Feito com Vite + React + TypeScript.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (geralmente `http://localhost:5173`).

## Estrutura

```
.
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx              # monta o React na página
    ├── App.tsx               # renderiza o portal
    ├── PortalNotificacao.tsx # o formulário anônimo
    ├── supabaseClient.ts     # conexão com o Supabase
    └── database.types.ts     # tipos gerados do banco
```

## Sobre a chave do Supabase

A chave em `supabaseClient.ts` é a chave **publishable** (publicável). Ela é
feita para ficar no navegador e só permite o que as políticas de segurança
(RLS) do banco autorizam — pode ficar em repositório público sem problema.
A chave secreta (service_role) **nunca** deve ir para o frontend.

## Publicar (GitHub + Vercel)

1. Suba esta pasta para um repositório no GitHub.
2. Em vercel.com, importe o repositório. A Vercel detecta o Vite
   automaticamente (build `npm run build`, saída `dist`).
3. Clique em Deploy. Pronto — a cada novo commit no GitHub, a Vercel
   republica sozinha.
