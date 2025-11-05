# 📚 BookNest - Komunitní platforma pro čtenáře

BookNest je moderní full-stack webová aplikace pro milovníky knih. Umožňuje uživatelům procházet databázi knih, vytvářet si osobní wishlisty a diskutovat o knihách v žánrově organizovaných diskuzích.

## 🚀 Technologie

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Databáze**: PostgreSQL
- **ORM**: Prisma
- **Autentizace**: NextAuth.js
- **Validace**: Zod

## ✨ Funkce

### 🔐 Autentizace & Uživatelé
- ✅ Registrace a přihlášení s NextAuth.js
- ✅ Profil uživatele se statistikami
- ✅ Počítadla knih, příspěvků a diskuzí

### 📚 Databáze knih
- ✅ Procházení knih v responzivní mřížce
- ✅ Vyhledávání podle názvu a autora
- ✅ Stránkování (12 knih na stránku)
- ✅ Detail knihy s kompletními informacemi
- ✅ Žánrová kategorizace (8 žánrů)

### ⭐ Wishlist
- ✅ Přidávání/odebírání knih do wishlistu
- ✅ Statusy: Chci přečíst, Právě čtu, Přečteno, Odloženo
- ✅ Filtrace podle statusu
- ✅ Srdíčkové tlačítko na každé knize

### 💬 Diskuzní fórum
- ✅ Rozdělení podle žánrů knih
- ✅ Vytváření nových diskuzí (jen pro přihlášené)
- ✅ Přidávání příspěvků do diskuzí
- ✅ Připínání a zamykání diskuzí
- ✅ Počítadla příspěvků

### 📊 Statistiky
- ✅ Celkové statistiky platformy
- ✅ Nejoblíbenější knihy (podle wishlistů)
- ✅ Nejaktivnější diskuze
- ✅ Přehled žánrů s počty

### 🎨 UX/UI
- ✅ Responzivní design (mobile-first)
- ✅ Tailwind CSS styling
- ✅ Navigace s uživatelským menu
- ✅ Breadcrumbs navigace
- ✅ Loading states
- ✅ Modální okna pro formuláře

## 📋 Předpoklady

Před instalací se ujistěte, že máte nainstalováno:

- Node.js 18+ (doporučeno 20+)
- Docker a Docker Compose (pro PostgreSQL databázi)
- npm nebo yarn

## 🛠️ Instalace

### 1. Klonování repozitáře

```bash
git clone https://github.com/GettMaaz/Book-Nest.git
cd Book-Nest
```

### 2. Instalace závislostí

```bash
npm install
```

### 3. Nastavení prostředí

Vytvořte soubor `.env` v kořenovém adresáři projektu:

```bash
cp .env.example .env
```

Upravte `.env` soubor podle potřeby:

```env
# Database
DATABASE_URL="postgresql://booknest:booknest123@localhost:5432/booknest?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# App
NODE_ENV="development"
```

**Důležité**: Pro produkci vygenerujte silný secret key:
```bash
openssl rand -base64 32
```

### 4. Spuštění PostgreSQL databáze

```bash
docker-compose up -d
```

Databáze běží na `localhost:5432`.

### 5. Inicializace databáze

```bash
# Vygenerovat Prisma Client
npm run prisma:generate

# Aplikovat migrace
npm run prisma:migrate

# Nebo použít push pro development
npm run db:push
```

### 6. Spuštění aplikace

```bash
npm run dev
```

