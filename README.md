# FinanceApp — Controle Financeiro Pessoal

Um aplicativo mobile completo para controle financeiro pessoal, construído com **React Native + Expo SDK 54**, **TypeScript**, **Zustand** e **Supabase**. Disponível para iOS e Android.

---

## Funcionalidades

### Dashboard
O painel principal apresenta uma visão completa das suas finanças: saldo total com opção de ocultar valores, cards de receitas e despesas do mês, gráfico de barras comparando os últimos 6 meses, gráfico de pizza por categoria de gastos, lista das transações mais recentes e insights financeiros automáticos gerados a partir do seu histórico.

### Transações
Registre e gerencie todas as suas movimentações financeiras com suporte a receitas e despesas, 10 categorias pré-definidas com ícones e cores, busca por texto, filtros por tipo e mês, edição e exclusão de registros, e campo de descrição opcional.

### Metas Financeiras
Defina e acompanhe seus objetivos financeiros com barra de progresso visual, data limite configurável, atualização do valor atual, e feedback visual ao atingir a meta.

### Perfil e Configurações
Visualize um resumo financeiro completo, alterne entre tema claro e escuro, oculte saldos por privacidade, gerencie notificações e exporte seus dados.

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Linguagem | TypeScript 5.9 |
| Navegação | Expo Router 6 (file-based routing) |
| Estilização | NativeWind 4 (Tailwind CSS) |
| Estado | Zustand |
| Backend/Auth | Supabase |
| Gráficos | React Native SVG |
| Persistência local | AsyncStorage |
| Animações | React Native Reanimated 4 |

---

## Estrutura do Projeto

```
app/
  _layout.tsx          ← Root layout com providers e roteamento
  (auth)/              ← Telas de autenticação
    index.tsx          ← Login
    register.tsx       ← Cadastro
    forgot-password.tsx← Recuperação de senha
  (tabs)/              ← Navegação principal (Bottom Tabs)
    index.tsx          ← Dashboard
    transactions.tsx   ← Lista de transações
    goals.tsx          ← Metas financeiras
    profile.tsx        ← Perfil e configurações
  transaction/
    add.tsx            ← Modal: adicionar transação
    [id].tsx           ← Modal: editar/detalhar transação
  goal/
    add.tsx            ← Modal: adicionar meta
    [id].tsx           ← Modal: editar/detalhar meta
  settings.tsx         ← Tela de configurações

components/
  finance/
    BalanceCard.tsx    ← Card de saldo total
    TransactionItem.tsx← Item de transação na lista
    GoalCard.tsx       ← Card de meta com progresso
    InsightCard.tsx    ← Card de insight financeiro
    SimpleBarChart.tsx ← Gráfico de barras (SVG)
    SimplePieChart.tsx ← Gráfico de pizza (SVG)
  ui/
    SkeletonLoader.tsx ← Skeleton para estados de carregamento
    EmptyState.tsx     ← Estado vazio
    SectionHeader.tsx  ← Cabeçalho de seção

store/
  index.ts             ← Stores Zustand (auth, transactions, goals, settings)

hooks/
  useAppAuth.ts        ← Hook de autenticação
  useTransactions.ts   ← Hook de transações
  useGoals.ts          ← Hook de metas
  useFinance.ts        ← Hooks de cálculo financeiro

services/
  auth.ts              ← Serviço de autenticação (Supabase)
  transactions.ts      ← CRUD de transações (Supabase + demo)
  goals.ts             ← CRUD de metas (Supabase + demo)

types/
  index.ts             ← Tipos TypeScript centrais

constants/
  finance.ts           ← Categorias, ícones e constantes

utils/
  mockData.ts          ← Dados de demonstração
```

---

## Configuração com Supabase

### 1. Criar projeto no Supabase

Acesse [supabase.com](https://supabase.com) e crie um novo projeto.

### 2. Executar o schema SQL

No painel do Supabase, acesse **SQL Editor** e execute o conteúdo do arquivo `supabase-schema.sql`. Isso criará as tabelas `users`, `transactions` e `goals` com Row Level Security configurado.

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

Você encontra essas chaves em **Settings → API** no painel do Supabase.

### 4. Iniciar o app

```bash
pnpm install
pnpm dev
```

---

## Modo Demonstração

O app inclui um **modo demo** completo que não requer conta ou configuração de backend. Na tela de login, toque em **"Experimentar sem conta"** para acessar o app com dados de exemplo realistas, incluindo transações dos últimos 2 meses e 3 metas financeiras pré-configuradas.

---

## Temas

O app suporta tema claro e escuro com troca manual via **Perfil → Tema** ou **Configurações → Tema Escuro**. O tema é persistido localmente via AsyncStorage.

| Token | Claro | Escuro |
|-------|-------|--------|
| Primary | `#1E3A8A` | `#3B82F6` |
| Background | `#F8FAFC` | `#020617` |
| Surface | `#FFFFFF` | `#0F172A` |
| Income | `#16A34A` | `#22C55E` |
| Expense | `#DC2626` | `#EF4444` |

---

## Categorias

| Categoria | Tipo | Ícone |
|-----------|------|-------|
| Alimentação | Despesa | 🍽️ |
| Transporte | Despesa | 🚗 |
| Moradia | Despesa | 🏠 |
| Estudos | Despesa | 📚 |
| Saúde | Despesa | ❤️ |
| Lazer | Despesa | 🎮 |
| Salário | Receita | 💼 |
| Freelance | Receita | 💻 |
| Investimentos | Receita | 📈 |
| Outros | Ambos | ⋯ |

---

## Testes

```bash
pnpm test
```

Os testes cobrem funções de formatação de moeda, cálculo de resumo financeiro, filtragem de categorias, progresso de metas e validação dos dados de demonstração.

---

## Publicação

Para gerar o APK de produção, crie um checkpoint no painel e clique em **Publish**. O processo de build será iniciado automaticamente via Expo EAS.

---

## Licença

MIT
