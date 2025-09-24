# 🚀 Cluster Kubernetes com Escalabilidade e HPA

Este projeto demonstra como rodar uma aplicação **PHP + Apache** em um **cluster Kubernetes** com **escalabilidade automática**, utilizando o **Horizontal Pod Autoscaler (HPA)**.  

A ideia é:
- Rodar um site simples em **PHP**.
- Empacotá-lo em um **container Docker**.
- Implantá-lo no **Kubernetes**.
- Configurar o **HPA** para ajustar automaticamente o número de réplicas.
- Fazer um **teste de carga** e validar que o HPA funciona.

---

## 📌 Pré-requisitos

Antes de começar, instale e configure os seguintes itens:

- [Docker](https://docs.docker.com/get-docker/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- Um cluster Kubernetes local ou remoto. Sugestões:
  - [kind](https://kind.sigs.k8s.io/) (Kubernetes in Docker)
  - [minikube](https://minikube.sigs.k8s.io/docs/)
  - [k3s](https://k3s.io/)

⚠️ O **Metrics Server** deve estar instalado no cluster, pois o HPA depende dele.  
Exemplo para instalar no minikube:
```bash
minikube addons enable metrics-server
````

---

## 📂 Estrutura do projeto

```
.
├── Dockerfile         # Criação da imagem com PHP + Apache
├── index.php          # Aplicação simples em PHP
├── deployment.yaml    # Deployment da aplicação no Kubernetes
├── service.yaml       # Service para expor a aplicação
├── hpa.yaml           # Configuração do Horizontal Pod Autoscaler
└── README.md          # Instruções (este arquivo)
```

---

## 📝 Arquivos do projeto

### 1. **index.php**

```php
<?php
echo "Olá, Kubernetes! 🚀 HPA funcionando!";
?>
```

### 2. **Dockerfile**

```dockerfile
FROM php:7.4-apache
COPY index.php /var/www/html/
EXPOSE 80
```

### 3. **deployment.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: php-apache-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: php-apache
  template:
    metadata:
      labels:
        app: php-apache
    spec:
      containers:
      - name: php-apache
        image: php-apache-hpa:1.0
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: "200m"
          limits:
            cpu: "500m"
```

### 4. **service.yaml**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: php-apache-service
spec:
  selector:
    app: php-apache
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
```

### 5. **hpa.yaml**

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache-deployment
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
```

---

## 🛠️ Passo a passo

### 1. Construir a imagem Docker

No diretório do projeto, rode:

```bash
docker build -t php-apache-hpa:1.0 .
```

Se estiver usando **kind** ou **minikube**, pode ser necessário carregar a imagem manualmente:

* **kind**:

  ```bash
  kind load docker-image php-apache-hpa:1.0
  ```
* **minikube**:

  ```bash
  eval $(minikube docker-env)
  docker build -t php-apache-hpa:1.0 .
  ```

---

### 2. Criar os recursos no Kubernetes

Aplique os manifestos:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f hpa.yaml
```

---

### 3. Verificar se tudo está rodando

```bash
kubectl get pods
kubectl get svc
kubectl get hpa
```

Você deve ver:

* **Pods** em execução.
* Um **Service** expondo a aplicação.
* O **HPA** configurado.

---

### 4. Acessar a aplicação

* Se estiver usando **minikube**:

  ```bash
  minikube service php-apache-service
  ```
* Se estiver em outro cluster, pegue o IP do serviço:

  ```bash
  kubectl get svc
  ```

Abra o endereço no navegador e veja a mensagem do `index.php`.

---

### 5. Realizar teste de carga

Para simular acessos simultâneos:

* **Apache Benchmark (ab)**:

```bash
ab -n 1000 -c 50 http://<ENDERECO-DO-SERVICE>/
```

* **kubectl run com busybox**:

```bash
kubectl run -it load-generator --rm --image=busybox -- /bin/sh
# Dentro do pod:
while true; do wget -q -O- http://php-apache-service; done
```


## ✅ Resultado esperado

* A aplicação PHP roda corretamente no Kubernetes.
* O **HPA** aumenta e diminui o número de pods automaticamente durante os testes.
* Todo o processo está documentado e reprodutível.

---

## 📖 Referências

* [Documentação oficial Kubernetes - HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
* [Kind - Kubernetes in Docker](https://kind.sigs.k8s.io/)
* [Minikube](https://minikube.sigs.k8s.io/docs/)
* [Metrics Server](https://github.com/kubernetes-sigs/metrics-server)

---
**Atividade realizada com auxílio do Cursor**

## [Vídeo Demonstrativo](https://drive.google.com/file/d/12vUrpLSDrsQL159maY7FTg4hra0jvdBA/view?usp=drive_link)


