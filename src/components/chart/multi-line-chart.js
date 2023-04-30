import React from 'react';
import Chart from 'react-google-charts';

const LineChartOptions = {
  hAxis: {
    title: 'Date',
  },
  vAxis: {
    title: 'Temperature',
  },
  series: {
    1: { curveType: 'function' },
  },
}

const MultiLineChart = (tempData) => {
  return (
    <div className="container">
      <h2>React Google Line Chart Example</h2>
      <Chart
        width={'700px'}
        height={'410px'}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={tempData}
        options={LineChartOptions}
        rootProps={{ 'data-testid': '2' }}
      />
    </div>
  )
}

export default MultiLineChart;