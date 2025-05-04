function loadAPI() {
    return fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
        .then((response) => response.json())
}

// Finding top stocks P1
async function loadStockData() {
    let stocksData = await loadAPI();
    let topStocks = stocksData
        .sort((x, y) => y.no_of_comments - x.no_of_comments) 
        .slice(0, 5); 
    
    displayStockData(topStocks);
}

// Displaying top stocks - Bull & Bear P1.1
function displayStockData(stocksInput) {
    let tableBody = document.getElementById('stock-body');
    let bullIcon = 'https://cdn.iconscout.com/icon/premium/png-512-thumb/bullish-1850182-1570389.png?f=webp&w=512';
    let bearIcon = 'https://cdn.iconscout.com/icon/free/png-512/free-bearish-icon-download-in-svg-png-gif-file-formats--downtrend-animal-stocks-finance-investment-pack-business-icons-1570417.png?f=webp&w=512';

    stocksInput.forEach(stock => {
        let row = document.createElement('tr');
        let stockCell = document.createElement('td');
        let stockLink = document.createElement('a');

        stockLink.textContent = stock.ticker;
        stockLink.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
        stockCell.appendChild(stockLink);
        row.appendChild(stockCell);

        let stockCommentCell = document.createElement('td');
        stockCommentCell.textContent = stock.no_of_comments;
        row.appendChild(stockCommentCell);

        let stockSentimentCell = document.createElement('td');
        let stockSentimentLink = document.createElement('img');

        if (stock.sentiment === 'Bullish') {
            stockSentimentLink.src = bullIcon;
        } else if (stock.sentiment === 'Bearish') {
            stockSentimentLink.src = bearIcon;
        }

        stockSentimentLink.alt = stock.sentiment;
        stockSentimentCell.appendChild(stockSentimentLink);
        row.appendChild(stockSentimentCell);

        tableBody.appendChild(row);
    });
}

//--------------- CHARTING ----------//
function formattingDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); 
    let day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

function getDate(dateRange) {
    let endDate = new Date(); 
    let startDate = new Date();
    startDate.setDate(endDate.getDate() - dateRange); 

    return {
        start: formattingDate(startDate),
        end: formattingDate(endDate)
    };
}

async function fetchingStock(ticker, dateRange) {
    let apiKey = '41JWSh1YHptu_F9vn3evfpEpF0OcDPM5';
    let { start, end } = getDate(dateRange);
    let url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${start}/${end}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;
    let response = await fetch(url);
    let data = await response.json();

    if ((data.results) && (data.results.length > 0)) {
        return data.results;
    } else {
        alert("ERROR!!!");
    }
}

function gettingStock(stockData) {
    let dates = [];
    let prices = [];
    
    stockData.forEach(day => {
        let date = new Date(day.t); 
        let formattedDate = date.toLocaleDateString();  
        dates.push(formattedDate);
        prices.push(day.c);  
    });
    
    return { dates, prices };
}

function loadingChart(dates, prices) {
    let ctx = document.getElementById('stockChart').getContext('2d');

    if (window.chart) {
        window.chart.destroy();
    }

    window.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Stock Price',
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Price Over Time'
                }
            }
        }
    });
}

document.getElementById('submit').addEventListener('click', async () => {
    let ticker = document.getElementById('ticker-name-input').value.trim();
    let dateRange = document.getElementById('chart-date-input').value;
    let stockData = await fetchingStock(ticker, dateRange);
    let { dates, prices } = gettingStock(stockData);

    if ((!ticker) || (!dateRange)) {
        alert('ERROR!!!');
        return;
    }
    if (stockData.length === 0) {
        return;
    }
    loadingChart(dates, prices);
});



if (annyang) {
    let commands = {
        'hello': () => alert('Hello World!'),
        'change the color to *color': (color) => document.body.style.backgroundColor = color,
        'navigate to *page': (page) => window.location.href = page + '.html',
        'lookup *stock': (stock) => {
            let uppercaseTicker = stock.toUpperCase();
            let tickerInput = document.getElementById('ticker-name-input');
            let dateRange = 30; 

            tickerInput.value = uppercaseTicker;  
            fetchingStock(uppercaseTicker, dateRange).then(stockData => {
                if (stockData.length > 0) {
                    let { dates, prices } = gettingStock(stockData);
                    loadingChart(dates, prices);
                }
            });
        }
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

window.addEventListener('DOMContentLoaded', loadStockData);
