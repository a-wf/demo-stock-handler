#!/bin/bash

openssl req -nodes -new -x509 -keyout $1/server.key -out $1/server.cert
