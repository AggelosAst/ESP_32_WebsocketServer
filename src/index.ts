import {Server} from "./libs/server";
import {InMemory} from "./libs/inMemory";
import {TelegramClient} from "./libs/telegramClient";

const telegramClient: TelegramClient = new TelegramClient()

const memoryInstance: InMemory = new InMemory();

const serverInstance: Server = new Server({
    port: 4040,
    memory: memoryInstance,
    telegramClient: telegramClient
});

serverInstance.listen().then(r=> {
    console.log(r)
})

