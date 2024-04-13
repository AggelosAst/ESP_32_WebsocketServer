import {WebsocketOptions} from "../types/websocketOptions";
import WebSocket, {WebSocketServer} from "ws";
import {payloadData} from "../types/payloadData";
import {InMemory} from "./inMemory";

export class WebsocketServer {
    private readonly wsServer: WebSocketServer
    private readonly inMemoryDB: InMemory
    public static Instance : WebsocketServer
    private temperature: number = 0;
    private humidity: number = 0;

    public constructor(options: WebsocketOptions) {
        this.wsServer = options.ws
        this.inMemoryDB = options.memory;
        WebsocketServer.Instance = this;
    }

    public changeUpdateRate(value: number) {
        for (const Client of this.wsServer.clients) {
            Client.send(JSON.stringify({
                type: "CHANGE_RATE",
                data: value
            }))
        }
    }
    public getTempAndHum(): {temperature: number, humidity: number} {
        return {
            temperature: this.temperature,
            humidity: this.humidity
        }
    }

    public async listen() {
        this.wsServer.on("connection", (socket: WebSocket, request) => {
            socket.on("message", (data: WebSocket.RawData, isBinary: boolean) => {
                let payload!: payloadData
                try {
                    payload = JSON.parse(data.toString())
                } catch (e) {
                    socket.send(JSON.stringify({
                        error: "Inappropriate json."
                    }))
                }
                switch (payload.type) {
                    case "SEND_DATA":
                        console.log(`[R]: ${payload.type}`);
                        console.log(payload);
                        if (payload.temperature && payload.humidity) { //We know the payload is {temp,hum}
                            this.humidity = payload.humidity;
                            this.temperature = payload.temperature;
                        }
                        // if (payload.temperature) {  //We know the payload is {temp}
                        //     this.temperature = payload.temperature;
                        // }
                         for (const Client of this.wsServer.clients) {
                            Client.send(JSON.stringify({
                                type: "RECEIVE_DATA",
                                data: {
                                    temperature: this.temperature,
                                    humidity: this.humidity
                                }
                            }))
                        }
                        break;
                    case "HELLO":
                        break;
                    case "PING":
                        socket.send(JSON.stringify({
                            type: "PONG"
                        }))
                        break;
                }
            })
        })
    }
}