const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'sciqus_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
    console.log('Database connected successfully');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

/**
 * Execute a SQL file
 * @param {string} filePath - Path to the SQL file
 * @returns {Promise<void>}
 */
const executeSQLFile = async (filePath) => {
    const client = await pool.connect();
    try {
        const sql = fs.readFileSync(filePath, 'utf8');
        await client.query(sql);
        console.log(`SQL file executed successfully: ${path.basename(filePath)}`);
    } catch (error) {
        console.error(`Error executing SQL file ${filePath}:`, error.message);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Initialize database schema and procedures
 * @returns {Promise<void>}
 */
const initializeDatabase = async () => {
    try {
        console.log('Initializing database...');
        
        // Execute schema
        await executeSQLFile(path.join(__dirname, '../sql/schema.sql'));
        
        // Execute procedures
        await executeSQLFile(path.join(__dirname, '../sql/procedures.sql'));
        
        // Execute seed data (optional - only in development)
        if (process.env.NODE_ENV !== 'production') {
            await executeSQLFile(path.join(__dirname, '../sql/seed.sql'));
        }
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error.message);
        throw error;
    }
};

/**
 * Execute a raw SQL query
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} - Query result
 */
const query = async (text, params) => {
    const start = Date.now();
    const client = await pool.connect();
    
    try {
        const res = await client.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Query error:', error.message);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Get a client from the pool for transaction management
 * @returns {Promise<Object>} - Database client
 */
const getClient = async () => {
    return await pool.connect();
};

module.exports = {
    pool,
    query,
    getClient,
    executeSQLFile,
    initializeDatabase,
};
