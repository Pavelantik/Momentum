//const DAY_ZONES = [{}18,24,6]
const MAX_IMAGE_NUMBER = 20;
const WEATHER_API ='d07966d7c47e9a98edafc87b90c9a147';
const DEFAULT_CITY_RECORD = '--'
const DEFAULT_NAME_RECORD = "[Type your name]";
const DEFAULT_PURPOSE_RECORD = "[Enter purpose]"

const  mainContainer = document.getElementById('main');
const  currentTimeText = document.querySelector('.time-text');
const  currentDateText = document.querySelector('.date-text');
const  citationText = document.querySelector('.quote-text');  
const  citationAuthor = document.querySelector('.quote-author');
const  quoteReloadBtn = document.querySelector('.quote-reload-btn');
const  quoteContainer = document.querySelector('.quote');
const  userNameElement = document.querySelector('.greeting-name');
const  purposeElement = document.querySelector('.purpose-input');
const  dtnNextWallpaper = document.querySelector('.bt-next-img');
const  dtnPrevWallpaper = document.querySelector('.bt-previous-img');
const typeWeatherElement = document.querySelector('.city-weather');
const weatherIcon = document.querySelector('.weather-icon');
const weatherInfoElement = document.querySelector('.weatherInfo');
const btnReloadImg = document.querySelector('.bt-reload-bunch-img');

let cityWether = getCity();
let currentDate = {};
let userName = getUserName();
let purposeValue = getPurpose();
let backgroundsList ={};

getQuota();
doUpdateTime()
getWeather()
window.onload = ()=> { 
  setInterval(automateTasks,1000);
  generateBackgroundsList();
  setRelevantBackgrounds();  
  
}
function automateTasks(){
  doUpdateTime();
  automateWallpaperChanger();  
}

function doUpdateTime(){  
  const NAMES_MONTHS = {
    0: 'january',
    1: 'february',
    2: 'march',
    3: 'april',
    4: 'may',
    5: 'june',
    6: 'july',
    7: 'august',
    8: 'september',
    9: 'october',
    10: 'november',
    11: 'december'
  }
  const NAMES_WEEK_DAYS = {
    0: 'sunday',
    1: 'monday',
    2: 'Tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'Saturday'
  }
  function makeTwoDigits(arg = ''){
    if(arg.length === 1) return `0${arg}`;
    return arg;
  }
 
  currentDate = new Date();
  let currentHours = makeTwoDigits(currentDate.getHours().toString());
  let currentMinutes = makeTwoDigits(currentDate.getMinutes().toString());
  let currentSeconds = makeTwoDigits(currentDate.getSeconds().toString());
  let currentMonth = currentDate.getMonth();
  let currentDay = currentDate.getDate();
  let currentWeekday = currentDate.getDay();

  currentTimeText.innerText = `${currentHours}:${currentMinutes}:${currentSeconds}`;
  currentDateText.innerText = `${NAMES_WEEK_DAYS[currentWeekday]}, ${currentDay} ${NAMES_MONTHS[currentMonth]}`
}

function automateWallpaperChanger(){
  let currentHourBackgroundUrl = backgroundsList[currentDate.getHours()]
  if(mainContainer.style.backgroundImage !== currentHourBackgroundUrl) {
    mainContainer.style.backgroundImage = backgroundsList[currentDate.getHours];
  }
}
function setRelevantBackgrounds(){
  let currentHour= new Date().getHours();
  mainContainer.style.backgroundImage =  setWallpaper(backgroundsListScroll[currentHour])// backgroundsList[currentHour];  
}


 let  backgroundsListScroll ={};
function  generateBackgroundsList(){
  for(let i = 0; i< 6; i++) backgroundsListScroll[i] = `assets/images/night/${getRandomValue(MAX_IMAGE_NUMBER)}.jpg`;
  for(let i = 6; i< 12; i++) backgroundsListScroll[i] = `assets/images/morning/${getRandomValue(MAX_IMAGE_NUMBER)}.jpg`;
  for(let i = 12; i< 18; i++) backgroundsListScroll[i] = `assets/images/day/${getRandomValue(MAX_IMAGE_NUMBER)}.jpg`;
  for(let i = 18; i<=23; i++) backgroundsListScroll[i] = `assets/images/evening/${getRandomValue(MAX_IMAGE_NUMBER)}.jpg`;
  for(let i=0; i<=23; i++) {
    backgroundsList[i] = `url("${backgroundsListScroll[i]}")`;
  }
  


  //backgroundsListScroll = Object.assign(backgroundsList);
}


btnReloadImg.addEventListener('click', (event) =>{
  generateBackgroundsList();
  setRelevantBackgrounds();
})

userNameElement.addEventListener('click', (ev) => ev.target.innerText = '');
userNameElement.addEventListener('keydown', (ev) => {
  if(ev.key === 'Enter') {   
    userNameElement.blur();
    return;
  };  
} )
userNameElement.addEventListener('blur', (ev) => ev.target.innerText === '' ? ev.target.innerText = userName : setUserName(ev.target.innerText));
purposeElement.addEventListener('click', (ev) => ev.target.innerText = '')
purposeElement.addEventListener('keydown', (ev) => { 
  if(ev.key === 'Enter') {    
    ev.target.blur();
    return;
  };
} )
purposeElement.addEventListener('blur', (ev) => ev.target.innerText === '' ? ev.target.innerText = purposeValue : setPurpose(ev.target.innerText))
function getRandomValue( max=1) {
  let min = 1;
  let res = (min + Math.trunc(Math.random()*(max - min+1))).toString();
  if(res.length===1)  res = `0${res}`;
  return res;  
}

