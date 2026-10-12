#!/bin/bash
# Installe le CLI HyperFrames et Chrome Headless Shell dans les sessions cloud.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

HYPERFRAMES_VERSION="0.8.150"

if [ "$(hyperframes --version 2>/dev/null)" != "$HYPERFRAMES_VERSION" ]; then
  npm install -g "hyperframes@$HYPERFRAMES_VERSION"
fi

hyperframes browser ensure
