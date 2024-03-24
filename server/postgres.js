import pg from "pg";
import 'dotenv/config'

// Correctly initialize the pool with configuration parameters
console.log(process.env.PG_PASSWORD,)
const pool = new pg.Pool({
    user: process.env["PG_USER"],
    host: process.env["PG_HOST"],
    database: process.env["PG_DATABASE"],
    password: '1234',
    port: process.env["PG_PORT"],
});





export { pool };