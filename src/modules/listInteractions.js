let startButton = document.getElementById('start-btn'),
    resetButton = document.getElementById('reset-btn'),
    myInput = document.getElementById("myInput"),
    toggle = document.getElementById("toggle");

// reset inputs 
const resetInputs = () => {
    startButton.click();
    resetButton.click();
    myInput.placeholder = "Search..";
    toggle.innerHTML = "Project Name";
    $("#container input").slice(1, 2).css({"backgroundColor": "#27ae60"});
}

const showLis = () => {
    $('ul li').each(function(i){
        $(this).show(); 
    });    
    $(this).prev().val(function(){
        return this.defaultValue;
    })
}

// random hex color generator
const getRandomColor = () => {
    var length = 6;
    var chars = '0123456789ABCDEF';
    var hex = '#';
    while(length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
}

// change project tag colors 
const changeProjectNameColors = (str) => {
    var projectNames = [];
    $( ".dDButton" ).each(function() {
        if (str === "randomize") {
            projectNames.push([($(this).attr('id')), (getRandomColor())]);
        }
        if (str === "normalize") {
            projectNames.push([($(this).attr('id')), ("rgb(92, 107, 115)")]);
        }
    });

    $('h6').each(function () {
        for (var c = 0; c < projectNames.length; c++) {
            if ($(this).html() === projectNames[c][0]) {
                $(this).css("background-color", projectNames[c][1]);
            }
        }
    });
}

const validateTimeEntry = () => {
// check for invalid input - '80 seconds' should be 1:20, etc. 
let time = document.getElementById("clock").value; 
let mins = time.charAt(4); 
let secs = time.charAt(9);
let forbidden = ['6', '7', '8', '9']; 
var flag = true; 
for (let m = 0; m < 5; m++) {
  if(forbidden[m] === mins) {
    flag = false;
  } 
  if (forbidden[m] === secs) {
      flag = false;
  } 
  if (time.match(/[a-z]/i)) {
      flag = false;
  } 
}
return flag;
}

// color code, normalize project tags
const colorCodeButtons = () => {
    $(document).ready(function(){
        $("#colorCode").click(function(){
            changeProjectNameColors("randomize");
        });
    });

    $(document).ready(function(){
        $("#colorNormal").click(function(){
            changeProjectNameColors("normalize");
        });
    });
}  

$(document).ready(function(){
    $("#projectStatus").click(function(){

    });
});

const determineProjectTagColors = (str1, str2) => {
    if (str2 !== "rgb(92, 107, 115)") {
        var currentProjectColors = [];
        var h6number = $("#projects h6").length;
        $("h6").each(function() {
            currentProjectColors.push([($(this).html()), ($(this).css("background-color"))]);
        });

        currentProjectColors.length = h6number; // remove duplicates from array 

        var allProjectNames = [];
        $( ".dDButton" ).each(function() {
            allProjectNames.push([($(this).attr('id'))]);
        });

        let projColor = '';
        let counter = '';
        for (var o = 0; o < currentProjectColors.length; o++) {
            if (str1 === currentProjectColors[o][0]) {
                projColor = currentProjectColors[o][1];
            } 

            if (str1 !== currentProjectColors[o][0]) {
                counter++;
            } 
        }

    if (counter === currentProjectColors.length) {
        projColor = getRandomColor();
    }
    return projColor;
    }
    return str2; 
}

const projectNameAndColor = () => {
    var projtitle = toggle.innerHTML.split(" - ").pop();
    var color = '';
    color = $("h6:first").css("background-color");

    //  one or more li exists
    if (typeof color === "string" || color instanceof String){
        if (color !== "rgb(92, 107, 115)") {
            color = determineProjectTagColors(projtitle, color);
        } else {
            color = color;
        }
    } else { 
    color = "rgb(92, 107, 115)"; // first instance of li 
    }

    return [projtitle, color]; 
}

export {resetInputs, showLis, getRandomColor, changeProjectNameColors, validateTimeEntry, colorCodeButtons, determineProjectTagColors, projectNameAndColor};
