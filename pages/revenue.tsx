import React from "react";
import {
  VictoryArea,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
} from "victory";

const months = Array.from(Array(12).keys()).map((month) => ({
  x: month + 1,
  y: Number((32000 / (Math.random() + 1)).toFixed(0)),
  y0: 0,
  label: month + ": " + (32000 / 12).toFixed(0),
}));

const tickLines = [5000, 10000];

const Revenue = () => {
  return (
      <div>
          <h1 className="mt-4 text-center text-2xl  font-bold ">Revenue 2021</h1>
      <div className="flex justify-center">
        <div className='flex flex-col w-3/4   mb-4'>
      <VictoryChart height={375} width={700}
      domainPadding={{x: [10, 10], y: [10, 10]}}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: {
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fill: "#8A8D94",
            },
            grid: { stroke: "transparent" },
          }}
          tickValues={Array.from(Array(12).keys()).map(month => month + 1)}
        />
        <VictoryAxis
          dependentAxis={true}
          style={{
            axis: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: {
              fontFamily: "'Inter', sans-serif",
              fontSize: tickLines.length ? 12 : 0,
              fill: "#8A8D94",
            },
          }}
          tickValues={tickLines}
        />
        <VictoryArea
          interpolation="basis"
          style={{
            data: {
              fill: "#065f46",
              fillOpacity: 0.1,
              stroke: "#065f46",
              strokeWidth: 1,
            },
          }}
          labelComponent={<></>}
          data={months}
          minDomain={{x: 1, y: 1}}

        />

        <VictoryBar
          labelComponent={<VictoryTooltip flyoutStyle={{ fontSize: "12px" }} />}
          data={months}
          minDomain={{x: 1, y: 1}}

          style={{
            data: { fill: "#065f46", opacity: 0.25, width: 15, fontSize: 12 },
          }}
        />

        {tickLines.map((line) => (
          <VictoryLine key={line}

            style={{
              data: {
                stroke: "#083D77",
                strokeWidth: 2,
                strokeDasharray: 0.5,
                opacity: 1
              },
            }}
            
            data={[
                { x: 1, y: line },
                { x: 12, y: line },
              ]}
            labels={[]}

          />
        ))}
      </VictoryChart>
    </div>
    </div>
    </div>
  );
};

export default Revenue;
