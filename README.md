**Internet Installation Cost Calculator**


**Overview**

The Internet Installation Cost Calculator is a web application designed to calculate the installation cost of internet for various technologies based on cluster locations. Users can upload a text file containing information about cluster locations, including zip codes, latitudes, and longitudes. The application supports different cluster types (loop, star, wheel) and technologies (OFC, FSO, Wireless).

**Getting Started**

Prerequisites
Node.js: Make sure you have Node.js installed on your machine. You can download it from nodejs.org.

Installation
Clone the repository:
git clone https://github.com/jyothich12/NetworkCostCalculator.git

Navigate to the project directory:
cd NetworkCostCalculator

Install dependencies:
npm install

**Usage**

Start the application:
node src/app.js

Open your web browser and navigate to http://localhost:3000.

Upload a text file containing cluster location information.

Set cluster types (loop, star, wheel) and technologies (OFC, FSO, Wireless).

Calculate the installation cost.

File Format
The text file should follow a specific format: (Zip Code, Latitude, Longitude)

example
12345, 40.7128, -74.0060
67890, 34.0522, -118.2437
