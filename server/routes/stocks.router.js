const express = require("express");
const router = express.Router();
const Quote = require("../schemas/Quote.schema");
const Stock = require("../schemas/Stocks.schema");
const KYC = require("../schemas/KYC.schema");
const axios = require("axios");
const { getFee, getRiskCost } = require("../web3/server-utils");
const { Contract, utils, BigNumber, getDefaultProvider } = require("ethers");
const CMC_API_KEY = "ec256de7-d98a-4988-b0bb-b38c0711dfb5";

const { WStockAddress, network } = require("../web3/constants");
const WStockABI = require("../web3/abi/WStock.abi");

const coinGecko =
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";

const stockNews =
  "https://stocknewsapi.com/api/v1?tickers=COIN,TSLA,AAPL,GME,VOO&items=50&token=" +
  process.env.STOCKNEWS_API_KEY;

let cache = {};

router.get("/stock-news", async (req, res) => {
  try {
    const currentTime = new Date().getTime();
    if (!cache.timestamp || cache.timestamp > currentTime + 120000) {
      await axios.get(stockNews).then((response) => {
        cache.timestamp = currentTime;
        cache.data = response.data;
      });
    }
    res.send(cache.data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/supported-stocks", async (req, res) => {
  try {
    let stocks = await Stock.find().sort({ timestamp: -1 });
    const tickerList = stocks.map((stock) => {
      return stock.ticker;
    });
    const barset = await alpaca.getBars("day", tickerList, { limit: 1 });

    for (let i = 0; i < stocks.length; i++) {
      let priceData = await alpaca.lastTrade(stocks[i].ticker);
      const bars = barset[stocks[i].ticker];

      const week_open = bars[0].openPrice;
      const week_close = bars.slice(-1)[0].closePrice;
      const percent_change = ((week_close - week_open) / week_open) * 100;

      const provider = getDefaultProvider(network);
      const contract = new Contract(WStockAddress, WStockABI, provider);
      const feeRate = await contract.getFeeRate();

      stocks[i] = {
        ticker: stocks[i].ticker,
        address: stocks[i].address,
        timestamp: stocks[i].timestamp,
        percent_change: percent_change,
        price: priceData.last.price,
        feeRate: parseFloat(feeRate),
      };
    }

    res.send(stocks);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/status", (req, res) => {
  alpaca.getClock().then((response) => {
    res.send(response);
  });
});

router.get("/:ticker/last", (req, res) => {
  const { ticker } = req.params;

  alpaca.lastTrade(ticker).then((response) => {
    axios
      .get(
        `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_371ed775adda469aa8fbee72604493aa`
      )
      .then((iexRes) => {
        const iexPrice = iexRes.data.latestPrice;
        const alpacaPrice = response.last.price;
        res.send({
          price: Math.abs(iexPrice - alpacaPrice) < 10 ? alpacaPrice : iexPrice,
        });
      });
  });
});

router.get("/:ticker/recent", (req, res) => {
  const { ticker } = req.params;
  const end = new Date();
  const start = new Date();
  start.setTime(end.getTime() - 10 * 60 * 1000);

  alpaca.getAggregates(ticker, "minute", start, end).then((response) => {
    res.send(response);
  });
});

//TODO: This is currently returning our entire portfolio. Not urgent, but
// should be limited to the stocks we support.
router.get("/portfolio", (req, res) => {
  alpaca.getPositions().then((response) => {
    res.send(response);
  });
});

router.post("/accept-quote", async (req, res) => {
  let { id } = req.body;
  try {
    await Quote.updateOne({ _id: id }, { accepted: true });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

router.post("/:ticker/quote", async (req, res) => {
  const { ticker } = req.params;
  try {
    let { address, qty, isBuy } = req.body;
    address = address.toLowerCase();
    let stock = await Stock.findOne({ ticker: ticker });
    if (!stock) {
      return res.status(404).send("this stock is not supported");
    }

    let user = await KYC.findOne({ address: address });
    if (!user || !user.approved) {
      return res.status(403).send("this address is not approved");
    }

    let quote = await getQuote(ticker, address, qty, isBuy);
    // save quote here to database
    if (!quote) {
      return res.status(400).send("Invalid Request");
    }
    const dbQuote = new Quote({
      address: quote.address,
      sig: quote.sig,
      price: quote.price,
      totalCost: BigNumber.from(quote.totalCost).toString(),
      fee: quote.fee,
      amount: quote.amount,
      ticker: quote.ticker,
      timestamp: quote.timestamp,
    });
    let result = await dbQuote.save();
    quote._id = result._id;
    res.send(quote);
  } catch (error) {
    console.log(error.message);
    res.status(401).send(error.message);
  }
});

const getQuote = async (ticker, address, qty, buy, callback) => {
  qty = parseInt(qty);
  if (qty < 1) {
    return null;
  }

  const ethDollarPrice = await getEthPriceCMC();
  const stockData = await alpaca.lastTrade(ticker);
  const stockDollarPrice = stockData.last.price;

  // Get cost associated with out of hours trading
  const riskCost = await getRiskCost(ticker);
  const costMultipler = buy ? 1 + riskCost : 1 - riskCost;

  const stockEthPrice = (stockDollarPrice / ethDollarPrice) * costMultipler;

  if (stockDollarPrice * qty >= 10000) {
    throw Error("Order greater than or equal to $10000");
  }

  let totalEthCost = stockEthPrice * qty;

  let fee = await getFee();
  fee *= totalEthCost;
  // do stonk gas fee calculation here

  const totalWeiCost = utils.parseEther(totalEthCost.toString());
  qty = utils.parseEther(qty.toString());
  const timestamp = parseInt(Date.now() / 1000);

  const sig = sign(address, ticker, qty, totalWeiCost, timestamp);
  return {
    address,
    sig,
    price: stockEthPrice,
    totalCost: totalWeiCost,
    fee: fee,
    amount: qty,
    ticker: ticker,
    timestamp,
  };
};

const sign = (address, ticker, amount, total, timestamp) => {
  let data = utils.defaultAbiCoder.encode(
    ["address", "bytes32", "uint256", "uint256", "uint256"],
    [
      address,
      utils.formatBytes32String(ticker),
      BigNumber.from(amount),
      total,
      BigNumber.from(timestamp),
    ]
  );
  const hash = utils.keccak256(utils.hexlify(data));
  const signer = new utils.SigningKey(process.env.PRIVATE_TEST_KEY);
  const { r, s, v } = signer.signDigest(hash);
  return { r, s, v };
};

const getEthPriceCMC = async () => {
  // Ethereum's ID is 1027
  try {
    const response = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=1027`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": CMC_API_KEY,
        },
      }
    );
    return response.data.data["1027"].quote.USD.price;
  } catch (error) {
    console.log(error);
    return getEthPriceGecko();
  }
};

const getEthPriceGecko = async () => {
  const response = await axios.get(coinGecko);
  return response.data.ethereum.usd;
};

getEthPriceGecko();

module.exports = router;
