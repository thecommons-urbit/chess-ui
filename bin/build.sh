#!/bin/bash
# ==============================================================================
#
# build - Build the chess app frontend
#
# ==============================================================================

# Stop on error
set -e

# --------------------------------------
# Functions
# --------------------------------------

#
# Print script usage
#
usage() {
  if [[ $1 -ne 0 ]]; then
    exec 1>&2
  fi

  echo -e ""
  echo -e "Usage:\t$SCRIPT_NAME [-h] [-l] [-n]"
  echo -e ""
  echo -e "Build the app frontend and the desk files required to install it in Grid"
  echo -e ""
  echo -e "Options:"
  echo -e "  -h\tPrint script usage info"
  echo -e "  -l\tFix formatting errors raised by eslint"
  echo -e "  -n\tUse npm natively instead of through Docker"
  echo -e ""
  exit $1
}

# --------------------------------------
# Variables
# --------------------------------------

SCRIPT_NAME=$(basename $0 | cut -d '.' -f 1)
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)

ROOT_DIR=$(dirname $SCRIPT_DIR)
BUILD_DIR="$ROOT_DIR/build"

DOCKER_IMAGE="urbit-chess"

VERSION="latest"

USE_DOCKER=1
LINT_FIX=0


# --------------------------------------
# MAIN
# --------------------------------------

# Parse arguments
OPTS=":hnl:"
while getopts ${OPTS} opt; do
  case ${opt} in
    h)
      usage 0
      ;;
    n)
      USE_DOCKER=0
      ;;
    l)
      LINT_FIX=1
      ;;
    :)
      echo "$SCRIPT_NAME: Missing argument for '-${OPTARG}'" >&2
      usage 2
      ;;
    ?)
      echo "$SCRIPT_NAME: Invalid option '-${OPTARG}'" >&2
      usage 2
      ;;
  esac
done

if [ $USE_DOCKER -eq 1 ] && [ $LINT_FIX -eq 1 ]; then
  echo "$SCRIPT_NAME: eslint not available in Docker build; build aborted"
  exit 1
fi

# Clean up dirs before running
rm -rf $BUILD_DIR

# Build frontend
if [ $USE_DOCKER -eq 1 ]; then
  # If you are on macOS, you need to use the legacy builder ( DOCKER_BUILDKIT=0 )
  # This is due to the following issue:
  #   https://github.com/moby/buildkit/issues/1271
  # sudo DOCKER_BUILDKIT=0 docker build --tag ${DOCKER_IMAGE}:${VERSION} ${ROOT_DIR}
  sudo docker build --tag ${DOCKER_IMAGE}:${VERSION} ${ROOT_DIR}
  sudo docker run --rm -v ${BUILD_DIR}:/app/output/ ${DOCKER_IMAGE}:${VERSION}

  # Copy additional src files for frontend
  sudo chown -R ${USER}:${USER} ${BUILD_DIR}
elif [ $LINT_FIX -eq 0 ]; then
  # Run linter, refuse to build if there are errors
  (cd "$ROOT_DIR/src"; npm run lint; npm run build)
else
  # Run linter, fix errors, then build
  (cd "$ROOT_DIR/src"; npm run lint -- --fix; npm run build)
fi
