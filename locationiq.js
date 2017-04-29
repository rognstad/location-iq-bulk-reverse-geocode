var fs = require('fs');
var request = require('request');
var csvjson = require('csvjson');
var async = require('async');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.key || typeof(argv.key) !== 'string') {
    console.log('Error! You must provide your API key as a param when running the script! See the readme.');
    return;
}

console.log('Reading input.csv');
var csv;
try {
    csv = fs.readFileSync('input.csv', {encoding: 'utf8'});
}
catch (e) {
    console.log('Error! Cannot read input.csv. It must exist.');
    return;
}

var json = csvjson.toObject(csv, {
    delimiter: ',',
    quote: '"'
});

var rowNum = 1;

var reverseGeocode = function reverseGeocodeF (row, cb) {
    console.log('Working on row ' + rowNum);

    if (!row.Latitude) {
        console.log('Error! Row ' + rowNum + ' does not have "Latitude"');
    }
    if (!row.Longitude) {
        console.log('Error! Row ' + rowNum + ' does not have "Longitude"');
    }
    var url = 'http://locationiq.org/v1/reverse.php?format=json&key=' + argv.key + '&lat=' + row.Latitude + '&lon=' + row.Longitude;
    rowNum++;
    request.get(url, function (err, res, body) {
        setTimeout(function () {
            if (err) {
                console.log('Uh oh, got an error!');
                console.log(err);
                console.log('Here\'s the row that had the error');
                console.log(row);
                cb(err);
            }
            else {
                var parsed = JSON.parse(body);
                row.display_name = parsed.display_name;
                row.house_number = parsed.address.house_number;
                row.road = parsed.address.road;
                row.suburb = parsed.address.suburb;
                row.city = parsed.address.city;
                row.county = parsed.address.county;
                row.state = parsed.address.state;
                row.postcode = parsed.address.postcode;
                cb(null);
            }
        }, 1000);
    });
};

var generateOutput = function generateOutputF (err) {
    console.log('Writing output.csv');
    var output = csvjson.toCSV(json, {headers: 'key', objectDenote: '', arrayDenote: ''});
    fs.writeFileSync('output.csv', output);
};

async.eachLimit(json, 1, reverseGeocode, generateOutput);
