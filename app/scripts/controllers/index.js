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

indexController.controller("homePageController", [ '$scope', '$http', '$interval', '$location', function($scope, $http, $interval, $location) {

	/** save lat/long position obtained from the browser */
	$scope.showNoLocationError = false;
	$scope.getConditionsByLocation = function (position) {
		if (typeof position.coords.latitude != 'undefined' && typeof position.coords.longitude != 'undefined') {
			$scope.isWeatherLoading = true;
        	$http({
        	    url : window.apiLocation+'?lat='+position.coords.latitude+'&lon='+position.coords.longitude,
        	    method : "GET",
        	    data : {}
        	}).then(function(response) {
        		$scope.currentWeather = response.data;
        		$scope.isWeatherLoading = false;
        		console.log($scope.currentWeather);
        		
        		/** set current weather icon */
        		$scope.setWeatherIcon('currentlyWeatherIcon', $scope.currentWeather.currently.icon);
        		
        		/** set the forecast icons */
        		$scope.setWeatherIcon('forecastWeatherIcon1', $scope.currentWeather.daily.data[0].icon);
        		$scope.setWeatherIcon('forecastWeatherIcon2', $scope.currentWeather.daily.data[1].icon);
        		$scope.setWeatherIcon('forecastWeatherIcon3', $scope.currentWeather.daily.data[2].icon);
        		
        		/** get the location details of your currently location based on current lat/long */
            	$http({
            	    url : window.apiLocationFinderService+'?q='+position.coords.latitude+','+position.coords.longitude+'&format=json',
            	    method : "GET",
            	    data : {}
            	}).then(function(response) {
            		$scope.currentLocationInfo = response.data;
            		var locationDetails = $scope.currentLocationInfo[0].display_name.split(',');
            		$scope.currentLocationDetails.street = locationDetails[0];
            		$scope.currentLocationDetails.city = locationDetails[1];
            		$scope.currentLocationDetails.county = locationDetails[2];
            		$scope.currentLocationDetails.state = locationDetails[3];
            		$scope.currentLocationDetails.zip = locationDetails[4];
            		$scope.currentLocationDetails.country = locationDetails[5];
            	});
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
    $scope.setWeatherIcon = function(element, icon) {
    	var icons = new Skycons(),
        list  = ["clear-day", "clear-night", "partly-cloudy-day","partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind","fog"],i;
      	for(i = list.length; i--; ) icons.set(element, icon);
      	icons.play();
    };
    
    /** load page resources */
	$scope.currentWeather = {};
	$scope.currentLocationInfo = {};
	$scope.currentLocationDetails = {};
	$scope.isWeatherLoading = true;
    $scope.currentYear = new Date().getFullYear();
    $scope.getWeatherConditions();
    
    /** turn on and off display mode based on URL */
    $scope.displayMode = false;
    var documentURL = window.location.href;
    $scope.displayModePattern = /displaymode=true$/;
    var isDisplayMode = documentURL.match($scope.displayModePattern)
    if (isDisplayMode) {
    	$scope.displayMode = true;
    }
    
    /** get the current weather conditions each 10 minutes */    
    $interval( function(){ $scope.getWeatherConditions(); }, 600000);
}]);