#!groovy

def nodeVersion = '7.3.0'
def buildRunner = 'master'

def slowBuildBranches = [
    master: true,
    staging: true,
]

def getAndIncrementBuildNumber() {
    def project = 'elos.planet-manager/build-number'
    build project
    step([$class: 'CopyArtifact', fingerprintArtifacts: true, projectName: project, selector: [$class: 'StatusBuildSelector', stable: false]])
    return readFile('build_number.txt')
}

def getNodePath(nodeVersion) {
    def nodeCommand
    withEnv(['N_PREFIX=/home/jenkins']) {
        sh "n -d ${nodeVersion}"
        nodeCommand = sh returnStdout: true, script: "n bin ${nodeVersion}"
    }
    return nodeCommand.trim()
}

def withNodeJS(nodeVersion, cl) {
    def nodePath = getNodePath(nodeVersion)[0..-5]
    withEnv(["PATH=${nodePath}:${PATH}"]) {
        cl()
    }
}

def universalBuildNumber

def sentry = evaluate readTrusted('pipeline/sentry.groovy')

node(buildRunner) {
    ansiColor('xterm') {
        stage('Init') {
            universalBuildNumber = getAndIncrementBuildNumber()
        }

        stage('Fast QA') {
            parallel(
                    'Linter': {
                        node(buildRunner) {
                            checkout scm
                            withNodeJS(nodeVersion) {
                                sh 'node ./yarn install --offline'
                                sh 'node ./yarn ci:lint'
                            }
                        }
                    },
                    'Tests': {
                        node(buildRunner) {
                            checkout scm
                            withNodeJS(nodeVersion) {
                                sh 'node ./yarn install --offline'
                                sh 'node ./yarn ci:test'
                            }
                        }
                    },
                    failFast: true
            )
        }

        stage('JavaScript Bundles') {
            node(buildRunner) {
                checkout scm
                withNodeJS(nodeVersion) {
                    sh 'node ./yarn install --offline'
                    if (slowBuildBranches[BRANCH_NAME]) {
                        sh 'node ./yarn ci:build'
                    } else {
                        sh 'node ./yarn ci:build-fast'
                    }
                }

                stash name: 'js', includes: 'dist/'
            }
        }

        if (BRANCH_NAME == 'staging') {
            stage('Source Maps Upload') {
                node(buildRunner) {
                    unstash 'js'

                    def cliPath = sentry.init('Linux-x86_64')
                    withCredentials([[$class: 'StringBinding', credentialsId: 'sentry-auth-token', variable: 'token']]) {
                        parallel(
                            'Electron': { sentry.execute(cliPath, token, 'Electron', 'dist/electron') },
                            'Android': { sentry.execute(cliPath, token, 'Android', 'dist/android') },
                            'iOS': { sentry.execute(cliPath, token, 'iOS', 'dist/ios') }
                        )
                    }
                }
            }
        }
    }

    stage('Apps') {
        parallel(
            'Android': {
                node(buildRunner) {
                    checkout scm
                    unstash 'js'

                    def gradleHome = tool 'gradle-elos.planet-manager'

                    sh 'rm -rf android/app/src/main/assets/web && \
                        find dist/android -name "*.map" -type f -delete && \
                        cp -r dist/android android/app/src/main/assets/web'

                    dir('android') {
                        withEnv(["PATH=${gradleHome}/bin:${env.PATH}", 'ANDROID_HOME=/home/jenkins/android-sdk-linux', "UNIVERSAL_BUILD_NUMBER=${universalBuildNumber}"]) {
                            withCredentials([
                                [$class: 'StringBinding', credentialsId: 'android-keystore-password', variable: 'KEYSTORE_PASSWORD'],
                                [$class: 'UsernamePasswordMultiBinding', credentialsId: 'android-keystore-key', passwordVariable: 'KEY_PASSWORD', usernameVariable: 'KEY_ALIAS'],
                                [$class: 'FileBinding', credentialsId: 'android-keystore', variable: 'KEYSTORE']
                            ]) {
                                sh 'gradle build assembleDebug assembleRelease'
                            }
                        }
                    }

                    stash name: 'android', includes: 'android/app/build/'
                }
            }
        )
    }

    stage('Archive artifacts') {
        unstash 'js'
        unstash 'android'
        sh 'mkdir archive'

        sh 'cp -r dist archive/js-bundles'
        sh 'cp -r android/app/build/outputs/apk archive/android'

        dir('archive') {
            archiveArtifacts artifacts: '**'
        }

        sh 'rm -rf archive'
    }


    if (BRANCH_NAME == 'staging') {
        stage('Deploy') {
            androidApkUpload apkFilesPattern: 'archive/android/apk/app-release.apk', googleCredentialsId: 'android-api', trackName: 'beta'
        }
    }
}
