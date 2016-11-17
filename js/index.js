var app=angular.module('app',['ui.router']);
app.controller('ctrl',['$scope','$http',function($scope,$http){
	
}]);


/*=====================*路由*=============================================================*/

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$stateProvider.state('alllist',{
		url:'/alllist/:tab',
		templateUrl:'views/alllist.html',
		controller:'alllistCtrl'
	}).state('my',{
		url:'/my/:tab',
		templateUrl:'views/my.html',
		controller:'myCtrl'
	}).state('details',{
		url:'/details/:nid',
		templateUrl:'views/details.html',
		controller:'detailsCtrl'
	})

	$urlRouterProvider.when('','/alllist/all');
}])


/*========================*控制器*==========================================================*/
// alllist
app.controller('alllistCtrl',['$scope','$http','$all','$rootScope','$stateParams',function($scope,$http,$all,$rootScope,$stateParams){
	
	$scope.contArr=[];
	$rootScope.tab=$stateParams.tab;
	$rootScope.loading=true;

	function getMore(){
		$all.alllist().success(function(data){console.log(data);
			$rootScope.page++;
			$scope.contArr=$scope.contArr.concat(data.data);
			$scope.news=$scope.contArr;
			$rootScope.loading=false;
		});
	}
	getMore();
	// 查看更多
	$scope.loadMore=function(){
		$rootScope.loading=true;
		getMore();
	}	

	// 搜索过滤
	$scope.searchfilter="";

}])

// my
app.controller('myCtrl',['$scope','$stateParams','$rootScope',function($scope,$stateParams,$rootScope){
	$rootScope.tab=$stateParams.tab;
}])

// details
app.controller('detailsCtrl',['$scope','$sce','$stateParams','$rootScope','$http','$all','$state',function($scope,$sce,$stateParams,$rootScope,$http,$all,$state){
	$rootScope.tab=$stateParams.tab;
	$rootScope.loading=true;

	$all.detailist().success(function(data){
		$scope.newcont=data.data.content;
		$scope.conthtml=$sce.trustAsHtml($scope.newcont);
		$rootScope.loading=false;
		console.log(data)
	})
}])


/*=======================*组件 directive*===========================================================*/

app.directive('tabtop',function(){
	return{
		templateUrl:'directives/index-tab.html'
	}
})

// 搜索栏
app.directive('searchbar',function(){
	return{
		templateUrl:'directives/searchbar.html'
	}
})

//底部nav
app.directive('bottombar',function(){
	return{
		templateUrl:'directives/bottombar.html'
	}
})


/*======================*服务*============================================================*/

app.service('$all',['$http','$stateParams','$rootScope',function($http,$stateParams,$rootScope){
	$rootScope.page=1;
	$rootScope.limit=10;
	return {
		alllist:function(){
			return $http.get('https://cnodejs.org/api/v1/topics',{
				params:{
					tab:$stateParams.tab,
					page:$rootScope.page,
					limit:$rootScope.limit,
					// mdrender:false
				}
			})
		},
		// 请求详情页
		detailist:function(){
			return $http.get('https://cnodejs.org/api/v1/topic/'+$stateParams.nid,{
				
			})
		}
	}
}])


