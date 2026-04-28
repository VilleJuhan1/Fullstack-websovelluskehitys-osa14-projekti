#!/bin/bash
set -e

# Just a script to remove the Bastion session tunnels
echo "Removing Bastion sessions"
kill $(cat bastion_pids.txt)
echo "Removing bastion session PIDs from local host"
rm bastion_pids.txt
echo "Done!"