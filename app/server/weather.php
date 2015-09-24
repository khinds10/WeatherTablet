<?php
/**
 * PHP cURL call to return JSON response to Javascript
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
require 'config.php';

/** if we have a valid request with latitude and longitude, then call API */
if (isset($_GET["lat"]) && isset($_GET["lon"])) {
	echo cURL("https://{$DarkSKYURI}/forecast/{$APIKEY}/{$_GET["lat"]},{$_GET["lon"]}");
}

/**
 * get the response from the API to send to the JS
 * @param strong $URL
 * @return string, JSON encoded webservice response
 */
function cURL($URL) {
    /** is cURL installed yet? */
    if (!function_exists('curl_init')) {
        die('Sorry cURL is not installed!');
    }
    /** download response from URL */
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $URL);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}