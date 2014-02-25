hooker
======

hooker is a node-js web server that is designed to listen for postdata from a github Web-Hook service, pull the updates if required and re-deploy the application.

hooker runs as a service alongside the application its intended to track and controls its state using ForeverJS

## Usage

1) clone the repo to your server

2) use ForeverJS to start the server as a service eg forever start -o node.log -a app.js

3) edit the configuration file located in public/config/cfg.json with the information of your repo, the format is as follows:

```json
{
  "PATH": "/home/ubuntu/seeder",
  "GITREPO": "seeder",
  "BRANCHNAME": "v2_arbor",
  "EXNAME": "app.js",
  "LOGNAME":"node.log"
}
```

| Field      | Description                                                                                   |
|------------|-----------------------------------------------------------------------------------------------|
| GITREPO    | the name of the repository, this can either be the name of a remote, or a .git url            |
| BRANCHNAME | the branch to pull updates from (default : master)                                            |
| EXNAME     | the name of the node server file (default is app.js i express)                                |
| LOGNAME    | name of the log file to use when re deploying the server                                      |
| PATH       | the path to the root of the application (and repository) of the application to be re-deployed |

this JSON file is loaded and read when the server starts, so any changes require that the hooker service be restarted (ie forever restart 0)

4) start the application as service 1 in foreverjs (just start it running directly after the hooker server)

5) make sure you have an active webhook that is pointed to yourserver.com:3000/hook

6) hooker will listen for push events where the commit message contains the text "[redeploy]" anywhere in the commit message. at which point it will pull the changes and restart the app
