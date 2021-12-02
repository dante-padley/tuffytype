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
	let topQuoteLength = 0;
	let bottomQuoteLength = 0;
	let userChars = [];
	let currentIndex = 0;
	let charTyped = null;
	let block = false;
	var myobj = document.getElementById("main-title");
	
    // stats page stuff
    let modalEl = $("#bg-modal");
    let wcEl2 = $("#word-count-2");
	let RcEl2 = $("#Rawwordspermin-2");
	let AcEl2 = $("#accuracy-percent-2");
    let ccEl2 = $("#character-count-2");
    let ecEl2 = $("#error-count-2");
    let wordsperminEl2 = $("#wordspermin-2");
	
		document.getElementById("Rawwordspermin").style.display = "none";
		document.getElementById("word-count").style.display = "none";
		document.getElementById("error-count").style.display = "none";
		document.getElementById("character-count").style.display = "none";
		document.getElementById("accuracy-percent").style.display = "none";
		document.getElementById("wordspermin").style.display = "none";


	// this function uses the API to fetch the actual quote
	function getRandomQuote() {
		return fetch(RANDOM_QUOTE_API_URL)
			.then((response) => response.json())
			.then((data) => data.content)
			.then((quote) => {
				let clean = cleanQuote(quote);
				return clean;
			});
	}
	// this function rejects the current quote if it has the Forbidden Characters
	async function cleanQuote(inputQuote) {
		let quote = inputQuote
		let cleanQuote = false;
		let dirtyChar = false;
		let cleanChar = false;

		while (cleanQuote == false) {

			var filteredQuote = quote;
			filteredQuote = filteredQuote.split('');

			for (let x = 0; x < filteredQuote.length; x++) {
				if (filteredQuote[x].charCodeAt() < 126 && filteredQuote[x].charCodeAt() != 96 && filteredQuote[x].charCodeAt() != 95) {
					cleanChar = true;
				}
				else {
					quote = await getRandomQuote();
					dirtyChar = true;
					break;
				}
			}
			if (cleanChar == true && dirtyChar == false) {
				cleanQuote = true;

			}
			else {

				dirtyChar = false;
				cleanChar = false;
			}
		}
		return quote;
	}
	// this function handles new quotes after the start of the test and manages their respective variables.
	async function renderNewQuote() {

		let quote = await getRandomQuote();
		removeTopQuote();
		quote += '\n';
		topQuoteLength = bottomQuoteLength;
		bottomQuoteLength = quote.length - 1;
		currentIndex = 0;
		// going through a loop that gets each individual character in the string, creating a span for it, and then setting the text to that span to the individual character. This makes it so we can apply individual colors to each one of our letters as needed.
		quote.split("").forEach((character) => {
			const characterSpan = document.createElement("span");
			characterSpan.innerText = character;
			quoteEl.append(characterSpan);
		});

		quoteChars.push.apply(quoteChars, quote.split(""));
		//quoteEl.value = null;
	}
	// this function removes the top quote from the page and from the quoteChars variable
	function removeTopQuote(){
		//use length of top quote to remove the right amount of spans
		//make a loop that runs length times
		//for each run, delete just the first span
		let counter = topQuoteLength + 1;
		while(counter > 0){
			$("span:first").remove();
			
			counter--;
		}
		quoteChars.splice(0, topQuoteLength + 1);
	}
	// This function renders the first 2 quotes to the element and records their lengths
	async function renderFirstQuotes(){
		
		let quote = await getRandomQuote();
		//record the length of the first quote
		topQuoteLength = quote.length;
		let quote2 = await getRandomQuote();
		// record the length of the second quote
		bottomQuoteLength = quote2.length;
		// add a single  character in between them (so one of the quote lengths is actually wrong)
		quote = quote + '\n' + quote2 + '\n';
		quote.split("").forEach((character) => {
			// we can add an ASCII filter here
			const characterSpan = document.createElement("span");
			characterSpan.innerText = character;
			//characterSpan.addClass("quoteChar")
			quoteEl.append(characterSpan);
		});
		quoteChars = quote.split("");
	}

	// This is the first function call. It produces the first quotes on the page.
	renderFirstQuotes();
  
  const blinkElement = document.createElement('span');
	// Input handling
	$('body').bind('keypress', function (e) {
		
		
		charTyped = String.fromCharCode(e.keyCode);
		
		//updates counters on keypress
		if (secondsRemaining > 0) TextCounter();


		//starts timer
		if (block == false) {Start_timer(); block = true; $(myobj).addClass("hidden");}


	
			$("span").eq(currentIndex).addClass("blinking");
			if (charTyped !== quoteChars[currentIndex]) {
				$("span").eq(currentIndex).css("background-color", "#e32957");
				$("span").eq(currentIndex).addClass("wrong");
				errorCount++;				
				currentIndex++;
				characterCount++;
			}
			else {
				$("span").eq(currentIndex).css("background-color", "#8cff78");
				characterCount++;
				wordCount = Math.floor(characterCount / 5);
				currentIndex++;
			}
		

		if (currentIndex === topQuoteLength) {
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
				currentIndex--;
				characterCount--;
				

				if ($("span").eq(currentIndex).hasClass("wrong") && errorCount != 0) {
					errorCount--;					
				}
				$("span").eq(currentIndex).removeClass("blinking");
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
		RcEl2.text("WPM: " + Gross_wpm.toString());
		AcEl2.text("Accuracy: " + AccuracyPercent.toString());

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
	

  timer_change = async function() {

    var select = document.getElementById('timer1');
    var value = select.options[select.selectedIndex].value;
    secondsRemaining = value;
    $("#timer").text("Seconds Remaining: " + secondsRemaining);

  }


	let cursorPos = sentence.length;
	let direction = -1;
	const switchDirection = () => direction *= -1;

	
});