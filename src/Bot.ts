import Bot from 'node-telegram-bot-api'

export const bot = new Bot(process.env.token, {
    polling: true
})