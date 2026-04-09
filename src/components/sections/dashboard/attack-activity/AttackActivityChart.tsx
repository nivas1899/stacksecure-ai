import { useMemo } from 'react';
import { SxProps, useTheme } from '@mui/material';
import * as echarts from 'echarts/core';
import ReactEchart from 'components/base/ReactEchart';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';

echarts.use([LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]);

export interface AttackSeriesData {
  xss: number[];
  bruteForce: number[];
  apiAbuse: number[];
}

interface AttackActivityChartProps {
  data: AttackSeriesData;
  sx?: SxProps;
}

const AttackActivityChart = ({ data, ...rest }: AttackActivityChartProps) => {
  const theme = useTheme();

  const option = useMemo(
    () => ({
      grid: { top: 16, bottom: 36, left: 44, right: 16, containLabel: true },
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        borderRadius: 8,
        textStyle: {
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
          fontSize: 12,
        },
        axisPointer: { type: 'line', lineStyle: { color: theme.palette.divider, type: 'dashed' } },
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: theme.palette.text.secondary,
          fontSize: 11,
          fontFamily: theme.typography.fontFamily,
        },
        splitLine: { show: false },
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        min: 0,
        splitLine: { lineStyle: { color: theme.palette.divider, type: 'dashed', opacity: 0.5 } },
        axisLabel: {
          color: theme.palette.text.secondary,
          fontSize: 11,
          fontFamily: theme.typography.fontFamily,
        },
      },
      series: [
        {
          name: 'XSS Attempts',
          data: data.xss,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: theme.palette.error.main },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: theme.palette.error.main + '33' }, { offset: 1, color: theme.palette.error.main + '00' }] } },
          emphasis: { focus: 'series' },
        },
        {
          name: 'Brute Force',
          data: data.bruteForce,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: theme.palette.warning.main },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: theme.palette.warning.main + '33' }, { offset: 1, color: theme.palette.warning.main + '00' }] } },
          emphasis: { focus: 'series' },
        },
        {
          name: 'API Abuse',
          data: data.apiAbuse,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: theme.palette.primary.main },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: theme.palette.primary.main + '33' }, { offset: 1, color: theme.palette.primary.main + '00' }] } },
          emphasis: { focus: 'series' },
        },
      ],
    }),
    [theme, data],
  );

  return <ReactEchart echarts={echarts} option={option} {...rest} />;
};

export default AttackActivityChart;
