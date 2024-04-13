import {in_memory} from "../types/in_memory";

export class InMemory {
    private readonly memory: in_memory[] = [];

    public async saveData(id: string):Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.memory.length < 1) {
                try {
                    this.memory.push({
                        id: id
                    })
                } catch (e: any) {
                    return reject()
                }
                resolve()
            } else {
                this.memory.at(0)!.id = id
                resolve()
            }
        })
    }

    public getData(): in_memory | undefined {
        if (this.memory.length < 1) {
            return undefined
        } else {
            return this.memory.at(0)
        }
    }
}