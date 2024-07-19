declare namespace Deno {
    export const version: {
        /** Deno's version. For example: `"1.0.0"` */
        deno: string;
        /** The V8 version used by Deno. For example: `"8.0.0.0"` */
        v8: string;
        /** The TypeScript version used by Deno. For example: `"4.0.0"` */
        typescript: string;
    };

    export interface NetAddr {
        transport: 'tcp' | 'udp';
        hostname: string;
        port: number;
    }

    export type Addr = NetAddr;

    export interface Closer {
        close(): void;
    }

    export interface Reader {
        /** Reads up to `p.byteLength` bytes into `p`. It resolves to the number of
         * bytes read (`0` < `n` <= `p.byteLength`) and rejects if any error
         * encountered. Even if `read()` resolves to `n` < `p.byteLength`, it may
         * use all of `p` as scratch space during the call. If some data is
         * available but not `p.byteLength` bytes, `read()` conventionally resolves
         * to what is available instead of waiting for more.
         *
         * When `read()` encounters end-of-file condition, it resolves to EOF
         * (`null`).
         *
         * When `read()` encounters an error, it rejects with an error.
         *
         * Callers should always process the `n` > `0` bytes returned before
         * considering the EOF (`null`). Doing so correctly handles I/O errors that
         * happen after reading some bytes and also both of the allowed EOF
         * behaviors.
         *
         * Implementations should not retain a reference to `p`.
         *
         * Use `itereateReader` from from https://deno.land/std/streams/conversion.ts to
         * turn a Reader into an AsyncIterator.
         */
        read(p: Uint8Array): Promise<number | null>;
    }

    export interface Writer {
        /** Writes `p.byteLength` bytes from `p` to the underlying data stream. It
         * resolves to the number of bytes written from `p` (`0` <= `n` <=
         * `p.byteLength`) or reject with the error encountered that caused the
         * write to stop early. `write()` must reject with a non-null error if
         * would resolve to `n` < `p.byteLength`. `write()` must not modify the
         * slice data, even temporarily.
         *
         * Implementations should not retain a reference to `p`.
         */
        write(p: Uint8Array): Promise<number>;
    }

    export interface Conn extends Reader, Writer, Closer {
        /** The local address of the connection. */
        readonly localAddr: Addr;
        /** The remote address of the connection. */
        readonly remoteAddr: Addr;
        /** The resource ID of the connection. */
        readonly rid: number;
        /** Shuts down (`shutdown(2)`) the write side of the connection. Most
         * callers should just use `close()`. */
        closeWrite(): Promise<void>;

        readonly readable: ReadableStream<Uint8Array>;
        readonly writable: WritableStream<Uint8Array>;
    }

    /** A generic network listener for stream-oriented protocols. */
    export interface Listener extends AsyncIterable<Conn> {
        /** Waits for and resolves to the next connection to the `Listener`. */
        accept(): Promise<Conn>;
        /** Close closes the listener. Any pending accept promises will be rejected
         * with errors. */
        close(): void;
        /** Return the address of the `Listener`. */
        readonly addr: Addr;

        /** Return the rid of the `Listener`. */
        readonly rid: number;

        [Symbol.asyncIterator](): AsyncIterableIterator<Conn>;
    }

    export interface ListenOptions {
        port: number;
    }

    export function listen(
        options: ListenOptions & { transport?: 'tcp' },
    ): Listener;

    export function serveHttp(conn: Conn): HttpConn;

    export interface HttpConn extends AsyncIterable<FetchEvent> {
        readonly rid: number;

        nextRequest(): Promise<FetchEvent | null>;
        close(): void;
    }
}
