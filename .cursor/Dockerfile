FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
    && rm -rf /var/lib/apt/lists/*

# Ubuntu 24.04 ships a non-root `ubuntu` user (uid 1000); run tooling as that user.
USER ubuntu
WORKDIR /home/ubuntu

# Volta manages Node/npm. Pin the PATH so shims resolve in install/start/terminals.
ENV VOLTA_HOME=/home/ubuntu/.volta
ENV PATH=$VOLTA_HOME/bin:$PATH

RUN curl -fsSL https://get.volta.sh | bash -s -- --skip-setup \
    && volta install node@22
