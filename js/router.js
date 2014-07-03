var calendar = angular.module("calendar", [
	'ngRoute',
	'calendarControllers'
	]);

calendar.config(['$routeProvider', 
	function($routeProvider){
		$routeProvider.
			when('/year/:yearId/month/:monthId/day/:dayId', {
				templateUrl: "partials/table-calendar.html",
				controller: 'CalendarCtrl'
			}).
			otherwise({
				redirectTo: "/year/"+new Date().getFullYear()+"/month/"+(new Date().getMonth()+1)+"/day/"+new Date().getDate()
			})
	}]);