import { type Bytes } from "./line.js";
export declare class JSONLDecoder<T> {
    private iterator;
    private response?;
    controller: AbortController;
    constructor(iterator: AsyncIterableIterator<Bytes> | undefined, controller: AbortController, response?: Response | undefined);
    private decoder;
    [Symbol.asyncIterator](): AsyncIterator<T>;
    static fromResponse<T>(response: Response, controller: AbortController): JSONLDecoder<T>;
}
//# sourceMappingURL=jsonl.d.ts.map