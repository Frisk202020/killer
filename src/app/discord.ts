import { Channel, Client, Events, GatewayIntentBits } from "discord.js";
import config from "../../discord.json"

export function bot_sends(message: string) {
    Bot.Send(message);
}

class Bot {
    static #client: Client|null = null;
    static #pending: string|null = null;

    static #tag = "[DISCORD]";
    static #log = (message: string) => console.log(`${this.#tag} ${message}`);
    static #error = (message: string) => console.error(`${this.#tag} ${message}`);

    static Start() {
        const client = new Client({intents: [GatewayIntentBits.Guilds]});

        client.once(Events.ClientReady, (ready) => {
            this.#log(`Ready! Logged in as ${ready.user.tag}`);
            this.#client = client;

            if (this.#pending !== null) {
                const message = this.#pending;
                this.#pending = null;
                this.Send(message);
            }
        });

        client.once(Events.Error, (err) => {
            this.#pending = null;
            this.#error(`An error occurred : ${err.cause}`);
        })


        client.login(config.token);
    }

    static async Send(message: string) {
        if (this.#client === null) {
            this.#pending = message;
            this.Start();
            return;
        }

        let channel: Channel | null | undefined  = this.#client.channels.cache.get(config.channels.debug);
        if (channel === undefined) {
            channel = await this.#client.channels.fetch(config.channels.debug);
            if (channel === null) {
                this.#error(`Channel not found : ${config.channels.debug}`);
                return;
            }
        }

        if (!channel.isTextBased() || !channel.isSendable()) {
            this.#error(`Can't send a message in the specified channel (${channel.name})`);
            return;
        }

        channel.send(message).then((x) => this.#log(`Sent ${x}`)).catch((err) => this.#error(err));
    }
}