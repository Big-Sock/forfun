import React, { Component } from "react";

class MenuCard extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      container_id: "tv-medium-widget",
      symbols: [["GameStop", "GME|ALL"]],
      chartOnly: true,
      width: "100%",
      height: "100%",
      locale: "en",
      colorTheme: "light",
      gridLineColor: "#F0F3FA",
      trendLineColor: "#2196F3",
      fontColor: "#787B86",
      underLineColor: "#E3F2FD",
      isTransparent: true,
      autosize: true,
      container_id: "tradingview_941d6",
    });

    this.myRef.current.appendChild(script);
  }

  render() {
    return (
      <div class="tradingview-widget-container" ref={this.myRef}>
        <div id="tradingview_10277"></div>
        <div class="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/symbols/NYSE-GME/"
            rel="noopener"
            target="_blank"
          >
            <span class="blue-text">GameStop</span>
          </a>{" "}
          by TradingView
        </div>
      </div>
    );
  }
}

export default MenuCard;
