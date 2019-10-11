$(document).ready(function(){
  
  var firstQuery = true;
  
  var queryOptions = {
    units: 'metric',
    position : ''
  }
 
  var weatherData;
  
  var getPosition = function () {
    return $.getJSON("https://bumpy-icon.gomix.me/ip?callback=?" /*https://freegeoip.net/json/?callback=?*/, function (response) {
      queryOptions.position = {
        lat : response.lat,
        lon : response.lon,
        city : response.city,
        countryCode : response.countryCode
      }; 
    });
  };

  var getWeather = function(data) {  
    var baseUrl = 'https://bumpy-icon.gomix.me/weather'//'http://api.openweathermap.org/data/2.5/weather';
    var queryUrl = baseUrl + '?lat=' + queryOptions.position.lat + '&lon=' + queryOptions.position.lon + '&units=' + queryOptions.units + '&callback=?';
    return $.getJSON(queryUrl);
  }

  
  var displayData = function(data){
    
    weatherData = data;
    
    if(queryOptions.units === 'imperial'){
      var tempUnits = 'wi wi-fahrenheit';
      var speedUnits = ' MPH ';
      var hue = 250 - Math.round((data.main.temp-32)*3.333);;
    }
    else{
      tempUnits = 'wi wi-celsius';
      speedUnits = ' m/s ';
      hue = 250 - Math.round(6*data.main.temp);
    }    
    
      if( Date.now() >= data.sys.sunrise*1000 && Date.now() <= data.sys.sunset*1000)
        var iconSwitch = '-day-';
      else
        iconSwitch = '-night-';

    var resetHue = function(x){
      x =  (x > 360) ? x -360 : x; 
      return (x < 0) ? x + 360 : x;  
    }

    $('.view').fadeOut(function(){
      $('#C').text(data.name+', '+data.sys.country);
      $('#I').removeClass().addClass("wi wi-owm"+iconSwitch+data.weather[0].id);
      $('#D').text(data.weather[0].description);
      $('#T').text(Math.round(data.main.temp*2)/2);
      $("#T-units").removeClass().addClass(tempUnits);
      $("#P").text(Math.round(data.main.pressure));
      $("#H").text(Math.round(data.main.humidity));
      $("#W").text(Math.round(data.wind.speed*2)/2);
      $("#W-dir").removeClass().addClass('wi wi-wind towards-'+Math.round(data.wind.deg)+'-deg');
      $("#W-units").text(speedUnits);
      $('.view').css('background','linear-gradient(to bottom , hsl('+resetHue(hue)+',70%,20%), hsl('+resetHue(hue+60)+',80%,40%))');
      $('.view').fadeIn();
    });
    
    if(firstQuery){
      if(data.main.temp > 32)
        $('body').css('background-image','url(https://rawgit.com/Em-Ant/fcc-course/master/front-end_cert/projects/intermediate/02-weather-app/img/w_bg_4.jpg)');
      else if (data.main.temp > 22)
        $('body').css('background-image','url(https://rawgit.com/Em-Ant/fcc-course/master/front-end_cert/projects/intermediate/02-weather-app/img/w_bg_3.jpg)');
      else if (data.main.temp > 5)
        $('body').css('background-image','url(https://rawgit.com/Em-Ant/fcc-course/master/front-end_cert/projects/intermediate/02-weather-app/img/w_bg_2.jpg)');
      else
        $('body').css('background-image','url(https://rawgit.com/Em-Ant/fcc-course/master/front-end_cert/projects/intermediate/02-weather-app/img/w_bg_1.jpg)');
      $('.preloader').fadeOut();
      firstQuery = false;
    }    
    $('body').css('background-size','cover');
  };
  
  function displayErr(xhr,err){
    $('.view').hide();
    $('#city').text('------');
    $('#w-icon').removeClass().addClass('wi wi-na');
    $('#D').text('Connection Error');
    $('#T').text('--');
    $("#T-units").removeClass();
    $("#P").text('----');
    $("#H").text('---');
    $("#W").text('---');
    $("#W-dir").removeClass().addClass('wi wi-wind');
    $("#W-units").text('---');
    $('.view').fadeIn();    
  }

  $('.screen, .push').click(function(){  
    if(queryOptions.units === 'imperial')
      queryOptions.units = 'metric';
    else
      queryOptions.units = 'imperial';
    getWeather().then(displayData,displayErr);
  });
  
  getPosition().then(getWeather,displayErr).then(displayData,displayErr);
  
});

