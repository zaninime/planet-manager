#!groovy

// keep .git, home/.yarn, home/.yarn-cache folders (cache)
// see http://stackoverflow.com/questions/4210042/exclude-directory-from-find-command
// see http://www.linuxquestions.org/questions/linux-general-1/find-with-prune-and-delete-902604/
def cleanWorkspace() {
    sh 'find . -mindepth 1 -maxdepth 1 \\( -path ./.git -o -path ./home/.yarn -o -path ./home/.yarn-cache \\) -prune -o -print0 | xargs -0 rm -rf'
}

def authSlackSend(Map args) {
    withCredentials([[$class: 'StringBinding', credentialsId: 'slack-token', variable: 'token']]) {
        slackSend channel: 'planet-manager', color: args.color, message: "Build <${env.BUILD_URL}|#${env.BUILD_NUMBER}> ${args.message}", teamDomain: 'elos-srl', token: token
    }
}

def sentry = evaluate readTrusted('pipeline/sentry.groovy')

node('docker') {
    docker.image('node:6.7.0').inside {
        sh 'mkdir -p home'
        withEnv(["HOME=${pwd()}/home"]) {
            stage('Fetch deps') {
                try {
                    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
                        sh "npm config set prefix ${pwd()}/home"
                        sh 'npm install --loglevel error -g yarn'
                        sh 'home/bin/yarn'
                    }
                } catch (err) {
                    authSlackSend message: "failed (JS bootstrap)", color: 'danger'
                    throw err
                }
            }
            stage('Fast QA') {
                parallel (
                    'Linter': {
                        try {
                            wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
                                sh 'npm run ci:lint'
                            }
                        } catch (err) {
                            authSlackSend message: "aborted. Code not linted!", color: 'danger'
                            throw err
                        }
                    },
                    'Tests': {
                        try {
                            wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
                                sh 'npm run ci:test'
                            }
                        } catch (err) {
                            authSlackSend message: "aborted. Tests did not pass!", color: 'danger'
                            throw err
                        }
                    }
                )
            }
            stage('Build JS bundles') {
                try {
                    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
                        sh 'npm run build'
                    }
                } catch (err) {
                    authSlackSend message: "failed. Webpack returned an error.", color: 'danger'
                    throw err
                }
            }
            stage('Sentry') {
                try {
                    if (env['RELEASE']) {
                        def cliPath = sentry.init('Linux-x86_64')
                        withCredentials([[$class: 'StringBinding', credentialsId: 'sentry-auth-token', variable: 'token']]) {
                            parallel(
                                'Electron': { sentry.execute(cliPath, token, 'Electron', 'dist/electron') },
                                'Android': { sentry.execute(cliPath, token, 'Android', 'dist/android') },
                                'iOS': { sentry.execute(cliPath, token, 'iOS', 'dist/ios') }
                            )
                        }
                    } else {
                        echo 'Skipping sourcemap upload (happens only on release builds)'
                    }
                } catch (err) {
                    authSlackSend message: "failed. Error while uploading source maps.", color: 'danger'
                    throw err
                }
            }
            stage('Strip sourcemaps') {
                sh 'find dist -name "*.map" -type f -delete'
            }
            stage('Pack desktop') {
                sh 'mkdir -p archive/electron; cp -r dist/electron archive/electron/src'
            }
        }
    }
    stash name: 'js', includes: 'archive/,android/,ios/,electron/,dist/,package.json,release.json'
    authSlackSend message: "is going well, JS bundles are ready"
}

node('master') {
    cleanWorkspace()
    unstash 'js'

    stage('Build Android') {
        try {
            def gradleHome = tool 'gradle-elos.planet-manager'

            sh 'rm -rf android/app/src/main/assets/web; cp -r dist/android android/app/src/main/assets/web'
            dir('android') {
                withEnv(["PATH=${gradleHome}/bin:${env.PATH}", 'ANDROID_HOME=/home/jenkins/android-sdk-linux']) {
                    withCredentials([
                        [$class: 'StringBinding', credentialsId: 'android-keystore-password', variable: 'KEYSTORE_PASSWORD'],
                        [$class: 'UsernamePasswordMultiBinding', credentialsId: 'android-keystore-key', passwordVariable: 'KEY_PASSWORD', usernameVariable: 'KEY_ALIAS'],
                        [$class: 'FileBinding', credentialsId: 'android-keystore', variable: 'KEYSTORE']
                    ]) {
                        sh 'gradle build assembleDebug assembleRelease'
                    }
                }
            }

            sh 'mkdir archive/android'
            sh 'cp -r dist/android archive/android/js; cp -r android/app/build/outputs/apk archive/android/apk'
        } catch (err) {
            authSlackSend message: "failed. Cannot build Android app.", color: 'danger'
            throw err
        }
    }

    stage('Archive artifacts') {
        dir('archive') {
            archiveArtifacts artifacts: '**', fingerprint: true
        }
    }

    authSlackSend message: "succeeded", color: 'good'
}
