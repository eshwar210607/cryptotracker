const spinner = document.querySelector('#spinner');
const searchInput = document.querySelector('.data-search input');
const searchBtn = document.querySelector('.data-search button');
const notFoundText = document.querySelector('#nodata');
const tableData = document.querySelector('.tableBody');
const bodyOverlay = document.querySelector('.body-overlay');

const searchFun = (searchVal, apidata) => {
    const searchmatchData = apidata.filter((e) => {
        if (e.id.toLowerCase().includes(searchVal.toLowerCase()) || e.symbol.toLowerCase().includes(searchVal.toLowerCase())) {
            return e;
        }
    });

    showData(searchmatchData);
};

const loadData = async () => {
    const getData = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1000&page=1&sparkline=false');
    const jsonData = await getData.json();
    showData(jsonData);

    searchBtn.addEventListener('click', (e) => {
        const searchVal = searchInput.value;
        if (searchVal === "") {
            alert('Please write something');
            return false;
        } else {
            searchFun(searchVal, jsonData);
        }
    });
};

const showData = (data) => {
    if (data.length === 0) {
        notFoundText.classList.remove('hidden');
        tableData.textContent = "";
    } else {
        tableData.textContent = "";
        notFoundText.classList.add('hidden');
        spinner.classList.add('hidden');

        data.forEach(val => {
            const allprofit = (val.price_change_percentage_24h || 0).toFixed(2);
const marketcap = (val.market_cap || 0).toString().slice(0, -6);


           let dataItem = `<tr  onclick="moreInformation('${val.id}','${val.current_price}')" class="shadow-sm shadow-gray-700 hover:bg-gray-900 cursor-pointer">
    <td class=" border-gray-500 p-1 flex flex-col items-center ">
    <img class="w-14 pl-3" src="${val.image}"/>
    <p class="pl-3 mt-2">${val.name}</p>
    </td>
    <td class=" p-1 border-gray-500">${val.current_price.toFixed(2)}$</td>
    <td class=" p-1 border-gray-500">${allprofit > 0 ? `<span class="text-green-700">${allprofit}%</span>` : `<span class="text-red-600">${allprofit}%</span>`}</td>
    <td class=" p-1 border-gray-500">${marketcap}M</td>
</tr>`;
            tableData.innerHTML += dataItem;
        });
    }
};

loadData();

const moreInformation = async (data, cprize) => {
    bodyOverlay.classList.remove('hidden');
    const loadSingle = await fetch(`https://api.coingecko.com/api/v3/coins/${data}`);
    const jsonSingle = await loadSingle.json();
    showModal(jsonSingle, cprize);
    modalContent.classList.add('active');
};

const modalContent = document.querySelector('.modal-all-content');
const showModal = (data, cprize) => {
    let modalItems = `
        <div style="padding: 1rem 0; border-bottom: 1px solid #4b5563; display: flex; justify-content: space-between; align-items: center;">
            <img style="width: 3rem;" src="${data.image.small}" alt=""/>
            <button onclick="closemodal()" type="button" style="color: #9ca3af; background-color: transparent; border: none;">
                <svg style="width: 1.25rem; height: 1.25rem; fill: currentColor;" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.25rem; margin-top: 1rem;">
            <div>
                <h2 style="text-transform: capitalize; font-weight: bold; font-size: 1.875rem;">${data.id}<span style="color: #9ca3af; font-weight: 600; margin-left: 0.5rem; font-size: 1.125rem;">${data.symbol}</span></h2>
                <p style="color: #facc15; font-weight: 600; margin-top: 0.75rem;">Creation Date: ${data.genesis_date ? data.genesis_date : `<span>Date is not available</span>`}</p>
                <p id="description" style="margin-top: 0.75rem; color: #ffffff; text-transform: capitalize; opacity: 0.9; line-height: 1.625;">Description here</p>
            </div>
            <div>
                <h2 style="margin-bottom: 0.25rem; font-size: 1.875rem; text-transform: capitalize; font-weight: bold; color: #374151;">Current Price:</h2>
                <p style="margin-bottom: 1rem; text-transform: capitalize; font-size: 1.5rem; font-weight: 600;">1 ${data.symbol}= <span style="color: #facc15;">${cprize}$</span></p>
                <p style="text-transform: capitalize; margin-top: 0.5rem; color: #374151;">Trade Now</p>
                <div style="max-height: 20rem; overflow-y: auto; margin-top: 1.25rem;">
                    <table style="border: none; width: 100%; color: #ffffff; text-align: center;">
                        <thead>
                            <tr style="box-shadow: 0px 1px 3px rgba(107, 114, 128, 0.7);">
                                <th style="padding: 0.75rem;">Coin</th>
                                <th style="padding: 0.75rem;">Market</th>
                                <th style="padding: 0.75rem;">Link</th>
                            </tr>
                        </thead>
                        <tbody class="tradeTable"></tbody>
                    </table>
                </div>
            </div>
        </div>`;
    modalContent.innerHTML = modalItems;

    const tradeContainer = document.querySelector('.tradeTable');
    if (data.description.en !== "") {
        document.querySelector('#description').innerHTML = data.description.en.slice(0, 300);
    } else {
        document.querySelector('#description').innerHTML = `<p style="font-size: 1.5rem; color: #374151;">Sorry, description is not available</p>`;
    }

    data.tickers.forEach((v) => {
        let tradeItem = `<tr style="box-shadow: 0px 1px 3px rgba(107, 114, 128, 0.7); cursor: pointer;">
            <td style="border: 1px solid #6b7280; padding: 0.375rem; margin-top: 0.5rem;"><span>${v.base.slice(0, 10)} / ${v.target.slice(0, 10)}</span></td>
            <td style="padding: 0.375rem; border: 1px solid #6b7280; margin-top: 0.5rem;">${v.market.name}</td>
            <td style="padding: 0.375rem; border: 1px solid #6b7280; margin-top: 0.5rem;"><button style="background-color: #facc15; width: 4rem; border-radius: 0.125rem; text-transform: capitalize; font-weight: 600; height: 2.25rem;"><a target="_blank" style="display: block;" href="${v.trade_url}">Trade</a></button></td>
        </tr>`;
        tradeContainer.innerHTML += tradeItem;
    });
};

const closemodal = () => {
    bodyOverlay.classList.add('hidden');
    modalContent.classList.remove('active');
};

bodyOverlay.addEventListener('click', closemodal);



