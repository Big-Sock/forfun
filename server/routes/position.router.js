// const express = require("express");
// const alpaca = require("../alpaca.js");

// const router = express.Router();

// router.get("/", (req, res) => {
//   alpaca.getPositions().then((response) => {
//     res.send(response);
//   });
// });

// // router.delete("/", (req) => {
// //   cancelExistingOrders();
// // });

// router.get("/history", (req, res) => {
//   alpaca
//     .getAccountActivities({
//       until: new Date(),
//     })
//     .then((response) => {
//       res.send(response);
//     });
// });

// router.get("/:ticker", (req, res) => {
//   res.send("Current position for specific stock");
// });

// // router.post("/:ticker", (req, res) => {
// //   const { ticker } = req.params;
// //   const { side, qty } = req.body;
// //   alpaca
// //     .createOrder({
// //       symbol: ticker,
// //       qty,
// //       side,
// //       type: "market",
// //       time_in_force: "day",
// //     })
// //     .then((response) => {
// //       res.send(response);
// //     });
// // });

// // //TODO
// // const cancelExistingOrders = async () => {
// //   let orders;
// //   try {
// //     orders = await this.alpaca.getOrders({
// //       status: "open",
// //       direction: "desc",
// //     });
// //   } catch (err) {
// //     console.log(err.error);
// //   }

// //   return Promise.all(
// //     orders.map((order) => {
// //       return new Promise(async (resolve) => {
// //         try {
// //           await this.alpaca.cancelOrder(order.id);
// //         } catch (err) {
// //           console.log(err.error);
// //         }
// //         resolve();
// //       });
// //     })
// //   );
// // };

// module.exports = router;
