import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'prisma', 'dev.db'));

export const dbClient = {
  user: {
    findUnique: ({ where }: { where: { email?: string; id?: string } }) => {
      if (where.email) {
        return db.prepare('SELECT * FROM users WHERE email = ?').get(where.email);
      }
      if (where.id) {
        return db.prepare('SELECT * FROM users WHERE id = ?').get(where.id);
      }
      return null;
    },
    create: ({ data }: any) => {
      const stmt = db.prepare(`
        INSERT INTO users (id, name, email, password, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const id = generateId();
      const now = new Date().toISOString();
      stmt.run(id, data.name, data.email, data.password, now, now);
      return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    },
  },

  book: {
    findMany: ({ where, include, orderBy, take, skip }: any = {}) => {
      let query = 'SELECT * FROM books';
      const params: any[] = [];

      if (where?.title?.contains) {
        query += ' WHERE title LIKE ?';
        params.push(`%${where.title.contains}%`);
      } else if (where?.author?.contains) {
        query += ' WHERE author LIKE ?';
        params.push(`%${where.author.contains}%`);
      } else if (where?.OR) {
        query += ' WHERE title LIKE ? OR author LIKE ?';
        const searchTerm = where.OR[0].title.contains;
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
      }

      if (orderBy?.createdAt) {
        query += ` ORDER BY createdAt ${orderBy.createdAt === 'desc' ? 'DESC' : 'ASC'}`;
      }

      if (take) {
        query += ' LIMIT ?';
        params.push(take);
      }

      if (skip) {
        query += ' OFFSET ?';
        params.push(skip);
      }

      const books = db.prepare(query).all(...params);

      if (include?.genres) {
        return books.map((book: any) => ({
          ...book,
          genres: db.prepare(`
            SELECT g.* FROM genres g
            INNER JOIN book_genres bg ON bg.genreId = g.id
            WHERE bg.bookId = ?
          `).all(book.id).map((g: any) => ({ genre: g }))
        }));
      }

      return books;
    },

    findUnique: ({ where, include }: any) => {
      const book = db.prepare('SELECT * FROM books WHERE id = ?').get(where.id);

      if (book && include?.genres) {
        (book as any).genres = db.prepare(`
          SELECT g.* FROM genres g
          INNER JOIN book_genres bg ON bg.genreId = g.id
          WHERE bg.bookId = ?
        `).all(where.id).map((g: any) => ({ genre: g }));
      }

      return book;
    },

    count: ({ where }: any = {}) => {
      if (where?.OR) {
        const searchTerm = where.OR[0].title.contains;
        return db.prepare('SELECT COUNT(*) as count FROM books WHERE title LIKE ? OR author LIKE ?')
          .get(`%${searchTerm}%`, `%${searchTerm}%`) as any;
      }
      return db.prepare('SELECT COUNT(*) as count FROM books').get() as any;
    }
  },

  genre: {
    findMany: ({ orderBy, include }: any = {}) => {
      let query = 'SELECT * FROM genres';

      if (orderBy?.name) {
        query += ` ORDER BY name ${orderBy.name === 'desc' ? 'DESC' : 'ASC'}`;
      }

      const genres = db.prepare(query).all();

      if (include?._count) {
        return genres.map((genre: any) => ({
          ...genre,
          _count: {
            books: db.prepare('SELECT COUNT(*) as count FROM book_genres WHERE genreId = ?').get(genre.id),
            discussions: db.prepare('SELECT COUNT(*) as count FROM discussions WHERE genreId = ?').get(genre.id)
          }
        }));
      }

      return genres;
    },

    findUnique: ({ where }: any) => {
      if (where.id) {
        return db.prepare('SELECT * FROM genres WHERE id = ?').get(where.id);
      }
      if (where.slug) {
        return db.prepare('SELECT * FROM genres WHERE slug = ?').get(where.slug);
      }
      return null;
    },

    create: ({ data }: any) => {
      const stmt = db.prepare(`
        INSERT INTO genres (id, name, slug, description, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const id = generateId();
      const now = new Date().toISOString();
      stmt.run(id, data.name, data.slug, data.description, now, now);
      return db.prepare('SELECT * FROM genres WHERE id = ?').get(id);
    }
  },

  wishlist: {
    findMany: ({ where, include }: any = {}) => {
      let query = 'SELECT * FROM wishlists';
      const params: any[] = [];

      if (where?.userId) {
        query += ' WHERE userId = ?';
        params.push(where.userId);
      }

      query += ' ORDER BY createdAt DESC';

      const wishlists = db.prepare(query).all(...params);

      if (include?.book) {
        return wishlists.map((w: any) => ({
          ...w,
          book: {
            ...db.prepare('SELECT * FROM books WHERE id = ?').get(w.bookId),
            genres: db.prepare(`
              SELECT g.* FROM genres g
              INNER JOIN book_genres bg ON bg.genreId = g.id
              WHERE bg.bookId = ?
            `).all(w.bookId).map((g: any) => ({ genre: g }))
          }
        }));
      }

      return wishlists;
    },

    findUnique: ({ where }: any) => {
      return db.prepare('SELECT * FROM wishlists WHERE userId = ? AND bookId = ?')
        .get(where.userId_bookId.userId, where.userId_bookId.bookId);
    },

    create: ({ data }: any) => {
      const stmt = db.prepare(`
        INSERT INTO wishlists (id, userId, bookId, status, notes, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const id = generateId();
      const now = new Date().toISOString();
      stmt.run(id, data.userId, data.bookId, data.status, data.notes, now, now);
      return db.prepare('SELECT * FROM wishlists WHERE id = ?').get(id);
    },

    delete: ({ where }: any) => {
      const stmt = db.prepare('DELETE FROM wishlists WHERE userId = ? AND bookId = ?');
      stmt.run(where.userId_bookId.userId, where.userId_bookId.bookId);
      return { success: true };
    }
  },

  discussion: {
    findMany: ({ where, include, orderBy }: any = {}) => {
      let query = 'SELECT * FROM discussions';
      const params: any[] = [];

      if (where?.genreId) {
        query += ' WHERE genreId = ?';
        params.push(where.genreId);
      }

      if (orderBy) {
        if (orderBy.isPinned) {
          query += ' ORDER BY isPinned DESC, createdAt DESC';
        } else if (orderBy.createdAt) {
          query += ` ORDER BY createdAt ${orderBy.createdAt === 'desc' ? 'DESC' : 'ASC'}`;
        }
      } else {
        query += ' ORDER BY isPinned DESC, createdAt DESC';
      }

      const discussions = db.prepare(query).all(...params);

      if (include) {
        return discussions.map((d: any) => ({
          ...d,
          ...(include.user && {
            user: db.prepare('SELECT id, name, image FROM users WHERE id = ?').get(d.userId)
          }),
          ...(include.genre && {
            genre: db.prepare('SELECT * FROM genres WHERE id = ?').get(d.genreId)
          }),
          ...(include._count && {
            _count: {
              posts: db.prepare('SELECT COUNT(*) as count FROM posts WHERE discussionId = ?').get(d.id)
            }
          })
        }));
      }

      return discussions;
    },

    findUnique: ({ where, include }: any) => {
      let discussion;
      if (where.id) {
        discussion = db.prepare('SELECT * FROM discussions WHERE id = ?').get(where.id);
      } else if (where.slug) {
        discussion = db.prepare('SELECT * FROM discussions WHERE slug = ?').get(where.slug);
      }

      if (discussion && include) {
        return {
          ...discussion,
          ...(include.user && {
            user: db.prepare('SELECT id, name, image FROM users WHERE id = ?').get((discussion as any).userId)
          }),
          ...(include.genre && {
            genre: db.prepare('SELECT * FROM genres WHERE id = ?').get((discussion as any).genreId)
          }),
          ...(include.posts && {
            posts: db.prepare(`
              SELECT p.*, u.id as user_id, u.name as user_name, u.image as user_image
              FROM posts p
              INNER JOIN users u ON u.id = p.userId
              WHERE p.discussionId = ?
              ORDER BY p.createdAt ASC
            `).all((discussion as any).id).map((p: any) => ({
              ...p,
              user: { id: p.user_id, name: p.user_name, image: p.user_image }
            }))
          })
        };
      }

      return discussion;
    },

    create: ({ data }: any) => {
      const stmt = db.prepare(`
        INSERT INTO discussions (id, title, slug, description, userId, genreId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const id = generateId();
      const now = new Date().toISOString();
      stmt.run(id, data.title, data.slug, data.description, data.userId, data.genreId, now, now);
      return db.prepare('SELECT * FROM discussions WHERE id = ?').get(id);
    }
  },

  post: {
    create: ({ data }: any) => {
      const stmt = db.prepare(`
        INSERT INTO posts (id, content, userId, discussionId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const id = generateId();
      const now = new Date().toISOString();
      stmt.run(id, data.content, data.userId, data.discussionId, now, now);
      return db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    }
  }
};

function generateId() {
  return 'c' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export { db };
