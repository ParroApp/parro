import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

<div>
  <Root store={store} history={history} />
    {/* <Recorder /> */}
    <LineChart width={600} height={300} data={data}
      margin={{top: 5, right: 30, left: 20, bottom: 5}}>
      <XAxis dataKey="words"/>
      <YAxis/>
      <CartesianGrid strokeDasharray="3 3"/>
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="clarity" stroke="#8884d8" activeDot={{r: 8}}/>
    </LineChart>
</div>,
