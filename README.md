# vass
Back end service for Vass

I used the last version of node 14.4.0
For npm I used the version 6.14.5

To run the app, execute:
git clone https://github.com/Pastor59/vass.git
cd vass
npm install
npm start

npm test #For testing

If mocha is not installed globally, it should execute as a root:
npm install -g mocha

On production I'll use https with the keys instead of http. Also, the file .env it'll be in .gitignore

I understand that the json files http://www.mocky.io/v2/5808862710000087232b75ac http://www.mocky.io/v2/580891a4100000e8242b75c5 pretend to be the date base and it could change so I get the data for every request.

In real environment I would create test data in a different database for the testing. Here I just take the json from the urls for the testing (but I know this is a contradiction of what I said before about the json files could change). For the test use case that I can't test because there is no example on http://www.mocky.io/v2/5808862710000087232b75ac or http://www.mocky.io/v2/580891a4100000e8242b75c5 I use unit testing instead of functional testing.