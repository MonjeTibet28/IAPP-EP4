import mysql from 'promise-mysql'
import config from '../config'

const conecction = mysql.createConnection({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    port: config.port
})

const getConnection= () => {
    return conecction
}

module.exports = {
    getConnection
}