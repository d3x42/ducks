import './App.css';
import {useEffect, useMemo, useState} from 'react';
import Plot from 'react-plotly.js';

function App(factory, deps) {
  const [ducksData, setDucksData] = useState([]);
  const [ducksRetentionData, setDucksRetentionData] = useState([]);

  useEffect(
    () => {
      fetch('./ducks.json',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(ducks => setDucksData(ducks))
        .catch(e => {
          setDucksData([]);
          console.error(e)
        })
    },
    []
  );

  useEffect(
    () => {
      fetch('./ducks-retention.json',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(ducks => setDucksRetentionData(ducks))
        .catch(e => {
          setDucksRetentionData([]);
          console.error(e)
        })
    },
    []
  );

  const ducksByColors = useMemo(
    () => {
      const agr = ducksData.reduce(
        (res, item) => {
          res[item.color] = res[item.color] ? res[item.color] + 1 : 1;
          return res;
        },
        {}
      );
      return {
        labels: Object.keys(agr),
        values: Object.values(agr)
      }
    },
    [ducksData]
  );

  const ducksRetention = useMemo(
    () => ducksRetentionData.reduce(
      (res, dataItem) => {
        res.labels.push(dataItem.label);
        res.values.push(dataItem.percent);
        res.leftCi.push(dataItem.ci[0]);
        res.rightCi.push(dataItem.ci[1]);
        return res;
      },
      {
        labels: [],
        values: [],
        leftCi: [],
        rightCi: []
      }
    ),
    [ducksRetentionData]
  );

  return (
    <div className="App">
      <div className="App_item">
        <Plot
          data={[
            {
              x: ducksData.map(dataItem => dataItem.location),
              y: ducksData.map(dataItem => dataItem.age),
              type: "histogram",
              name: "age",
              histfunc: "avg"
            }
          ]}
          layout={ {width: 400, height: 350, title: 'Avg ducks age by country'} }
        />
      </div>
      <div className="App_item">
        <Plot
          data={[
            {
              values: ducksByColors.values,
              labels: ducksByColors.labels,
              type: 'pie'
            }
          ]}
          layout={ {width: 350, height: 350, title: 'Duck by colors'} }
        />
      </div>
      <div className="App_item">
        <Plot
          data={[
            {
              x: ducksRetention.labels,
              y: ducksRetention.values,
              line: {width: 1},
              marker: {color: "blue"},
              mode: "lines",
              name: "Average percent",
              type: "scatter"
            }, {
              x: ducksRetention.labels,
              y: ducksRetention.leftCi,
              fill: "tonexty",
              fillcolor: "rgba(68, 68, 68, 0.3)",
              line: {color: "transparent"},
              mode: "lines",
              name: "Left confidence interval",
              type: "scatter"
            }, {
              x: ducksRetention.labels,
              y: ducksRetention.rightCi,
              fill: "tonexty",
              fillcolor: "rgba(68, 68, 68, 0.3)",
              line: {color: "transparent"},
              mode: "lines",
              name: "Right confidence interval",
              type: "scatter"
            }
          ]}
          layout={ {width: 600, height: 350, title: 'Duck retention in NY 2021 with zero week 1 - 7 March'} }
        />
      </div>
      <div className="App_item">
        <Plot
          data={[{
            type: 'scattergeo',
            lat: [ 40.7127, 51.5072 ],
            lon: [ -74.0059, 0.1275 ],
            mode: 'lines',
            line:{
              width: 2,
              color: 'red'
            }
          }]}
          layout={{
            title: 'Yellow ducks migration path from NY to London',
            width: 700,
            height: 350,
            showlegend: false,
            geo: {
              resolution: 50,
              showland: true,
              showlakes: true,
              landcolor: 'rgb(204, 204, 204)',
              countrycolor: 'rgb(204, 204, 204)',
              lakecolor: 'rgb(255, 255, 255)',
              projection: {
                type: 'equirectangular'
              },
              coastlinewidth: 2,
              lataxis: {
                range: [ 20, 60 ],
                showgrid: true,
                tickmode: 'linear',
                dtick: 10
              },
              lonaxis:{
                range: [-100, 20],
                showgrid: true,
                tickmode: 'linear',
                dtick: 20
              }
            }
          }}
        />
      </div>
      <div className="App_item">
        <Plot
          data={[{type: 'densitymapbox', lat: [51,	40.731], lon: [-0.11, -73.935], z: [10, 5]}]}
          layout={
            {
              width: 600,
              height: 350,
              mapbox: {style: 'stamen-terrain', center: {lat: 51, lon: 0}},
              title: 'Ducks heatmap in UK after migration'
          }}
        />
      </div>
    </div>
  );
}

export default App;