function getQuota (){
   fetch('https://favqs.com/api/qotd')
  .then((resp) =>{
    if(resp.status === 200) {
      resp.json()
        .then ((quotaText) => {        
          citationText.innerText = '"' + quotaText.quote.body + '"';
          citationAuthor.innerText = quotaText.quote.author+'.';
        }) 
    } else {
      citationText.innerText = '';
      citationAuthor.innerText = '';
    }   
  })
}
quoteContainer.addEventListener('click',getQuota);

function getWeather() {
 
  let weatherUrl = new URL('https://api.openweathermap.org/data/2.5/weather');
  weatherUrl.searchParams.set('q',cityWether);
  weatherUrl.searchParams.set('lang','en');
  weatherUrl.searchParams.set('appid',WEATHER_API);
  weatherUrl.searchParams.set('units', 'metric');
 
  fetch(weatherUrl)
  .then( (resp) => {
    if (resp.status === 200)  {     
      resp.json()
      .then((wetherDate) => {
        weatherIcon.classList.add(`owf-${wetherDate.weather[0].id}`);
        weatherInfoElement.innerText = `${wetherDate.main.temp}°C, ${wetherDate.main.humidity}%, ${wetherDate.wind.speed}m/s`;
      })
    } else {
      if(cityWether !== DEFAULT_CITY_RECORD  ) {
        cityWether = DEFAULT_CITY_RECORD;
        typeWeatherElement.innerText = cityWether;
        localStorage.removeItem('cityWether')  
        weatherInfoElement.innerText = `--°C, --%, --m/s`;        
        alert('The entered city is incorrect or the server does not support it.'); 
      } else {
        cityWether = DEFAULT_CITY_RECORD;
        typeWeatherElement.innerText = cityWether;        
        weatherInfoElement.innerText = `--°C, --%, --m/s`;
      }
      
    }
  })
}


function getCity() {

  let name = readFromStore('cityWether');
  if( name === null || name === '' || name === undefined) {
    typeWeatherElement.innerText = DEFAULT_CITY_RECORD; 
  } else {
    typeWeatherElement.innerText = name;  
  }
  return typeWeatherElement.innerText 
}
function setCity(value=''){
  saveToStore('cityWether', value);
  cityWether = value;
}
typeWeatherElement.addEventListener('click', (ev) => ev.target.innerText = '');
typeWeatherElement.addEventListener('keydown', (ev) => {
  if(ev.key === 'Enter') {   
    typeWeatherElement.blur();
    return;
  };  
} )
typeWeatherElement.addEventListener('blur', (ev) => {
  ev.target.innerText === '' ? ev.target.innerText = cityWether : setCity(ev.target.innerText);
  getWeather(); 
})


function saveToStore (name, value) {  
  localStorage.setItem(name,JSON.stringify(value));
}
function readFromStore (name='') {  
  return JSON.parse(localStorage.getItem(name));
  
}

function getUserName() {
  let name = readFromStore('userName');
  if( name === null || name === '') {
     userNameElement.innerText = DEFAULT_NAME_RECORD;
  } else {
  userNameElement.innerText = name;
  
  }
  return userNameElement.innerText 
}
function setUserName(value=''){
  saveToStore('userName', value);
  userName = value;
}

function getPurpose (){
  let purpose = readFromStore('purposeValue');
  if( purpose === null || purpose === '') {
    purposeElement.innerText = DEFAULT_PURPOSE_RECORD;
  } else {
    purposeElement.innerText = purpose;   
  
  }
  return purposeElement.innerText 
}
function setPurpose(value=''){
  saveToStore('purposeValue', value);
  purposeValue = value; 
}


let restoreBackground = '';
dtnNextWallpaper.addEventListener('click', () =>{
  clearTimeout(restoreBackground)
  let currentBackgroundNumber = parseFloat( mainContainer.style.backgroundImage.slice(-8,-6));
  currentBackgroundNumber < 23 ? currentBackgroundNumber++ : currentBackgroundNumber = 0;  
 // mainContainer.style.backgroundImage = backgroundsList[currentBackgroundNumber]
  setWallpaper(backgroundsListScroll[currentBackgroundNumber])
  restoreBackground = setTimeout(setRelevantBackgrounds, 10000)
  dtnNextWallpaper.disabled = true;
  setTimeout(() =>{
    dtnNextWallpaper.disabled = false;
  } , 1500)
})


dtnPrevWallpaper.addEventListener('click', () =>{
  clearTimeout(restoreBackground)
  let currentBackgroundNumber = parseFloat( mainContainer.style.backgroundImage.slice(-8,-6)); 
  currentBackgroundNumber > 0 ? currentBackgroundNumber-- : currentBackgroundNumber = 23;
  //mainContainer.style.backgroundImage = backgroundsList[currentBackgroundNumber]
  setWallpaper(backgroundsListScroll[currentBackgroundNumber])



  restoreBackground = setTimeout(setRelevantBackgrounds, 10000);
  dtnPrevWallpaper.disabled = true;
  setTimeout(() =>{
    dtnPrevWallpaper.disabled = false;
  } , 1500)

})

function setWallpaper(imgSrc){
 
  const src = imgSrc;
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => {      
    mainContainer.style.backgroundImage  = `url(${src})`;
  }; 
}