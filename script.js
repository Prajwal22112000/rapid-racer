let menu = document.getElementById("menu");
let mycar = document.getElementById("mycar"); // my car object
let carlane; // current lane of my car
let currentlane = document.getElementById("lane2"); // current lane object for road
let scoreboard = document.getElementById("scoreboard")
let started = false; // to check user isn't able to click the start more than once
let trafficspeed; // speed of the oncoming traffic in the game
let dead = false; // a boolean to signify whether the player has crashed or not, false indicating he is still alive
let interruption = true;
let rand // to create random numbers
let trafficcar // upcoming traffic cars object
let score = 0; // score of the player
let vehicles = ["ambulance", "citycar", "citycoupe", "cityhatch", "coupe", "hatch", "pickup", "police", "sedan", "sportshatch", "sportssedan", "taxi"];

// function to cause delay
function sleep(delay){
    return new Promise(r => setTimeout(r, delay));
}

function pause(){
    menu.style.visibility = "visible"
    menu.innerHTML = "Game Paused Tap to Resume";
}

async function start(){
    menu.style.visibility = "hidden";
    if(started == false){
        started = true;
        dead = false;
        trafficspeed = 5;
        carlane = 2;
        index = 0;
        score = 0;
        while(dead == false){
            let random = Math.floor(Math.random()*3);
            createTraffic(index);
            index++;
            if(random >= 1){
                createTraffic(index);
                index++;
            }
            await sleep(trafficspeed*400);
            if(score%10 == 0){
                level();
            }
        }
    }
}

function move(event){
    if(event.code == "KeyA" || event.code ==  "ArrowLeft"){
        left();
    }
    else if(event.code == "KeyD" || event.code ==  "ArrowRight"){
        right();
    }
}

function left(){
    if(started == false){
        start();
        return;
    }
    if(carlane > 0){
        carlane--;
        changeLane();
    }
}
function right(){
    if(started == false){
        start();
        return;
    }
    if(carlane < 4){
        carlane++;
        changeLane();
    }
}

function changeLane(){
    mycar.parentElement.removeChild(mycar);
    mycar = document.createElement("div");
    mycar.id = "mycar";
    currentlane = document.getElementById("lane" + carlane);
    currentlane.appendChild(mycar);
}

function createTraffic(index){
    let trafficcar = document.createElement("button")
    if((index+1)%31 == 0){
        trafficcar.style.backgroundImage = "url(images/fire.png)";
        trafficcar.style.backgroundColor = "rgb(128, 128, 128);"
    }
    else{
        rand = Math.floor(Math.random()*12); // random to select any of the 12 vehicles from the given array of vehicle names
        trafficcar.style.backgroundImage = "url(images/"+ vehicles[rand] + ".png)";
    }
    rand = Math.floor(Math.random()*5); // random to select the random lane from given 5
    currentlane = document.getElementById("lane" + rand);
    trafficcar.className = "car";
    trafficcar.id = "car"+ index;
    trafficcar.value = rand;
    trafficcar.style.animation = "movetraffic " + trafficspeed +"s forwards cubic-bezier(0, 0, 0, 0)";
    currentlane.appendChild(trafficcar);
    checkAccident(index);
}

function level(){
    if(trafficspeed > 1){
        trafficspeed = trafficspeed - 0.20;
    }
}

let invincible = false; // if true then user gets invincibilty for 5 seconds;
async function checkAccident(index){
    let newtrafficcar = document.getElementById("car" + index); // individual traffic car
    let trafficarclane = newtrafficcar.value; // lane value of the current traffic car object that was created
    while(true){
        let carstyles = window.getComputedStyle(newtrafficcar); //traffic car css styles
        let mycarstyles = window.getComputedStyle(mycar); // my car css styles
        let carheight = parseInt(carstyles.height.split("p")[0]); // height of the traffic car and my car, both are same
        let mycarmargintop = parseInt(mycarstyles.marginTop.split("p")[0]); // top margin of the my car which is constant
        let trafficcarmargintop = parseInt(carstyles.marginTop.split("p")[0]); // top margin of the traffic car that changes after each 1ms
        await sleep(1);
        if(trafficarclane == carlane && (carheight + trafficcarmargintop) > mycarmargintop && (trafficcarmargintop) < mycarmargintop + carheight){
            if(carstyles.backgroundImage.split("images/")[1] == 'fire.png")'){
                newtrafficcar.parentElement.removeChild(newtrafficcar);
                makeInvincible();
            }
            else{
                console.log("gameover");
                gameover(invincible);
            }
            break;
        }
        if(trafficcarmargintop + 10 > mycarmargintop + carheight || dead == true){
            increaseScore();
            newtrafficcar.parentElement.removeChild(newtrafficcar);
            console.log("traffic car object deleted");
            break;
        }
    }
}

function increaseScore(){
    let h1 = document.getElementById("score")
    h1.innerHTML = "Score:" + score + "<br>";
    score++;
}

async function gameover(invincible){
    if(invincible == true){
        console.log("score increased in invincible mode");
        increaseScore();
    }
    else{
    dead = true;
    started = false;
    menu.style.visibility = "visible";
    menu.innerHTML = "<h1>Game Over! Tap to Restart</h1><br>" + "<h1>Score:" + score + "</h1>" ;
    document.getElementById("score").innerHTML = "Score:0";
    for(let i = 0; i < 5; i++){
        let lanes = document.getElementById("lane" + i);
        lanes.innerHTML = "";
    }
    mycar = document.createElement("div");
    mycar.id = "mycar";
    document.getElementById("lane" + 2).appendChild(mycar);
    }
}

async function makeInvincible(){
    invincible = true;
    console.log("invincibility is " + invincible + " now");
    let invincibilityindicator = document.createElement("h2");
    scoreboard.appendChild(invincibilityindicator);
    for (let i = 0; i <= 5; i++) {
        invincibilityindicator.innerHTML = "Invincibility:" + (5 - i) + "secs";
        await sleep(1000);
    }
    scoreboard.removeChild(invincibilityindicator);
    invincible = false;
    console.log("invincibility is " + invincible + " now");
}