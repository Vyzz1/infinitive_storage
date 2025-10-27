# Mục lục

- [Docker Compose (level 1 và 2)](#docker-compose-level-1-và-2)
- [Kubernetes (level 3)](#kubernetes-level-3)

# Docker compose (level 1 và 2)

## Architecture Overview (Tổng quan Kiến trúc)

Dự án này triển khai kiến trúc `microservices` với các thành phần sau:

- **Frontend UI**: Ứng dụng `Next.js` với các thành phần `UI` hiện đại
- **Backend API**: `NestJS REST API` với `load balancing` (3 `instances`)
- **File Processing Service**: Tạo `thumbnail` cho file qua `RabbitMq`
- **Message Service**: Quản lý thông báo `email` qua `RabbitMq`
- **Load Balancer**: `Nginx` để phân phối `requests` qua các `instances` của `backend`
- **Databases**: `PostgreSQL` cho dữ liệu, `Redis` cho `caching`, `RabbitMQ` cho `messaging`

## Project Structure (Cấu trúc Dự án)

```
root/
├── backend/                  # NestJS Backend API
├── frontend-ui/              # Next.js Frontend

├── file-processing/          # File Processing Service

├── message-service/          # Email  Service

├── k8s/                      # Kubernetes
```

## Prerequisites

- [Kubernetes](https://kubernetes.io/docs/setup/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [Docker](https://docs.docker.com/get-docker/)

### Running the Application

1.  **Khởi động tất cả services**

    ```bash
    docker-compose up -d
    ```

2.  **Kiểm tra trạng thái service**

    ```bash
    docker-compose ps
    ```

3.  **Xem logs**

    ```bash
    # Tất cả services
    docker-compose logs -f

    # Service cụ thể
    docker-compose logs -f frontend-ui
    docker-compose logs -f backend-api
    ```

4.  **Dừng ứng dụng**

    ```bash
    docker-compose down
    ```

5.  **Dọn dẹp (xóa volumes)**

    ```bash
    docker-compose down -v
    ```

### Access Points (Các điểm truy cập)

Khi tất cả `services` đang chạy, có thể truy cập:

| Service                  | URL                       | Description (Mô tả)                                        |
| :----------------------- | :------------------------ | :--------------------------------------------------------- |
| **Frontend Application** | http://localhost:3000     | Giao diện người dùng chính                                 |
| **Backend API**          | http://localhost:8888/api | `REST API` qua `load balancer`                             |
| **RabbitMQ Management**  | http://localhost:15672    | Quản lý `queue` (user: `vy`, pass: `vy`)                   |
| **PgAdmin**              | http://localhost:5050     | Quản trị cơ sở dữ liệu (user: `vy@gmail.com`, pass: `123`) |

# Kubernetes (level 3)

Đầu tiên đi tới thư mục `k8s`:

```bash
 cd k8s
```

### Bước 1: Tạo Namespaces

Đầu tiên, tạo các `namespaces` cần thiết:

```bash
kubectl apply -f namespaces.yaml
```

Lệnh này sẽ tạo ra ba `namespaces`:

- `backend`: Dành cho `API` và `microservices`
- `frontend`: Dành cho giao diện người dùng
- `data`: Dành cho `databases` và `message brokers`

### Bước 2: Áp dụng Secrets

Áp dụng các cấu hình `secret`:

```bash
kubectl apply -f secrets/data.yaml
kubectl apply -f secrets/backend.yaml
```

### Bước 3: Deploy các Data Services

`Deploy` `PostgreSQL`, `Redis`, và `RabbitMQ`:

```bash
kubectl apply -f data/postgres-deployment.yaml
kubectl apply -f data/redis-deployment.yaml
kubectl apply -f data/rabbit-deployment.yaml
```

Đợi cho các `data services` sẵn sàng:

```bash
kubectl get pods -n data -w
```

### Bước 4: Deploy các Backend Services

`Deploy` `backend API` và các `services`:

```bash
kubectl apply -f backend/backend-deployment.yaml
kubectl apply -f backend/file-service.yaml
kubectl apply -f backend/message-service.yaml
```

Xác minh các `backend deployments`:

```bash
kubectl get pods -n backend
```

### Bước 5: Deploy Frontend

`Deploy` ứng dụng `frontend`:

```bash
kubectl apply -f frontend/frontend-deployment.yaml
```

Xác minh `frontend deployment`:

```bash
kubectl get pods -n frontend
```

### Bước 6: Cấu hình Ingress

Áp dụng các cấu hình `ingress`:

```bash
kubectl apply -f ingress/backend.yaml
kubectl apply -f ingress/frontend.yaml
```

Lưu ý: Đảm bảo một `ingress controller` (như `NGINX Ingress Controller`) đã được cài đặt trong `cluster Kubernetes`.

## Accessing the Application (Truy cập Ứng dụng)

Sau khi `deploy`, truy cập:

- Frontend: [http://frontend.localhost/](http://frontend.localhost/)
- Backend API: [http://backend-api.localhost/](http://backend-api.localhost/)

### Kiểm tra Trạng thái Pod

```bash
kubectl get pods -n <namespace>
```

### Xem Logs của Pod

```bash
kubectl logs <pod-name> -n <namespace>
```

### Kiểm tra Trạng thái Ingress

```bash
kubectl get ingress -A
```

## Maintenance

### Cập nhật Deployments

Để cập nhật bất kỳ `deployment` nào:

```bash
kubectl apply -f <path-to-updated-yaml>
```

### Scale Services

Để `scale` một `deployment`:

```bash
kubectl scale deployment <deployment-name> -n <namespace> --replicas=<number>
```

### Xóa Resources

Để xóa tất cả `resources`:

```bash
kubectl delete -f <folder>/ -R
```
