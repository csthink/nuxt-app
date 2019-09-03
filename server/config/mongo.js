const HOST = '127.0.0.1'
const PORT = 27017
const USERNAME = 'root'
const PASSWORD = '123456'
const DBNAME = 'nuxt-app'
const URI = `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`
const OPTIONS = { useNewUrlParser: true, dbName: DBNAME }

export default {
  URI,
  OPTIONS
}
