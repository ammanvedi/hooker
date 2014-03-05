![hooker](http://i.imgur.com/2Ztk0pb.png)

# hooker
======

Hooker is a node-js web server that is designed to listen for postdata from a github Web-Hook service, pull the updates if required and re-deploy the application.

Hooker runs as a service alongside the application its intended to track and controls its state using ForeverJS


### Requirements 
[NodeJS](http://nodejs.org/download/) and [Git](http://git-scm.com/book/en/Getting-Started-Installing-Git) (CLI Tools) are required on your webserver as well as [ExpressJS](http://expressjs.com/guide.html) for ease of setup and familiarity of layout.

[Forever](https://github.com/nodejitsu/forever) is also necessary

### Usage

* Clone the repo to your server

* Use ForeverJS to start the server as a service eg forever start -o node.log -a app.js

```bash
$ cd /path/to/hooker
$ forever start -o node.log -a app.js
```

* Edit the configuration file located in public/config/cfg.json with the information of your repo, the format is as follows:

```json
{
  "PATH": "/home/user/path/to/yourapproot",
  "GITREPO": "https://github.com/ammanvedi/seeder.git",
  "BRANCHNAME": "master",
  "EXNAME": "app.js",
  "LOGNAME":"node.log"
}
```

| Field      | Description                                                                                   |
|------------|-----------------------------------------------------------------------------------------------|
| GITREPO    | Name of the repository, this can either be the name of a remote, or a .git url            |
| BRANCHNAME | Branch to pull updates from (default : master)                                            |
| EXNAME     | Name of the node server file (default is app.js i express)                                |
| LOGNAME    | Name of the log file to use when re deploying the server                                      |
| PATH       | Path to the root of the application (and repository) of the application to be re-deployed |

This JSON file is loaded and read when the server starts, so any changes require that the hooker service be restarted, ie;

```bash
$ forever restart 0
```
(make sure port 3000 is open for http in your security group)

* Start the application as service 1 in foreverjs (just start it running directly after the hooker server)

* Make sure you have an active webhook that is pointed to yourserver.com:3000/hook

![webhook setup](http://imgur.com/Y2QI1O0.png)

* Hooker will listen for push events where the commit message contains the string "[redeploy]". At which point it will pull the changes and restart the app

So, for example a push like this from your local environment

```bash
$ git commit -m "fixed some bug [redeploy]"
$ git push origin master
```

Will trigger hooker to pull changes from the remote repository to the webserver

### About

I built this while working on [Seeder](https://github.com/ammanvedi/seeder) as a way to auto deploy the application to an Amazon EC2 server instance. 

if you think its broken fix it

beerware license 
