import { useMemo } from 'react';
import { useTheme, SxProps } from '@mui/material';
import * as echarts from 'echarts/core';
import ReactEchart from 'components/base/ReactEchart';
import { TooltipComponent } from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import { GaugeChart } from 'echarts/charts';

echarts.use([TooltipComponent, GaugeChart, SVGRenderer]);

interface SecurityScoreChartProps {
  data: {
    value: number;
    detail: { valueAnimation: boolean; offsetCenter: string[] };
  }[];
  sx?: SxProps;
}

const SecurityScoreChart = ({ data, ...rest }: SecurityScoreChartProps) => {
  const theme = useTheme();

  const getColor = (val: number) => {
    if (val >= 80) return theme.palette.success.main;
    if (val >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const score = data[0]?.value ?? 0;
  const color = getColor(score);

  const option = useMemo(
    () => ({
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          radius: '100%',
          pointer: { show: false },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              color,
              shadowBlur: 8,
              shadowColor: color,
            },
          },
          axisLine: {
            lineStyle: {
              width: 4,
              color: [[1, theme.palette.divider]],
            },
          },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          data: data.map((d) => ({
            ...d,
            itemStyle: { color },
          })),
          detail: {
            fontSize: 16,
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
            formatter: '{value}',
          },
        },
      ],
    }),
    [theme, data, color],
  );

  return <ReactEchart echarts={echarts} option={option} {...rest} />;
};

export default SecurityScoreChart;
