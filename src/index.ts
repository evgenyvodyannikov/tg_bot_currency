import dotenv from "dotenv";

import TelegramBot, { SendMessageOptions } from 'node-telegram-bot-api';

import { Currency } from "./types/Currency";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on('message', (msg) => {

    if (msg.text === '/start') {

        const opts: SendMessageOptions = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Get Euro Rate",
                            callback_data: Currency.EURO,
                        }
                    ],
                    [
                        {
                            text: "Get Dollar Rate",
                            callback_data: Currency.DOLLAR,
                        }
                    ]
                ]
            }
        }

        bot.sendMessage(msg.chat.id, `Hello, ${msg.from.first_name}!`, opts);

    } else {
        bot.sendMessage(msg.chat.id, `Sorry, ${msg.from.first_name}! I don't understand you((`);
    }
})

bot.on('callback_query', async (cb) => {

    const currency = cb.data as Currency;

    const data = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
    const response = await data.json();

    bot.sendMessage(cb.message.chat.id, `${currency} rate to RUB: ${response.rates.RUB}`);

})