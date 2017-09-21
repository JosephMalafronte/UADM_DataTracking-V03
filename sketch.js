//JOSEPH MALAFRONTE
//UADM TWITTER BOT V01
//Must use with Bot node.js file


var lineX = 0;
var dataWordMentions;
var dataProfileTweets;

var tweets;
var tweetsFromUser;

function tweetObj(tweetText, rtNum, month, day){
	this.tweetText = tweetText;
	this.rtNum = rtNum;
	this.month = month;
	this.day = day;
    this.circleW = 0;
    this.cirlceH = 0;
    this.circleR = 0;
}

var userTweetsArr;
var catDataArr= [];


//This function is run before setup
function preload(){


    //IF PULLING FROM RECENT NODE BOT RUN
    dataWordMentions = loadJSON("twitDataWordMentions.json");
    dataProfileTweets = loadJSON("twitDataProfileTweets.json");

    /*
    *IF PULLING FROM SAVED JSONS*
    *dataWordMentions = loadJSON("SavedDates/twitDataWordMentions4-17.json");
    *dataProfileTweets = loadJSON("SavedDates/twitDataProfileTweets4-17.json");
    ***/
}

//This function is run before the draw function
function setup() {
    var canvas = createCanvas(1000, 500);
    canvas.parent('sketch-holder');
    

    //console.log(data);


    tweets = dataWordMentions.statuses;

    createElement('h1', "User Mentions");
    for(var i =0;i<tweets.length;i++){
        createElement('h2',tweets[i].user.name);
        createDiv(tweets[i].text);
        createDiv(tweets[i].created_at)
    	
    }

    tweetsFromUser = dataProfileTweets;

    //Create a new array of tweets that is only the most recent 20 tweets
    if(tweetsFromUser.length>20){
        for(var i = 0; i<20; i++){
            catDataArr.push(tweetsFromUser[i]);
        }
    }
    else catDataArr = tweetsFromUser;


    //Create an array of tweetObjs based on the 20 most recent tweets
    userTweetsArr = [];
    randomSeed(3);
    for(var i = 0;i<catDataArr.length;i++){
    	var thisTweet = catDataArr[i];
        console.log(thisTweet);
    	var tweetText = thisTweet.text;
    	var rtNum = thisTweet.retweet_count;

    	var dateString = thisTweet.created_at;
    	var dateStringSplit = dateString.split(" ");
    	var monthName = dateStringSplit[1];
    	var monthNum = getMonthNum(monthName); 
    	var dayNum = parseInt(dateStringSplit[2]);

    	var insTweet = new tweetObj(tweetText, rtNum, monthNum, dayNum);

        //Determin the tweetObj's x and y coordinates and its radius
        var h=0; var w=0;
        if(i%2==0)h = random(130,height-140);
        else h = random(height-140,height-100);

        insTweet.circleH = h;

        var exx = width /20;
        var w = ((catDataArr.length - i) * exx    );
        insTweet.circleW = w;

        var rt = rtNum * 4;
        if(rt<25) rt = 25;
        if(rt > 150) rt = 150;
        insTweet.circleR = rt;


    	userTweetsArr.push(insTweet);

    }




    
}


//Helper function, send it a month abreviation and it returns its month number
function getMonthNum(monthName){
	var monthNum = 0;

	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	monthNum = months.indexOf(monthName) + 1;

	return monthNum;

}




var Done = 0;

var tweetBoxNum = -1;


//Draw function is constantly running and redrawing the sketch
function draw() {
    randomSeed(5);
    background(51); // Gray background

    //Check that tweets array has been created before attempting to draw circles
    if(tweetsFromUser){
        for(var j=catDataArr.length;j>0;j--){
            var tweet = userTweetsArr[j-1];

            rt = tweet.circleR;
            var rtOrg = tweet.rtNum;
            
            if(rtOrg<10) fill('white');
            else if(rtOrg<30) fill('orange');
            else fill('red');

            var month = tweet.month;
            var day = tweet.day;

            
            var w = tweet.circleW;
            var h = tweet.circleH;

            //If "scanner line" has reached the middle of the circle display the circle
            if(w <= lineX ){
                ellipse(w,h,rt,rt);
                noStroke();
                textSize(24);
                fill('black');
                textAlign(CENTER);
                text(rtOrg, w,h+7);

                noStroke();
                textSize(18);
                fill('white');
                textAlign(CENTER);
                text(tweet.month.toString() + '/' + tweet.day.toString(), w,height-10);
            }
        }
    }
     

    //Display Header Info
        //Sketch Title
        if(tweets){
            noStroke();
            textSize(24);
            fill(255);
            textAlign(CENTER);
            text('ReTweet Tracker', width/2, 30);
        }
       
        //In progress text
        if(Done == 0){
            noStroke();
            textSize(20);
            fill(255);
            textAlign(CENTER);
            text('Scanning Twitter Data...', width/2, 60);
        }

        //Scan complete text
        if(Done == 1){
            noStroke();
            textSize(20);
            fill(255);
            textAlign(CENTER);
            text('Scan Complete', width/2, 50);
        }


    //"Line reader" that scans through the sketch
        stroke(255);
        line(lineX, 0, lineX, height);
        var xSpeed = 1.3; //Change this number to change speed that line scans the document
        lineX = lineX + xSpeed;
        //if scan line passes the frame set Done var to 1
        if (lineX > width) {
            lineX = lineX - xSpeed;
            Done = 1;
        }

    //Checks if the user has clicked on a tweet
    //If so display the tweet information based on tweetBoxNum
    if(tweetBoxNum > -1){
        //Create box
        stroke('black');
        fill('white');
        rect(width/2-225,height/2-125,450,250,20);

        //From User
        noStroke();
        textSize(20);
        fill('black');
        textAlign(LEFT);
        text("@UADanceMarathon", width/2 -210,height/2 - 85, 400, 80);

        //Tweet Text
        var pString = userTweetsArr[tweetBoxNum].tweetText;
        noStroke();
        textSize(15);
        fill('black');
        textAlign(LEFT);
        text(pString, width/2 -210,height/2 - 35, 400, 80);


        //Retweet Count
        var rtCount = userTweetsArr[tweetBoxNum].rtNum;
        noStroke();
        textSize(15);
        fill('black');
        textAlign(LEFT);
        text('# of RTs: ' + rtCount.toString(), width/2 -210,height/2 + 20 , 400, 80);

        //RETURN BOX
        fill('blue');
        rect(width/2-60,height/2+74,120,40,20);
        noStroke();
        textSize(20);
        fill('white');
        textAlign(LEFT);
        text("RETURN", width/2-40,height/2 + 100);

    }

}


function mousePressed() {

  //** May want to change this so only can check tweet if scan is complete
  if(1){ 

    //Check if tweet info box is currently pulled up if so close it
    if(tweetBoxNum > -1){
        tweetBoxNum = -1;
        return;
    }

    //If tweet box is not pulled up check if mouse is in tweet circle
    //If it is set the tweetBoxNum to that tweet's array location
    for(var i = 0;i<userTweetsArr.length;i++){
        var thisTweet = userTweetsArr[i];
        var d = dist(mouseX,mouseY, thisTweet.circleW, thisTweet.circleH);
        if(d<thisTweet.circleR/2){
            //createElement('p',thisTweet.tweetText);
            //console.log(thisTweet.tweetText);
            tweetBoxNum = i;
        }
    }

  }

}

