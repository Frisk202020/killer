import { Channel, Client, Events, GatewayIntentBits, MessagePayload } from "discord.js";
import privateConfig from "../../discord-private.json"
import publicConfig from "../../discord-public.json"

type ChannelName = keyof typeof publicConfig.channels;

interface PendingToChannel {
    message: string,
    channel: keyof typeof publicConfig.channels,
    file?: File
}

interface PendingToUser {
    message: string,
    user: string
}

export default class Bot {
    static #client: Client|null = null;
    static #sending = false;

    static #pendingChannel: PendingToChannel[] = [];
    static #pendingUser: PendingToUser[] = [];

    static #tag = "[DISCORD]";
    static #log = (message: string) => console.log(`${this.#tag} ${message}`);
    static #error = (message: string) => console.error(`${this.#tag} ${message}`);
    static #fail(cause: string) {
        this.#error(cause);
        this.Send(`${this.PingRole("admin")} ${cause}`, "fallback");
    }

    static async #getPayloadWithAttach(content: string, file: File) {
        const data = await file.arrayBuffer();
        return {
            content,
            files: [Buffer.from(data)]
        };
    }

    static async #popChannelQueue(wait=true) {
        if (this.#pendingChannel.length === 0) return;
        if (wait) await new Promise((r) => setTimeout(r, 1000));

        const elm = this.#pendingChannel.pop();
        if (elm === undefined) return;

        this.Send(elm.message, elm.channel, elm.file);
    }

    static async #popUserQueue(wait=true) {
        if (this.#pendingUser.length === 0) return;
        if (wait) await new Promise((r) => setTimeout(r, 1000));

        const elm = this.#pendingUser.pop();
        if (elm === undefined) return;

        this.Dm(elm.message, elm.user);
    }

    static #start() {
        const client = new Client({intents: [GatewayIntentBits.Guilds]});

        client.once(Events.ClientReady, (ready) => {
            this.#log(`Ready! Logged in as ${ready.user.tag}`);
            this.#client = client;

            this.#popChannelQueue(false);
            this.#popUserQueue(false);
        });

        client.once(Events.Error, (err) => {
            this.#error(`An error occurred : ${err.cause}`);
        })

        client.login(privateConfig.token);
    }

    static PingUser = (userId: string) => `<@${userId}>`;
    static PingRole = (role: keyof typeof publicConfig.roles) => `<@&${publicConfig.roles[role]}>`

    static async Send(message: string, channelName: ChannelName, file?: File) {
        if (this.#client === null) {
            this.#pendingChannel.push({ message, channel: channelName, file });
            this.#start();
            return;
        }

        if (this.#sending) {
            this.#pendingChannel.push({ message, channel: channelName, file });
            return;
        }
        this.#sending = true;

        let channel: Channel | null | undefined  = this.#client.channels.cache.get(publicConfig.channels[channelName]);
        if (channel === undefined) {
            try {
                channel = await this.#client.channels.fetch(publicConfig.channels[channelName]);
            } catch(_) {
                this.#fail(`Failed to send message \`${message}\` in \`${channelName}\` : channel not found`);
                return;
            }

            if (channel === null) {
                this.#fail(`Failed to send message \`${message}\` in \`${channelName}\` : channel not found`);
                return;
            }
        }

        if (!channel.isTextBased() || !channel.isSendable()) {
            this.#fail(`Failed to send message '${message}' in ${channelName} : channel is not sendable or not text-based`);
            return;
        }

        const payload = file === undefined 
            ? message 
            : new MessagePayload(channel, await this.#getPayloadWithAttach(message, file));

        channel.send(payload).then((x) => {
            this.#log(`Sent ${x} in ${channelName}`);
            this.#sending = false;

            this.#popChannelQueue();
            this.#popUserQueue();
        }).catch((err) => this.#error(err));
    }

    static async Dm(message: string, userId: string) {
        if (this.#client === null) {
            this.#pendingUser.push({ message, user: userId });
            this.#start();
            return;
        }
        if (this.#sending) {
            this.#pendingUser.push({ message, user: userId });
            return;
        }

        let user = this.#client.users.cache.get(userId);
        if (user === undefined) {
            try {
                user = await this.#client.users.fetch(userId);
            } catch(_) {
                this.#fail(`Failed to send DM \`${message}\` to user \`${userId}\` : user not found`);
                return;
            }
        }

        user.send(message).then(() => {
            this.#log(`Sent ${message} to ${userId}`);
            this.#sending = false;

            this.#popChannelQueue();
            this.#popUserQueue();
        });
    }
}