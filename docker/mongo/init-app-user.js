// Se ejecuta una sola vez, cuando el volumen de MongoDB está vacío (primer arranque).
// Crea el usuario de la aplicación con permisos solo sobre su base de datos;
// el backend nunca usa el usuario root.
const dbName = process.env.MONGO_DB
const user = process.env.MONGO_APP_USER
const password = process.env.MONGO_APP_PASSWORD

if (!dbName || !user || !password) {
  throw new Error('Faltan MONGO_DB, MONGO_APP_USER o MONGO_APP_PASSWORD')
}

db.getSiblingDB(dbName).createUser({
  user,
  pwd: password,
  roles: [{ role: 'readWrite', db: dbName }],
})

print(`Usuario ${user} creado en la base ${dbName}`)
