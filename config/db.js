
import mysql from 'mysql';
import { promisify } from 'util';
import 'dotenv/config';

const dbHost = process.env.DB_HOST || process.env.db_host;
const dbPort = process.env.DB_PORT || process.env.db_port;
const dbUser = process.env.DB_USER || process.env.db_user;
const dbPassword = process.env.DB_PASSWORD || process.env.DB_PASS || process.env.db_password || process.env.db_pass;
const dbName = process.env.DB_NAME || process.env.db_name;

const keys = {
	host: dbHost,
	port: dbPort ? Number(dbPort) : undefined,
	user: dbUser,
	password: dbPassword,
	database: dbName,
	clearExpired: true,
	checkExpirationInterval: 900000,
	expiration: 86400000,
	createDatabaseTable: true,
	endConnectionOnClose: true,
	disableTouch: false,
	schema: {
		tableName: 'sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data'
		}
	}
};

const pool = mysql.createPool(keys);

pool.getConnection((err, conexion) => {
	err ? console.log(`Error de conexión: ${err.code}`) :
		conexion ? (console.log(`Conexión correcta a la base de datos, conexión id: [ ${conexion.threadId} ] `), conexion.release()) :
		console.log('Error desconocido al conectar a la base de datos');
    return;
});

pool.query = promisify(pool.query).bind(pool);
pool.getConnectionAsync = promisify(pool.getConnection).bind(pool);

export default pool;