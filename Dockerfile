FROM python:3.9-slim

ARG DEBIAN_FRONTEND=noninteractive

RUN set -e; \
    apt-get update -y && apt-get install -y \
    apt-transport-https \
    apt-utils \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    && apt-get clean

RUN set -e; \
    apt-get update -y && apt-get install -y \
    build-essential \
    libgdal-dev \
    libpq-dev \
    memcached \
    postgis \
    python3-dev \
    python3-pylibmc \
    zip \
    && apt-get clean

RUN set -e; \
    echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg && \
    apt-get update -y && apt-get install -y \
    google-cloud-cli \
    && apt-get clean

RUN set -e; \
    curl -o /usr/local/bin/cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.7.1/cloud-sql-proxy.linux.amd64 && \
    chmod +x /usr/local/bin/cloud-sql-proxy

WORKDIR /app

COPY club/requirements ./requirements
RUN pip install --upgrade --no-cache-dir -r requirements/prod.txt

COPY club .

ENV PORT 8000
ENV DJANGO_WORKERS 1
ENV DJANGO_THREADS 8
CMD exec gunicorn --bind 0.0.0.0:$PORT --workers $DJANGO_WORKERS --threads $DJANGO_THREADS --timeout 0 conf.wsgi:application
