// Variables mínimas para que config/env.ts valide sin un archivo .env
process.env.NODE_ENV = 'test'
process.env.FRONTEND_URL = 'http://localhost:5173'
process.env.DATABASE_URL = 'mongodb://localhost:27017/test'
process.env.JWT_SECRET = 'secreto-de-pruebas-con-al-menos-32-caracteres'
process.env.MQTT_URL = 'mqtt://localhost:1883'
process.env.SMTP_HOST = 'localhost'
process.env.SMTP_PORT = '1025'
process.env.MAIL_FROM = 'Pruebas <test@example.com>'
