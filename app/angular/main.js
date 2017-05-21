var regApp = angular.module('regApp', []);
 regApp.controller('reg', function reg($scope,serviceItems,$timeout,$log,$http){
	
 
 
		$http.get('db.json').then(function(data){
			$scope.items = $scope.rename(data.data)	 
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
 
	 
	$scope.returnURL = function( ){	
		 return 'includes/add1.html' ;
		 
	}
	
	$scope.sendForm = function(obj,form){
		/*  $http({method:'POST', url:'/qwe', params: obj}).then(
			 function(response) {
				$scope.testObjs = response.data;
				console.log( response.data);
			 }, 
			 function(errResponse) { console.log('Error while fetching notes',errResponse); }
		 ); */
		$http.post('/qwe',obj,obj)
		//console.log(obj)
	}
	
	$(window).on("load",function(){
		  
				$("body").mCustomScrollbar({
					theme:"minimal-dark",
					mouseWheelPixels: 100,
					scrollInertia: 200,
					 callbacks:{ 
						onTotalScroll: function(){						 
							$timeout(function(){ $scope.n += 2; })					 
						}  
					} 	 
				});		
		 
	});
	
});
 
 