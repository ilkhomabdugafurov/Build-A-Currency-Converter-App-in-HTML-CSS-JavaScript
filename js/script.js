const dropList = document.querySelectorAll(".drop-list select"),
    fromCurrency = document.querySelector(".from select"),
    toCurrency = document.querySelector(".to select"),
    getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for (currency_code in country_code) {
        // selecting USD by default as FROM currency and NPR as TO currency
        let selected;
        if (i == 0) {
            selected = currency_code == "USD" ? "selected" : "";
        } else if (i == 1) {
            selected = currency_code == "UZS" ? "selected" : "";
        }
        // creating option tag with passing currency code as a text and value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // inserting options tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", (e) => {
        loadFlag(e.target); // calling loadFlag with passing target element as an argument
    });
}

function loadFlag(element) {
    for (code in country_code) {
        // if currency code of country list is equal to option value
        if (code == element.value) {
            // selecting img tag of particular drop list
            let imgTag = element.parentElement.querySelector("img");
            // passing country code of a selected currency code in a img url
            imgTag.src = `https://www.countryflags.io/${country_code[code]}/flat/64.png`;
        }
    }
}

window.addEventListener("load", () => {
    getExchangeRate();
});

getButton.addEventListener("click", (e) => {
    e.preventDefault(); // preventing from from submitting
    getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
    // temporary currency code of FROM drop list
    let tempCode = fromCurrency.value;
    // passing TO currency code to FROM currency code
    fromCurrency.value = toCurrency.value;
    // passing temporary currency code to TO currency code
    toCurrency.value = tempCode;
    // calling loadFlag with passing select element (fromCurrency) of FROM
    loadFlag(fromCurrency);
    // calling loadFlag with passing select element (toCurrency) of TO
    loadFlag(toCurrency);
    getExchangeRate();
});

function getExchangeRate() {
    const amount = document.querySelector(".amount input"),
        exchangeRateTxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value;
    // if user don't enter any value or enter 0 then we'll put 1 value by default in the input field
    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = "Getting exchange rate...";
    let url = `https://v6.exchangerate-api.com/v6/c550455773de4db82863ad0c/latest/${fromCurrency.value}`;
    // fetching api response and returning it with parsing into js obj and in another then method receiving that obj
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            let exchangeRate = result.conversion_rates[toCurrency.value];
            let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
        })
        .catch(() => {
            // if user is offline or any other error occured while fetching data then catch function will run
            exchangeRateTxt.innerText = "Something went wrong";
        });
}
