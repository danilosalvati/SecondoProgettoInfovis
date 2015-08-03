#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd /
cd $DIR
python -mwebbrowser http://localhost:8000
echo "checkout your browser at localhost:8000"
python -m SimpleHTTPServer 8000