#!/bin/bash
# Render-compatible dependency installation
# Two-step process to avoid PEP517/Rust builds

pip install --no-use-pep517 --upgrade pip setuptools wheel
pip install --no-use-pep517 -r requirements-base.txt
pip install --no-use-pep517 -r requirements-ml.txt
