var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var fs = require('fs');
var io = require('socket.io')(http);
var mongoose = require('mongoose');
nicknames=[];
users={};
global.authe;
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/js/jquery.min.js', function(req, res){
  res.sendFile(__dirname + '/js/jquery.min.js');
});
app.get('/js/jquery-1.11.1.js', function(req, res){
  res.sendFile(__dirname + '/js/jquery-1.11.1.js');
});
app.get('/js/jquery-1.11.2.min.js', function(req, res){
  res.sendFile(__dirname + '/js/jquery-1.11.2.min.js');
});
app.get('/js/bootstrap.min.js', function(req, res){
  res.sendFile(__dirname + '/js/bootstrap.min.js');
});
app.get('/js/socket.io-1.2.0.js', function(req, res){
  res.sendFile(__dirname + '/js/socket.io-1.2.0.js');
});
app.get('/css/jquery.emojipicker.css', function(req, res){
  res.sendFile(__dirname + '/css/jquery.emojipicker.css');
});
app.get('/js/jquery.emojipicker.js', function(req, res){
  res.sendFile(__dirname + '/js/jquery.emojipicker.js');
});
app.get('/css/jquery.emojipicker.tw.css', function(req, res){
  res.sendFile(__dirname + '/css/jquery.emojipicker.tw.css');
});
app.get('/js/jquery.emojis.js', function(req, res){
  res.sendFile(__dirname + '/js/jquery.emojis.js');
});
app.get('/lib/js/emoji-picker.js', function(req, res){
  res.sendFile(__dirname + '/lib/js/emoji-picker.js');
});
app.get('/lib/js/tether.min.js', function(req, res){
  res.sendFile(__dirname + '/lib/js/tether.min.js');
});
app.get('/lib/css/nanoscroller.css', function(req, res){
  res.sendFile(__dirname + '/lib/css/nanoscroller.css');
});
app.get('/lib/css/emoji.css', function(req, res){
  res.sendFile(__dirname + '/lib/css/emoji.css');
});
app.get('/css/bootstrap.min.css', function(req, res){
  res.sendFile(__dirname + '/css/bootstrap.min.css');
});
app.get('/lib/img/blank.gif', function(req, res){
  res.sendFile(__dirname + '/lib/img/blank.gif');
});
app.get('/lib/img/emoji_spritesheet_0.png', function(req, res){
  res.sendFile(__dirname + '/lib/img/emoji_spritesheet_0.png');
});
app.get('/lib/img/IconsetSmiles.png', function(req, res){
  res.sendFile(__dirname + '/lib/img/IconsetSmiles.png');
});
app.get('/lib/img/IconsetW.png', function(req, res){
  res.sendFile(__dirname + '/lib/img/IconsetW.png');
});
app.get('/lib/img/IconsetW_1x.png', function(req, res){
  res.sendFile(__dirname + '/lib/img/IconsetW_1x.png');
});
app.get('/lib/img/emoji_spritesheet_1.png', function(req, res){
  res.sendFile(__dirname + '/lib/img/emoji_spritesheet_1.png');
});
app.get('/lib/img/emoji_spritesheet_2.png', function(req, res){
  res.sendFile(__dirname + '/lib/img/emoji_spritesheet_2.png');
});
app.get('/lib/img/emoji_spritesheet_3.png', function(req, res){
  res.sendFile(__dirname + '/lib/img/emoji_spritesheet_3.png');
});
app.get('/lib/img/emoji_spritesheet_4.png', function(req, res){
  res.sendFile(__dirname + '/lib/img/emoji_spritesheet_4.png');
});
io.sockets.on('connection', function(socket){
	
  socket.on('new user', function(data,callback){
    
	if(data.username=='' || data.pass=='')
    {
		callback(false);
	}		
    else if(data.username in users){
    callback(false);
   }
   else{
    console.log(data.username);
    user.find({$and:[{"nick":data.username},{"password":data.pass}]},function(err,auth){
    if (err) throw err;
      
      
      console.log(data.username);
    if(auth[0]==undefined)  
    callback(false);
  
  else
  {
   callback(true); 
   socket.nickname=data.username;
  users[socket.nickname]=socket;
    nicknames.push(socket.nickname);
    var query=chat.find({"group":"Common group"});
    query.sort("created").exec({},function(err,docs){
    if (err) throw err;
    console.log('Sending old messages');
    socket.emit('load old msgs',docs); 
    });
   var pquery= pchat.find({$or:[{"nickfrom":socket.nickname},{"nickto":socket.nickname}]});
    pquery.sort("created").exec({},function(err,pdocs){
    if (err) throw err;
    console.log('Sending old pmessages');
    socket.emit('load old pmsgs',pdocs);
  });
    groups.find({"members":socket.nickname},function(err,gdocs){
    if (err) throw err;
    if (gdocs[0]!=undefined){
    users[socket.nickname].emit('groupinfo',gdocs);
    console.log(gdocs[0].groupname);
  }
  });
     if(users[socket.nickname] !== undefined)
       user.find({},function(err,auth){
    if (err) throw err;
      users[socket.nickname].emit('cuser', {cuser:socket.nickname, users:Object.keys(users),alluser:auth});
    updateNicknames();
  });
    }
});
   }
   }); 
  //New Group creation
  socket.on('newgroup',function(data,callback){
    console.log(data);
    groups.find({"groupname":data},function(err,gdocs){
    if (err) throw err;
    if (gdocs[0]!=undefined){
    callback("This groupname already exists!! Please Enter a new one");
    }
    else{
      console.log("new group");
      var newgrp = new groups({groupname:data, members:[socket.nickname]});
             newgrp.save(function(err){
               if (err) throw err;
               groups.find({"members":socket.nickname},function(err,docs){
    if (err) throw err;
    if (docs[0]!=undefined){
    users[socket.nickname].emit('groupinfo',docs);
    console.log(docs[0].groupname);
  }
  });
               callback("New group created successfully!! Please close the modal and add members to your group");
    });
  }
  }); 
  });
  //Edit Group
   socket.on('editgroup',function(data,callback){
    groups.find({"groupname":data.groupname},function(err,gdocs){
    if (err) throw err;
    if (gdocs[0]==undefined){
    callback("close the modal");
    }
    else if(data.groupname=="Common group")
      callback("Close the modal");
    else{
   console.log("Save new members to db");
   console.log(data.groupname);
   console.log(data.members);
   // groups.update({"groupname":data.groupname},{"members":data.members});
    groups.update({groupname:data.groupname}, {members:data.members},function(err){
               if (err) throw err;
                groups.find({"groupname":data.groupname},function(err,gdocs){
    if (err) throw err;
    if (gdocs[0]!=undefined){
      user.find({},function(err,auth){
    if (err) throw err;
    users[socket.nickname].emit('membergroup',{gdocs:gdocs,alluser:auth,cuser:socket.nickname, users:Object.keys(users)});
  });
    }
  });
     callback("Members list updated successfully!!");
   });
  }
  }); 
  });
   //Change group
   socket.on('groupchange',function(data){
      var query=chat.find({"group":data});
    query.sort("created").exec({},function(err,docs){
    if (err) throw err;
    console.log('Sending old messages');
    socket.emit('load old msgs',docs); 
  });
    if(data=="Common group")
    {
      user.find({},function(err,auth){
    if (err) throw err;
      users[socket.nickname].emit('cuser', {cuser:socket.nickname, users:Object.keys(users),alluser:auth});
    });
    }
    else{
    groups.find({"groupname":data},function(err,gdocs){
    if (err) throw err;
    if (gdocs[0]!=undefined){
      user.find({},function(err,auth){
    if (err) throw err;
    users[socket.nickname].emit('membergroup',{gdocs:gdocs,alluser:auth,cuser:socket.nickname, users:Object.keys(users)});
  });
    }
  });
  }
    });
   socket.on('changerequest',function(){
      var pquery= pchat.find({$or:[{"nickfrom":socket.nickname},{"nickto":socket.nickname}]});
    pquery.sort("created").exec({},function(err,pdocs){
    if (err) throw err;
    console.log('Sending old pmessages');
    socket.emit('load old pmsgs',pdocs);
  });
    });
 function updateNicknames(){

 io.sockets.emit('usernames', { users:Object.keys(users)});
 
}
  socket.on('chat message', function(data,callback){
	  var msg=data.msg.trim();
	  if(msg==='')
	  {
			callback("Error! Please enter a message ");  
		  }
	  else{
    var newMsg = new chat({msg: msg, nick:socket.nickname, group:data.groupname});
    newMsg.save(function(err){
		if (err) throw err;
    if(data.groupname=="Common group"){
		io.emit('new message', {msg:msg,nick:socket.nickname});
    }
    else
   {
   groups.find({"groupname":data.groupname},function(err,gdocs){
    if (err) throw err;
    console.log(gdocs);
    if (gdocs[0]!=undefined){
    for(var i=0; i< gdocs[0].members.length;i++)
    {
      if(gdocs[0].members[i] in users){
      users[gdocs[0].members[i]].emit('new message', {msg:msg,nick:socket.nickname});
    }
  }
  }
  }); 
  }
	});	
	  }
  });
  socket.on('pchat message', function(data,callback){
	  var pmsg=data.pmsg.trim();
	  var pnick=data.pnick.trim();
	          if(pmsg=='')
			  {
				callback("Error: Enter a message to send");  
			  }
	          else if(pnick in users && pnick!=socket.nickname){
              var newpMsg = new pchat({msg: pmsg, nickfrom:socket.nickname, nickto:pnick});
             newpMsg.save(function(err){
               if (err) throw err;
				  users[pnick].emit('pwhisper', {msg:pmsg,nick:socket.nickname});
				   users[socket.nickname].emit('pwhisper', {msg:pmsg,nick:'You'});
		       console.log("Whisper");
         });
			  }
			  else if(pnick==socket.nickname)
			  {
				callback("Error: Cannot send message to yourself");  
			  }
			  else{
				  callback("Error: Enter a valid user");
			  }
	  
	   });
  socket.on('disconnect', function(data){
   if(!socket.nickname)return;
   delete users[socket.nickname];
  // nicknames.splice(nicknames.indexOf(socket.nickname),1);
   updateNicknames();
  });
  socket.on('base64 file', function (msg) {
    console.log('received base64 file from');
	console.log(msg.fileName);
    //socket.username = msg.username;
    // socket.broadcast.emit('base64 image', //exclude sender
      var newFile = new chat({file: msg.file,fileName:msg.fileName,fileType:msg.fileType,group:msg.groupname, nick:socket.nickname});
    newFile.save(function(err){
    if (err) throw err;
    if(msg.groupname=="Common group"){
    io.sockets.emit('base64 file',  //include sender

        {
          group:msg.groupname,
          nick: socket.nickname,
          file: msg.file,
          fileName: msg.fileName,
		  fileType: msg.fileType
        });
  }
  else
  {
   groups.find({"groupname":msg.groupname},function(err,gdocs){
    if (err) throw err;
    console.log(gdocs);
    if (gdocs[0]!=undefined){
    for(var i=0; i< gdocs[0].members.length;i++)
    {
      if(gdocs[0].members[i] in users){
      users[gdocs[0].members[i]].emit('base64 file',  //include sender

        {
          group:msg.groupname,
          nick: socket.nickname,
          file: msg.file,
          fileName: msg.fileName,
      fileType: msg.fileType
        });
    }
  }
  }
  }); 
  }
});
  });
socket.on('pbase64 file', function (msg) {
    console.log('received base64 file from');
	console.log(msg.fileName);
	console.log(msg.pnick);
    //socket.username = msg.username;
    // socket.broadcast.emit('base64 image', //exclude sender
	if(msg.pnick in users && msg.pnick!=socket.nickname){
    var newpFile = new pchat({file: msg.file,fileName:msg.fileName,fileType:msg.fileType,nickfrom:socket.nickname,nickto:msg.pnick});
    newpFile.save(function(err){
    if (err) throw err;
   users[msg.pnick].emit('pbase64 file',  //include sender

        { pnick:msg.pnick,
          username: socket.nickname,
          file: msg.file,
          fileName: msg.fileName,
		  fileType: msg.fileType
		  
        });
   users[socket.nickname].emit('pbase64 file',  //include sender

        { 
		  pnick:msg.pnick,
          username: 'You',
          file: msg.file,
          fileName: msg.fileName,
		  fileType: msg.fileType
        });
   });
	}
	else if(msg.pnick==socket.nickname)
	{
	users[socket.nickname].emit('fileerror', {error:'Cannot send file to yourself'});	
	}
	else{
		users[socket.nickname].emit('fileerror', {error:'Enter valid user name'});
	}
});
});
//Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/chat',function(err){
if(err)
{
console.log(err);	
}else{
console.log('Connected to MongoDB!');	
}
});
//Common Chat Schema
var chatSchema = mongoose.Schema({
nick: String,
msg: String,
group: String,
file: String,
fileName: String,
fileType: String,
created:{type: Date, default:Date.now}	
});
var chat = mongoose.model('Message',chatSchema);
//Private Chat Schema
var pchatSchema = mongoose.Schema({
nickfrom: String,
nickto: String,
msg: String,
file: String,
fileName: String,
fileType: String,
created:{type: Date, default:Date.now}  
});
var pchat = mongoose.model('PMessage',pchatSchema);
var userSchema = mongoose.Schema({
nick: String,
password: String
});
var user = mongoose.model('User',userSchema);
var groupSchema = mongoose.Schema({
groupname: String,
members: Array
});
var groups = mongoose.model('Group',groupSchema);
http.listen(3000, function(){
  console.log('listening on *:3000');
});
