# TMDB Movie Search

Вебзастосунок для пошуку фільмів через TMDB API. Проєкт дозволяє шукати фільми за назвою, переглядати підказки під час введення, застосовувати розширені фільтри, переходити на детальний екран фільму та працювати зі збереженою історією пошуку.

## Опис проекту та функціональності

Основний сценарій користувача:

- ввести назву фільму в поле пошуку;
- отримати autocomplete-підказки з постером, роком і жанрами;
- застосувати додаткові фільтри: `language`, `region`, `year`, `primary release year`, `page`, `include adult`;
- переглянути результати пошуку з пагінацією;
- перейти на окремий детальний екран фільму;
- повернутися назад до пошуку без втрати параметрів у URL.

Що реалізовано у функціональності:

- пошук фільмів через TMDB;
- debounce для основного пошуку;
- debounce для `year` і `primary release year`;
- commit для `page` по `blur` / `Enter`;
- autocomplete з історією останніх запитів;
- збереження історії пошуку в `localStorage`;
- сторінка деталей фільму;
- обробка loading, empty, error, retry states;
- `ErrorBoundary` для React render errors і окремий route-level fallback для lazy routes;
- lazy loading сторінок;
- базова оптимізація рендеру через `memo` / `useMemo`;
- тести для ключової UI та частини бізнес-логіки.

## Інструкції по встановленню та запуску

### 0. Node.js version

Критично: для цього проєкту потрібен `Node.js ^20.19.0` або `>=22.12.0`.

Перевірити поточну версію можна так:

```bash
node -v
```

### 1. Встановлення залежностей

```bash
npm install
```

### 2. Налаштування змінних середовища

Створи файл `.env.local` на основі `.env.example` і додай один із варіантів авторизації до TMDB:

```bash
VITE_TMDB_ACCESS_TOKEN=your_tmdb_read_access_token
# optional fallback
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

### 3. Запуск у режимі розробки

```bash
npm run dev
```

Після запуску застосунок буде доступний локально через Vite dev server.

### 4. Перевірка production build

```bash
npm run build
npm run preview
```

### 5. Додаткові перевірки якості

```bash
npm run lint
npm run test:run
```

## Використані технології та бібліотеки

Основний стек:

- `React 19`
- `TypeScript`
- `Vite`
- `React Router DOM`
- `Axios`
- `CSS Modules`

Для якості коду та тестування:

- `ESLint`
- `Vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `jsdom`

## Архітектурні рішення та їх обґрунтування

### Модульна структура за фічами

Проєкт організований навколо feature-модулів:

- `src/modules/MovieSearch`
- `src/modules/MovieDetails`

Всередині модулів логіка поділена на шари:

- `entity` — робота з API, DTO, mapper-и;
- `presenters` — бізнес-логіка, orchestration, кастомні hooks, context;
- `ui` / `components` — відображення та композиція інтерфейсу;
- `schemas` / `types` — типи та робота з пошуковими параметрами.

Чому так:

- простіше масштабувати нові фічі;
- UI не перевантажується async-логікою;
- API-шар відокремлений від представлення;
- код зручніше тестувати на рівні окремих шарів.

### Винесення спільної логіки в `lib`, `hooks`, `UIKit`

- `src/lib` містить загальні утиліти та API-клієнт;
- `src/hooks` містить повторно використовувані hooks;
- `src/UIKit` містить базові UI-примітиви: `Button`, `Input`, `Select`, `Checkbox`, `Loader`, `LoadingState`, `ErrorBoundary`.

Чому так:

- повторне використання без дублювання;
- єдина поведінка базових елементів;
- простіше змінювати спільний UI в одному місці.

### Централізований HTTP client

Для роботи з TMDB використовується спільний `axios.create(...)` клієнт.

Чому так:

- credentials і `baseURL` налаштовуються в одному місці;
- простіше контролювати timeout і загальні параметри;
- менше дублювання в API-модулях.

### URL як частина стану пошуку

Пошуковий запит і фільтри синхронізуються з query params.

Чому так:

- сторінку можна перезавантажити без втрати стану;
- можна поділитися посиланням на поточний результат пошуку;
- back navigation працює передбачувано.

### Поділ між hook-логікою і view-model логікою

- `useMovieSearch` відповідає за пошук, debounce, pagination, retry, error/loading states;
- `useMovieSearchView` готує дані для UI і вирішує, що саме показувати на екрані.

Чому так:

- менше умов безпосередньо в JSX;
- UI-компонент залишається простішим;
- view-logic легше тестувати окремо.

## Які додаткові фічі реалізовані

Окрім базового пошуку, додатково реалізовано:

- autocomplete зі збереженою історією пошуку;
- кеш жанрів у пам’яті для повторних запитів однією мовою;
- retry для search і details;
- окремий details page з поверненням до попереднього пошуку;
- route-level lazy loading сторінок;
- memoization для часто ререндерюваних компонентів;
- offline/network error messages з більш дружнім текстом;
- приховування `Search Results`, коли це доречно по UX;
- unit та integration-style тести для ключових сценаріїв.

## Структура проекту

```text
src/
  app/                # router, providers, app-level boundaries
  hooks/              # shared custom hooks
  lib/                # shared utils, api client, helpers
  modules/
    MovieSearch/      # search feature
    MovieDetails/     # movie details feature
  UIKit/              # reusable UI primitives
  test/               # global test setup
```

## Поточні перевірки якості

У проєкті налаштовані:

- TypeScript type-checking
- ESLint
- Vitest + Testing Library

Базові команди:

```bash
npx tsc -p tsconfig.app.json
npm run lint
npm run test:run
```
