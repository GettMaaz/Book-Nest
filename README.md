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

- ✅ Uživatelská registrace a přihlášení
- ✅ Databáze knih s možností vyhledávání
- ✅ Osobní wishlist pro správu četby
- ✅ Diskuzní fórum rozdělené podle žánrů
- ✅ Správa žánrů knih
- ✅ Responzivní design

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
- `POST /api/auth/signin` - Přihlášení (NextAuth)
- `POST /api/auth/signout` - Odhlášení

### Knihy
- `GET /api/books` - Získat seznam knih (s filtry)
- `POST /api/books` - Vytvořit novou knihu (vyžaduje přihlášení)

### Žánry
- `GET /api/genres` - Získat všechny žánry
- `POST /api/genres` - Vytvořit nový žánr (vyžaduje přihlášení)

### Wishlist
- `GET /api/wishlist` - Získat wishlist aktuálního uživatele
- `POST /api/wishlist` - Přidat knihu do wishlistu

### Diskuze
- `GET /api/discussions` - Získat diskuze (s filtry)
- `POST /api/discussions` - Vytvořit novou diskuzi (vyžaduje přihlášení)

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

## 📝 Další kroky

1. Implementovat stránky pro:
   - Detail knihy
   - Seznam žánrů
   - Detail diskuze
   - Profil uživatele

2. Přidat další funkce:
   - Hodnocení knih
   - Komentáře v diskuzích
   - Vyhledávání
   - Paginace
   - Upload obrázků

3. Nasadit na production:
   - Vercel (doporučeno pro Next.js)
   - Railway/Render pro databázi

## 📄 Licence

MIT

## 👨‍💻 Autor

Vytvořeno s pomocí Claude Code

---

**Hodně štěstí s rozvojem vaší aplikace! 🚀**
