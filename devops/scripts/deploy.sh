#!/bin/bash
echo "Starting deployment..."
kubectl apply -f ../kubernetes/
echo "Deployment finished."