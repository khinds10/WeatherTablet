/**
 * IndexController
 * @copyright Kevin Hinds @ WeatherWheel.net
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *	http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
var indexController = angular.module("indexController", []);

indexController.controller("homePageController", [ '$scope', '$http', '$interval', function($scope, $http, $interval) {

	/** save lat/long position obtained from the browser */
	$scope.showNoLocationError = false;
	$scope.getConditionsByLocation = function (position) {
		if (typeof position.coords.latitude != 'undefined' && typeof position.coords.longitude != 'undefined') {
        	$http({
        	    url : window.apiLocation+'?lat='+position.coords.latitude+'&lon='+position.coords.longitude,
        	    method : "GET",
        	    data : {}
        	}).then(function(response) {
        		$scope.currentWeather = response.data;
        		console.log($scope.currentWeather);
        		
        		/** set current weather icon */
        		$scope.setWeatherIcon();	
        	});	
    	} else {
    		$scope.showNoLocationError = true;
    	}
	}

    /** get weather to work with from the local server calling the API */
    $scope.getWeatherConditions = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.getConditionsByLocation);
        } else { 
        	$scope.showNoLocationError = true;
        }
    }
    
	/** based on current conditions set the "skycon" animated canvas*/
    $scope.setWeatherIcon = function() {
    	var icons = new Skycons(),
        list  = ["clear-day", "clear-night", "partly-cloudy-day","partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind","fog"],i;
      	for(i = list.length; i--; ) icons.set('weatherIcon', $scope.currentWeather.currently.icon);
      	icons.play();
    };
    
    /** load page resources */
	$scope.currentWeather = {};
    $scope.currentYear = new Date().getFullYear();
    $scope.getWeatherConditions();
    
    /** get the current weather conditions each 10 minutes */    
    $interval( function(){ $scope.getWeatherConditions(); }, 600000);
}]);