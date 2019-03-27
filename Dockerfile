# Docker Container for Troposphere
FROM ubuntu:14.04

# Set environment
SHELL ["/bin/bash", "-c"]

# Install dependencies with apt
RUN apt-get update && \
    apt-get install --no-install-recommends -y curl && \
    curl -skL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
      apt-transport-https \
      build-essential \
      git \
      g++ \
      libffi-dev \
      libldap2-dev \
      libpq-dev \
      libsasl2-dev \
      libssl-dev \
      libxml2-dev \
      libxslt1-dev \
      make \
      nginx \
      nodejs \
      openssl \
      python \
      python-dev \
      python-m2crypto \
      python-pip \
      python-psycopg2 \
      python-setuptools \
      python-tk \
      # python-virtualenv \
      ssh \
      sudo \
      swig \
      ufw \
      uwsgi \
      uwsgi-plugin-python \
      zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /root/.ssh

# Create PID and log directories for uWSGI
RUN mkdir -p /run/uwsgi/app/troposphere /var/log/uwsgi && \
    chown -R www-data:www-data /run/uwsgi/app/ /var/log/uwsgi && \
    touch /var/log/uwsgi/troposphere.log

# Clone repos and pip install requirements
RUN pip install --upgrade pip==9.0.3 virtualenv && \
    mkdir /opt/env && \
    virtualenv /opt/env/troposphere

COPY . /opt/dev/troposphere
WORKDIR /opt/dev/troposphere

# Setup uwsgi
RUN mkdir -p /etc/uwsgi/apps-available /etc/uwsgi/apps-enabled && \
    cp docker/uwsgi.ini /etc/uwsgi/apps-available/troposphere.ini && \
    ln -s /etc/uwsgi/apps-available/troposphere.ini /etc/uwsgi/apps-enabled/troposphere.ini

RUN source /opt/env/troposphere/bin/activate && pip install -r requirements.txt

# Cleanup
RUN apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* && \
    rm /etc/nginx/sites-enabled/default

# Setup NGINX
RUN openssl dhparam -out /etc/ssl/certs/dhparam.pem 1024 && \
    cp -r docker/nginx/ /etc/

RUN useradd user

# Prepare entrypoint
RUN cp docker/entrypoint.sh /root/entrypoint.sh && \
    chmod +x /root/entrypoint.sh && \
    echo "source /opt/env/troposphere/bin/activate" >> /root/.bashrc
ENTRYPOINT ["/root/entrypoint.sh"]
