const key = 'd728f497d1c84989b22a5d7e9600e402';
var currCity = '';

// Main Functions

// Initialization
function init() {

    $(".search.modal-button").click(function() {
        $(".modal-search").addClass("is-active");
    });

    $(".modal-close").click(function() {
        $(".modal").removeClass("is-active");
        hideSearchError();
    });

    $(".refresh").click(function() {
        refreshForecast();
    });

    checkLocalStorage();

    setTimeout(function() {
        removeLoadingClass();
    }, 2000);

}

function refreshForecast() {

    addLoadingClass();

    setTimeout(function() {
        removeLoadingClass();
    }, 2000);

    getCurrent(getCurrentCity());

}

function addLoadingClass() {
    var body = document.querySelectorAll('body')[0];
    body.classList.add('--loading');
}

function removeLoadingClass() {
    var loading = document.querySelectorAll('body')[0];
    loading.classList.remove('--loading');

}

function hideSearchModal() {
    var searchModal = document.querySelectorAll('.modal')[0];
    searchModal.classList.remove("is-active");
}

function showSearchError() {
    var warning = document.querySelectorAll('.warning')[0];
    warning.classList.remove('hidden');
}

function hideSearchError() {
    var warning = document.querySelectorAll('.warning')[0];
    var searchField = document.querySelectorAll('.city-name')[0];

    warning.classList.add('hidden');
    searchField.value = '';
}

function getCurrentCity() {
    var currCity = document.querySelectorAll('.current-city')[0];

    var the_string = currCity.textContent;
    var parts = the_string.split(',', 2);
    var the_text = parts[0];

    return the_text;
}

// Check local storage
function checkLocalStorage() {

    if (localStorage.getItem('preferences') !== null) {
        var cities = JSON.parse(localStorage.getItem('preferences'));

        // console.log(`Preferences exists`);
        // console.log(cities);

        getCurrent(cities);

    } else {
        const cities = ['Makati'];

        console.log(`Preferences not found`);
        localStorage.setItem('preferences', JSON.stringify(cities));

        getCurrent(cities[0]);
    }

}


function updateLocalStorage(city) {
    localStorage.setItem('preferences', JSON.stringify(city));
}

function getTimeFromDate(date) {
    var myDate = new Date(date);

    var hours = myDate.getHours();
    var minutes = myDate.getMinutes();

    var ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var strTime = hours + ':' + minutes + ampm;

    return strTime;

}

function getDayFromDate(date) {

    var myDate = new Date(date);
    var day = myDate.getDay();

    var dayName = '';

    if (day == 0) {
        dayName = 'Sunday';
    } else if (day == 1) {
        dayName = 'Monday';
    } else if (day == 2) {
        dayName = 'Tuesday';
    } else if (day == 3) {
        dayName = 'Wednesday';
    } else if (day == 4) {
        dayName = 'Thursday';
    } else if (day == 5) {
        dayName = 'Friday';
    } else if (day == 6) {
        dayName = 'Saturday';
    }

    return dayName;
}

function renderCurrent(response) {
    const currCity = document.querySelectorAll('.current-city')[0];
    const currTemperature = document.querySelectorAll('.current-temperature')[0];
    const currCondition = document.querySelectorAll('.current-condition')[0];

    const currFeelslike = document.querySelectorAll('.feels-like')[0];
    const currPrecipitation = document.querySelectorAll('.precipitation')[0];
    const currUV = document.querySelectorAll('.uv')[0];
    const currCloud = document.querySelectorAll('.cloud')[0];

    const unit = document.createElement('span');
    unit.textContent = '°C';

    // Clear text 
    currCity.textContent = '';
    currTemperature.textContent = '';
    currCondition.textContent = '';

    // Update Current Forecast UI 
    currCity.textContent = response.data[0].city_name + ', ' + response.data[0].country_code;
    currTemperature.textContent = (response.data[0].temp).toFixed(1);
    currTemperature.appendChild(unit);

    currCondition.textContent = response.data[0].weather.description;

    currFeelslike.textContent = 'Feels Like: ' + response.data[0].app_temp + '°C';
    currPrecipitation.textContent = 'Precip.: ' + (response.data[0].precip).toFixed(1);
    currCloud.textContent = 'Clouds: ' + response.data[0].clouds;
    currUV.textContent = 'UV: ' + response.data[0].uv;

}

