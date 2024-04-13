import TelegramBot, {} from "node-telegram-bot-api"
import {chatMetadata} from "../types/chatMetadata";
import {WebsocketServer} from "./websocket";

export class TelegramClient {
    private readonly telegramBot : TelegramBot
   public constructor() {
        this.telegramBot = new TelegramBot("", {
            polling: true,
            filepath: false
        })
       this.telegramBot.setMyCommands([{
           command: "set_cycle",
           description: "Lets you set the time in ms for the sensor to log values. Cant be lower than 600 m/s and higher than 6000 m/s"
       }, {
           command: "show_data",
           description: "Shows you information about the current temp/hum"
       }]).then(r => console.log(`[TELEGRAM]: SET UP set_cycle, show_data `))
        this.telegramBot.on("message", async (message: TelegramBot.Message, metadata: TelegramBot.Metadata) => {
            switch (metadata.type) {
                case "text" : {
                    const chatMetadata: chatMetadata = {
                        chatId: message.chat.id,
                        recipient: message.chat.username,
                        recipient_first_name: message.chat.first_name,
                        messageId: message.message_id,
                        content: message.text
                    }
                   await this.onMessage(chatMetadata);
                }
            }
        })
    }
    private async onMessage(chatMetadata: chatMetadata): Promise<any> {
        if (chatMetadata.content?.toLowerCase().startsWith("/show_data")) {
            await this.telegramBot.sendChatAction(chatMetadata.chatId, "typing");
            await this.telegramBot.sendMessage(chatMetadata.chatId, "Choose what you would like to see.", {
                reply_markup: {
                    one_time_keyboard: true,
                    resize_keyboard: false,
                    keyboard: [[
                        {
                            text: "Temperature",
                        },
                        {
                            text: "Humidity",
                        }
                    ]]
                }
            })
        }
        if (chatMetadata.content?.toLowerCase().startsWith("/set_cycle")) {
            await this.telegramBot.sendChatAction(chatMetadata.chatId, "typing");
            await this.telegramBot.sendMessage(chatMetadata.chatId, "Choose cycle timing (m/s)", {
                reply_markup: {
                    one_time_keyboard: true,
                    resize_keyboard: false,
                    keyboard: [[
                        {
                            text: "600 m/s",
                        },
                        {
                            text: "1000 m/s",
                        },
                        {
                            text: "2000 m/s",
                        },
                        {
                            text: "4000 m/s",
                        },
                        {
                            text: "5000 m/s",
                        },
                    ]]
                }
            })
        } else if (chatMetadata.content?.toLowerCase().startsWith("temperature")) {
            const {humidity, temperature}: {
                humidity: number;
                temperature: number
            } = WebsocketServer.Instance.getTempAndHum()
            return this.telegramBot.sendMessage(chatMetadata.chatId, `${temperature}°C`)
        } else if (chatMetadata.content?.toLowerCase().startsWith("humidity")) {
            const {humidity, temperature}: {
                humidity: number;
                temperature: number
            } = WebsocketServer.Instance.getTempAndHum()
            return this.telegramBot.sendMessage(chatMetadata.chatId, `${humidity}% rh`)
        } else if (chatMetadata.content?.toLowerCase().startsWith("5000")) {
            console.log("5k")
            WebsocketServer.Instance.changeUpdateRate(5000);
            await this.telegramBot.sendMessage(chatMetadata.chatId, "Success!")
        } else if (chatMetadata.content?.toLowerCase().startsWith("4000")) {
            console.log("4k")
            WebsocketServer.Instance.changeUpdateRate(4000);
            await this.telegramBot.sendMessage(chatMetadata.chatId, "Success!")
        } else if (chatMetadata.content?.toLowerCase().startsWith("2000")) {
            console.log("2k")
            WebsocketServer.Instance.changeUpdateRate(2000);
            await this.telegramBot.sendMessage(chatMetadata.chatId, "Success!")
        } else if (chatMetadata.content?.toLowerCase().startsWith("1000")) {
            console.log("1k")
            WebsocketServer.Instance.changeUpdateRate(1000);
            await this.telegramBot.sendMessage(chatMetadata.chatId, "Success!")
        } else if (chatMetadata.content?.toLowerCase().startsWith("600")) {
            console.log("600")
            WebsocketServer.Instance.changeUpdateRate(600);
            await this.telegramBot.sendMessage(chatMetadata.chatId, "Success!")
        }
    }
}