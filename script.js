var counter = 0;
$(document).ready(function () {
  let wordCount = 0;
  let characterCount = 0;
  let errorCount = 0;
  let wpm = 0;
  let generatedQuote = `There once was a story of a man named Wilbur, who was a very good cat, a noble one who was better than all of the rest. One day, Wilbur decided to leave home a bit early to go to work, as he had an important meeting in the morning. You see, Wilbur was a full-time banker at a nearby AME, he had a wife and 2 kids, but Wilbur was unsatisfied with life's direction. He was tired of the same old routine and yearned for some true excitement in his life. This morning, however, this morning was very different, and it was the morning Wilbur would make a true change in his life.`;
  let wcEl = $("#word-count");
  let ccEl = $("#character-count");
  let ecEl = $("#error-count");
  let quoteEl = $("#generated-quote");
  let wordsperminEl = $("#wordspermin");
  let quoteChars = generatedQuote.split("");
  let userChars = [];
  let currentIndex = 0;
  let charTyped = null;
  let block = false;

  // Generate quote element
  for (let i = 0; i < generatedQuote.length; i++) {
    quoteEl.append("<span>" + generatedQuote[i] + "</span>");
  }

  // Input handling
  $("body").bind("keypress", function (e) {
    charTyped = String.fromCharCode(e.keyCode);
    if (charTyped !== quoteChars[currentIndex]) {
      if (block !== true) {
        $("span").eq(currentIndex).css("background-color", "#e32957");
        errorCount++;
        ecEl.text("Errors: " + errorCount.toString());
        currentIndex++;
        block = true;
      }
    } else {
      $("span").eq(currentIndex).css("background-color", "#8cff78");
      characterCount++;
      ccEl.text("Characters Typed: " + characterCount.toString());
      if (charTyped === " ") {
        wordCount++;
        wcEl.text("Words Typed: " + wordCount.toString());
        block = false;
      }
      currentIndex++;
    }

    if (currentIndex === quoteChars.length - 1) {
      wordspermin();
      return;
    }
	
  });

  let timerlimit = 1;
  function wordspermin() {
    counter = Math.round(characterCount / 5 / timerlimit);
    wordsperminEl.text("WPM: " + counter.toString());
  }

  // calling Timer function changed by salem
	timer_change();
	
});

//writing timer fucntion by salem

let secondsRemaining = 0;

const delay = ms => new Promise(res => setTimeout(res, ms));
const timer_change = async () => { 
	
	var t1 = 5;
	var time_count = setInterval(function() {
    $("#timer_start").text("The timer will start in: " + t1 + " seconds");
    if (t1 > 0) {
      t1--;
    } else {
      //wordspermin();
      clearInterval(time_count);
      return;
    }
  }, 1000);
    secondsRemaining = 0;
	$("#timer").text("Seconds Remaining: " + secondsRemaining);
	await delay(5000);
	
	secondsRemaining = 0;
	var select = document.getElementById('timer1');
	var value = select.options[select.selectedIndex].value;
	secondsRemaining = value*15;
    var interval = setInterval(function() {
    $("#timer").text("Seconds Remaining: " + secondsRemaining);
    if (secondsRemaining > 0) {
      secondsRemaining--;
    } else {
      //wordspermin();
      clearInterval(interval);
      return;
    }
  }, 1000);
	
}
