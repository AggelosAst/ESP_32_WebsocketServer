import {WebSocketServer} from "ws";
import {InMemory} from "../libs/inMemory";
import {TelegramClient} from "../libs/telegramClient";

export interface WebsocketOptions {
    ws: WebSocketServer,
    memory: InMemory,
    telegramClient: TelegramClient
}