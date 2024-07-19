type Transport = 'tcp' | 'udp' | 'pipe';

interface ListenOptions {
    backlog?: number;
    // Disables dual stack mode.
    ipv6Only?: boolean;
    // Used on UDP only. Enable address reusing (when binding). What that means is that multiple threads or processes can bind to the same address without error (provided they all set the flag) but only the last one to bind will receive any traffic, in effect "stealing" the port from the previous listener.
    reuseAddr?: boolean;
}

declare namespace tjs {
    const versions: {
        curl: string;
        quickjs: string;
        tjs: string;
        uv: string;
        wasm3: string;
    };

    export interface Address {
        readonly family: number;
        readonly flowinfo?: number;
        readonly ip: string;
        readonly port: number;
        readonly scopeId?: number;
    }

    export interface Connection {
        readonly localAddress: Address;
        readonly readable: ReadableStream<Uint8Array>;

        readonly remoteAddress: Address;
        readonly writeable: WritableStream<Uint8Array>;

        close(): void;
        read(buf: Uint8Array): Promise<number>;
        write(buf: Uint8Array): Promise<number>;

        setKeepAlive(enable?: boolean): void;
        setNoDelay(enable?: boolean): void;
        shutdown(): void;
    }

    export interface Listener extends AsyncIterable<Connection> {
        readonly localAddress: Address;

        accept(): Promise<Connection>;
        close(): void;

        [Symbol.asyncIterator](): AsyncIterableIterator<Connection>;
    }

    export function listen(
        transport: Transport,
        host: string,
        port?: string | number,
        options?: ListenOptions,
    ): Promise<Listener>;
}
