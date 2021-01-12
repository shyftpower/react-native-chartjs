import React, { Component } from "react";
import { Platform } from "react-native";
import PropTypes from "prop-types";

import { WebView } from "react-native-webview";

var settingChartScript = `
	Chart.defaults.global.defaultFontSize={DEFAULT_FONT_SIZE};
	var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart( ctx, {CONFIG} );
`;

export default class Chart extends Component {
  static propTypes = {
    chartConfiguration: PropTypes.object.isRequired,
    defaultFontSize: PropTypes.number,
  };
  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.chartConfiguration !== this.props.chartConfiguration ||
      nextProps.defaultFontSize !== this.props.defaultFontSize
    ) {
      this.setChart(nextProps.chartConfiguration, nextProps.defaultFontSize);
    }
  }

  setChart(chartConfiguration, defaultFontSize) {
    if (
      !chartConfiguration ||
      undefined == defaultFontSize ||
      null == defaultFontSize
    ) {
      return;
    }
    this.webview &&
      this.webview.injectJavaScript(
        settingChartScript
          .replace("{CONFIG}", JSON.stringify(chartConfiguration))
          .replace("{DEFAULT_FONT_SIZE}", defaultFontSize)
      );
    this.webview.setWebChromeClient(new WebChromeClient());
  }

  render() {
    const defaultFontSize = this.props.defaultFontSize
      ? this.props.defaultFontSize
      : 12;
    return (
      <WebView
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        ref={(ref) => (this.webview = ref)}
        injectedJavaScript={settingChartScript
          .replace("{CONFIG}", JSON.stringify(this.props.chartConfiguration))
          .replace("{DEFAULT_FONT_SIZE}", defaultFontSize)}
        source={
          Platform.OS == "ios"
            ? require("./dist/index.html")
            : { uri: "file:///android_asset/index.html" }
        }
        onError={(error) => {
          console.log(error);
        }}
        // scalesPageToFit false for IOS and true for Android
        scalesPageToFit={false}
        useWebKit={true}
      />
    );
  }
}
