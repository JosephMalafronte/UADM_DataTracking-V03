//JOSEPH MALAFRONTE
//TWITTER BOT NODE.JS
//Requires installation of NODE.JS and supporting libraries 


var fs = require('fs');
var jsonfile = require('jsonfile')
var readline = require('readline');
var lodash = require('lodash');
var Twit = require('twit');
var config = require('./config'); 

var rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout,
	  terminal: false
	});

console.log('The bot is starting');

var T = new Twit(config);

var tweets;

//SELECT DYN OR PRE
//getUserInput();
setUpProfileTweets();
setUpWordMentions();


var response;

var searchTerm;

function getUserInput(){
	
	console.log("Enter the term:");


	rl.on('line',function(line){
    //console.log(line);
    searchTerm = line;
    rl.close();
    dynSetUp();
})
}

function dynSetUp(){

	var qString = searchTerm;

	var params = {
		q: qString,
		count:100
	}

	T.get('search/tweets', params, gotData);
}

var sName = 'UADanceMarathon';

function setUpProfileTweets(){

	//var qString = 'UADanceMarathon';

	var params = {
		screen_name: 'UADanceMarathon'
	}

	T.get('statuses/user_timeline', params, gotDataProfileTweets);
	T.get('statuses/user_timeline', params, gotDataProfileTweetsSave);
	rl.close();
}


var allData;
var profTweetsData;

function gotDataProfileTweets(err, data, response){
	var fileLoc = 'twitDataProfileTweets.json';
	profTweetsData = data;

	var oldProfTweets = JSON.parse(fs.readFileSync(fileLoc, 'utf8'));
	console.log("Retreiving tweets from @" + sName + " twitter account.");
	var newProfTweets = profTweetsData.concat(oldProfTweets);

	//Following code segment deletes all duplicate tweets from the JSON base on tweet ID
		var seenNames = {};

		newProfTweets = newProfTweets.filter(function(currentObject) {
		    if (currentObject.id in seenNames) {
		        return false;
		    } else {
		        seenNames[currentObject.id] = true;
		        return true;
		    }
		});


	console.log(newProfTweets[0].created_at);

	jsonfile.spaces = 4;
	jsonfile.writeFile(fileLoc,newProfTweets,function (err) {
		
	})
	

}

//var oldProfTweets;

function gotDataProfileTweetsSave(err, data, response){

	allData = data;
	profTweetsData = data;

	var today = new Date();
	var dd = today.getDate();
	var ss = today.getSeconds();
	var hh = today.getHours();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	

	var fileLoc = 'SavedDates/twitDataProfileTweets_' + mm + '-' + dd + '-'
	 + hh + '-' + ss + '.json';
	
	/*tweets = allData.statuses;
	for(var i=0;i<tweets.length;i++){
		console.log(i);
		console.log(tweets[i].text);
	}*/

	jsonfile.spaces = 4;
	jsonfile.writeFile(fileLoc,profTweetsData,function (err) {
		
	})
	

}

function setUpWordMentions(){

	var qString = "UADM since:2016-11-11";

	var params = {
		q: qString,
		count:100
	}

	T.get('search/tweets', params, gotDataWordMentions);
	T.get('search/tweets/', params, gotDataWordMentionsSave);
	rl.close();
}


var allData;


function gotDataWordMentions(err, data, response){
	var fileLoc = 'twitDataWordMentions.json';
	allData = data;
	/*tweets = allData.statuses;
	for(var i=0;i<tweets.length;i++){
		console.log(i);
		console.log(tweets[i].text);
	}*/

	jsonfile.spaces = 4;
	jsonfile.writeFile(fileLoc,allData,function (err) {
		
	})
	

}

function gotDataWordMentionsSave(err, data, response){


	var today = new Date();
	var dd = today.getDate();
	var ss = today.getSeconds();
	var hh = today.getHours();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();




	var fileLoc = 'SavedDates/twitDataWordMentions_' + mm + '-' + dd + '-'
	 + hh + '-' + ss + '.json';
	allData = data;
	/*tweets = allData.statuses;
	for(var i=0;i<tweets.length;i++){
		console.log(i);
		console.log(tweets[i].text);
	}*/

	jsonfile.spaces = 4;
	jsonfile.writeFile(fileLoc,allData,function (err) {
		
	})
	

}








