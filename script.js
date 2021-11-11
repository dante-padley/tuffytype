const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";
var timer_function;
$(document).ready(function () {
	let wordCount = 0;
	let characterCount = 0;
	let errorCount = 0;
	let Gross_wpm = 0;
	let Raw_wpm = 0;
	let AccuracyPercent = 0;
	let SecondsPassed = 0;
	let secondsRemaining = 60;
	let generatedQuote = ``;
	let aaE1 = $("#accuracy-percent");
	let wcEl = $("#word-count");
	let ccEl = $("#character-count");
	let ecEl = $("#error-count");
	let quoteEl = $("#generated-quote");
	let wordsperminEl = $("#wordspermin");
	let RawwordsperminEl = $("#Rawwordspermin");
	let quoteChars = '';
	let userChars = [];
	let currentIndex = 0;
	let charTyped = null;
	let block = false;
	var myobj = document.getElementById("main-title");
	
    // stats page stuff
    let modalEl = $("#bg-modal");
    let wcEl2 = $("#word-count-2");
    let ccEl2 = $("#character-count-2");
    let ecEl2 = $("#error-count-2");
    let wordsperminEl2 = $("#wordspermin-2");

	// this function uses the API to fetch the actual quote
	function getRandomQuote() {
		return fetch(RANDOM_QUOTE_API_URL)
			.then((response) => response.json())
			.then((data) => data.content);
	}

	// this function handles the quote and puts the quote into the quoteDisplay element to display it to the user.
	async function renderNewQuote() {
		//NOTES to self on adjusting this.
		/*
		Basically, we want to abstract this so we can grab clean quotes whenever and move them around.
		So getRandomQuote() should have the filter code in it.
		We might move the code on line 85 to a new function similar to this called "renderFirstQuotes"
		that calls getRandomQuote 2 times and assembles the typing test like normal.
		We want to keep track of the char array of the very first and second quote pulled with the 
		"quoteChars" variable and maybe a "quoteChars2" OR we can think about moving to an array with these 2.

		The operation of renderNewQuote will be like this:
		-const quote = await getRandomQuote()
		-remove quoteChars.length amount of spans from the beginning of quoteEl
		-quoteChars = quoteChars2
		-turn the new quote into a char array and append it to the quoteEl like normal
		-quoteChars2 = the new quote char array
		
		
		*/
		const quote = await getRandomQuote();
		quoteEl.empty();
		currentIndex = 0;
		let cleanQuote = false;
		let dirtyChar = false;
		let cleanChar = false;
		
		while(cleanQuote == false){
			
			var filteredQuote = quote;
			filteredQuote = filteredQuote.split('');
			
			for(let x = 0; x < filteredQuote.length; x++){
				if(filteredQuote[x].charCodeAt() < 126 && filteredQuote[x].charCodeAt() != 96 && filteredQuote[x].charCodeAt() != 95)
				{
					cleanChar = true;	
				}
				else
				{
					quote = await getRandomQuote();
					dirtyChar = true;
					break;
				}
			}
			if(cleanChar == true && dirtyChar == false){
				cleanQuote = true;
				
			}
			else
			{
				
				dirtyChar = false;
				cleanChar = false;
			}
		}
		// going through a loop that gets each individual character in the string, creating a span for it, and then setting the text to that span to the individual character. This makes it so we can apply individual colors to each one of our letters as needed.
		quote.split("").forEach((character) => {
			// we can add an ASCII filter here
			const characterSpan = document.createElement("span");
			characterSpan.innerText = character;
			quoteEl.append(characterSpan);
		});
		quoteChars = quote.split("");
		//quoteEl.value = null;
	}
	renderNewQuote()

	// Input handling
	$('body').bind('keypress', function (e) {
		charTyped = String.fromCharCode(e.keyCode);

		//updates counters on keypress
		if (secondsRemaining > 0) TextCounter();

		//starts timer
		if (block == false) {Start_timer(); block = true; myobj.remove();}

		// if (/^[a-zA-Z0-9]+$/.test(charTyped) || /[~`!#$%\^&*+= \-\[\]\\'';,/{}|\\":<>\?]+$/.test(charTyped) || charTyped == '.' || charTyped == "'") {

			// block = true;
			$("span").eq(currentIndex).addClass("blinking");
			if (charTyped !== quoteChars[currentIndex]) {
				//if (block !== true) {
					$("span").eq(currentIndex).css("background-color", "#e32957");
					$("span").eq(currentIndex).addClass("wrong");
					errorCount++;				
					currentIndex++;
					characterCount++;
					//block = true;
				//}
			}
			else {
				$("span").eq(currentIndex).css("background-color", "#8cff78");
				characterCount++;
				wordCount = Math.floor(characterCount / 5);
				currentIndex++;
			}
		// }
		

		if (currentIndex === quoteChars.length) {
			renderNewQuote();
			return;
		}
	});
	//Keybind specifically for backspace. Requires binding to "keydown" instead of "keypress"
	$('body').bind('keydown', function (e) {

		//updates counters on keypress
		if (secondsRemaining > 0) TextCounter();
		if (currentIndex > 0) {
			charTyped = e.keyCode;
			if (charTyped == 8) {
				/// We want to track the wordcount better, probably by counting every 5 characters
				/// Then figure out how to lower wordcount when backspacing
				/*if ($("span").eq(currentIndex).textContent == '\u00A0'){
					wordCount--;
					wcEl.text("Words Typed: " + wordCount.toString());
				}*/
				currentIndex--;
				characterCount--;
				

				if ($("span").eq(currentIndex).hasClass("wrong") && errorCount != 0) {
					errorCount--;					
				}
				$("span").eq(currentIndex).css("background-color", "#00000000");
			}
		}
	});
	//handles all textcounters
	function TextCounter(){
		ccEl.text("Characters Typed: " + characterCount.toString());
    ccEl2.text("Characters Typed: " + characterCount.toString());
		ecEl.text("Errors: " + errorCount.toString());
    ecEl2.text("Errors: " + errorCount.toString());
		wpmCounter();
		accuracy();
		wcEl.text("Words Typed: " + wordCount.toString());
    wcEl2.text("Words Typed: " + wordCount.toString());
		RawwordsperminEl.text("Raw WPM: " + Raw_wpm.toString());
		aaE1.text("Accuracy: "+ AccuracyPercent.toString() + "%");
		wordsperminEl.text("WPM: " + Gross_wpm.toString());
    wordsperminEl2.text("WPM: " + Gross_wpm.toString());
	}

	//calculates all wpm's and word count
	function wpmCounter() {
		wordCount = Math.floor(characterCount / 5);
		Gross_wpm = Math.floor(((wordCount - errorCount) / SecondsPassed) * 60);
		Raw_wpm = Math.floor(((wordCount / SecondsPassed) * 60));
		
		if (Gross_wpm < 0 || isNaN(Gross_wpm) || Gross_wpm == Infinity) Gross_wpm = 0;
		if (isNaN(Raw_wpm) || Raw_wpm == Infinity) Raw_wpm = 0;
	}
	//calculates the accuracy
	function accuracy(){
		
		AccuracyPercent = ((characterCount - errorCount)/characterCount)*100;
		if (isNaN(AccuracyPercent)) AccuracyPercent = 0;
		AccuracyPercent = AccuracyPercent.toFixed(0);
		
	}
	// Timer
	let timerEl = $("#timer");
	function Start_timer() {
		let interval = setInterval(function () {
			if (secondsRemaining-- > 0) {
				TextCounter();
				SecondsPassed++;
			}
			else {
        $("#modal-id").css("display", "flex");
        displaymodal();
				TextCounter();
				clearInterval(interval);
				return;
			}
			timerEl.text("Seconds Remaining: " + secondsRemaining.toString());
		}, 1000);
	}
	

	// let started = false;
 //  $('body').bind('keypress', function (){
 //    if (!started) {
 //      document.getElementById("main-title").styles.display = "none"
 //    }
 //    started = true;
	// 			// start timer here
 //   });

  timer_change = async function() {

    var select = document.getElementById('timer1');
    var value = select.options[select.selectedIndex].value;
    secondsRemaining = value;
    $("#timer").text("Seconds Remaining: " + secondsRemaining);

  }/*
  $("#timer1").onchange(function(){
    var select = document.getElementById('timer1');
    var value = select.options[select.selectedIndex].value;
    secondsRemaining = value;
    timerEl.text("Seconds Remaining: " + secondsRemaining);
  });*/
});