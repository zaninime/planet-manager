#!groovy

def nodeVersion = '7.3.0'

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
    sh "n -d ${nodeVersion}"
    nodeCommand = sh returnStdout: true, script: "n bin ${nodeVersion}"
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

ansiColor('xterm') {
    stage('Init') {
        node {
            universalBuildNumber = getAndIncrementBuildNumber()
        }
    }

    stage('Fast QA') {
        parallel(
            'Linter': {
                node('nodejs') {
                    checkout scm
                    withNodeJS(nodeVersion) {
                        sh 'node ./yarn install --offline --cache-folder ./yarn-cache'
                        sh 'node ./yarn ci:lint'
                    }
                }
            },
            'Tests': {
                node('nodejs') {
                    checkout scm
                    withNodeJS(nodeVersion) {
                        sh 'node ./yarn install --offline --cache-folder ./yarn-cache'
                        sh 'node ./yarn ci:test'
                    }
                }
            },
            failFast: true
        )
    }

    stage('JavaScript Bundles') {
        node('master') {
            checkout scm
            withNodeJS(nodeVersion) {
                sh 'node ./yarn install --offline --cache-folder ./yarn-cache'
                if (slowBuildBranches[BRANCH_NAME]) {
                    sh 'node ./yarn ci:build'
                } else {
                    sh 'node ./yarn ci:build-fast'
                }
            }

            stash name: 'js', includes: 'dist/'
            sh 'rm -rf dist'
        }
    }

    if (BRANCH_NAME == 'staging') {
        stage('Source Maps Upload') {
            node('nodejs && sentry-cli') {
                unstash 'js'

                def commandName = 'sentry-cli'
                withCredentials([[$class: 'StringBinding', credentialsId: 'sentry-auth-token', variable: 'token']]) {
                    withNodeJS(nodeVersion) {
                        sh "${commandName} --auth-token ${token} info"
                        parallel(
                            'Electron': { sentry.execute(commandName, token, 'Electron', 'dist/electron') },
                            'Android': { sentry.execute(commandName, token, 'Android', 'dist/android') },
                            'iOS': { sentry.execute(commandName, token, 'iOS', 'dist/ios') }
                        )
                    }
                }
            }
        }
    }

    stage('Apps') {
        parallel(
            'Android': {
                node('android-sdk && buck') {
                    checkout scm
                    unstash 'js'

                    sh 'rm -rf android/src/main/assets/web && \
                    find dist/android -name "*.map" -type f -delete && \
                    cp -r dist/android android/src/main/assets/web'

                    dir('android') {
                        withEnv(["UNIVERSAL_BUILD_NUMBER=${universalBuildNumber}"]) {
                            withCredentials([
                                [$class: 'FileBinding', credentialsId: 'android-keystore', variable: 'KEYSTORE_FILE'],
                                [$class: 'FileBinding', credentialsId: 'android-keystore-properties', variable: 'KEYSTORE_PROPERTIES']
                            ]) {
                                try {
                                    sh "cp ${KEYSTORE_FILE} release.keystore && cp ${KEYSTORE_PROPERTIES} release.keystore.properties"
                                    sh 'buck build :app-release-aligned :app-debug'
                                } finally {
                                    sh 'rm -f release.keystore release.keystore.properties'
                                }
                            }
                        }
                        sh 'mv buck-out/gen/app-release-aligned/*.apk buck-out/gen/'
                    }

                    stash name: 'android', includes: 'android/buck-out/gen/*.apk'
                }
            }
        )
    }

    stage('Archive artifacts') {
        node('linux') {
            unstash 'js'
            unstash 'android'

            sh 'rm -rf archive && mkdir archive'

            sh 'cp -r dist archive/js-bundles'
            sh 'mkdir archive/android && cp android/buck-out/gen/*.apk archive/android'

            dir('archive') {
                archiveArtifacts artifacts: '**'
            }

            sh 'rm -rf archive'
        }
    }


    if (BRANCH_NAME == 'staging') {
        stage('Deploy') {
            node('linux') {
                unstash 'android'
                androidApkUpload apkFilesPattern: 'android/buck-out/gen/app-release-aligned.apk', googleCredentialsId: 'android-api', trackName: 'beta'
            }
        }
    }
}
