import { Channel, Client, Events, GatewayIntentBits } from "discord.js";
import privateConfig from "../../discord-private.json"
import publicConfig from "../../discord-public.json"

export type ChannelName = keyof typeof publicConfig.channels;
export function bot_sends(message: string, channel: ChannelName) {
    Bot.Send(message, channel);
}

export function bot_dms(message: string, userId: string) {
    Bot.Dm(message, userId);
}

interface PendingToChannel {
    message: string,
    channel: keyof typeof publicConfig.channels
}

interface PendingToUser {
    message: string,
    user: string
}

class Bot {
    static #client: Client|null = null;
    static #pendingChannel: PendingToChannel|null = null;
    static #pendingUser: PendingToUser|null = null;

    static #tag = "[DISCORD]";
    static #log = (message: string) => console.log(`${this.#tag} ${message}`);
    static #error = (message: string) => console.error(`${this.#tag} ${message}`);

    static Start() {
        const client = new Client({intents: [GatewayIntentBits.Guilds]});

        client.once(Events.ClientReady, (ready) => {
            this.#log(`Ready! Logged in as ${ready.user.tag}`);
            this.#client = client;

            if (this.#pendingChannel !== null) {
                const args = this.#pendingChannel;
                this.#pendingChannel = null;
                this.Send(args.message, args.channel);
            }

            if (this.#pendingUser !== null) {
                const args = this.#pendingUser;
                this.#pendingUser = null;
                this.Dm(args.message, args.user);
            }
        });

        client.once(Events.Error, (err) => {
            this.#error(`An error occurred : ${err.cause}`);
        })

        client.login(privateConfig.token);
    }

    static async Send(message: string, channelName: ChannelName) {
        if (this.#client === null) {
            this.#pendingChannel = { message, channel: channelName };
            this.Start();
            return;
        }

        let channel: Channel | null | undefined  = this.#client.channels.cache.get(publicConfig.channels[channelName]);
        if (channel === undefined) {
            channel = await this.#client.channels.fetch(publicConfig.channels[channelName]);
            if (channel === null) {
                this.#error(`Channel not found : ${channelName} (${publicConfig.channels[channelName]})`);
                return;
            }
        }

        if (!channel.isTextBased() || !channel.isSendable()) {
            this.#error(`Can't send a message in the specified channel (${channel.name})`);
            return;
        }

        channel.send(message).then((x) => this.#log(`Sent ${x} in ${channelName}`)).catch((err) => this.#error(err));
    }

    static async Dm(message: string, userId: string) {
        if (this.#client === null) {
            this.#pendingUser = { message, user: userId };
            this.Start();
            return;
        }

        let user = this.#client.users.cache.get(userId);
        if (user === undefined) {
            user = await this.#client.users.fetch(userId);
        }

        user.send(message);
        this.#log(`Sent ${message} to ${userId}`);
    }
}