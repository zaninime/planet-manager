String downloadCLI(String platform) {
	sh "curl -LO https://github.com/getsentry/sentry-cli/releases/download/0.19.2/sentry-cli-${platform}"
	"sentry-cli-${platform}"
}

void createRelease(String cliPath, String platform) {
	def createArgs = sh script: "node scripts/sentryHelper.js create ${platform}", returnStdout: true
	sh "${cliPath} ${createArgs}"
}

void uploadSourceMaps(String cliPath, String platform, String sourcePath) {
	def uploadArgs = sh script: "node scripts/sentryHelper.js upload ${platform} ${sourcePath}", returnStdout: true
	sh "${cliPath} ${uploadArgs}"
}

def init(String hostPlatform) {
	def cliPath = downloadCLI(hostPlatform)
	sh "chmod +x ${cliPath}"
	cliPath
}

def execute(String cliPath, String token, String platform, String sourcePath) {
	def cliRun = "./${cliPath} --auth-token ${token}"
	createRelease(cliRun, platform.toLowerCase())
	uploadSourceMaps(cliRun, platform.toLowerCase(), sourcePath)
}

return this
