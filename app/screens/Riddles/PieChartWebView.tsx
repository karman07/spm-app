import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  correct: number;
  wrong: number;
}

export default function PieChartWebView({ correct, wrong }: Props) {
  const html = `
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body>
        <canvas id="myChart" width="100%" height="100%"></canvas>
        <script>
          const ctx = document.getElementById('myChart').getContext('2d');
          new Chart(ctx, {
            type: 'pie',
            data: {
              labels: ['Correct', 'Wrong'],
              datasets: [{
                data: [${correct}, ${wrong}],
                backgroundColor: ['#4CAF50', '#F44336'],
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    color: '#000',
                    font: {
                      size: 20
                    }
                  }
                }
              }
            }
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        automaticallyAdjustContentInsets={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 40,
    height: 350,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 20,
  },
});
