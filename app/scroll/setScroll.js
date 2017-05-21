/* 	$(window).on("load",function(){
			var heightDiv;
			var itemX;
			$("body").mCustomScrollbar({
				theme:"minimal-dark",
				mouseWheelPixels: 10,
				scrollInertia: 0,
				callbacks:{ 
					onScrollStart: function(){
						  itemX = document.getElementsByClassName('item');
						  heightDiv = parseInt(window.getComputedStyle(itemX[0]).height); 
							console.log('onScrollStart' )
							
							var divTop = itemX[0].offsetTop
						var scrollTop = this.mcs.top*(-1)
						
						if(scrollTop >= divTop ){	//console.log('00', scrollTop)
							 //var deff = scrollTop - divTop
							itemX[0].style.height = (heightDiv - 10) + 'px';
							 console.log('ok1' )
						}
					}, 
					whileScrolling:function(){
						 
						//var heightDiv = parseInt(window.getComputedStyle(itemX[0]).height);   //console.log(height)
						var divTop = itemX[0].offsetTop
						var scrollTop = this.mcs.top*(-1)
						
						if(scrollTop >= divTop ){	//console.log('00', scrollTop)
							 //var deff = scrollTop - divTop
							itemX[0].style.height = (heightDiv - 10) + 'px';
							 console.log('ok' )
						}
						 
					},
					onScrollStart: function(){
						var itemX = document.getElementsByClassName('item');	
						// console.log(itemX[0].offsetTop, itemX )	 
					},
					onInit: function(){
						console.log('11')
					},
				 
					onTotalScroll: function(){						 
						$timeout(function(){ $scope.n += 2; })					 
					}  
				},
				 
			});		
 
	}); */