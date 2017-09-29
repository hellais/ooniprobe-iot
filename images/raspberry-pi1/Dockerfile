FROM resin/raspberry-pi-python:2.7.12-slim

ENV DEBIAN_FRONTEND noninteractive
ENV INITSYSTEM on
ENV OONI_PROBE_INSTALL_URI https://github.com/TheTorProject/ooni-probe/releases/download/v2.3.0-rc.1/ooniprobe-2.3.0rc1.tar.gz

# Setup the locales in the Dockerfile
RUN set -x \
    && apt-get update \
    && apt-get install apt-utils -y --no-install-recommends \
    && apt-get install locales -y \
    && locale-gen en_US.UTF-8

# Install OONI Probe dependencies
RUN set -x \
    && apt-get install -y build-essential libdumbnet-dev libpcap-dev tor \
                          libgeoip-dev libffi-dev python-dev python-pip libssl-dev

RUN set -x \
    && mkdir -p /srv/ooni

RUN pip install -U setuptools
RUN pip install $OONI_PROBE_INSTALL_URI

EXPOSE 80
COPY ooniprobe.conf /etc/ooniprobe.conf

ENV DEBIAN_FRONTEND teletype
CMD ["ooniprobe-agent", "run"]
