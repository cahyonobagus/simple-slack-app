# GITHUB SLACK APP
This is a prototype of an Slack App that has two features :

> 1. Get recent open Issue on Github repository
> 2. Add comment to that issue

Before you begin, you have to prepare some stuff: 
> 1. [Ngrok](https://ngrok.com/) 
> 2. Slack Workspace, if you don't have, visit this [site](https://slack.com/get-started)
> 3. github token, if you don't have, follow this [Instruction](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)


## How to Reproduce


1. Create your own new slack app, visit [here](https://api.slack.com/apps?new_app=1)
2. Install app to your workspace and get the token from Oauth $ Permision Menu
3. Get Signing Secret from Basic Information Menu 
4. Invite your app to a channel, get the channel ID
5. Clone this repo
6. Copy env.example to .env, and put your token, secret etc there
7. run command `node index.js`
8. run command `ngrok http 3000`
9. Subscribe event slack on Event Subscription menu, put your generated ngrok url there to validate
10.  Add event bot : app_mention

## Test the features

After inviting bot/app to your channel on your workspace, try the command below

1. Get Issue Github, format command
> @{your_app_name}[space]get_issue#{repoOwner}#{repoName} 

change the your_app_name, repoOwner, and repoName with data on your own

The Bot will reply message containing the issue, including issue id (you'll use it for add_comment)

2. Add comment to the issue, format command
> @{your_app_name}[space]add_comment#{issueId}#{contentComment} 

change the data appropiately.

example command : 
> @bagusApp add_comment#somerandomstringid#this is my comment. I hope this will help you.

