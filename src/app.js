import {dragDropList} from './modules/dragDrop';
import {listSearch} from './modules/dropListSearch';
import {appendTaskToInput, deleteListItem} from './modules/liDeleteHide';
import {toggleBilling, checkBillingToggle} from './modules/toggleBilling';
import {startTimer, trackListItemTime} from './modules/timerComponents';
import {toggleProjectDropdown, filterFunction, filterEntry, appendProjToButton} from './modules/dropDownButton';
import {resetInputs, showLis, getRandomColor, changeProjectNameColors, determineProjectTagColors, projectNameAndColor} from './modules/listInteractions';
import {getTaskInput, checkTaskInput, validateTimerModeEntry, validateManualModeEntry, checkAssignedProject} from './modules/timerInputValidators';
import {generateTodaysDate, convertToAlternateDate, dateToShorthand, generateCurrentTime, checkManualInput, getManualInputs} from './modules/toggleInputs';
import {genDigitalTime, digitalTimeToWord, digitalTimeToSeconds, secondsToDigital, wordedTimeToSeconds} from './modules/timeConversion';
import {timesToSeconds, genTimerModeManualTimeStamp} from './modules/timeStampConvert';
import {containerIdMatch, containerIdOrder} from './modules/dateContainer';
listSearch(); 

// drag drop 
dragDropList();
toggleBilling();

// li items delete, hide 
appendTaskToInput();
deleteListItem();
trackListItemTime();

// choose project dropdown 
toggleProjectDropdown();
filterFunction();
filterEntry();

appendProjToButton();

