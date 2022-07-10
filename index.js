const quoteText = document.querySelector("h1");
const authorText = document.querySelector(".author");
const tweetBtn = document.querySelector(".twitter__btn");
const newQuoteBtn = document.querySelector(".new__quote--btn");

const backdrop = document.querySelector(".backdrop");
const errorDiv = document.querySelector(".error");
const count__exceeded = document.querySelector(".count__exceeded");

let api_one = "https://api.quotable.io/random";
let api__two = "https://quotable.io/quotes?page=";
let api__three = "https://type.fit/api/quotes";
let quotes = [];
const apiUrlArray = [api_one, api__two, api__three];
let tweetUrl = "";
let quote, author;

const showBackdrop = () => {
    backdrop.classList.remove("hidden");
};

const hideBackdrop = () => {
    backdrop.classList.add("hidden");
};

const showErrorModal = (error) => {
    errorDiv.style.top = "5%";
    errorDiv.style.opacity = "1";
    errorDiv.innerHTML = `
        <h3>Something went wrong!! Unable to fetch quotes</h3> \n<h3 style="margin-top: 1rem">${error}</h3>
        `;
};

const hideErrorModal = () => {
    errorDiv.style.top = "-100%";
    errorDiv.style.opacity = "0";
};

const showTweetCountModal = () => {
    count__exceeded.style.top = "5%";
    count__exceeded.style.opacity = "1";
    count__exceeded.innerHTML = `
        <h3 style="margin-bottom:2rem;">Tweet contains more than 280 characters, some characters might get discarded</h3>\n
        <button class="continue" style="font-size:1rem">Continue anyway</button>
        `;
    document.querySelector(".continue").addEventListener("click", () => {
        hideBackdrop();
        count__exceeded.style.top = "-100%";
        count__exceeded.style.opacity = "0";
        window.open(tweetUrl, "_blank");
    });
};

async function getQuoteFromApiOne() {
    let fetchedQuote;
    let fetchedAuthor;
    try {
        const response = await fetch(api_one);
        const data = await response.json();
        fetchedQuote = data.content;
        fetchedAuthor = data.author;
    } catch (e) {
        catchError(e);
    }
    return [fetchedQuote, fetchedAuthor];
}

async function getQuoteFromApiTwo() {
    let fetchedQuote;
    let fetchedAuthor;
    let pageNumber = Math.floor(Math.random() * 103) + 1;
    try {
        const response = await fetch(api__two + pageNumber);
        const data = await response.json();
        fetchedQuote = data.results[Math.floor(Math.random() * 20)].content;
        fetchedAuthor = data.results[Math.floor(Math.random() * 20)].author;
    } catch (e) {
        catchError(e);
    }
    return [fetchedQuote, fetchedAuthor];
}

async function getQuoteFromApiThree() {
    let fetchedQuote;
    let fetchedAuthor;
    try {
        const response = await fetch(api__three);
        const data = await response.json();
        let rand = Math.floor(Math.random() * data.length);
        fetchedQuote = data[rand].text;
        fetchedAuthor = data[rand].author;
    } catch (e) {
        catchError(e);
    }
    return [fetchedQuote, fetchedAuthor];
}

async function displayQuote() {
    let returnedArray = [];
    const randomSelectedApi = Math.floor(Math.random() * 3);
    if (randomSelectedApi === 0) {
        returnedArray = await getQuoteFromApiOne();
    } else if (randomSelectedApi === 1) {
        returnedArray = await getQuoteFromApiTwo();
    } else {
        returnedArray = await getQuoteFromApiThree();
    }
    quote = returnedArray[0];
    author = returnedArray[1];
    if (!quote) {
        displayQuote();
    }
    if (!author) {
        author = "Unknown";
    }
    if (quote.length > 80) {
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
    quoteText.innerHTML = quote;
    authorText.innerHTML = `<em>${author}</em>`;
}

const catchError = (error) => {
    showBackdrop();
    showErrorModal(error);
};

const tweetQuote = () => {
    tweetUrl = `https://twitter.com/intent/tweet?text="${quote}" - ${author}`;
    if (!tweetUrl) {
        return;
    } else if (quote.length + author.length + 5 > 280) {
        showBackdrop();
        showTweetCountModal();
        return;
    } else {
        window.open(tweetUrl, "_blank");
    }
};

const continueBtnHandler = () => {
    window.open(tweetUrl, "_blank");
    count__exceeded.style.top = "-100%";
    count__exceeded.style.opacity = "0";
    hideBackdrop();
};

const backdropHandler = () => {
    count__exceeded.style.top = "-100%";
    count__exceeded.style.opacity = "0";
    hideErrorModal();
    hideBackdrop();
};

newQuoteBtn.addEventListener("click", displayQuote);
tweetBtn.addEventListener("click", tweetQuote);
backdrop.addEventListener("click", backdropHandler);
