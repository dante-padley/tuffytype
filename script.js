const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";

$(document).ready(function () {
	let wordCount = 0;
	let characterCount = 0;
	let errorCount = 0;
	let wpm = 0;
	let generatedQuote = ``;
	let wcEl = $("#word-count");
	let ccEl = $("#character-count");
	let ecEl = $("#error-count");
	let quoteEl = $("#generated-quote");
	let wordsperminEl = $("#wordspermin");
	let quoteChars = '';
	let userChars = [];
	let currentIndex = 0;
	let charTyped = null;
	let block = false;

	// this function uses the API to fetch the actual quote
	function getRandomQuote() {
		return fetch(RANDOM_QUOTE_API_URL)
			.then((response) => response.json())
			.then((data) => data.content);
	}

	// this function handles the quote and puts the quote into the quoteDisplay element to display it to the user.
	async function renderNewQuote() {
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
		if (secondsRemaining != 0) TextCounter();
		// if (/^[a-zA-Z0-9]+$/.test(charTyped) || /[~`!#$%\^&*+= \-\[\]\\'';,/{}|\\":<>\?]+$/.test(charTyped) || charTyped == '.' || charTyped == "'") {
			// block = true;
			if (charTyped !== quoteChars[currentIndex]) {
				//if (block !== true) {
					$("span").eq(currentIndex).css("background-color", "#e32957");
					$("span").eq(currentIndex).addClass("wrong")
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
		if (secondsRemaining != 0) TextCounter();
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
				wordCount = Math.floor(characterCount / 5);

				if ($("span").eq(currentIndex).hasClass("wrong") && errorCount != 0) {
					errorCount--;					
				}
				$("span").eq(currentIndex).css("background-color", "#00000000");
			}
		}
	});

	let SecondsPassed = 0;
	function TextCounter(){
		ccEl.text("Characters Typed: " + characterCount.toString());
		wcEl.text("Words Typed: " + wordCount.toString());
		ecEl.text("Errors: " + errorCount.toString());
		wpm = Math.floor(((((characterCount / 5) - errorCount) / SecondsPassed)*60));
		if (wpm < 0 || isNaN(wpm) || wpm == Infinity) wpm = 0;
		
		wordsperminEl.text("WPM: " + wpm.toString());
	}

	
	// Timer
	let secondsRemaining = 60;
	let timerEl = $("#timer");

	let interval = setInterval(function () {
		timerEl.text("Seconds Remaining: " + secondsRemaining.toString());
		if (secondsRemaining > 0) {
			TextCounter();
			SecondsPassed++;
			secondsRemaining--;	
		}
		else {
			TextCounter();
			clearInterval(interval);
			return;
		}
	}, 1000);
	
});