# FinanceApp — Design System & UI Plan

## Visual Archetype: "Sábio / Tradicional Seguros"

The app communicates **trust, intelligence, organization, and financial stability**. Inspired by premium digital banks (Nubank, Itaú Digital, C6 Bank) and executive dashboards. Every visual decision reinforces calm confidence — never flashy, never childish.

---

## Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `background` | `#F8FAFC` | `#020617` | Screen backgrounds |
| `surface` | `#FFFFFF` | `#0F172A` | Cards, sheets, modals |
| `surface2` | `#F1F5F9` | `#1E293B` | Secondary surfaces |
| `foreground` | `#0F172A` | `#E2E8F0` | Primary text |
| `muted` | `#64748B` | `#94A3B8` | Secondary text, labels |
| `primary` | `#1E3A8A` | `#3B82F6` | CTAs, active icons, key elements |
| `primaryDark` | `#0F172A` | `#1E40AF` | Headers, navbar |
| `border` | `#E2E8F0` | `#1E293B` | Dividers, card borders |
| `income` | `#16A34A` | `#22C55E` | Income, profit |
| `expense` | `#DC2626` | `#EF4444` | Expenses |
| `warning` | `#D97706` | `#F59E0B` | Warnings |
| `tint` | `#1E3A8A` | `#3B82F6` | Tab bar active, highlights |

---

## Typography

- **Font family**: System default (SF Pro on iOS, Roboto on Android) — clean and native
- **Heading 1**: 28px, bold (700), tight tracking
- **Heading 2**: 22px, semibold (600)
- **Heading 3**: 18px, semibold (600)
- **Body**: 15px, regular (400), line-height 1.5
- **Caption**: 12px, regular (400), muted color
- **Label**: 13px, medium (500)
- **Number/Amount**: 32px, bold (700), tabular numbers

---

## Spacing & Radius

- Base unit: 4px
- Screen padding: 20px horizontal
- Card padding: 16px
- Border radius: 12px (cards), 8px (buttons), 16px (large cards), 999px (pills)
- Shadow: `0 2px 8px rgba(0,0,0,0.08)` light / `0 2px 12px rgba(0,0,0,0.3)` dark

---

## Screen List

### Auth Flow
1. **SplashScreen** — Logo + loading animation, auto-navigate to auth or home
2. **LoginScreen** — Email/password form, "Forgot password?" link, "Create account" CTA
3. **RegisterScreen** — Name, email, password, confirm password, terms
4. **ForgotPasswordScreen** — Email input, send reset link

### Main App (Bottom Tabs)
5. **DashboardScreen** (Home tab) — Balance hero, income/expense cards, charts, transactions preview, goals preview, insights
6. **TransactionsScreen** (Transactions tab) — Full transaction list, search bar, filters, FAB to add
7. **GoalsScreen** (Goals tab) — Goals list with progress bars, add goal FAB
8. **ProfileScreen** (Profile tab) — User info, financial summary, settings shortcut, logout

### Modal / Stack Screens
9. **AddTransactionScreen** — Form: type (income/expense), title, amount, category, date, description
10. **EditTransactionScreen** — Same form pre-filled
11. **AddGoalScreen** — Form: title, target amount, current amount, deadline
12. **SettingsScreen** — Dark mode, notifications, export, security
13. **TransactionDetailScreen** — Full detail view of a transaction

---

## Key User Flows

### Flow 1: First-time User
Splash → Register → Dashboard (empty state with onboarding prompt)

### Flow 2: Add Expense
Dashboard → FAB or Transactions tab → Add Transaction → Select "Despesa" → Fill form → Save → Dashboard updated

### Flow 3: View Monthly Summary
Dashboard → Scroll to charts section → Tap bar chart → See breakdown by category

### Flow 4: Create Financial Goal
Goals tab → Tap "+" FAB → Fill goal form → Save → See progress card

### Flow 5: Check Insights
Dashboard → Scroll to insights section → See auto-generated tips (e.g., "Você gastou 18% a mais este mês")

---

## Component Library

### Atoms
- `Button` — primary, secondary, ghost, danger variants; loading state; haptic feedback
- `Input` — with label, error state, icon prefix/suffix
- `Badge` — category pill with color and icon
- `Avatar` — user initials or image
- `Divider` — subtle horizontal line

### Molecules
- `BalanceCard` — large hero card with total balance, show/hide toggle
- `SummaryCard` — income or expense with icon, amount, percentage change
- `TransactionItem` — category icon, title, amount (colored), date
- `GoalCard` — title, progress bar, percentage, deadline
- `InsightCard` — icon, message, subtle background
- `CategoryBadge` — icon + label pill
- `ChartCard` — title + chart wrapped in card

### Organisms
- `DashboardHeader` — greeting + notification bell
- `TransactionList` — FlatList with section headers (by date)
- `BottomSheet` — for filters and quick actions
- `EmptyState` — illustration + message + CTA

---

## Navigation Structure

```
RootStack
├── AuthStack (when not authenticated)
│   ├── Login
│   ├── Register
│   └── ForgotPassword
└── MainTabs (when authenticated)
    ├── Dashboard (index)
    ├── Transactions
    ├── Goals
    └── Profile
        └── Settings (stack push)
```

---

## Animation Strategy

- **Entry animations**: Fade + slide up (200ms, ease-out) for cards on mount
- **Tab transitions**: Default Expo Router transitions
- **Button press**: Scale 0.97 + opacity 0.9 (80ms)
- **Chart animations**: Progressive draw on mount (600ms)
- **Skeleton**: Shimmer effect (1200ms loop)
- **Balance toggle**: Blur/unblur with fade (150ms)
- **FAB**: Scale spring on press

---

## Dark Mode

Full dark mode support via ThemeProvider + CSS variables. All colors defined as tokens that automatically switch. No `dark:` prefix needed — just use token classes.
