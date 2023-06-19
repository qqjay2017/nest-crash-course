export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    database: process.env.DB_database,
    host: process.env.DB_host,
    port: parseInt(process.env.DB_port, 10) || 5432,
    username: process.env.DB_username,
    password: process.env.DB_password,

    // port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
