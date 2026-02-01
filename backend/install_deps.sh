#!/usr/bin/env bash
set -e

pip install --upgrade pip setuptools wheel

pip install -r requirements-base.txt
pip install -r requirements-ml.txt
