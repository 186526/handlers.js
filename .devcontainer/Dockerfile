FROM debian:bullseye as tjs

RUN apt-get update -y && apt install cmake build-essential curl libcurl4-openssl-dev git -y

WORKDIR /

RUN git clone --recursive https://github.com/saghul/txiki.js --shallow-submodules && cd txiki.js && \
    make

FROM denoland/deno:bin AS deno

FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:16-bullseye

COPY --from=deno /deno /usr/local/bin/deno
COPY --from=tjs /txiki.js/build/tjs /usr/local/bin/tjs

RUN su node -c "npm install -g esbuild webpack jest ts-node"

ARG EXTRA_NODE_VERSION=14
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"
