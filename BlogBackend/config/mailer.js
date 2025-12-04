import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn(
        'WARNING: Email credentials (EMAIL_USER or EMAIL_PASS) are missing in .env. Email features will not work.'
    );
}

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

    tls: {
        // Do not fail on invalid certs (common in Docker containers)
        rejectUnauthorized: false,
        // Sometimes forcing a specific cipher helps
        ciphers: 'SSLv3',
    },
});
