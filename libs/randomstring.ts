import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

@Injectable()
export class RandomString {
    public generate(length?: number): string {
        const now = Date.now().toString(32);
        length = length ? (length > 9 ? length - 9 : 1) : 1;
        const randomBytes = crypto.randomBytes(length).toString("hex");
        const output = now + randomBytes;
        return output;
    }
    public parse(random: string): Date {
        const dateStr = random.slice(0, 9);
        return new Date(parseInt(dateStr, 32));
    }
}