function renderHourly(response) {
    const hourlyContainer = document.querySelectorAll('.hourly-container')[0];
    hourlyContainer.innerHTML = '';

    const title = document.createElement('h1');
    title.classList.add('title');
    title.textContent = 'Hourly Forecast'

    hourlyContainer.appendChild(title);

    for (i = 0; i < 5; i++) {
        var obj = response.data[i];

        var cols = document.createElement('div');
        cols.classList.add('columns');
        cols.classList.add('is-mobile');

        var date = document.createElement('div');
        date.classList.add('column');
        date.classList.add('time');
        date.textContent = getTimeFromDate(obj.timestamp_local);

        var temp = document.createElement('div');
        temp.classList.add('column');
        temp.classList.add('temp');
        temp.textContent = obj.temp + '°C';

        var cond = document.createElement('div');
        cond.classList.add('column');
        cond.classList.add('desc');
        cond.textContent = obj.weather.description;

        cols.appendChild(date);
        cols.appendChild(temp);
        cols.appendChild(cond);

        hourlyContainer.appendChild(cols);

    }

}

function renderDaily(response) {
    const dailyContainer = document.querySelectorAll('.daily-container')[0];
    dailyContainer.innerHTML = '';

    const title = document.createElement('h1');
    title.classList.add('title');
    title.textContent = 'Daily Weather Forecast'

    dailyContainer.appendChild(title);

    for (var i = 1; i < 8; i++) {
        var obj = response.data[i];

        // Create elements 
        var cols = document.createElement('div');
        cols.classList.add('columns');
        cols.classList.add('is-mobile');

        var date = document.createElement('div');
        date.classList.add('column');
        date.classList.add('time');
        date.textContent = getDayFromDate(obj.valid_date);

        var temp = document.createElement('div');
        temp.classList.add('column');
        temp.classList.add('temp');
        temp.textContent = obj.temp + '°C';

        var cond = document.createElement('div');
        cond.classList.add('column');
        cond.classList.add('desc');
        cond.textContent = obj.weather.description;

        cols.appendChild(date);
        cols.appendChild(temp);
        cols.appendChild(cond);

        dailyContainer.appendChild(cols);
    }

}

// Check if API has no error 
function checkResponse(data) {

    renderCurrent(data);
    getHourly(data.data[0].city_name);
    getDaily(data.data[0].city_name);

    hideSearchModal();

    updateLocalStorage(data.data[0].city_name);

}

// Get the forecast from API 
function getCurrent(city) {

    const getCurrentForecast = async() => {

        let currentForecast = await fetch(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${key}&include=minutely`)
            .then(response => response.json())
            .then(data => {
                checkResponse(data);
            })
            .catch((e) => {
                // console.log('Oh no! We did not find that location. Try checking your spelling.');
                showSearchError();
                // console.log("Something went wrong" + e);
            });

    }

    getCurrentForecast();

}

function getHourly(city) {

    const getHourlyForecast = async() => {

        let currentForecast = await fetch(`https://api.weatherbit.io/v2.0/forecast/hourly?city=${city}&key=${key}&hours=48`)
            .then(response => response.json())
            .then(data => {
                renderHourly(data);
            })
            .catch((e) => {
                // console.log("Something went wrong" + e);
            });

    }

    getHourlyForecast();

}

function getDaily(city) {

    const getDailyForecast = async() => {

        const currentDaily = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`)
            .then(response => response.json())
            .then(data => {
                renderDaily(data);
            })
            .catch((e) => {
                // console.log("Something went wrong" + e);
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

        getCurrent(getInput());
    }
});

init();