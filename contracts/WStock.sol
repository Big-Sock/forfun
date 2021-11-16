// SPDX-License-Identifier: MIT

// some notes...
// may want to store is buy/sell on the contract
// remove fractional share support
// check that someone sent enough payment
// order revert
// blacklist
// server must sign/confirm the buy price
// contract must verify price offer is not too old

pragma solidity 0.7.3;

import "./lib/SafeMath.sol";
import "./lib/IERC20.sol";
import "./lib/Context.sol";
import "./lib/ReentrancyGuard.sol";
import "./lib/Ownable.sol";

contract Stonk is ReentrancyGuard, Context, Ownable {
  using SafeMath for uint256;

  constructor(address _stockToken, address _rewardToken, address payable _feeAddress, address payable _holdingAddress, uint256 _feeRate, uint256 _mintRate, uint256 _burnRate) {
    REWARD_TOKEN = IERC20(_rewardToken);
	STOCK_TOKEN = IERC20(_stockToken);
    feeAddress = _feeAddress;
    holdingAddress = _holdingAddress;
	feeRate = _feeRate;
    mintRate = _mintRate;
	burnRate = _burnRate;
    isFrozen = false;
  }

  IERC20 private REWARD_TOKEN;
  IERC20 private STOCK_TOKEN;

  address payable private feeAddress;
  address payable private holdingAddress;
  uint256 private feeRate;
  uint256 private mintRate;
  uint256 private burnRate;
  bool private isFrozen;
  uint256 private frozenTimestamp;

  uint256 public totalTrades;

  uint256[] public pendingTrades;
  mapping(uint256 => uint256) public tradeAmount;


  event PendingTrade(uint256 indexed tradeId, address indexed account, bool isBuy, uint256 amount);
  event Trade(uint256 indexed tradeId, address indexed account, bool isBuy, uint256 ethAmount, uint256 stockAmount, uint256 price, uint256 fee, uint256 mint);

  function orderBuy(uint256 amount) public nonReentrant {
      uint256 amount = msg.value;
      require(amount > 0, "Must pay an amount of tokens");
      require(!isFrozen, "Contract is frozen");
      tradeAmount[totalTrades.add(1)] = amount;
      pendingTrades.push(totalTrades.add(1));
      emit PendingTrade(totalTrades.add(1), _msgSender(), true, amount);
      totalTrades = totalTrades.add(1);
  }

  function orderSell(uint256 amount) public nonReentrant {
      require(amount > 0, "Must select an amount of tokens");
      require(!isFrozen, "Contract is frozen");
      require(amount <= STOCK_TOKEN.balanceOf(_msgSender()), "Cannot sell more than balance");
      uint256 burn = amount.mul(burnRate).div(1e18);
      require(burn <= REWARD_TOKEN.balanceOf(_msgSender()), "Cannot burn more than balance");
      STOCK_TOKEN.transferFrom(_msgSender(), address(this), amount);
      REWARD_TOKEN.transferFrom(_msgSender(), address(this), burn);
      tradeAmount[totalTrades.add(1)] = amount;
      pendingTrades.push(totalTrades.add(1));
      emit PendingTrade(totalTrades.add(1), _msgSender(), false, amount);
      totalTrades = totalTrades.add(1);
  }

  function executeBuy(uint256 price, uint256 tradeId, address payable account) public onlyOwner nonReentrant { //price is eth per stock
    require(price > 0, "price must be nonzero");
    require(!isFrozen, "Contract is frozen");
    uint256 amount = tradeAmount[tradeId];
    uint256 fee = amount.mul(feeRate).div(1e18);
    uint256 cost = amount.sub(fee);
    uint256 mint = amount.mul(mintRate).div(1e18);
    uint256 bought = amount.div(price).div(1e18);
    STOCK_TOKEN.mint(account, bought);
    REWARD_TOKEN.mint(account, mint);
    _safeTransfer(feeAddress, fee);
    _safeTransfer(holdingAddress, cost);
    emit Trade(tradeId, account, true, amount, bought, price, fee, mint)
    clearPendingTrade(account, saleId);
  }

  function executeSell(uint256 price, uint256 tradeId, address payable account) public onlyOwner nonReentrant {
    require(price > 0, "price must be nonzero");
    require(!isFrozen, "Contract is frozen");
    uint256 sold = tradeAmount[tradeId];
    uint256 amount = sold.mult(price).div(1e18);
    uint256 fee = amount.mul(feeRate).div(1e18);
    uint256 value = amount.sub(fee);
    uint256 burn = amount.mul(burnRate).div(1e18);
    STOCK_TOKEN.burn(sold);
    REWARD_TOKEN.burn(burn);
    _safeTransfer(feeAddress, fee);
    _safeTransfer(account, value);
    emit Trade(tradeId, account, false, amount, sold, price, fee, burn);
    clearPendingTrade(account, saleId);
  }

  function getPendingTrades() public view returns(uint256[] memory) {
    return pendingTrades;
  }

  function clearPendingTrade(uint256 trade) internal {
    for (uint256 i = 0; i < pendingTrades.length; i++) {
      if (pendingTrades[i] == trade) {
        pendingTrades[i] = pendingTrades[pendingTrades.length - 1];
        pendingTrades.pop();
        break;
      }
    }
  }

  function getFeeAddress() public view returns (address) {
    return feeAddress;
  }
  function setFeeAddress(address payable _feeAddress) public onlyOwner nonReentrant {
    feeAddress = _feeAddress;
  }

  function getFeeRate() public view returns (uint256) {
    return feeRate;
  }
  function setFeeRate(uint256 _feeRate) public onlyOwner nonReentrant {
    require(_feeRate > 1e3, "Fee rate too small");
    feeRate = _feeRate;
  }

  function getMintRate()  public view returns(uint256) {
    return mintRate;
  }
  function setMintRate(uint256 _mintRate) public onlyOwner nonReentrant {
    mintRate = _mintRate;
  }

  function getBurnRate()  public view returns(uint256) {
    return burnRate;
  }
  function setBurnRate(uint256 _burnRate) public onlyOwner nonReentrant {
    burnRate = _burnRate;
  }

  function _safeTransfer(address payable to, uint256 amount) internal {
    uint256 balance;
    balance = address(this).balance;
    if (amount > balance) {
        amount = balance;
    }
    Address.sendValue(to, amount);
  }

}