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
    static #sending = false;

    static #pendingChannel: PendingToChannel[] = [];
    static #pendingUser: PendingToUser[] = [];

    static #tag = "[DISCORD]";
    static #log = (message: string) => console.log(`${this.#tag} ${message}`);
    static #error = (message: string) => console.error(`${this.#tag} ${message}`);
    static #fail(cause: string) {
        this.#error(cause);
        this.Send(`<@&${publicConfig.adminRoleId}> ${cause}`, "fallback");
    }

    static async PopChannelQueue(wait=true) {
        if (this.#pendingChannel.length === 0) return;
        if (wait) await new Promise((r) => setTimeout(r, 1000));

        const elm = this.#pendingChannel.pop();
        if (elm === undefined) return;

        this.Send(elm.message, elm.channel);
    }

    static async PopUserQueue(wait=true) {
        if (this.#pendingUser.length === 0) return;
        if (wait) await new Promise((r) => setTimeout(r, 1000));

        const elm = this.#pendingUser.pop();
        if (elm === undefined) return;

        this.Dm(elm.message, elm.user);
    }

    static Start() {
        const client = new Client({intents: [GatewayIntentBits.Guilds]});

        client.once(Events.ClientReady, (ready) => {
            this.#log(`Ready! Logged in as ${ready.user.tag}`);
            this.#client = client;

            this.PopChannelQueue(false);
            this.PopUserQueue(false);
        });

        client.once(Events.Error, (err) => {
            this.#error(`An error occurred : ${err.cause}`);
        })

        client.login(privateConfig.token);
    }

    static async Send(message: string, channelName: ChannelName) {
        if (this.#client === null) {
            this.#pendingChannel.push({ message, channel: channelName });
            this.Start();
            return;
        }

        if (this.#sending) {
            this.#pendingChannel.push({ message, channel: channelName });
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

        channel.send(message).then((x) => {
            this.#log(`Sent ${x} in ${channelName}`);
            this.#sending = false;

            this.PopChannelQueue();
            this.PopUserQueue();
        }).catch((err) => this.#error(err));
    }

    static async Dm(message: string, userId: string) {
        if (this.#client === null) {
            this.#pendingUser.push({ message, user: userId });
            this.Start();
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

            this.PopChannelQueue();
            this.PopUserQueue();
        });
    }
}