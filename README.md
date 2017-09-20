# Weather Tablet
Wall Based Tablet for Current Weather

### Build the Webapp
To install dependancies and build:

Install "npm package manager" for the command line

`$ npm install`

`$ grunt`

#### Obtain DarkSky API access
Visit: https://darksky.net/dev/ and sign up for a free API account.

In the `server/` folder copy `config.shadow.php` to `config.php` and input your home location's latitude and longitude.  Also for the `$DarkSKYURI` value enter your DarkSky API key.


### Install software
Host your project on a local or public site that your tablet can connect to as a simple PHP - HTML/JS website. 

On your tablet install a "full-screen kiosk browser app", there are many available.

Point the tablet full screen browser app to your own instance of the Web App and it should begin to show the weather (also turn off the screen timeout on your device, so that it always shows the weather).

### Hang the walltablet
![Weather Tablet](https://raw.githubusercontent.com/khinds10/WeatherTablet/master/construction/wall-tablet.jpg "Weather Tablet")

Finished!
