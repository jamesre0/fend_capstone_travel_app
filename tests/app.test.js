// Importing necessary testing utilities
import { act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { handleSubmit } from "../src/client/js/app";

// Describing a test suite for client side code
describe("Client Tests", () => {
    // Test case: handleSubmit should make a fetch request and update the DOM
    it("handleSubmit should make a fetch request and update the DOM", async () => {
        // Creating DOM elements to be used in the test
        const location = document.createElement('input');
        const date = document.createElement('input');
        const temperature = document.createElement('div');
        const weatherDescription = document.createElement('div');
        const locationImage = document.createElement('div');
        const forecastType = document.createElement('div');
        const weatherInfo = document.createElement('div');

        // Assigning ids to the created elements
        location.id = 'location';
        date.id = 'date';
        temperature.id = 'temperature';
        weatherDescription.id = 'weatherDescription';
        locationImage.id = 'locationImage';
        forecastType.id = 'forecastType';
        weatherInfo.id = 'weatherInfo';

        // Assigning values to the elements
        location.value = 'London';
        date.value = '26/07/2023';

        // Appending elements to the document body
        document.body.append(location, date, temperature, weatherDescription, locationImage, forecastType, weatherInfo);

        // Mock window.alert function
        window.alert = jest.fn();

        // Mock the global fetch function
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ temp: 20, weather: { description: 'clear sky' }, imageUrl: 'http://example.com/image.jpg' }),
            })
        );

        // Creating a mock event
        const event = {
            preventDefault: jest.fn(),
        };

        // Wrapping handleSubmit function call in `act` for React to track all the updates
        await act(async () => {
            await handleSubmit(event);
        });

        // Print temperature to the console for debugging
        console.log(temperature.textContent);

        // Assertions: Check if the function behaves as expected
        expect(temperature).toHaveTextContent("Temperature: 20°C");
        expect(weatherDescription).toHaveTextContent("Weather: clear sky");
        expect(locationImage.src).toEqual("http://example.com/image.jpg");
        expect(forecastType).toHaveTextContent("Current Weather");
    });
});
