pipeline {
    agent {
        docker {
            image 'node:8.11.4-alpine' 
            args '-p 3000:3000' 
        }

    	environment {
        	CI = 'false'
    	}

    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install' 
                sh 'npm start' 
            }
        }
    }
}