const appendToList = () => {

        // check task and project is assigned 
        if (checkTaskInput() == true && checkAssignedProject() === true) {

        // if timer mode enabled and digital entry invalid 
        if (checkManualInput() == false && validateTimerModeEntry() === false) {
            return false;     
        }

        // if manual entry enabled and manual entry invalid 
        if (checkManualInput() === true && validateManualModeEntry() === false) {
            return false; 
        }

        // list container 
        var taskListContainer = document.getElementById("taskList");

        // date and time elements to be generated 
        var timeStamp = '',
        dateStamp = '',
        alternateDateFormat = '',
        dateShorthand = '',
        seconds = '',
        clockTimer = '',
        indexCont = '';


        // if timer mode enabled and digital entry valid
        if (checkManualInput() == false && validateTimerModeEntry() === true) {
            var manualInputValues = getManualInputs();

        // 4:43 pm - 5:03 pm format 
        timeStamp = genTimerModeManualTimeStamp();

        // mm/dd/yyyy format 
        dateStamp = generateTodaysDate();

        // yyyy-mm-dd format 
        alternateDateFormat = convertToAlternateDate(dateStamp);

        // 'Wed, 28 Nov, 2017' format 
        dateShorthand = dateToShorthand(alternateDateFormat);

        // grab digital time 
        clockTimer = genDigitalTime();

        // seconds format
        seconds = digitalTimeToSeconds(clockTimer);
        }

        // if manual entry enabled and manual entry valid 
        if (checkManualInput() === true && validateManualModeEntry() === true) {
            var manualInputValues = getManualInputs();

        // create timestamp
        timeStamp = manualInputValues[0] + " - " + manualInputValues[1];

        // mm/dd/yyyy format
        if (manualInputValues[2] === 'Today') {
            dateStamp = generateTodaysDate();
        } else {
            dateStamp = manualInputValues[2] + '/' + manualInputValues[3];
        }

        // yyyy-mm-dd format 
        alternateDateFormat = convertToAlternateDate(dateStamp);

        // 'Wed, 28 Nov, 2017' format 
        dateShorthand = dateToShorthand(alternateDateFormat);

        // get seconds difference, and then convert to digital time 
        let manualTimeStamps  = timesToSeconds(manualInputValues[0], manualInputValues[1]);

        clockTimer = secondsToDigital(manualTimeStamps);

        // seconds format
        seconds = digitalTimeToSeconds(clockTimer);
        }

        // generate current time  
        let currentYear = (new Date()).getFullYear(),
        assumeTodaysDate = generateTodaysDate(),
        currentTime = generateCurrentTime();

        // begin builing list item components
        // get task and create item  
        const task = getTaskInput(); 
        const taskNode = document.createElement("div");
        taskNode.className = "listTask";
        taskNode.innerHTML = task;

        // create digital time component 
        const clockTimerElementNode = document.createElement("div");
        clockTimerElementNode.className = "listClockTime";
        clockTimerElementNode.innerHTML = clockTimer;

        // toggle billable hours 
        let billingToggle = checkBillingToggle();

        // create delete + append time elements, place in container div 
        const deleteLiIcon = document.createElement("span");
        let iElem = document.createElement("i");
        let iClasses = [ 'fa', 'fa-trash' ];
        iElem.classList.add(...iClasses);
        deleteLiIcon.appendChild(iElem);

        const appendTimeIcon = document.createElement("span");
        let iElem2 = document.createElement("i");
        let iClasses2 = [ 'fa', 'fa-play' ];
        iElem2.classList.add(...iClasses2);
        appendTimeIcon.appendChild(iElem2);

        const deleteTimeIcons = document.createElement("div");
        deleteTimeIcons.className = "deleteTimeIcons";
        deleteTimeIcons.appendChild(appendTimeIcon);
        deleteTimeIcons.appendChild(deleteLiIcon);

        // create project name li elements 
        let titleAndColor = projectNameAndColor();
        let projtitle = titleAndColor[0];
        let iconColor = titleAndColor[1];

        // build project name li element
        const projectNameIcon = document.createElement("div");
        projectNameIcon.className = "projIcon";

        let iElem3 = document.createElement("h6");
        iElem3.style.backgroundColor = iconColor;
        iElem3.innerHTML = projtitle;
        projectNameIcon.appendChild(iElem3);

        // create billing icon li element 
        const projectBillIcon = document.createElement("div");
        let classesToAdd3 = [ 'billIcon', 'noselect' ];
        projectBillIcon.classList.add(...classesToAdd3);
        projectBillIcon.innerHTML = "$";

        // create timestamp for li element 
        const taskTimeStampNode = document.createElement("div");
        taskTimeStampNode.className = "timestamp";
        taskTimeStampNode.innerHTML = timeStamp;

        // declare new li node, add list data  
        const node = document.createElement("li"); 
        let classesToAdd = [ 'listItem', 'ui-sortable-handle' ];
        node.classList.add(...classesToAdd);
        // add list items to li node                
        node.appendChild(taskNode);
        node.appendChild(projectNameIcon);
        node.appendChild(projectBillIcon);
        // timer elements on far right 
        node.appendChild(taskTimeStampNode);
        node.appendChild(clockTimerElementNode);
        // add time, delete, and billing icons 
        node.appendChild(deleteTimeIcons);

        // if no matching container id 
        if (containerIdMatch(dateStamp) === false) { 

        // create task list container for calendar day (li node)
        const dateContainer = document.createElement("div"); 
        let dateContainerClasses = [ 'dateContainer', 'dateContainerStyle' ];
        dateContainer.classList.add(...dateContainerClasses);
        dateContainer.id = dateStamp; // id is day's date 
        dateContainer.draggable = false;

        // check if dateshorthand year, if current, hide date 
        let appearDate = '';
        let enteredYear = Number(dateShorthand.substr(dateShorthand.length - 4));

        if (currentYear != enteredYear) {
            appearDate = dateShorthand;
        } else {
            appearDate = dateShorthand.substring(0, dateShorthand.lastIndexOf(","));
        }

        dateContainer.innerHTML = appearDate;

        // create project list 
        const projTaskListNode = document.createElement("ul"); 
        let taskListClasses = [ 'droppable-area', 'ui-sortable' ];
        projTaskListNode.classList.add(...taskListClasses);
        projTaskListNode.id = 'projects';

        // add li to ul
        projTaskListNode.appendChild(node); 

        // add ul to newly created div container  
        dateContainer.appendChild(projTaskListNode);

        // add container to end of page 
        taskListContainer.appendChild(dateContainer);

        // change order based on date 
        let idlists = containerIdOrder(dateStamp);

        // ------------------------------------------
        // list of two items and second date is most recent 
        if (idlists === 'second item more recent') {
        taskListContainer.insertBefore(dateContainer, taskListContainer.childNodes[0]);
        }

        // need to insert li into appropriate spot 

        }

        // if container id matches
        if (containerIdMatch(dateStamp) === true) {
            indexCont = '';
        // attach list node to matching list 
        let listMatch = document.getElementById(dateStamp);
            listMatch.appendChild(node);
        }

    showLis();
    resetInputs();   
    } 
}

// initialize append 
let testappend = document.getElementById('testappend');

testappend.addEventListener('click', () => {
    appendToList();
});
