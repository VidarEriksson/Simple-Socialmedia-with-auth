const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

class PostModel {
    constructor() {
        this.db = mysql.createPool(dbConfig);
    }

    async getAllPosts() {
        try {
            const [result] = await this.db.execute(`
        SELECT * FROM posts
        WHERE is_deleted = 0
        ORDER BY created_at DESC
      `);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createPost(userId, title, postText) {
        try {
            const [result] = await this.db.execute(`
        INSERT INTO posts (user_id, title, post_text, created_at, updated_at, is_deleted)
        VALUES (?, ?, ?, NOW(), NOW(), 0)
      `, [userId, title, postText]);
            return result.insertId;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updatePost(id, title, postText) {
        try {
            await this.db.execute(`
        UPDATE posts
        SET title = ?, post_text = ?, updated_at = NOW()
        WHERE id = ?
      `, [title, postText, id]);
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deletePost(id) {
        try {
            await this.db.execute(`
        UPDATE posts
        SET is_deleted = 1
        WHERE id = ?
      `, [id]);
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getPostById(id) {
        try {
            const [result] = await this.db.execute(`
        SELECT * FROM posts
        WHERE is_deleted = 0
        AND id = ?
      `, [id]);
            return result[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = new PostModel();