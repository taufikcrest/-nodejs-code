require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    DB_URI: process.env.DB_URI,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiredIn: process.env.JWT_EXPIRED_IN
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        sender: process.env.SMTP_SENDER,
        secure: process.env.SMTP_SECURE
    },
    app: {
        url: process.env.APP_URL
    },
    klaviyo: {
        publicToken: process.env.KLAVIYO_PUBLIC_TOKEN,
        privateToken: process.env.KLAVIYO_PRIVATE_TOKEN,
    }
};