Aplikace bude dostupná na [http://localhost:3000](http://localhost:3000)

## 📦 Dostupné skripty

```bash
npm run dev          # Spustí development server
npm run build        # Vytvoří produkční build
npm run start        # Spustí produkční server
npm run lint         # Spustí ESLint

# Prisma příkazy
npm run prisma:generate  # Vygeneruje Prisma Client
npm run prisma:migrate   # Spustí migrace
npm run prisma:studio    # Otevře Prisma Studio (databázové GUI)
npm run db:push          # Push schématu do databáze (development)
```

## 🗄️ Databázové schéma

Aplikace používá následující modely:

- **User** - Uživatelé aplikace
- **Account**, **Session**, **VerificationToken** - NextAuth.js modely
- **Genre** - Žánry knih
- **Book** - Knihy
- **BookGenre** - Many-to-Many vztah mezi knihami a žánry
- **Wishlist** - Osobní seznamy knih uživatelů
- **Discussion** - Diskuze o knihách
- **Post** - Příspěvky v diskuzích

## 🔑 API Endpoints

### Autentizace
- `POST /api/auth/register` - Registrace nového uživatele
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Knihy
- `GET /api/books?search=...` - Seznam knih s vyhledáváním
- `POST /api/books` - Vytvořit novou knihu

### Žánry
- `GET /api/genres` - Všechny žánry s počty
- `POST /api/genres` - Vytvořit nový žánr

### Wishlist
- `GET /api/wishlist` - Wishlist aktuálního uživatele
- `POST /api/wishlist` - Přidat do wishlistu
- `DELETE /api/wishlist/[bookId]` - Odebrat z wishlistu
- `GET /api/wishlist/check/[bookId]` - Zkontrolovat stav

### Diskuze & Příspěvky
- `GET /api/discussions?genreId=...` - Diskuze podle žánru
- `POST /api/discussions` - Vytvořit diskuzi
- `POST /api/posts` - Přidat příspěvek

## 📁 Struktura projektu

```
Book-Nest/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── auth/           # Autentizace
│   │   ├── books/          # API pro knihy
│   │   ├── genres/         # API pro žánry
│   │   ├── wishlist/       # API pro wishlist
│   │   └── discussions/    # API pro diskuze
│   ├── login/              # Stránka přihlášení
│   ├── register/           # Stránka registrace
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Domovská stránka
│   └── globals.css         # Globální styly
├── components/              # React komponenty
│   └── Navigation.tsx      # Navigační lišta
├── lib/                     # Utility funkce
│   ├── auth.ts             # NextAuth konfigurace
│   ├── prisma.ts           # Prisma Client
│   └── utils.ts            # Pomocné funkce
├── prisma/                  # Prisma schéma a migrace
│   └── schema.prisma       # Databázové schéma
├── types/                   # TypeScript typy
│   └── next-auth.d.ts      # NextAuth typy
├── docker-compose.yml       # Docker Compose pro PostgreSQL
├── .env.example             # Příklad prostředí
├── package.json             # Závislosti a skripty
└── README.md               # Tento soubor
```

## 🔐 Bezpečnost

- Hesla jsou hashována pomocí bcryptjs
- Používá se JWT pro session management
- SQL injection prevence díky Prisma ORM
- Input validace pomocí Zod

## 🎨 Customizace

### Změna barevného schématu

Upravte `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    // Vaše vlastní barvy
  }
}
```

### Přidání nových žánrů

Využijte Prisma Studio nebo vytvořte seed soubor:

```bash
npm run prisma:studio
```

## 🐛 Řešení problémů

### Databáze se nemůže připojit
```bash
# Zkontrolujte, zda běží Docker kontejner
docker ps

# Restartujte databázi
docker-compose restart
```

### Chyba s Prisma Client
```bash
# Znovu vygenerujte Prisma Client
npm run prisma:generate
```

### Port 3000 je obsazený
```bash
# Použijte jiný port
PORT=3001 npm run dev
```

## 🎯 Implementované funkce

✅ **Fáze 1-4**: Kompletní základ aplikace
- SQLite databáze s better-sqlite3
- 20 testovacích knih, 4 uživatelé
- Všechny hlavní stránky (/books, /wishlist, /discussions)
- API endpoints pro všechny operace

✅ **Fáze 5-10**: Rozšířené funkce
- Profil uživatele s statistikami
- Statistiky platformy
- Vyhledávání a filtrace
- Diskuzní fórum podle žánrů

## 📝 Možná vylepšení

- 🔹 Hodnocení a recenze knih (hvězdičky, komentáře)
- 🔹 Upload vlastních avatarů a cover obrázků
- 🔹 Admin panel pro správu obsahu
- 🔹 Notifikace při nových příspěvcích
- 🔹 Doporučovací systém podle žánrů
- 🔹 Dark mode
- 🔹 Exportování wishlistu (CSV, PDF)
- 🔹 Integrace s knihovnami (API)

## 📄 Licence

MIT

## 👨‍💻 Autor

Vytvořeno s pomocí Claude Code

---

**Hodně štěstí s rozvojem vaší aplikace! 🚀**
