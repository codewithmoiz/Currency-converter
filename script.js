document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('currency-form');
    const amountInput = document.getElementById('amount');
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    const resultDiv = document.getElementById('conversion-result');
    const convertButton = document.getElementById('convert-button');


    async function getData() {
        try {
            let response = await fetch(`https://v6.exchangerate-api.com/v6/630cfcee0b8f98159f361200/latest/USD`);
            let data = await response.json();

            for (let code in data.conversion_rates) {
                fromSelect.innerHTML += `<option value="${code}">${code}</option>`;
                toSelect.innerHTML += `<option value="${code}">${code}</option>`;
            }

            document.querySelectorAll('#from option').forEach((elem) => {
                if (elem.textContent == "USD") {
                    elem.selected = true;
                }
            });
            document.querySelectorAll('#to option').forEach((elem) => {
                if (elem.textContent == "PKR") {
                    elem.selected = true;
                }
            });

            document.querySelectorAll('select').forEach((elem) => {
                elem.addEventListener('change', function () {
                    const selectedCode = elem.value;
                    const countryCode = countryList[selectedCode];

                    if (countryCode) {
                        const flagUrl = `https://flagsapi.com/${countryCode}/flat/64.png`;
                        const imgElement = elem.parentNode.querySelector('img');

                        if (imgElement) {
                            imgElement.src = flagUrl;
                        }
                    }
                });
            });

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const fromCurrency = fromSelect.value;
                const toCurrency = toSelect.value;
                const amount = parseFloat(amountInput.value);
            
                if (isNaN(amount) || amountInput.value == "0") {
                    amountInput.value = "1"
                    resultDiv.textContent = 'Please enter a valid amount';
                    return;
                }


                try {
                    let response = await fetch(`https://v6.exchangerate-api.com/v6/630cfcee0b8f98159f361200/pair/${fromCurrency}/${toCurrency}`);
                    let data = await response.json();

                    if (data.conversion_rate) {
                        const conversionRate = data.conversion_rate;
                        const convertedAmount = (amount * conversionRate).toFixed(2);
                        resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
                    } else {
                        resultDiv.textContent = 'Conversion rate not found.';
                    }
                } catch (error) {
                    console.error('There was a problem with the fetch operation:', error);
                    resultDiv.textContent = 'Error fetching conversion rate';
                }
            });
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    getData();
});


