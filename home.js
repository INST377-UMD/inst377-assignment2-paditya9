function loadAPI() {
    return fetch('https://zenquotes.io/api/random')
        .then((result) => result.json());
}

async function loadQuote() {
    let quotePara = document.getElementById('quote-para');
    let loading = document.getElementById('loading-quote');
    let quoteData = await loadAPI();

    loading.style.display = 'block';
    quotePara.style.display = 'none'; 

    let quoteText = quoteData[0].q;  
    let quoteAuthor = quoteData[0].a;   

    quotePara.innerHTML = `"${quoteText}" — ${quoteAuthor}`;

    loading.style.display = 'none';
    quotePara.style.display = 'block'; 
}

if (annyang) {
    let commands = {
      'hello': () => alert('Hello World!'),
      'change the color to *color': (color) => document.body.style.backgroundColor = color,
      'navigate to *page': (page) => window.location.href = page + '.html'
    };
  
    annyang.addCommands(commands);
    
    function toggleListening(turnOn) {
      if (turnOn) {
        if (!annyang.isListening()) {
          annyang.start();
          alert('Audio listening turned on.');
        }
      } else {
        if (annyang.isListening()) {
          annyang.abort();
          alert('Audio listening turned off.');
        }
      }
    }
}

window.addEventListener('DOMContentLoaded', loadQuote);