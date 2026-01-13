#!/bin/sh

docker build --platform linux/amd64 -t <GIT_LAB_REGISTRY_URL>/kts-modulbibliothek/sca-modulecatalogue:catalogue-latest .
docker push <GIT_LAB_REGISTRY_URL>/kts-modulbibliothek/sca-modulecatalogue:catalogue-latest