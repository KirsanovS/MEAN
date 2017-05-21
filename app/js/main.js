var regApp = angular.module('regApp', []);
 regApp.controller('reg', function reg($scope,serviceItems,$timeout,$log,$http){
	
	$http.post('/showDB',{}, {params:{}}).then(function(response){
			console.log(response.data)
			$scope.items = $scope.rename(response.data)
		})
 

	 
		 $http.post('/groupNames',{}, {params:{}}).then(function(response){
			console.log(response.data)
			$scope.groupNames =  response.data 
		})
	 
 
 
	
	$scope.rename = function(obj){
		for(var i = 0; i< obj.length; i++){
			var imgUrl = obj[i].imgUrl
			for(var j = 0; j<imgUrl.length; j++){ 
				var index = imgUrl[j].lastIndexOf('/')  			 
				imgUrl[j] = imgUrl[j].slice(index)			 
			}
		} 
		return obj;
	}	 
	
	$scope.sendForm = function(obj,form){
		$http.post('/downloadPage',{},{params:obj}).then(function(response){
			console.log(response.data)
		})	 
	}	 
	
	$scope.returnURL = function( ){	return 'includes/add1.html' ; }
	
	$scope.rename = function(obj){
		for(var i = 0; i< obj.length; i++){
			var imgUrl = obj[i].imgUrl
			for(var j = 0; j<imgUrl.length; j++){ 
				var index = imgUrl[j].lastIndexOf('/')  			 
				imgUrl[j] = imgUrl[j].slice(index)			 
			}
		} 
		return obj;
	}	 
	
	
	$(window).on("load",function(){	  
				$("body").mCustomScrollbar({
					theme:"minimal-dark",
					mouseWheelPixels: 200,
					scrollInertia: 200,
					 callbacks:{ 
						onTotalScroll: function(){						 
							$timeout(function(){ $scope.n += 20; })					 
						}  
					} 	 
				});			 
	});
	
});
 
 