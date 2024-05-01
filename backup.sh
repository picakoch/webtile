#!/bin/bash

current_date=$(date +'%m/%d/%Y')
DIR=${HOME}/backup/$(current_date)
mkdir -p $DIR
cd $DIR
docker exec -i strapi_db pg_dump -U strapi strapi > db_$(current_date).sql
gzip db_$(current_date).sql