// Importing necessary testing and server modules
const request = require("supertest");
const fetch = require('node-fetch');
const app = require("../src/server/server");

let server;

// Before all tests, store the server instance for further usage
beforeAll(() => {
  server = app;
});

// After all tests, close the server
afterAll(done => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
});

// Mock response data
const responseLondon = {
  geonames: [{
    lat: '51.50853',
    lng: '-0.12574',
  }]
};

const responseWeather = {
  data: [{
    temp: 20,
    weather: {
      description: "clear sky"
    }
  }]
};

const responsePixabay = {
  hits: [{
    webformatURL: "http://example.com/image.jpg"
  }]
};

// Mock 'node-fetch' to simulate server responses
jest.mock('node-fetch', () => {
  return jest.fn()
    .mockReturnValueOnce(Promise.resolve({ json: () => Promise.resolve(responseLondon) })) // Mock geonames response
    .mockReturnValueOnce(Promise.resolve({ json: () => Promise.resolve(responseWeather) })) // Mock weather data response
    .mockReturnValueOnce(Promise.resolve({ json: () => Promise.resolve(responsePixabay) })); // Mock Pixabay image response
});

// Describing a test suite for server-side code
describe("Server Tests", () => {
  // Before each test, clear all instances of fetch being called
  beforeEach(() => {
    fetch.mockClear();
  });

  // Test case: server should return weather data for a valid location
  it("should return weather data for a valid location", async () => {
    const response = await request(app).get("/weather?location=London&date=2023-07-26&forecast=current");

    // Assertions: Check if the server behaves as expected
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("temp");
    expect(response.body).toHaveProperty("weather");
    expect(response.body).toHaveProperty("imageUrl");
  });
});
