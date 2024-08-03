let input = document.querySelector(".locSearch");
let inputContainer = document.querySelector(".input");
let weatherContainer = document.querySelector('.weather');
let search = document.querySelector(".search");
let date = new Date();
let humidityAmount = document.querySelector(".humidityAmount");
let windDegree = document.querySelector(".windDegree");
let middle = document.querySelector(".middle");

async function getWeatherInfo(city) {
    let location = await fetch(`https://us1.locationiq.com/v1/search.php?key=pk.6071c5c3a9cb08816a0322571ed3bb53&q=${city}&format=json`).then(res => res.json());
    let latitude = location[0].lat;
    let longitude = location[0].lon;
    let weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max&timezone=Europe%2FMoscow&forecast_days=14`).then(res => res.json());
    let tempUnit = weather.current_units.temperature_2m;
    let dayTemp = weather.current.temperature_2m;
    let humidity = weather.current.relative_humidity_2m;
    let wind = weather.current.wind_speed_10m;
    let currentDate = date.getDate();
    let currentMonth = date.getMonth();
    let currentDay = date.getDay();
    let currentYear = date.getFullYear();

    function getMonthName(currentMonth) {
        switch (currentMonth) {
            case 0: return "January";
            case 1: return "February";
            case 2: return "March";
            case 3: return "April";
            case 4: return "May";
            case 5: return "June";
            case 6: return "July";
            case 7: return "August";
            case 8: return "September";
            case 9: return "October";
            case 10: return "November";
            case 11: return 'December';
            default: break;
        }
    }

    function getFullDay(currentDay) {
        switch (currentDay) {
            case 0: return 'Sunday';
            case 1: return 'Monday';
            case 2: return 'Tuesday';
            case 3: return 'Wednesday';
            case 4: return 'Thursday';
            case 5: return 'Friday';
            case 6: return 'Saturday';
            default: break;
        }
    }

    let today = document.createElement("div");
    today.classList.add("today");
    today.innerHTML =
        `
        <div class="dayInfo">
            <h2 class="todayDay">${getFullDay(currentDay)}</h2>
            <p class="todayDate">${currentDate} ${getMonthName(currentMonth)}, ${currentYear}</p>
            <p class="address">${input.value}</p>
        </div>
        <div class="weatherInfo">
            <img src="images/wind.png" alt="windy" class="weatherIcon">
            <h1 class="temp">${dayTemp} ${tempUnit}</h1>
            <p class="weatherCondition">Windy</p>
        </div>
    `;

    weatherContainer.appendChild(today);

    function getAbbreviatedDayName(dateString) {
        const date = new Date(dateString);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return dayNames[date.getDay()];
    }

    for (let i = 0; i < 7; i++) {
        let dateDaily = weather.daily.time[i];
        let windDaily = weather.daily.temperature_2m_max[i];
        let dayName = getAbbreviatedDayName(dateDaily);
        let dateParts = dateDaily.split("-");
        let day = dateParts[2];

        let days = document.createElement("div");
        days.classList.add("days");
        days.innerHTML =
            `
            <img src="images/wind.png" class="imgIcon">
            <p class="day">${dayName}</p>
            <p class="degree">${windDaily}</p>
        `;
        days.addEventListener("mouseleave", function () {
            let imgIcon = this.querySelector(".imgIcon");
            imgIcon.style.filter = "invert(1)";
        });

        days.addEventListener("mouseenter", function () {
            let imgIcon = this.querySelector(".imgIcon");
            imgIcon.style.filter = "none";
        });

        middle.appendChild(days);
    }

    humidityAmount.innerText = `${humidity} %`;
    windDegree.innerText = `${wind} km/h`;
}

input.addEventListener('keypress', function (e) {
    if (e.key == 'Enter') {
        inputContainer.style.display = 'none';
        weatherContainer.style.display = 'flex';
        getWeatherInfo(input.value);
    }
});

search.addEventListener("click", () => {
    inputContainer.style.width = "260px";
    setTimeout(() => {
        input.style.display = "inline";
    }, 1400);
});

