# LocationIQ Bulk Reverse Geocode

## Summary

This script reverse geocodes each row of a CSV using the LocationIQ API.

## Instructions

1. Make sure you have NodeJS (https://nodejs.org/) installed
1. Run `npm install`
1. Make sure there's a file named `input.csv` exists
1. Make sure input.csv has a columns called "Latitude" and "Longitude"
1. Run the script from the command prompt with `node locationiq.js --key YOUR_API_KEY`
1. When done, you'll get a file called `output.csv` that matches your input but has additional columns
