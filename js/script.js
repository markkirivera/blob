// Initialization
function init() {
    // Modal 
    $(".modal-button").click(function() {
        $(".modal-search").addClass("is-active");
    });

    $(".modal-close").click(function() {
        $(".modal").removeClass("is-active");
    });
}

// Get cities from JSON file
function getCitiesJson() {
    $.getJSON("capital.json", function(json) {
        console.log(json);
    });
}

// Get current day 
function getCurrentDay() {
    var d = new Date();
    var n = d.getDay()

    return n;
}

function getNextDay(day) {
    var nextDay = '';

    if (day == 7) {
        nextDay = 0;
        return day;
    } else {
        nextDay = day + 1;
    }

    return nextDay;
}

function getDayName(n) {
    var day = '';

    if (n == 0) {
        day = 'Sunday';
    } else if (n == 1) {
        day = 'Monday';
    } else if (n == 2) {
        day = 'Tuesday';
    } else if (n == 3) {
        day = 'Wednesday';
    } else if (n == 4) {
        day = 'Thursday';
    } else if (n == 5) {
        day = 'Friday';
    } else if (n == 6) {
        day = 'Saturday';
    }

    return day;
}

function updateUI(data) {}

function renderCurrent(data) {
    const currCity = document.querySelectorAll('.current-city')[0];
    const currTemperature = document.querySelectorAll('.current-temperature')[0];
    const currCondition = document.querySelectorAll('.current-condition')[0];

    const currFeelslike = document.querySelectorAll('.feels-like')[0];
    const currHumidity = document.querySelectorAll('.humidity')[0];
    const currCloud = document.querySelectorAll('.cloud')[0];
    const currPressure = document.querySelectorAll('.pressure')[0];


    console.log('Current Forecast:');
    console.log(data);

    // Clear text 
    currCity.textContent = '';
    currTemperature.textContent = '';
    currCondition.textContent = '';

    // Update Current Forecast UI 
    currCity.textContent = data.name + ', ' + data.sys.country;
    currTemperature.textContent = data.main.temp + '°C';
    currCondition.textContent = data.weather[0].main;

    currFeelslike.textContent = 'Feels Like: ' + data.main.feels_like + '°C';
    currHumidity.textContent = 'Humidity: ' + data.main.humidity;
    currCloud.textContent = 'Clouds: ' + data.clouds.all;
    currPressure.textContent = 'Pressure: ' + data.main.pressure;

}

function renderDaily(data) {
    const dailyContainer = document.querySelectorAll('.daily-container')[0];
    dailyContainer.innerHTML = '';

    var day = getCurrentDay();

    console.log('5-Day Forecast:');
    console.log(dailyContainer);

    for (var i = 0; i < data.list.length; i++) {
        var obj = data.list[i];

        // Create elements 
        var cols = document.createElement('div');
        cols.classList.add('columns');
        cols.classList.add('is-mobile');

        var date = document.createElement('div');
        date.classList.add('column');
        date.textContent = getDayName(day);

        var temp = document.createElement('div');
        temp.classList.add('column');
        temp.textContent = obj.main.temp + '°C';

        var cond = document.createElement('div');
        cond.classList.add('column');
        cond.textContent = obj.weather[0].main;

        // var column = `<div class="column">${obj.dt_txt}</div>
        // <div class="column">${obj.main.temp}</div>
        // <div class="column">${obj.weather[0].main}</div>`;

        // console.log(obj.dt_txt + ' ' + obj.main.temp + ' ' + obj.weather[0].main);

        cols.appendChild(date);
        cols.appendChild(temp);
        cols.appendChild(cond);

        dailyContainer.appendChild(cols);

        console.log(day);
    }

}

// Check if API has no error 
function checkResponse(data) {

    if (data.cod == 200) {
        // console.clear();
        console.log('No error');
        console.log(data.cod);

        renderCurrent(data);
        getDaily(data.name);

    } else {
        console.log('Error');
        console.log(data.cod);
    }
}

// Get the forecast from API 
function getForecast(city) {

    const getCurrentForecast = async() => {

        let currentForecast = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=44475c9fda46d8cd4663a8c16ecb2619&units=metric`)
            .then(response => response.json())
            .then(data => {
                checkResponse(data);
            })
            .catch((e) => {
                console.log("Something went wrong" + e);
            });

    }

    getCurrentForecast();

}

function getDaily(city) {

    const getDailyForecast = async() => {

        const currentDaily = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=44475c9fda46d8cd4663a8c16ecb2619&cnt=7&units=metric`)
            .then(response => response.json())
            .then(data => {
                renderDaily(data);
            })
            .catch((e) => {
                console.log("Something went wrong" + e);
            });
    }

    getDailyForecast();

}

function getInput() {
    var input = document.querySelectorAll('.city-name')[0].value;

    return input;
}

$(".city-name").keyup(function(event) {
    if (event.keyCode === 13) {
        getInput();

        getForecast(getInput());
        console.log(getInput());

        $(".modal").removeClass("is-active");
    }
});

init();
getForecast('Tokyo');
// getDay();