var calendarControllers = angular.module('calendarControllers', []);

calendarControllers.controller('CalendarCtrl', ['$scope', '$routeParams', '$location',
	function($scope, $routeParams, $location){

		//--Set values

		isToday = function(year, month, day){
			return (parseInt(year) == parseInt(new Date().getFullYear()) && parseInt(month) == parseInt(new Date().getMonth()+1) && parseInt(day-1) == parseInt(new Date().getDate())) ? true: false;
		};

		isSelected = function(modelDay, dayInWeek){
			return ((new Date().getDate() != parseInt(modelDay)) && (parseInt(modelDay) == parseInt(dayInWeek))) ? true: false;
		};

		$scope.month_value = (function(){
			var months = [
  				'January',
  				'February',
  				'March',
  				'April',
  				'May',
  				'June',
  				'July',
  				'August',
  				'September',
  				'Oktober',
  				'November',
  				'December']

  				return months[$routeParams.monthId-1];
		})();

		$scope.year_value = $routeParams.yearId;

		$scope.weeks = (function(){
			var year = +$routeParams.yearId;
			var month = +$routeParams.monthId;

			var countDays = 32 - new Date(year, month-1, 32).getDate();
			var placeOfFirstDay = new Date(year, month-1, 1).getDay();

			if(placeOfFirstDay == 0) placeOfFirstDay = 7;

			var weeks = [];

			var firstWeek = [];
			var day = 1;
			for (var i = 1; i <= 7; i++){
				firstWeek.push(Object.create({
					title: i < placeOfFirstDay ? "" : day++,
					isToday: isToday(year, month, day),
					isSelected: isSelected(+$routeParams.dayId, day-1)
				}));
			}

			weeks.push(firstWeek);

			var week = [];
			for (var i = day; i <= countDays; i++) {
				week.push(Object.create({
					title: day++,
					isToday: isToday(year, month, day),
					isSelected: isSelected(+$routeParams.dayId, day-1)
				}));

				if(week.length == 7) {
					weeks.push(week);
					week = [];
				}
			};

			if(week.length > 0 && week.length < 6)
				for (var i = week.length - 1; i < 6; i++) {
					week.push(Object.create({
						title: "",
						isToday: isToday(year, month, day),
						isSelected: isSelected(+$routeParams.dayId, day-1)
					}));
				};

			weeks.push(week);

			return weeks;
		})();

		//-------------------------------------------------------

		//--Actions

		var check = function(params, flag, yearFlag){
			
			var year = params.yearId;
			var month = params.monthId;
			var day = params.dayId;

			if(!flag){
				if(month - 1 == 0){
					month = 13;
					year -= 1;
				}

				if(yearFlag){
					var count = 32 - new Date(year-1, month-1, 32).getDate();
					if(day > count){
						day = count;
					}					
				}
				else{
					var count = 32 - new Date(year, month-2, 32).getDate();
					if(day > count){
						day = count;
					}
				}
			} 
			else {
				if(+month + 1 == 13){
					month = 0;
					+year++;
				}

				if(yearFlag){
					var count = 32 - new Date(year+1, month-1, 32).getDate();
					if(day > count){
						day = count;
					}	
				}
				else{
					var count = 32 - new Date(year, month, 32).getDate();
					if(day > count){
						day = count;
					}
				}
			}

			return {
				year: year,
				month: month,
				day: day
			}
		}

		$scope.prevYear = function(){
			var date = check($routeParams, false, true);
			$location.path("/year/"+(date.year-1)+"/month/"+(date.month)+"/day/"+(date.day));
		};

		$scope.prevMonth = function(){	
			var date = check($routeParams, false, false);
			$location.path("/year/"+(date.year)+"/month/"+(date.month-1)+"/day/"+(date.day));
		};

		$scope.nextYear = function(){
			var date = check($routeParams, true, true);
			$location.path("/year/"+(+date.year+1)+"/month/"+(date.month)+"/day/"+(date.day));	
		};

		$scope.nextMonth = function(){
			var date = check($routeParams, true, false);
			$location.path("/year/"+(date.year)+"/month/"+(+date.month+1)+"/day/"+(date.day));		
		};

		$scope.goToDay = function(){
			$location.path("/year/"+new Date().getFullYear()+"/month/"+(new Date().getMonth()+1)+"/day/"+new Date().getDate());
		}

		$scope.goToAnotherDay = function(day){
			$location.path("/year/"+(+$routeParams.yearId)+"/month/"+(+$routeParams.monthId)+"/day/"+(+day.title));
		}

		//-------------------------------------------------------

		//--Validation
		var error = true;

		if($routeParams.yearId > 0){
			if($routeParams.monthId > 0 && $routeParams.monthId < 13){
				var count = 32 - new Date($routeParams.yearId, $routeParams.monthId-1, 32).getDate();
				if($routeParams.dayId > 0 && $routeParams.dayId < count + 1)
				{
					error = false;;
				}
			}
		}

		if(error) $location.path("/route");

		//-------------------------------------------------------
}]);