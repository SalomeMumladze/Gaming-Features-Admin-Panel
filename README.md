# Gaming Features Admin Panel

## 1. Project Overview
 Modular admin panel for managing gaming features including Leaderboard, Raffle, and Wheel (Spin-to-Win). Operators can create, configure, and manage each feature independently through a clean, professional interface.

## 2. Architecture
follows a modular architecture where each feature is fully independent. Removing any feature from the codebase will not affect the others. The project uses a folder structure that reflects feature boundaries, reusable utilities, and centralized configuration.

## Tech Stack

**Frontend:**
- **React** ^18.3.1 — Core UI library for building components
- **React Router DOM** ^6.30.3 — Client-side routing
- **React Hook Form** ^7.72.0 — Form handling and validation
- **Zod** ^4.3.6 — Schema validation for forms
- **@mui/material** ^5.18.0 — Material UI component library
- **@mui/icons-material** ^5.18.0 — Material icons
- **@mui/x-data-grid** ^8.28.0 — Advanced data tables
- **@mui/x-date-pickers & pro** ^8.27.2 — Date and time pickers
- **@emotion/react & styled** ^11.14.0 / ^11.14.1 — Styling components
- **Tailwind CSS** ^3.4.19 & **@tailwindcss/vite** ^4.2.2 — Utility-first CSS framework
- **@dnd-kit/core & sortable** ^6.3.1 / ^10.0.0 — Drag-and-drop functionality
- **react-custom-roulette** ^1.4.1 — Wheel/Spin-to-win component

**State & Data Management:**
- **@tanstack/react-query** ^5.95.2 — Server state management, caching
- **Axios** ^1.13.6 — HTTP client for API requests
- **Day.js** ^1.11.20 — Date manipulation library

**Backend / Mock API:**
- **json-server** ^1.0.0-beta.15 — Local mock REST API

**Tooling & Build:**
- **Vite** ^8.0.1 — Development server and build tool
- **TypeScript** ~5.9.3 — Type-safe JavaScript
- **ESLint** ^9.39.4 + plugins — Linting and code quality
- **PostCSS & Autoprefixer** ^8.5.8 / ^10.4.27 — CSS processing



## Getting started
In the project directory, you can run the following scripts:

- `npm install` — nstall dependencies
- `npm run dev` — Start the development server
- `npm run start:api` — Start the mock API server

### Leaderboard Endpoints
- `GET /leaderboards` — List leaderboards  
  **Response:** `Leaderboard[]`
- `POST /leaderboards` — Create leaderboard  
  **Body:** `Leaderboard` (without `id`, `createdAt`, `updatedAt`)
- `GET /leaderboards/:id` — Get leaderboard detail
- `PUT /leaderboards/:id` — Update leaderboard
- `DELETE /leaderboards/:id` — Delete leaderboard

### Raffle Endpoints
- `GET /raffles` — List raffles  
  **Response:** `Raffle[]`
- `POST /raffles` — Create raffle (via `RaffleComposer`)
- `GET /raffles/:id` — Get raffle detail
- `PUT /raffles/:id` — Update raffle
- `DELETE /raffles/:id` — Delete raffle

### Wheel Endpoints
- `GET /wheels` — List wheels  
  **Response:** `Wheel[]`
- `POST /wheels` — Create wheel
- `GET /wheels/:id` — Get wheel detail
- `PUT /wheels/:id` — Update wheel
- `DELETE /wheels/:id` — Delete wheel


## არქიტექტურული და ტექნიკური გადაწყვეტილებები

აპლიკაციის ძირითადი არქიტექტურული/ტექნიკური გადაწყვეტილებები ეხება URL პარამეტრების მართვას და Drawer UI კომპონენტების ორგანიზებას:

### 1. URL Query პარამეტრების მართვა Context-ით
**ფაილი:** `useQueryParams` / `UrlContextProvider`  
 
- ეს გადაწყვეტა საშუალებას იძლევა, რომ მთელი აპლიკაცია ერთიანად წვდომა ჰქონდეს URL პარამეტრებზე, ერთგან განახორციელოს ცვლილებები და ყველა კომპონენტი ავტომატურად რეაგირებდეს ცვლილებებზე.  
- სარგებელი:  
  - **DRY პრინციპი:** აღარ არის საჭირო URL parsing/setting ყველა კომპონენტში.  
  - **History API კონტროლი centralized–ია**, რაც უზრუნველყოფს consistent navigation experience SPA-ში.  
  - `setUrlParams` და `removeParams` ფუნქციები საშუალებას იძლევიან პარამეტრების მოქნილ მართვას (push ან replace).

### 2. Dynamic Drawer სისტემის იმპლემენტაცია
**ფაილი:** `Drawers.tsx`  

- ყველა drawer–ის centralized რეენდერინგი ერთი კომპონენტიდან, რომელიც Base hook–ით (`useQueryParams`) განსაზღვრავს drawer–ის გახსნის ლოგიკას.  
- ეს მიდგომა უზრუნველყოფს drawer–ის გახსნას კონკრეტული URL პარამეტრის მიხედვით და დახურვისას შესაბამისი პარამეტრების ავტომატურ წაშლას.  
- სარგებელი:  
  - **კონტროლის ერთი წერტილი:** მარტივად ემატება ახალი drawer–ები `drawerComponents` array-ში.  
  - Drawer–ების გახსნის/დახურვის ლოგიკა reusable და predictable ხდება (`requiredParams` + `closeParams`).  

