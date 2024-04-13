import {InMemory} from "../libs/inMemory";
import {TelegramClient} from "../libs/telegramClient";

export interface ServerOptions {
    port: number;
    memory: InMemory;
    telegramClient: TelegramClient
}