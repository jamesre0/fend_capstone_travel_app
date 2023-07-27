import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isBetween from 'dayjs/plugin/isBetween';

// If the environment is test, mock the dayjs function to always return false.
// This is needed to test code dependent on dates independently from the current date.
if (process.env.NODE_ENV === 'test') {
    dayjs.isToday = jest.fn().mockReturnValue(false);
    dayjs.isTomorrow = jest.fn().mockReturnValue(false);
    dayjs.isBetween = jest.fn().mockReturnValue(false);
    dayjs.isAfter = jest.fn().mockReturnValue(false);
}

// Extend dayjs with the plugins we need
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(isBetween);

/**
 * Handle the form submit event
 * @param {Event} event - The form submit event
 */
export async function handleSubmit(event) {
  event.preventDefault();

  // Extract the form data
  const location = document.getElementById('location').value;
  let date = document.getElementById('date').value;

  // Format the date to 'YYYY-MM-DD'
  date = dayjs(date, 'DD/MM/YYYY').format('YYYY-MM-DD');

  const dateNow = dayjs();
  const travelDate = dayjs(date);

  // Decide the type of forecast to request based on the travel date
  let forecast = 'current';
  if (travelDate.isTomorrow() || travelDate.isBetween(dateNow.add(1, 'day'), dateNow.add(7, 'days'))) {
    forecast = 'forecast';
  } else if (travelDate.isAfter(dateNow.add(7, 'days'))) {
    forecast = 'unavailable';
  }

  try {
    // Request the weather data from the server
    const response = await fetch(`http://localhost:3000/weather?location=${location}&date=${date}&forecast=${forecast}`);
    
    // If the response is not ok, display an alert to the user with the server message
    if (!response.ok) {
      const data = await response.json();
      alert(data.message);
      return;
    }

    let { temp, weather, imageUrl } = await response.json();

    // If no temperature data was returned, set a default temperature
    if (!temp) {
      temp = 20;
    }

    // If no weather or image data was returned, show an alert
    if (!weather || !imageUrl) {
      return alert('Something went wrong');
    }

    // Update the UI with the received data
    const temperature = document.getElementById('temperature');
    const weatherDescription = document.getElementById('weatherDescription');
    const locationImage = document.getElementById('locationImage');
    const forecastType = document.getElementById('forecastType');

    temperature.textContent = `Temperature: ${temp}°C`;
    weatherDescription.textContent = `Weather: ${weather.description}`;
    locationImage.src = imageUrl;
    forecastType.textContent = forecast === 'current' ? 'Current Weather' : 'Weather Forecast';

    // Log the updated elements
    console.log(temperature);
    console.log(weatherDescription);
    console.log(locationImage);

    // Display the weather info section
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.style.display = 'block';
  } catch (error) {
    console.error(error);
    alert('Something went wrong');
  }
}
