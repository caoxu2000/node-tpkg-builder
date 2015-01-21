#!/bin/bash

# get datacenter and nodegroup info
CONFIGRC=$(/home/t/bin/get_configrc)
. $CONFIGRC

if [ -z $CLUSTER ]; then
  ENV=$ENVIRONMENT
else
  ENV=$CLUSTER
fi

NODE_CMD=/home/t/bin/node
ENV_VARS="NODE_ENV=$ENV"
PROG_CMD="$ENV_VARS $NODE_CMD @@project.startScript >> @@directory.log/@@project.name.log 2>&1 &"
