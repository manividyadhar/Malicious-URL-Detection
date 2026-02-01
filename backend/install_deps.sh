#!/usr/bin/env bash
set -e

# Step 1: Upgrade pip normally
pip install --upgrade pip

# Step 2: Install build tools FIRST (no flags)
pip install setuptools wheel

# Step 3: Install base dependencies (disable PEP517)
pip install --no-use-pep517 -r requirements-base.txt

# Step 4: Install ML dependencies (disable PEP517)
pip install --no-use-pep517 -r requirements-ml.txt
