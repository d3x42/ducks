import './App.css';
import {useEffect, useMemo, useState} from 'react';
import Plot from 'react-plotly.js';

function App(factory, deps) {
  const [ducksData, setDucksData] = useState([]);

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
  )

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
    </div>
  );
}

export default App;
