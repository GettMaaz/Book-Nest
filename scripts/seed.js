const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

function generateId() {
  return 'c' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const db = new Database(path.join(__dirname, '../prisma/dev.db'));

console.log('🌱 Seeduji databázi...');

// Vymazat existující data
console.log('🗑️  Mazání starých dat...');
db.exec('DELETE FROM posts');
db.exec('DELETE FROM discussions');
db.exec('DELETE FROM wishlists');
db.exec('DELETE FROM book_genres');
db.exec('DELETE FROM books');
db.exec('DELETE FROM genres');
db.exec('DELETE FROM sessions');
db.exec('DELETE FROM accounts');
db.exec('DELETE FROM users');

// 1. Vytvořit testovací uživatele
console.log('👥 Vytv\u00e1\u0159\u00edm u\u017eivatele...');
const hashedPassword = bcrypt.hashSync('password123', 10);
const hashedAdminPassword = bcrypt.hashSync('admin123', 10);

const users = [
  {
    id: generateId(),
    name: 'Test User 1',
    email: 'test1@example.com',
    password: hashedPassword,
    bio: 'Milovník fantasy knih',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Test User 2',
    email: 'test2@example.com',
    password: hashedPassword,
    bio: 'Fanoušek sci-fi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Test User 3',
    email: 'test3@example.com',
    password: hashedPassword,
    bio: 'Čtenář detektivek',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: 'Admin',
    email: 'admin@example.com',
    password: hashedAdminPassword,
    bio: 'Administrátor BookNest',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const insertUser = db.prepare(`
  INSERT INTO users (id, name, email, password, bio, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

users.forEach(user => {
  insertUser.run(user.id, user.name, user.email, user.password, user.bio, user.createdAt, user.updatedAt);
});

console.log(`✅ Vytvořeno ${users.length} uživatelů`);

// 2. Vytvořit žánry
console.log('📚 Vytváření žánrů...');
const genres = [
  { name: 'Fantasy', description: 'Magické světy, draci a dobrodružství' },
  { name: 'Sci-Fi', description: 'Vědecká fantastika a budoucnost' },
  { name: 'Detektivka', description: 'Záhady a kriminální příběhy' },
  { name: 'Romantika', description: 'Milostné příběhy' },
  { name: 'Historický román', description: 'Příběhy z minulosti' },
  { name: 'Thriller', description: 'Napínavé a akční příběhy' },
  { name: 'Horror', description: 'Děsivé a strašidelné příběhy' },
  { name: 'Klasika', description: 'Klasická světová literatura' }
];

const genreIds = {};
const insertGenre = db.prepare(`
  INSERT INTO genres (id, name, slug, description, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?)
`);

genres.forEach(genre => {
  const id = generateId();
  const slug = slugify(genre.name);
  genreIds[genre.name] = id;
  insertGenre.run(id, genre.name, slug, genre.description, new Date().toISOString(), new Date().toISOString());
});

console.log(`✅ Vytvořeno ${genres.length} žánrů`);

// 3. Vytvořit knihy
console.log('📖 Vytváření knih...');
const books = [
  // Fantasy
  { title: 'Pán prstenů', author: 'J.R.R. Tolkien', genre: 'Fantasy', description: 'Epická fantasy sága o cestě malého hobita Froda, který musí zničit mocný prsten.', pageCount: 1178, language: 'cs' },
  { title: 'Harry Potter a Kámen mudrců', author: 'J.K. Rowling', genre: 'Fantasy', description: 'První díl série o mladém čarodějovi Harrym Potterovi.', pageCount: 336, language: 'cs' },
  { title: 'Jméno větru', author: 'Patrick Rothfuss', genre: 'Fantasy', description: 'Příběh Kvothe, legendárního kouzelníka a dobrodruha.', pageCount: 662, language: 'cs' },

  // Sci-Fi
  { title: 'Duna', author: 'Frank Herbert', genre: 'Sci-Fi', description: 'Sci-fi epos o planetě Arrakis a boji o nejcennější surovinu ve vesmíru.', pageCount: 688, language: 'cs' },
  { title: 'Nadace', author: 'Isaac Asimov', genre: 'Sci-Fi', description: 'Klasická sci-fi série o pádu galaktického impéria.', pageCount: 296, language: 'cs' },
  { title: 'Stopařův průvodce po Galaxii', author: 'Douglas Adams', genre: 'Sci-Fi', description: 'Humorná sci-fi o dobrodružstvích ve vesmíru.', pageCount: 224, language: 'cs' },
  { title: 'Já, robot', author: 'Isaac Asimov', genre: 'Sci-Fi', description: 'Sbírka povídek o robotech a třech zákonech robotiky.', pageCount: 253, language: 'cs' },

  // Detektivka
  { title: 'Vražda v Orient expresu', author: 'Agatha Christie', genre: 'Detektivka', description: 'Hercule Poirot řeší vraždu ve vlaku.', pageCount: 256, language: 'cs' },
  { title: 'Dívka ve vlaku', author: 'Paula Hawkins', genre: 'Detektivka', description: 'Psychologický thriller o ženě, která je svědkem čehosi znepokojivého.', pageCount: 352, language: 'cs' },
  { title: 'Šifra mistra Leonarda', author: 'Dan Brown', genre: 'Detektivka', description: 'Robert Langdon řeší záhadu vraždy v Louvru.', pageCount: 489, language: 'cs' },

  // Romantika
  { title: 'Pýcha a předsudek', author: 'Jane Austen', genre: 'Romantika', description: 'Klasický romantický příběh Alžběty Bennetové.', pageCount: 432, language: 'cs' },
  { title: 'Na vlásku', author: 'John Green', genre: 'Romantika', description: 'Dojemný příběh o lásce a životě mladých lidí.', pageCount: 336, language: 'cs' },
  { title: 'Notebook', author: 'Nicholas Sparks', genre: 'Romantika', description: 'Krásný milostný příběh na celý život.', pageCount: 214, language: 'cs' },

  // Historický román
  { title: 'Válka a mír', author: 'Lev Nikolajevič Tolstoj', genre: 'Historický román', description: 'Monumentální dílo o napoleonských válkách.', pageCount: 1296, language: 'cs' },
  { title: 'Pomáda', author: 'Dalton Trumbo', genre: 'Historický román', description: 'Příběh o první světové válce z pohledu mladého vojáka.', pageCount: 309, language: 'cs' },
  { title: 'Pillars of the Earth', author: 'Ken Follett', genre: 'Historický román', description: 'Epický příběh stavby katedrály ve středověké Anglii.', pageCount: 973, language: 'cs' },

  // Thriller
  { title: 'Mlčení jehňátek', author: 'Thomas Harris', genre: 'Thriller', description: 'Clarice Starling musí spolupracovat se sériovým vrahem.', pageCount: 368, language: 'cs' },
  { title: 'Zmizelá', author: 'Gillian Flynn', genre: 'Thriller', description: 'Amy zmizí v den svého pátého výročí svatby.', pageCount: 544, language: 'cs' },

  // Horror
  { title: 'To', author: 'Stephen King', genre: 'Horror', description: 'Děsivý příběh o klaun Pennywisovi.', pageCount: 1138, language: 'cs' },
  { title: 'Osvícení', author: 'Stephen King', genre: 'Horror', description: 'Rodina izolovaná v horském hotelu čelí nadpřirozeným silám.', pageCount: 447, language: 'cs' }
];

const bookIds = [];
const insertBook = db.prepare(`
  INSERT INTO books (id, title, author, description, pageCount, language, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertBookGenre = db.prepare(`
  INSERT INTO book_genres (id, bookId, genreId, createdAt)
  VALUES (?, ?, ?, ?)
`);

books.forEach(book => {
  const id = generateId();
  bookIds.push(id);
  insertBook.run(id, book.title, book.author, book.description, book.pageCount, book.language, new Date().toISOString(), new Date().toISOString());

  // Přidat vztah ke žánru
  const genreId = genreIds[book.genre];
  if (genreId) {
    insertBookGenre.run(generateId(), id, genreId, new Date().toISOString());
  }
});

console.log(`✅ Vytvořeno ${books.length} knih`);

// 4. Vytvořit wishlist záznamy
console.log('⭐ Vytváření wishlist záznamů...');
const insertWishlist = db.prepare(`
  INSERT INTO wishlists (id, userId, bookId, status, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?)
`);

// Každý uživatel má 3-5 knih ve wishlistu
let wishlistCount = 0;
users.slice(0, 3).forEach((user, index) => {
  const numBooks = 3 + Math.floor(Math.random() * 3);
  const userBookIds = [...bookIds].sort(() => 0.5 - Math.random()).slice(0, numBooks);

  userBookIds.forEach((bookId, i) => {
    const statuses = ['WANT_TO_READ', 'CURRENTLY_READING', 'FINISHED'];
    const status = statuses[i % 3];
    insertWishlist.run(generateId(), user.id, bookId, status, new Date().toISOString(), new Date().toISOString());
    wishlistCount++;
  });
});

console.log(`✅ Vytvořeno ${wishlistCount} wishlist záznamů`);

// 5. Vytvořit diskuze
console.log('💬 Vytváření diskuzí...');
const discussions = [
  { title: 'Jaká je vaše oblíbená fantasy kniha?', genre: 'Fantasy', userId: users[0].id },
  { title: 'Nejlepší sci-fi knihy všech dob', genre: 'Sci-Fi', userId: users[1].id },
  { title: 'Doporučení detektivek pro začátečníky', genre: 'Detektivka', userId: users[2].id },
  { title: 'Romantika vs. erotica - co je rozdíl?', genre: 'Romantika', userId: users[0].id },
  { title: 'Stephen King - který horor je nejlepší?', genre: 'Horror', userId: users[1].id }
];

const insertDiscussion = db.prepare(`
  INSERT INTO discussions (id, title, slug, userId, genreId, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertPost = db.prepare(`
  INSERT INTO posts (id, content, userId, discussionId, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?)
`);

discussions.forEach(discussion => {
  const id = generateId();
  const slug = slugify(discussion.title) + '-' + Date.now();
  const genreId = genreIds[discussion.genre];

  insertDiscussion.run(id, discussion.title, slug, discussion.userId, genreId, new Date().toISOString(), new Date().toISOString());

  // Přidat 2-3 příspěvky do každé diskuze
  const numPosts = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < numPosts; i++) {
    const postUser = users[Math.floor(Math.random() * users.length)];
    const content = `Toto je testovací příspěvek #${i + 1} v diskuzi "${discussion.title}". Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
    insertPost.run(generateId(), content, postUser.id, id, new Date().toISOString(), new Date().toISOString());
  }
});

console.log(`✅ Vytvořeno ${discussions.length} diskuzí`);

db.close();

console.log('\n🎉 Seedování dokončeno!');
console.log('\n📊 Shrnutí:');
console.log(`   - ${users.length} uživatelů`);
console.log(`   - ${genres.length} žánrů`);
console.log(`   - ${books.length} knih`);
console.log(`   - ${wishlistCount} wishlist záznamů`);
console.log(`   - ${discussions.length} diskuzí`);
console.log('\n✨ Můžete se přihlásit s:');
console.log('   test1@example.com / password123');
console.log('   test2@example.com / password123');
console.log('   test3@example.com / password123');
console.log('   admin@example.com / admin123');
