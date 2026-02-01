#!/usr/bin/env bash
set -e

echo "Upgrading pip tools..."
pip install --upgrade pip setuptools wheel

echo "Installing base dependencies..."
pip install -r requirements-base.txt

echo "Installing ML dependencies..."
pip install -r requirements-ml.txt
