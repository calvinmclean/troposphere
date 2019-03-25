#!/bin/bash

function echo_and_run() {
  echo "RUNNING COMMAND: $1"
  bash -c "$1"
}

git clone https://github.com/cyverse/troposphere.git /opt/dev/troposphere
cd /opt/dev/troposphere

apt-get update && apt-get install -y postgresql python-pip
pip install -U pip==9.0.3 setuptools
pip install pip-tools==1.11.0

# Wait for DB to be active
echo "Waiting for postgres..."
while ! nc -z postgres 5432; do sleep 5; done

psql -c "CREATE USER troposphere_db_user WITH PASSWORD 'troposphere_db_pass' CREATEDB;" -U postgres
psql -c "CREATE DATABASE troposphere_db WITH OWNER troposphere_db_user;" -U postgres

echo_and_run "pip install -r dev_requirements.txt"
echo_and_run "npm install"
echo_and_run "sed -i 's/DATABASE_HOST = localhost/DATABASE_HOST = postgres/' variables.ini.dist"
echo_and_run "cp ./variables.ini.dist ./variables.ini"
echo_and_run "./configure"
echo_and_run "./travis/check_properly_generated_requirements.sh"
echo_and_run "./manage.py makemigrations --dry-run --check"
echo_and_run "./manage.py test"
echo_and_run "npm run build"
echo_and_run "npm run lint"
echo_and_run "npm run format -- -l"
