import { Injectable } from "@nestjs/common";

@Injectable()
export class Snowflake {
    private EPOCH = 1581368400000;
    private INCREMENT = 0;
    private binaryToID(binary: string): string {
        let dec = "";
        while (binary.length > 50) {
            const high = parseInt(binary.slice(0, -32), 2);
            const low = parseInt(
                (high % 10).toString(2) + binary.slice(-32),
                2,
            );
            dec = (low % 10).toString() + dec;
            binary =
                Math.floor(high / 10).toString(2) +
                Math.floor(low / 10)
                    .toString(2)
                    .padStart(32, "0");
        }
        let parsed = parseInt(binary, 2);
        while (parsed > 0) {
            dec = (parsed % 10).toString() + dec;
            parsed = Math.floor(parsed / 10);
        }
        return dec;
    }
    private idToBinary(id: string): string {
        let bin = "";
        let high = parseInt(id.slice(0, -10)) || 0;
        let low = parseInt(id.slice(-10));
        while (low > 0 || high > 0) {
            bin = String(low & 1) + bin;
            low = Math.floor(low / 2);
            if (high > 0) {
                low += 5000000000 * (high % 2);
                high = Math.floor(high / 2);
            }
        }
        return bin;
    }
    public generate(): string {
        const timestamp = Date.now();
        if (this.INCREMENT >= 4095) this.INCREMENT = 0;
        const BINARY = `${(timestamp - this.EPOCH)
            .toString(2)
            .padStart(42, "0")}0000100000${(this.INCREMENT++)
            .toString(2)
            .padStart(12, "0")}`;
        return this.binaryToID(BINARY);
    }
    public deconstruct(
        snowflake: string,
    ): {
        timestamp: number;
        workerID: number;
        processID: number;
        increment: number;
        binary: string;
    } {
        const BINARY = this.idToBinary(snowflake).padStart(64, "0");
        const timestamp = parseInt(BINARY.substring(0, 42), 2) + this.EPOCH;
        const res = {
            timestamp,
            workerID: parseInt(BINARY.substring(42, 47), 2),
            processID: parseInt(BINARY.substring(47, 52), 2),
            increment: parseInt(BINARY.substring(52, 64), 2),
            binary: BINARY,
        };
        return res;
    }
    public isSnowflake(snowflake: string): boolean {
        const deconstructed = this.deconstruct(snowflake);
        const timestamp = deconstructed.timestamp;
        if (timestamp > this.EPOCH && timestamp <= 3619093655551) return true;
        return false;
    }
}
