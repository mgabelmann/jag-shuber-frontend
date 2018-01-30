// Edit your app's name below
def APP_NAME = 'frontend'
def SLACK_CHANNEL = "#sheriffmvp_dev"
// Edit your environment TAG names below
def TAG_NAMES = ['dev', 'test', 'prod']

// You shouldn't have to edit these if you're following the conventions
def NGINX_BUILD_CONFIG = 'nginx-runtime'
def BUILD_CONFIG = APP_NAME + '-build'
def IMAGESTREAM_NAME = APP_NAME
def CONTEXT_DIRECTORY = ''
def DEBUG = true

// Todo: Figure out how to load groovyscripts dynamically
// https://jenkins.io/doc/book/pipeline/shared-libraries/
 
// Check if there are changes within the context directory 
if( DEBUG || triggerBuild(CONTEXT_DIRECTORY) ) {
  stage('build nginx runtime') {
      node {
      echo "Building: " + NGINX_BUILD_CONFIG
      openshiftBuild bldCfg: NGINX_BUILD_CONFIG, showBuildLogs: 'true'
      
      // Don't tag with BUILD_ID so the pruner can do it's job; it won't delete tagged images.
      // Tag the images for deployment based on the image's hash
      NGINX_IMAGE_HASH = sh (
        script: """oc get istag ${NGINX_BUILD_CONFIG}:latest -o template --template=\"{{.image.dockerImageReference}}\"|awk -F \":\" \'{print \$3}\'""",
        returnStdout: true).trim()
      echo ">> NGINX_IMAGE_HASH: ${NGINX_IMAGE_HASH}"
      
      // tag/retag the image to ensure it's there for the next stage of the build.
      openshiftTag destStream: NGINX_BUILD_CONFIG, verbose: 'true', destTag: 'latest', srcStream: NGINX_BUILD_CONFIG, srcTag: "${NGINX_IMAGE_HASH}"

      def attachments = "[\
        {\
          'text':'Shuber Deployed to Dev',\
          'fallback':'Shuber Deployed to Dev',\
          'actions':[\
            {'type':'button','text':'View','url':'#viewthat','style':'primary'}\
          ]\
        }\
      ]"
      // def attachments = [
      //   new MessageAttachment("Shuber Deployed to Dev","Shuber Deployed to Dev",[
      //       new MessageAction("button","View","https://frontend-jag-shuber-dev.pathfinder.gov.bc.ca/","standard"),
      //       new MessageAction("button","Deploy","${env.BUILD_URL}input","primary")            
      //     ])
      // ]   
      slackSend(color: 'good', channel: "SLACK_CHANNEL", attachments: attachments)

    }
  }
  
  stage('build ' + BUILD_CONFIG) {
    node{
      echo "Building: " + BUILD_CONFIG
      openshiftBuild bldCfg: BUILD_CONFIG, showBuildLogs: 'true'
      
      // Don't tag with BUILD_ID so the pruner can do it's job; it won't delete tagged images.
      // Tag the images for deployment based on the image's hash
      IMAGE_HASH = sh (
        script: """oc get istag ${IMAGESTREAM_NAME}:latest -o template --template=\"{{.image.dockerImageReference}}\"|awk -F \":\" \'{print \$3}\'""",
        returnStdout: true).trim()
      echo ">> IMAGE_HASH: ${IMAGE_HASH}"
    }
  }
  
  stage('deploy-' + TAG_NAMES[0]) {
    node{
      openshiftTag destStream: IMAGESTREAM_NAME, verbose: 'true', destTag: TAG_NAMES[0], srcStream: IMAGESTREAM_NAME, srcTag: "${IMAGE_HASH}"    
    }
  }

  stage('deploy-' + TAG_NAMES[1]){
    timeout(time:3, unit: 'DAYS'){ input "Deploy to test?"}
    node{
      openshiftTag destStream: IMAGESTREAM_NAME, verbose: 'true', destTag: TAG_NAMES[1], srcStream: IMAGESTREAM_NAME, srcTag: "${IMAGE_HASH}"

      // def attachments = [
      //   new MessageAttachment("Shuber Deployed to Test","Shuber Deployed to Dev",[
      //       new MessageAction("button","View","https://frontend-jag-shuber-test.pathfinder.gov.bc.ca/","standard")            
      //     ])
      // ]    
      // slackSend(color: 'good', channel: SLACK_CHANNEL, attachments: new groovy.json.JsonBuilder(attachments).toString())

    }
  }

  // Need a pipeline stage for prod

}
else {
  stage('No Changes') {      
    currentBuild.result = 'SUCCESS'
  }
}



def notifyBuild(String buildStatus = 'STARTED') {
  // build status of null means successful
  buildStatus =  buildStatus ?: 'SUCCESSFUL'

  // Default values
  def colorName = 'RED'
  def colorCode = '#FF0000'
  def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
  def summary = "${subject} (${env.BUILD_URL})"
  def details = """<p>STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
    <p>Check console output at "<a href="${env.BUILD_URL}">${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>"</p>"""

  // Override default values based on build status
  if (buildStatus == 'STARTED' || buildStatus.startsWith("DEPLOYMENT")) {
    color = 'YELLOW'
    colorCode = '#FFFF00'
  } else if (buildStatus == 'SUCCESSFUL' || buildStatus.startsWith("DEPLOYED")) {
    color = 'GREEN'
    colorCode = '#00FF00'
  } else {
    color = 'RED'
    colorCode = '#FF0000'
  }

  // Send notifications
  slackSend (color: colorCode, message: summary)
}
