const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');
const bcrypt = require('bcrypt');

class UserModel {
    constructor() {
        this.db = mysql.createPool(dbConfig);
    }

    async getUserByEmail(email) {
        try {
            const [result] = await this.db.execute(`SELECT * FROM user WHERE email = ?`, [email]);
            return result[0] || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getUserByName(name) {
        try {
            const [result] = await this.db.execute(`SELECT * FROM user WHERE name = ?`, [name]);
            return result[0] || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createUser(
        name,
        email,
        password,
        phoneNumber,
        address,
        city,
        state,
        zipCode,
        country,
        role = 'user' // default role
    ) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await this.db.execute(`
            INSERT INTO user (
              name,
              email,
              password,
              phone_number,
              address,
              city,
              state,
              zip_code,
              country,
              role
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
                name,
                email,
                hashedPassword,
                phoneNumber,
                address,
                city,
                state,
                zipCode,
                country,
                role
            ]);
            return result.insertId;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = new UserModel();