const quoteText = document.querySelector("h1");
const authorText = document.querySelector(".author");
const tweetBtn = document.querySelector(".twitter__btn");
const newQuoteBtn = document.querySelector(".new__quote--btn");
const backdrop = document.querySelector(".backdrop");
let quotes = [];
let tweetUrl = "";

async function getQuote() {
    const apiUrl = "https://type.fit/api/quotes";
    try {
        const response = await fetch(apiUrl);
        quotes = await response.json();
    } catch (error) {
        document.querySelector(".backdrop").classList.remove("hidden");
        const errorDiv = document.querySelector(".error");
        errorDiv.style.top = "5%";
        errorDiv.style.opacity = "1";
        errorDiv.innerHTML = `
        <h3>Something went wrong!! Unable to fetch quotes</h3> \n<h3 style="margin-top: 1rem">${error}</h3>
        `;
        backdrop.addEventListener("click", () => {
            backdrop.classList.add("hidden");
            errorDiv.style.top = "-100%";
            errorDiv.style.opacity = "0";
        });
    }
}

const displayQuote = () => {
    let rand = Math.floor(Math.random() * quotes.length);
    let randomQuote = quotes[rand].text;
    let authorName = quotes[rand].author;
    tweetUrl = `https://twitter.com/intent/tweet?text="${randomQuote}" - ${authorName}`;

    if (randomQuote.length > 80) {
        quoteText.style.fontSize = "1.5rem";
        const mediaQuery = window.matchMedia("(min-width: 40rem)");
        if (mediaQuery.matches) {
            quoteText.style.fontSize = "2rem";
        }
    } else {
        quoteText.style.fontSize = "2rem";
        const mediaQuery = window.matchMedia("(min-width: 40rem)");
        if (mediaQuery.matches) {
            quoteText.style.fontSize = "2.5rem";
        }
    }
    quoteText.innerHTML = randomQuote;

    if (!authorName) {
        authorName = "Unknown";
    }
    authorText.innerHTML = `<em>${authorName}</em>`;
};

const tweetQuote = () => {
    if (!tweetUrl) {
        return;
    } else {
        window.open(tweetUrl, "_blank");
    }
};

getQuote();

newQuoteBtn.addEventListener("click", displayQuote);
tweetBtn.addEventListener("click", tweetQuote);
