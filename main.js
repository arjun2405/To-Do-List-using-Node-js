const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000

var session = require('express-session')

app.use(express.static("public"))
app.use(express.json())

app.use(session({
	secret: 'keyboard-cat',
	saveUninitialized: true
})) 

app.get('/', (req, res) => {
	if(req.session.isLoggedIn)
	{
		res.sendFile(__dirname+"/public/todo.html");
	}
	else{
		res.redirect("/login.html");
	}
})

app.get('/logout',(req,res)=>{
	req.session.destroy();
	res.status(200);
	res.end();
})

function readUser( callback ){
	   fs.readFile("./db.txt","utf-8",function(err,data){
			     if(err){
						 	callback(err,null);
					 }
					 else{
						   if(data.length){
						 				var users = JSON.parse(data);
										callback(null,users);

							 }else{
								    callback(null,null);
							 }

					 }
		 })
}

app.post('/signup',(req,res)=>{
	var item = [];
	    readUser(function(err,data){
				  console.log(data);
				  if(err){
              console.log("err occured");
		      }else{
						  console.log(data);
							if(data!==null)
							{
                 item = data;
								 item.forEach(function(user){
									 if(user.name===req.body.name || user.id===req.body.id)
									 {
										 res.status(400);
									   res.end("signup failed");
									 }
								 })
							}
							item.push(req.body);
							console.log(item);
							fs.writeFile("./db.txt",JSON.stringify(item),function(err,data){
												if(err){
													res.end("error occured");
												}
												else{
													//req.session.isLoggedIn=true;
													res.status(200);
													res.end();
												}
						  })

					}
	})
})

app.post('/login',(req,res)=>{
	console.log(req.body);
	readUser(function(err,users){

					  if(err){
							 res.status(404);
							 res.end("user not found");
						}
						else{
							if(users===null)
							{
								res.status(404);
							  res.end("user not found");
							}
							else{
                var ouruser = users.filter(function(user){
								  if(user.name === req.body.name && user.key === req.body.key)
									{
										return true;
									}
							  })
								if(ouruser.length){

									req.session.isLoggedIn=true;
									req.session.user = ouruser[0].name;
									res.status(200);
									res.end("login success");
								}
								else{
										res.status(400);
										res.end("login failed");
								}
							}


						}
			});
})

app.post('/save',function(req,res){
   fs.readFile('./todo.txt',"utf-8",function(err,data){
		 var todos = [];
		 if(data.length>0)
		 {
			 todos = JSON.parse(data);
		 }
		 req.body.todoOwner = req.session.user;
		 todos.push(req.body)
		 fs.writeFile('./todo.txt',JSON.stringify(todos),function(err){
			 if(err)
			 {
				 res.end("err occured");
			 }
			 else
			 {
				 res.end();
			 }
		 })
	 })
})

app.get('/getusername',(req,res)=>{
	var name = req.session.user;
	res.json({name:name});
})

app.post('/delete',function(req,res){
	fs.readFile('./todo.txt',"utf-8",function(err,data){
		var todos=[];
		todos=JSON.parse(data);
		todos = todos.filter(function(task){
			if(task.id!==req.body.id)
			   return true;
		});
		fs.writeFile('./todo.txt',JSON.stringify(todos),function(err){
			if(err)
			{
				res.end("err occured");
			}
			else{
				res.end();
			}
		})
	})
})

app.post('/complete',function(req,res){
	fs.readFile('./todo.txt',"utf-8",function(err,data){
		var todos=[];
		todos=JSON.parse(data);
    todos.forEach(function(task){
			if(task.id===req.body.id)
			{
				task.isCheck=req.body.isCheck;
			}
		});
		fs.writeFile('./todo.txt',JSON.stringify(todos),function(err){
			if(err)
			{
				res.end("err occured");
			}
			else{
				res.end();
			}
		})
	})
})

app.get('/recieve',function(req,res){
	fs.readFile('./todo.txt',"utf-8",function(err,data){
		if(err)
		{
			res.end("err occured");
		}
		else{
			var userdata = [];
			if(data.length>0)
			{
				userdata=JSON.parse(data);
			}
      var usertodo = userdata.filter(function(todo){
				if(todo.todoOwner===req.session.user)
				{
					return true;
				}
				else{
					return false;
				}
			})
			res.json(usertodo);
		}
	})
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
