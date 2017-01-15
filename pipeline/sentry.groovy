void createRelease(String cliPath, String platform) {
	def createArgs = sh script: "node scripts/sentryHelper.js create ${platform}", returnStdout: true
	sh "${cliPath} ${createArgs}"
}

void uploadSourceMaps(String cliPath, String platform, String sourcePath) {
	def uploadArgs = sh script: "node scripts/sentryHelper.js upload ${platform} ${sourcePath}", returnStdout: true
	sh "${cliPath} ${uploadArgs}"
}

def execute(String cliPath, String token, String platform, String sourcePath) {
	def cliRun = "./${cliPath} --auth-token ${token}"
	createRelease(cliRun, platform.toLowerCase())
	uploadSourceMaps(cliRun, platform.toLowerCase(), sourcePath)
}

return this
