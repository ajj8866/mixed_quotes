
// https://quote-garden.onrender.com/api/v3/quotes

const formSubmit = document.getElementById('submit');
const resetButton = document.getElementById("reset");
const exampleBox = document.querySelector("body > div:last-of-type");


resetButton.addEventListener('click', () => {
    document.getElementById("output-space").innerHTML = "";
})

function getResponse(out_lim, genre_selected) {
    if ( genre_selected != "all")
    {
        return fetch(`https://quote-garden.onrender.com/api/v3/quotes?genre=${genre_selected}&limit=${out_lim}`)
        .then(resp => {
            return resp.json()})
        .catch((error) => {
            console.log(error);
            throw new Error(error);
        })
    }
    else {
        return fetch(`https://quote-garden.onrender.com/api/v3/quotes?limit=${out_lim}`)
        .then(resp => {
            return resp.json()})
        .catch((error) => {
            console.log(error);
            throw new Error(error);
        })
    }
}


function interval_timer(duration) {
    const promise = new Promise((resolve, reject) => {
        const options = ["all", "positive", "humor", "knowledge", "learning", "business"];
        let counter = 1;
        let flag = false;
        setInterval( async () => {
            let curQuote = await getResponse(1, options[(counter)%options.length] )
            console.log(curQuote)
            counter++;
            if (!(flag)) {
                exampleBox.setAttribute("id", "interval-example");
                flag = true;
            }
            exampleBox.innerHTML = `<span>"${curQuote.data[0].quoteText}"<br><br>Author: ${curQuote.data[0].quoteAuthor}<s/pan>`
            resolve()
        }, duration);
    })
}

interval_timer(5000);

formSubmit.addEventListener('submit', async (event) => {
    event.preventDefault();
    const quoteGenre = document.getElementById('genre-selector');
    const outputLimit = document.getElementById('num-quotes');

    const apiResp = await getResponse(outputLimit.value, quoteGenre.value.toLowerCase());
    // console.log(apiResp.data);
    
    for (let i=0; i < parseInt(outputLimit.value); i++ ) {
        let quoteHolder = document.querySelector('#output-space > ul');
        let lastQuote = document.querySelector('div#output-space > ul > li:last-of-type');
        console.log(apiResp.data[i].quoteText);
        if  ( lastQuote && lastQuote.getAttribute('id') ) {
            let lastIdx = lastQuote.getAttribute('id');
            let outputTemplate = `<li id=${parseInt(lastIdx)+1}>${apiResp.data[i].quoteText} </li><br>`
            // console.log(apiResp.data);
            quoteHolder.innerHTML += outputTemplate; 
        }
        else {
            const initList = document.createElement("ul")
            initList.className = "output-list"
            document.getElementById("output-space").appendChild(initList);
            let quoteHolder = document.querySelector('#output-space > ul');
            let outputTemplate = `<li id=1>${apiResp.data[i].quoteText} </li><br>`;
            quoteHolder.innerHTML += outputTemplate;

        }
    }
});



