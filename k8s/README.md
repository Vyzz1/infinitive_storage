## Project Structure

```
.
├── configmap.yaml      # ConfigMap definitions
├── namespaces.yaml     # Namespace definitions for backend, frontend, and data
├── package.json        # Project metadata
├── backend/
│   ├── backend-deployment.yaml  # Backend API deployment and service
│   ├── file-service.yaml        # File processing service
│   └── message-service.yaml     # Message handling service
├── data/
│   ├── postgres-deployment.yaml # PostgreSQL database
│   ├── rabbit-deployment.yaml   # RabbitMQ message broker
│   └── redis-deployment.yaml    # Redis cache
├── frontend/
│   └── frontend-deployment.yaml # Frontend UI deployment
├── ingress/
│   ├── backend.yaml             # Ingress for backend API
│   └── frontend.yaml            # Ingress for frontend UI
└── secrets/
    ├── backend.yaml             # Backend environment secrets
    └── data.yaml                # Data services credentials

```

## Prerequisites

- [Kubernetes](https://kubernetes.io/docs/setup/) (Minikube, Docker Desktop Kubernetes, or a cloud provider)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) command-line tool
- [Docker](https://docs.docker.com/get-docker/) for local development

## Getting Started

### Step 1: Create Namespaces

First, create the required namespaces:

```bash
kubectl apply -f namespaces.yaml
```

This will create three namespaces:

- `backend`: For API and microservices
- `frontend`: For user interface
- `data`: For databases and message brokers

### Step 2: Apply Secrets

Apply the secret configurations:

```bash
kubectl apply -f secrets/data.yaml
kubectl apply -f secrets/backend.yaml
```

### Step 3: Deploy Data Services

Deploy PostgreSQL, Redis, and RabbitMQ:

```bash
kubectl apply -f data/postgres-deployment.yaml
kubectl apply -f data/redis-deployment.yaml
kubectl apply -f data/rabbit-deployment.yaml
```

Wait for the data services to be ready:

```bash
kubectl get pods -n data -w
```

### Step 4: Deploy Backend Services

Deploy the backend API and services:

```bash
kubectl apply -f backend/backend-deployment.yaml
kubectl apply -f backend/file-service.yaml
kubectl apply -f backend/message-service.yaml
```

Verify the backend deployments:

```bash
kubectl get pods -n backend
```

### Step 5: Deploy Frontend

Deploy the frontend application:

```bash
kubectl apply -f frontend/frontend-deployment.yaml
```

Verify the frontend deployment:

```bash
kubectl get pods -n frontend
```

### Step 6: Configure Ingress

Apply the ingress configurations:

```bash
kubectl apply -f ingress/backend.yaml
kubectl apply -f ingress/frontend.yaml
```

Note: Make sure an ingress controller (like NGINX Ingress Controller) is installed in your Kubernetes cluster.

## Accessing the Application

Once deployed, you can access:

- Frontend: http://frontend.localhost/
- Backend API: http://backend-api.localhost/

## Troubleshooting

### Check Pod Status

```bash
kubectl get pods -n <namespace>
```

### View Pod Logs

```bash
kubectl logs <pod-name> -n <namespace>
```

### Check Ingress Status

```bash
kubectl get ingress -A
```

## Maintenance

### Update Deployments

To update any deployment:

```bash
kubectl apply -f <path-to-updated-yaml>
```

### Scale Services

To scale a deployment:

```bash
kubectl scale deployment <deployment-name> -n <namespace> --replicas=<number>
```

### Delete Resources

To delete all resources:

```bash
kubectl delete -f <folder>/ -R
```
