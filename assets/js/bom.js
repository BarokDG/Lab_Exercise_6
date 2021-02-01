/*  
Here is the exercise on working on the remaining bom method 

Location , Navigator , screen , Window 

Follow the Instruction on the comments 

1. Declare the UI Variables for selecting on the elements 
2. Use the innerHTML property to display the result on each element 
3. The Text  of the elements will lead you what bom information is required 

Adding Extra is Possible if you want to explore more ...

Good Luck !!! 
*/




// Define UI Variables  here 

const main = document.getElementsByClassName('collection');

const locationDiv = main[0];
const browserDiv = main[1];
const screenDiv = main[2];
const historyDiv = main[3];

// Display the BOM Information on the innerHTML of the elements

// locationDiv

locationDiv.children[0].firstElementChild.innerText = location.href;
locationDiv.children[1].firstElementChild.innerText = location.protocol;
locationDiv.children[2].firstElementChild.innerText = location.host;
locationDiv.children[3].firstElementChild.innerText = location.port;
locationDiv.children[4].firstElementChild.innerText = location.hostname;

// browserDiv

browserDiv.children[0].firstElementChild.innerText = navigator.appName;
browserDiv.children[1].firstElementChild.innerText = navigator.appVersion;
browserDiv.children[2].firstElementChild.innerText = navigator.platform;
browserDiv.children[3].firstElementChild.innerText = navigator.language;
browserDiv.children[4].firstElementChild.innerText = navigator.cookieEnabled;

// screenDiv

screenDiv.children[0].firstElementChild.innerText = screen.height;
screenDiv.children[1].firstElementChild.innerText = screen.width;
screenDiv.children[2].firstElementChild.innerText = screen.pixelDepth;

// historyDiv

historyDiv.children[0].firstElementChild.innerText = history.length;
historyDiv.children[1].firstElementChild.innerText = history.state;