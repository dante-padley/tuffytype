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
		// going through a loop that gets each individual character in the string, creating a span for it, and then setting the text to that span to the individual character. This makes it so we can apply individual colors to each one of our letters as needed.
		quote.split("").forEach((character) => {
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
		if (/^[a-zA-Z0-9]+$/.test(charTyped) || /[~`!#$%\^&*+= \-\[\]\\'';,/{}|\\":<>\?]+$/.test(charTyped) || charTyped == '.' || charTyped == "'") {
			if (charTyped !== quoteChars[currentIndex]) {
				//if (block !== true) {
					$("span").eq(currentIndex).css("background-color", "#e32957");
					$("span").eq(currentIndex).addClass("wrong")
					errorCount++;
					ecEl.text("Errors: " + errorCount.toString());
					currentIndex++;
					//block = true;
				//}
			}
			else {
				$("span").eq(currentIndex).css("background-color", "#8cff78");
				characterCount++;
				ccEl.text("Characters Typed: " + characterCount.toString());
				if (charTyped === ' ') {
					wordCount++;
					wcEl.text("Words Typed: " + wordCount.toString());
					//block = false;
				}
				currentIndex++;
			}
		}
		

		if (currentIndex === quoteChars.length) {
			renderNewQuote();
			return;
		}
	});
	//Keybind specifically for backspace. Requires binding to "keydown" instead of "keypress"
	$('body').bind('keydown', function (e) {
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
				ccEl.text("Characters Typed: " + characterCount.toString());
				
				if ($("span").eq(currentIndex).hasClass("wrong")) {
					errorCount--;
					ecEl.text("Errors: " + errorCount.toString());
				}
				$("span").eq(currentIndex).css("background-color", "#00000000");
			}
		}
	});
	
	//Trying to make the word count count every 5 characters
	// let wordcountEl = $("#word-count");
	// function wordcounter() {
	// 	wcount = Math.round(characterCount / 5);
	// 	wcEl.text("Words Typed: " + wcount.toStrting());
	// }

	let SecondsPassed = 0;
	function wordspermin() {
		
		wpm = Math.round((((characterCount / 5) / SecondsPassed)*60));
		wordsperminEl.text("WPM: " + wpm.toString());
	}

	// Timer
	let secondsRemaining = 60;
	let timerEl = $("#timer");

	let interval = setInterval(function () {
		timerEl.text("Seconds Remaining: " + secondsRemaining.toString());
		if (secondsRemaining > 0) {
			wordspermin();
			SecondsPassed++;
			secondsRemaining--;	

		}
		else {
			wordspermin();
			clearInterval(interval);
			return;
		}
	}, 1000);

	
});