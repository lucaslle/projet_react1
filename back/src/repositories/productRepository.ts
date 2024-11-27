import { Database } from 'sqlite3';
import { Product } from '../models/product';

export class ProductRepository {
	private db: Database;

	constructor(db: Database) {
		this.db = db;
		this.initializeTable();
	}

	private initializeTable(): void {
		const sql = `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

		this.db.run(sql);
	}

	async create(product: Product): Promise<Product> {
		return new Promise((resolve, reject) => {
			const sql = `
        INSERT INTO products (name, quantity, price)
        VALUES (?, ?, ?)
      `;

			this.db.run(
				sql,
				[product.name, product.quantity, product.price],
				function(err) {
					if (err) reject(err);

					const id = this.lastID;
					resolve({ ...product, id });
				}
			);
		});
	}

	async findAll(): Promise<Product[]> {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT * FROM products';

			this.db.all(sql, [], (err, rows) => {
				if (err) reject(err);
				resolve(rows as Product[]);
			});
		});
	}

	async findById(id: number): Promise<Product | null> {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT * FROM products WHERE id = ?';

			this.db.get(sql, [id], (err, row) => {
				if (err) reject(err);
				resolve(row as Product || null);
			});
		});
	}

	async update(id: number, product: Partial<Product>): Promise<void> {
		return new Promise((resolve, reject) => {
			const sql = `
        UPDATE products 
        SET name = ?, quantity = ?, price = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

			this.db.run(
				sql,
				[product.name, product.quantity, product.price, id],
				(err) => {
					if (err) reject(err);
					resolve();
				}
			);
		});
	}

	async delete(id: number): Promise<void> {
		return new Promise((resolve, reject) => {
			const sql = 'DELETE FROM products WHERE id = ?';

			this.db.run(sql, [id], (err) => {
				if (err) reject(err);
				resolve();
			});
		});
	}
}