const {
  Contract,
  utils,
  providers,
  getDefaultProvider,
  Wallet,
} = require("ethers");
const { WStockAddress, network } = require("./constants");
const WStockABI = require("./abi/WStock.abi");
const StockTokenABI = require("./abi/StockToken.abi");
const alpaca = require("../alpaca");
const AcceptedOrder = require("../schemas/AcceptedOrder.schema");
const CompletedOrder = require("../schemas/CompletedOrder.schema");
const Stock = require("../schemas/Stocks.schema");

const provider = new providers.WebSocketProvider(process.env.WSS_PROVIDER_URL);

const listenForOrders = async () => {
  const contract = new Contract(WStockAddress, WStockABI, provider);
  console.log("trade listener running");

  contract.on("Trade", async (data) => {
    let filter = contract.filters.Trade(data);
    let event = await contract.queryFilter(filter);

    CompletedOrder.exists(
      { tradeId: event[0].args.tradeId.toNumber() },
      (err, doc) => {
        if (doc) {
          console.log("Trade already exists");
        } else {
          let trade = {
            tradeId: event[0].args.tradeId.toNumber(),
            account: event[0].args.account,
            ticker: utils.parseBytes32String(event[0].args.ticker),
            isBuy: event[0].args.isBuy,
            amount: parseFloat(event[0].args.amount.toString()) / 1e18,
            total: parseFloat(event[0].args.total.toString()) / 1e18,
            fee: parseFloat(event[0].args.fee.toString()) / 1e18,
          };
          console.log("trade completed", trade);

          setTimeout(() => {
            executeTrade(trade.tradeId, trade);
          }, 1000);
        }
      }
    );
  });
};

const listenForRefill = async () => {
  let provider = new providers.WebSocketProvider(process.env.WSS_PROVIDER_URL);
  let walletWithProvider = new Wallet(process.env.PRIVATE_TEST_KEY, provider);
  const contract = new Contract(WStockAddress, WStockABI, walletWithProvider);
  console.log("refill listener running");

  contract.on("Reload", async (data) => {
    console.log("Reload Detected!");
    let filter = contract.filters.Reload(data);
    let event = await contract.queryFilter(filter);
    await contract.setReserve("13000000000000000000", {
      value: event[0].args.amount,
    });
  });
};

const acceptOrder = (order) => {
  try {
    let acceptedOrder = new AcceptedOrder({
      ticker: order.ticker,
      price: order.total / order.amount,
      totalCost: order.total,
      amount: order.amount,
      isBuy: order.isBuy,
      timestamp: Date.now(),
    });
    acceptedOrder.save().catch((err) => {
      console.log(err);
    });
    console.log(acceptedOrder);
  } catch (err) {
    console.log(err);
  }
};

const executeTrade = (tradeID, order) => {
  // Will want to break this out into a standard function will sell.
  // Also want to consider placing this as a limit order, but will
  // have to consider other ways of ensuring 1:1 on failure.
  acceptOrder(order);
  if (process.env.REAL_TIME_TRADING) {
    createOrder(tradeID, order);
  }
};

const createOrder = (tradeID, order) => {
  alpaca
    .createOrder({
      symbol: order.ticker,
      qty: order.amount,
      side: order.isBuy ? "buy" : "sell",
      type: "market",
      time_in_force: "day",
    })
    .then((response) => {
      let saveOrder = new CompletedOrder({
        tradeID: tradeID,
        address: order.account,
        price: order.total / order.amount,
        totalCost: order.total,
        amount: order.amount,
        isBuy: order.isBuy,
        symbol: response.symbol,
        submittedTime: response.submittedTime,
        type: response.type,
        status: response.status,
        timestamp: Date.now(),
      });
      saveOrder.save().catch((err) => {
        console.log(err);
      });
    })
    .catch((err) => {
      console.error(err);
      console.error("Create sell order error");
    });
};

const settlePosition = async () => {
  // Get actual stock balance
  const actualPosition = (await alpaca.getPositions()).reduce(
    (acc, curr) => ({ ...acc, [curr.symbol]: parseInt(curr.qty) }),
    {}
  );

  // Get tokenized stock balance
  const stocks = await Stock.find();
  const tokenPosition = await stocks.reduce(async (acc, curr) => {
    const contract = new Contract(curr.address, StockTokenABI, provider);
    const totalSupply = await contract.totalSupply();
    return {
      ...(await acc),
      [curr.ticker]: Math.ceil(parseInt(totalSupply) / 1e18),
    };
  }, {});

  // Buy/Sell shares to equalize position
  for (const [ticker, tokenQty] of Object.entries(tokenPosition)) {
    // TODO: handle stocks we don't want to be equal. E.g., VOO
    const diff = tokenQty - actualPosition[ticker];
    if (diff) {
      // TODO: check if any open orders, if so don't proceed
      alpaca.createOrder({
        symbol: ticker,
        qty: Math.abs(diff),
        side: diff > 0 ? "buy" : "sell",
        type: "market",
        time_in_force: "day",
      });
    }
  }
};

// TODO: Add cronjob to do this on market open.
// settlePosition();

const isMarketOpen = async () => {
  const clockRes = await alpaca.getClock();
  return clockRes.is_open;
};

const isWeekday = () => {
  const today = new Date();
  const weekday = today.getDay();
  return weekday > 0 && weekday < 6;
};

const getRiskCost = async (ticker) => {
  // If regular market hours, use actual stock price
  if (await isMarketOpen()) {
    return 0;
  }

  // Allow outside of hours trading only during the week
  if (isWeekday()) {
    const stock = await Stock.findOne({ ticker: ticker });
    // Might be better just to error if riskCost not found
    return stock.riskCost ? stock.riskCost : 0.2;
  } else {
    throw Error("Market is closed");
  }
};

const getFee = async () => {
  const provider = getDefaultProvider(network);
  const contract = new Contract(WStockAddress, WStockABI, provider);
  const feeRate = await contract.getFeeRate();
  return feeRate;
};

module.exports = {
  isMarketOpen,
  isWeekday,
  listenForOrders,
  listenForRefill,
  getFee,
  getRiskCost,
};
