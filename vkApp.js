var fs = require('fs');
var http = require('https');
var path = require('path');

var request = require('request');
var mongoClient = require("mongodb").MongoClient;

var express = require('express');
var app = express();

 
	



 







 

 

app.use(express.static(__dirname+'/app'))	
app.get('*',function(err,res){	
	res.end('index')  
 });
/*  app.post('/qwe',function(req, res){	
	console.log(req.query)
	res.end('Group is download' )  
 }); */

  app.post('/groupNames',function(req, res){	
	mongoClient.connect("mongodb://localhost:27017/itemsDB", function(err, db){					 
	if(!err){  
		db.collection("items").distinct("nameGrp",(function(err,result){
            res.send(result);  
            db.close();
        }))
 	 
		}else{console.log('/showDB',err); return  }			 
	});		 
 });
 
 app.post('/showDB',function(req, res){	
	mongoClient.connect("mongodb://localhost:27017/itemsDB", function(err, db){					 
	if(!err){  
		db.collection("items").find().toArray(function(err, results){ 
				//console.log('node',results);
				res.send(results)
				db.close();
			});	 
		}else{console.log('/showDB',err); return  }			 
	});		 
 });
 
 
  
 app.post('/downloadPage',function(req, res){	
		var nameGroup = req.query.name;
		var quantity = req.query.quantity;
		go(nameGroup,quantity)


		function go(nameGroup,quantity){
			
			for(var z = 0; z <= quantity ; z++){
				request.post('https://api.vk.com/method/wall.get?domain='+nameGroup+'&offset='+z+'&count=1&v=3.0', pushRequest)
			}
			   
			 
			
			function pushRequest(err,obj){
				 
				getJSON = JSON.parse(arguments[1].body) ; //берёт json  с vk
				//console.log(getJSON, '--------------------------')
				
				var smartArr = createSmartArr(getJSON);	//преобразование json  в более простой объект
				//console.log(smartArr);
				
				for(var j = 0; j < smartArr.length; j++){
					var newPost = smartArr[j];
					 uploadAndAddToDB(newPost);
					  
					//if(checkRepiater(newPost) == 0){  //проверка на присутсвие такого-же поста в БД						 
						 
					//}
			
				} 
				
				
			}
			
			
				function  uploadAndAddToDB(newPost){
					if(!newPost.imgUrl.length)return;
					 
					addToDB(newPost);
					
						function downloadImg(url){				 
							var uploadDir = 'app/upload/';
							var name = path.basename(url)
							request(url).pipe(fs.createWriteStream(uploadDir+name)).on('close', function() {
								
							}) 
						}
					
						function addToDB(newPost){
							var mongoClient = require("mongodb").MongoClient;
							mongoClient.connect("mongodb://localhost:27017/itemsDB", function(err, db){					 
								if(!err){
									var collection = db.collection("items");
									console.log('2post:', newPost)
									
									db.collection("items").find({postId: newPost.postId}).toArray(function(err, results){ 
									 
										if(results.length == 0){ //отсеивание повторяющихся постов
											collection.insertOne(newPost, function(err, result){
												if(err){return console.log('2',err);}
												//console.log(result.ops);
												for(var q = 0; q < newPost.imgUrl.length; q++){
													downloadImg(newPost.imgUrl[q]);       //загрузка img
												}
												db.close();
											});
										}else{console.log('отсеивание повторяющихся постов')}
										 
									});
									
									 
								}else{console.log('3',err); return  }			 
							});
							
						}
				} 
				
				
				

			
				function checkRepiater(newPost){
					var newPostId = newPost.postId;
					var fileContent = fs.readFileSync("db.json", "utf8");
					var obj =  getObj( fileContent );
					 
					for(var i=0; i< obj.length; i++){ //console.log(newPostId ,obj[i].postId);
						if(newPostId == obj[i].postId){
							return 1;
						}
					}
					return 0; 
					
					function getObj(string){
						string = string.slice(0,-3);
						return JSON.parse('['+string+']');
					}
				}
				
				
				
						 
						 
				function createSmartArr(getObject){ 
					var arrPostObj = [];
					var lenPost = getObject.response.length;    
					for(var postNumb = 1; postNumb<lenPost; postNumb++ ){
						var myObj = {}
						 			
						var post = getObject.response[postNumb];// console.log('z',post)	
						myObj.nameGrp = nameGroup;
						myObj.text = post.text; //console.log( text );
						myObj.postId = getObject.response[postNumb].id
						myObj.likesPost = getObject.response[postNumb].likes.count;	//console.log( likesPost );		
						myObj.reposts = getObject.response[postNumb].reposts.count;	//console.log( reposts );
						myObj.date = (new Date).toLocaleString()	
						 
						myObj.post_type = getObject.response[postNumb].post_type;
						 if( post.attachments){
							myObj.imgUrl = [];
							var lenImg = post.attachments.length;
							for(var imgNumb = 0; imgNumb < lenImg; imgNumb++ ){
								 
								var itemInPost = post.attachments[imgNumb]; //console.log( itemInPost );	
								var type = itemInPost.type;
								if(type=='photo'){
									if(itemInPost.photo.src_xxbig){
										myObj.imgUrl[imgNumb] = itemInPost.photo.src_xxbig;
									}else if(itemInPost.photo.src_xbig){
										myObj.imgUrl[imgNumb] = itemInPost.photo.src_xbig;
									}else if(itemInPost.photo.src_big){
										myObj.imgUrl[imgNumb] = itemInPost.photo.src_big;
									}else if(itemInPost.photo.src_small){
										myObj.imgUrl[imgNumb] = itemInPost.photo.src_small;
									}
								}
						  
							}
							arrPostObj[arrPostObj.length] = myObj;
						 }	
					} 
					//console.log('CC',arrPostObj) 
					return arrPostObj;
				}
				 
										
				
			 
		}
			 
		res.send('Group is download' )  
 });
 
 app.listen(8882); console.log('ok: 8882')

 
 

 
 
 


 
 
 /* 
 
		var nameGroup = 'minimalism';
		var quantity = 10;
		go(nameGroup,quantity)


		function go(nameGroup,quantity){
			
			for(var z = 0; z <= quantity ; z++){
				request.post('https://api.vk.com/method/wall.get?domain='+nameGroup+'&offset='+z+'&count=1&v=3.0', pushRequest)
			}
			 
			 
			
			function pushRequest(err,obj){
				 
				getJSON = JSON.parse(arguments[1].body) ; //берёт json  с vk
				//console.log(getJSON, '--------------------------')
				
				var smartArr = createSmartArr(getJSON);	//преобразование json  в более простой объект
				//console.log(smartArr);
				
				for(var j = 0; j < smartArr.length; j++){
					var newPost = smartArr[j];
					 uploadAndAddToDB(newPost);
					  
					//if(checkRepiater(newPost) == 0){  //проверка на присутсвие такого-же поста в БД						 
						 
					//}
			
				} 
				
				
			}
			
			
				function  uploadAndAddToDB(newPost){
					if(!newPost.imgUrl.length)return;
					for(var q = 0; q < newPost.imgUrl.length; q++){
						downloadImg(newPost.imgUrl[q]);
					}
					
						function downloadImg(url){				 
							var uploadDir = 'app/upload/';
							var name = path.basename(url)
							request(url).pipe(fs.createWriteStream(uploadDir+name)).on('close', function() {
								addToDB(newPost);
							}) 
						}
					
						function addToDB(newPost){
							var mongoClient = require("mongodb").MongoClient;
							mongoClient.connect("mongodb://localhost:27017/itemsDB", function(err, db){					 
								if(!err){
									var collection = db.collection("items");
									collection.insertOne(newPost, function(err, result){
										if(err){return console.log('2',err);}
										//console.log(result.ops);
										db.close();
									});
								}else{console.log('3',err); return  }			 
							});
							
						}
				} 
				
				
				

			
				function checkRepiater(newPost){
					var newPostId = newPost.postId;
					var fileContent = fs.readFileSync("db.json", "utf8");
					var obj =  getObj( fileContent );
					 
					for(var i=0; i< obj.length; i++){ //console.log(newPostId ,obj[i].postId);
						if(newPostId == obj[i].postId){
							return 1;
						}
					}
					return 0; 
					
					function getObj(string){
						string = string.slice(0,-3);
						return JSON.parse('['+string+']');
					}
				}
				
				
				
						 
						 
				function createSmartArr(getObject){ 
					var arrPostObj = [];
					var lenPost = getObject.response.length;    
					for(var postNumb = 1; postNumb<lenPost; postNumb++ ){
						var myObj = {}
						 			
						var post = getObject.response[postNumb];// console.log('z',post)	
						myObj.nameGrp = nameGroup;
						myObj.text = post.text; //console.log( text );
						myObj.postId = getObject.response[postNumb].id
						myObj.likesPost = getObject.response[postNumb].likes.count;	//console.log( likesPost );		
						myObj.reposts = getObject.response[postNumb].reposts.count;	//console.log( reposts );
						myObj.date = (new Date).toLocaleString()	
						 
						myObj.post_type = getObject.response[postNumb].post_type;
						 if( post.attachments){
							myObj.imgUrl = [];
							var lenImg = post.attachments.length;
							for(var imgNumb = 0; imgNumb < lenImg; imgNumb++ ){
								 
								var itemInPost = post.attachments[imgNumb]; //console.log( itemInPost );	
								var type = itemInPost.type;
								if(type=='photo'){
									if(itemInPost.photo.src_xxbig){
										myObj.imgUrl[imgNumb] = itemInPost.photo.src_xxbig;
									}else if(itemInPost.photo.src_xbig){
										myObj.imgUrl[imgNumb] = itemInPost.photo.src_xbig;
									}else if(itemInPost.photo.src_big){
										myObj.imgUrl[imgNumb] = itemInPost.photo.src_big;
									}else if(itemInPost.photo.src_small){
										myObj.imgUrl[imgNumb] = itemInPost.photo.src_small;
									}
								}
						  
							}
							arrPostObj[arrPostObj.length] = myObj;
						 }	
					} 
					//console.log('CC',arrPostObj) 
					return arrPostObj;
				}
				 
										
				
			 
		} */
