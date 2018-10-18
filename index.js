require('dotenv').config()
// // An access token (from your Slack app or custom integration - xoxa, xoxp, or xoxb)
const token_slack = process.env.TOKEN_SLACK
const signing_secret = process.env.SIGNING_SECRET
const token_github = process.env.TOKEN_GITHUB
// // This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = process.env.CONVERSATION_ID;

const { createEventAdapter }    = require('@slack/events-api');
const { WebClient }             = require('@slack/client');
const slackEvents               = createEventAdapter(signing_secret);
const port                      = process.env.PORT || 3000;
var GithubGraphQLApi            = require('node-github-graphql')

var github = new GithubGraphQLApi({
  Promise: require('bluebird'),
  token: token_github,
})

const web = new WebClient(token_slack);

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('app_mention', (event) => {
    // change the <@UDG3U2HT3> with your app/user ID slack
    var messages = event.text.replace('<@UDG3U2HT3> ', '')
    var splittedMessages = messages.split('#')
    if(splittedMessages[0] == 'get_issue') {
        var repoOwner   = splittedMessages[1]
        var repoName    = splittedMessages[2]
        github.query(`
            query ($repoOwner: String!, $repoName : String!){
            repository(owner:$repoOwner, name:$repoName) {
              issues(last:1, states:OPEN) {
                nodes {
                  id
                  title
                  body
                  author {
                    login
                  }
                  createdAt
                }
              }
                  
            }
            }`, {
            repoOwner, repoName
        }).then(function (res) {
            var stringResponse = JSON.stringify(res, null, 2)
            
            // See: https://api.slack.com/methods/chat.postMessage
            web.chat.postMessage({ channel: conversationId, text: stringResponse })
              .then((res) => {
                // `res` contains information about the posted message
                console.log('Message sent to channel')
              })
              .catch(console.error);

        }).catch((err) => { console.log(err) })
    
    } else if (splittedMessages[0] == 'add_comment'){
        var subjectId   = splittedMessages[1]
        var content     = splittedMessages[2]
        console.log('split', splittedMessages)
        github.query(`
            mutation ($subjectId: ID!, $content: String!){
                addComment(input:{subjectId: $subjectId, body: $content}) {
                subject {
                    id
                }
                commentEdge {
                    node {
                    author {
                        login
                    }
                    body
                    createdAt
                    }
                }
                }
            }`, {
            subjectId : subjectId.toString() ,content
        }).then(function (res) {
            var stringResponse = JSON.stringify(res, null, 2)
            
            // See: https://api.slack.com/methods/chat.postMessage
            web.chat.postMessage({ channel: conversationId, text: stringResponse })
              .then((res) => {
                // `res` contains information about the posted message
                console.log('Message sent to channel')
              })
              .catch(console.error);

        }).catch((err) => { console.log(err) })
    }

  });

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

// Start a basic HTTP server
slackEvents.start(port).then(() => {
  console.log(`server listening on port ${port}`);
});