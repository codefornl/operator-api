#!/bin/bash

sed -i "s^__NODE_ENV__^$NODE_ENV^g" /operator-api/config/config.json
sed -i "s^__DATABASE_HOST__^$DATABASE_HOST^g" /operator-api/config/config.json
sed -i "s^__DATABASE_NAME__^$DATABASE_NAME^g" /operator-api/config/config.json
sed -i "s^__DATABASE_USER__^$DATABASE_USER^g" /operator-api/config/config.json
sed -i "s^__DATABASE_PASSWORD__^$DATABASE_PASSWORD^g" /operator-api/config/config.json
sed -i "s^__DATABASE_PORT__^$DATABASE_PORT^g" /operator-api/config/config.json

cd /operator-api
npm start