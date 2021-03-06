import React from 'react';
import { Chart } from 'react-charts';
import { arrCount } from '../../utils/array';

const DisChart = ({ notas }) => {
  let values = notas.map((nota) => nota.total);

  let aggrupad = arrCount(values, { max: 1000, min: 0, divisions: 25 });

  let charData = aggrupad.map(value => [value.y, value.x])

  const data = [
    {
      label: 'Notas',
      data: charData,
    }
  ];

  const axes = [
    { primary: true, type: 'ordinal', position: 'bottom' },
    { position: 'left', type: 'linear', show: false },
  ];
  return (
    <Chart
      style={{ width: '400px', height: '300px' }}
      data={data}
      axes={axes}
      series={{ type: 'area' }}
      tooltip
    />
  );
};

export default DisChart;
