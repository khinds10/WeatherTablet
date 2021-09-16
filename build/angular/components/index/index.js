/**
 * IndexController
 * @copyright Kevin Hinds @ KevinHinds.com
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

    // get the color for the temperature with the colors API
    $scope.tempColors = [];
    $scope.getColorForTemp = function(temp, dataElement) {
    	$http({
    	    url : window.apiColorLocation + "?temperature=" + temp,
    	    method : "GET",
    	    data : {}
    	}).then(function(response) {
            $scope.tempColors[dataElement] = response.data;	
    	}); 
    }

    // get weather to work from the local server calling the DarkSky API
    $scope.getWeatherConditions = function() {
		$scope.isWeatherLoading = true;
    	$http({
    	    url : window.apiLocation,
    	    method : "GET",
    	    data : {}
    	}).then(function(response) {
    	
    		$scope.currentWeather = response.data;
    		$scope.isWeatherLoading = false;
    		$scope.getColorForTemp($scope.currentWeather.currently.apparentTemperature, 'apparentTemperature');

    		// get the parsed weather for hour by hour summary
    		$scope.hourlyWeather = $scope.currentWeather.hourly.data.splice(0,12);
    		$scope.hourlyWeatherParsed = [];
    		$scope.colorValues = ['#4A80C7', '#80A4D5', '#B5BECA', '#D5DAE2', '#EDEEF0'];
    		angular.forEach($scope.hourlyWeather, function(value, key) {
              $scope.hourlyWeatherParsed[key] = value;
              
              // clear
              $scope.hourlyWeatherParsed[key].color = '#EDEEF0';
              
              // rain
              if (value.icon == 'rain' || value.icon == 'sleet' || value.icon == 'snow') {
                $scope.hourlyWeatherParsed[key].color = '#4A80C7';
                if (value.summary.indexOf('Light') !== -1) $scope.hourlyWeatherParsed[key].color = '#80A4D5';
              }
              
              // cloudy
              if (value.icon == 'cloudy' || value.icon == 'fog' || value.icon == 'wind') $scope.hourlyWeatherParsed[key].color = '#B5BECA'; 
              
              // partly cloudy
              if (value.icon == 'partly-cloudy-day' || value.icon == 'partly-cloudy-night') $scope.hourlyWeatherParsed[key].color = '#D5DAE2';
            });

    		// set current weather icon
    		$scope.setWeatherIcon('currentlyWeatherIcon', $scope.currentWeather.currently.icon);
    		
    		// set the forecast icons
    		$scope.setWeatherIcon('forecastWeatherIcon1', $scope.currentWeather.daily.data[0].icon);
    		$scope.setWeatherIcon('forecastWeatherIcon2', $scope.currentWeather.daily.data[1].icon);
    		$scope.setWeatherIcon('forecastWeatherIcon3', $scope.currentWeather.daily.data[2].icon);
    		
    		// setup the daily summaries for the next 3 days, with the extreme high/low temp listed
    		$scope.currentWeather.dailyAverages = [];
    		$scope.currentWeather.dailyExtreme = [];
    		$scope.currentWeather.dailyExtremeType = [];
			
			// get the averages for each day
			count = 0;
    		for (i = 0; i < 4; i++) { 
    			$scope.getColorForTemp($scope.currentWeather.daily.data[i].apparentTemperatureMin, 'data-'+i+'-min');
    			$scope.getColorForTemp($scope.currentWeather.daily.data[i].apparentTemperatureMax, 'data-'+i+'-max');
    			count = count + 3;
			}
			
			// if it's daytime after 4pm till 6am we'll show the lows, else it's daytime and we'll show the highs
    	    var today = new Date();
    	    var hourOfDay = today.getHours();
			if (hourOfDay > 16 || hourOfDay < 6) {
				$scope.currentWeather.dailyExtreme[0] = $scope.currentWeather.daily.data[0].apparentTemperatureMin;
				$scope.currentWeather.dailyExtremeType[0] = 'LOW';
			} else {
				$scope.currentWeather.dailyExtreme[0] = $scope.currentWeather.daily.data[0].apparentTemperatureMax;
				$scope.currentWeather.dailyExtremeType[0] = 'HIGH';
			}
			
			// get daily extreme color
			$scope.getColorForTemp($scope.currentWeather.dailyExtreme[0], 'dailyExtreme');
    	});
    }
    
	// based on current conditions set the "skycon" animated canvas
    $scope.setWeatherIcon = function(element, icon) {
    	var icons = new Skycons({"color": "white"}),
        list  = ["clear-day", "clear-night", "partly-cloudy-day","partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind","fog"],i;
      	for(i = list.length; i--; ) icons.set(element, icon);
    };
    
    // load page resources
	$scope.currentWeather = {};
	$scope.currentLocationInfo = {};
	$scope.currentLocationDetails = {};
	$scope.isWeatherLoading = true;
    $scope.currentYear = new Date().getFullYear();
    $scope.getWeatherConditions();
    
    // get the current weather conditions each 10 minutes
    $interval( function(){ $scope.getWeatherConditions(); }, 600000);
}]);
