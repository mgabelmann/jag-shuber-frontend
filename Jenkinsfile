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

 
// Checks for new changes to the context directory
@NonCPS
boolean triggerBuild(String contextDirectory) {
  // Determine if code has changed within the source context directory.
  def changeLogSets = currentBuild.changeSets
  def filesChangeCnt = 0
  for (int i = 0; i < changeLogSets.size(); i++) {
    def entries = changeLogSets[i].items
    for (int j = 0; j < entries.length; j++) {
      def entry = entries[j]
      //echo "${entry.commitId} by ${entry.author} on ${new Date(entry.timestamp)}: ${entry.msg}"
      def files = new ArrayList(entry.affectedFiles)
      for (int k = 0; k < files.size(); k++) {
        def file = files[k]
        def filePath = file.path
        //echo ">> ${file.path}"
        if (filePath.contains(contextDirectory)) {
          filesChangeCnt = 1
          k = files.size()
          j = entries.length
        }
      }
    }
  }  
  if ( filesChangeCnt < 1 ) {
    echo('The changes do not require a build.')
    return false
  }
  else {
    echo('The changes require a build.')
    return true
  } 
}

// Get's the string associated with the commit messages being built
@NonCPS
def getChangeString() {
  MAX_MSG_LEN = 512
  def changeString = ""
  def changeLogSets = currentBuild.changeSets
  for (int i = 0; i < changeLogSets.size(); i++) {
     def entries = changeLogSets[i].items
     for (int j = 0; j < entries.length; j++) {
         def entry = entries[j]
         truncated_msg = entry.msg.take(MAX_MSG_LEN)
         changeString += " - ${truncated_msg} [${entry.author}]\n"
     }
  }
  if (!changeString) {
     changeString = "No changes"
  }
  return changeString
}


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
