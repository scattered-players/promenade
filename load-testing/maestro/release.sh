#!/bin/bash -ex

cat Dockerfile | time docker build -t shattered/maestro:x86 -f- . && \
docker push shattered/maestro:x86

# cat Dockerfile.arm64 | time docker build -t shattered/maestro:arm64 -f- . && \
# docker push shattered/maestro:arm64

docker system prune -f

sleep 1

aws ec2 reboot-instances --instance-ids $(aws ec2 describe-instances --query 'Reservations[].Instances[].InstanceId' --filters "Name=tag:shattered,Values=maestro" --output text)