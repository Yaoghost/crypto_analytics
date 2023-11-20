import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("selection.ejs")
});

app.get("/price", (req, res) => {
    // Getting hold of the form data
    const selectedCrypto = req.query.crypto;

    let cryptoCode;
    switch (selectedCrypto) {
        case 'bitcoin':
            cryptoCode = 'BTC-USD';
            break;
        case 'ethereum':
            cryptoCode = 'ETH-USD';
            break;
        case 'litecoin':
            cryptoCode = 'LTC-USD';
            break;
        // Add more cases for additional cryptocurrencies if needed
        default:
            // Handle the case where the selected cryptocurrency is not recognized
            return res.status(400).send('Invalid cryptocurrency selection');
    }

    let symbol, price, volume, lastPrice; // Declare variables here

    const apiUrl = `https://api.blockchain.com/v3/exchange/tickers/${cryptoCode}`;

    axios.get(apiUrl)
        .then(response => {
            // Assign values inside the callback
            symbol = response.data["symbol"];
            price = response.data["price_24h"];
            volume = response.data["volume_24h"];
            lastPrice = response.data["last_trade_price"];
        })
        .catch(error => {
            console.error('API Error:', error.message);
        })
        .finally(() => {
            // Render the page inside the finally block to ensure it happens after the API call completes
            res.render("price.ejs", {
                symbol: symbol,
                price: price,
                volume: volume,
                lastPrice: lastPrice
            });
        });
});


app.listen(port, (req,res) => {
    console.log(`Listening on port ${port}`)
});