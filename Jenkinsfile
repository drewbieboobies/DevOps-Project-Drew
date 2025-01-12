pipeline {
    agent any
    environment {
        DOCKER_USERNAME = credentials('docker-username') // Replace with your Jenkins credential ID
        DOCKER_PASSWORD = credentials('docker-password') // Replace with your Jenkins credential ID
        AZURE_TENANT_ID = "25a99bf0-8e72-472a-ae50-adfbdf0df6f1"
        AZURE_CLIENT_ID = "a477f37e-d9e9-4605-8633-9358deb13c04"
        AZURE_CLIENT_SECRET = credentials('azure-client-secret') // Replace with your Jenkins credential ID
        AZURE_SUBSCRIPTION_ID = "72652105-95c8-42bf-a7a7-ee6274755281"
    }
    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                parallel (
                    "Backend Tests": {
                        sh 'npm run backend-test'
                    },
                    "Frontend Instrumentation": {
                        sh 'npm run frontend-instrument'
                    },
                    "Frontend Tests (Edge)": {
                        sh 'npm run frontend-test-edge'
                    },
                    "Frontend Tests (Chrome)": {
                        sh 'npm run frontend-test-chrome'
                    }
                )
            }
        }
        stage('Build and Push Docker Image') {
            steps {
                echo 'Building and pushing Docker image...'
                sh """
                    echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                    docker-compose build
                    docker-compose push
                """
            }
        }
        stage('Azure Kubernetes Deployment') {
            steps {
                echo 'Deploying to Azure Kubernetes Service...'
                sh """
                    az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET --tenant $AZURE_TENANT_ID
                    az aks show --resource-group rmsResourceGroup --name rmsAKSCluster -o json || \
                    az aks create --resource-group rmsResourceGroup --name rmsAKSCluster --node-count 1 --generate-ssh-keys
                    az aks get-credentials --resource-group rmsResourceGroup --name rmsAKSCluster --overwrite-existing --subscription $AZURE_SUBSCRIPTION_ID
                    kubectl apply -f rms-deployment.yaml
                    kubectl apply -f rms-service.yaml
                    kubectl rollout history deployment/rms-deployment
                    kubectl get pods
                    kubectl get services
                """
            }
        }
    }
    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
