---
title: WSL 安装 k3d
date: 2026/03/08
tags:
 - WSL
categories:
 - 运维手册
---

```shell
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
k3d cluster create lab   --agents 1   -p "8080:80@loadbalancer"   -p "8443:443@loadbalancer"

curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl
kubectl version --client
kubectl config use-context k3d-lab
kubectl cluster-info
kubectl get nodes -o wide
kubectl get pods -A

curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

kubectl create namespace argocd
helm upgrade --install argocd argo/argo-cd -n argocd
kubectl -n argocd rollout status deploy/argocd-server
kubectl -n argocd get pods
# argocd 密码
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

```shell
cat <<'YAML' | kubectl apply -f -
apiVersion: traefik.containo.us/v1alpha1
kind: ServersTransport
metadata:
  name: argocd-transport
  namespace: argocd
spec:
  insecureSkipVerify: true
---
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: argocd
  namespace: argocd
spec:
  entryPoints:
    - websecure
  routes:
    - kind: Rule
      match: Host(`argocd.local`)
      services:
        - name: argocd-server
          port: 443
          scheme: https
          serversTransport: argocd-transport
  tls: {}
YAML
```

:::tip
- 用户名：admin
- 设置 `hosts` 文件：`127.0.0.1 argocd.local`
:::
