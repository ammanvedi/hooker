
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var sys = require('sys');
var exec = require('child_process').exec;
var fs = require('fs');

function puts(error, stdout, stderr) { sys.puts(stdout) }

var envi = process.env;

var config = {
    maxBuffer: 10000 * 1024,
    env: envi
};

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);



app.post('/hook', function (req, res){

//the github server will post data here
var commit_msg = req.body.commits[0].message;
var printtext;
var now = new Date();


//get the config variables

var hook_path, hook_branch, hook_exname, hook_logname, hook_repo;

//load them from file

fs.readFile(__dirname + '/public/config/cfg.json', 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }
 
  data = JSON.parse(data);
  
  hook_path = data.PATH;
  hook_branch = data.BRANCHNAME;
  hook_exname = data.EXNAME;
  hook_logname = data.LOGNAME;
  hook_repo = data.GITREPO;
 
  console.log("cd " + hook_path +" && git pull " + hook_repo + " " + hook_branch + " && forever start -o " + hook_logname + " -a " + hook_exname);
});

if(commit_msg.indexOf("[redeploy]") != -1)
{
	//the commit message has a redeploy tag, so the script should run
	printtext = "There was a REDEPLOY push to remote repo at " + now.getTime()+ ' with data ' + req.body.commits[0].message;
	
	//run script to redeploy based on preferences jSON
	
	var command = "cd " + hook_path +" && git pull " + hook_repo + " " + hook_branch + " && forever restart 1";
	
	exec(command,config, puts);
//	exec("git pull seeder v2_arbor",config, puts);
//	exec("forever restart 1",config, puts);
	
	
}else{

	//the commit was not a redeploy, but was a normal commit 
		printtext = "There was a push to remote repo at " + now.getTime()+ ' with data ' + req.body.commits[0].message;
}

	
	
	
fs.writeFile("hooker.txt", printtext, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 

res.send(200);

});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
