#!/bin/bash

docker run --rm -p 80:80 --name iOS-Dashboard -v "$PWD":/usr/local/apache2/htdocs httpd:2.4
