
import { config } from "dotenv";

config()


export default {
    host: process.env.HOST || '',
    database: process.env.DATABASE || '',
    user: process.env.user || '',
    password: process.env.PASSWORD || '',
    port: process.env.PORT || '',
    jwt_key: process.env.JWT_SECRET || ''
}