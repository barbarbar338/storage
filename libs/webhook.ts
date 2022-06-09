import { Injectable } from "@nestjs/common";
import {
	MessagePayload,
	WebhookClient,
	WebhookMessageOptions,
} from "discord.js";
import CONFIG from "src/config";

@Injectable()
export class Webhook {
	private webhook = new WebhookClient({
		id: CONFIG.DISCORD.id,
		token: CONFIG.DISCORD.token,
	});

	public async send(
		options: string | MessagePayload | WebhookMessageOptions,
	) {
		return this.webhook.send(options).catch((err) => {
			console.error(`Disabled webhook, reason: ${err}`);
			this.webhook = null;
		});
	}

	public async canSend() {
		return !!this.webhook && !!this.webhook.token;
	}
}
