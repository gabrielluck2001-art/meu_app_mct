import { View, Text } from 'react-native';
import { CartesianChart, Line } from 'victory-native';
import { useColors } from '@/hooks/use-colors';
import type { ChartDataPoint } from '@/types/models';

interface ProgressChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export function ProgressChart({ data, height = 200 }: ProgressChartProps) {
  const colors = useColors();
  
  // Preparar dados para o gráfico
  const chartData = data.map((point, index) => ({
    x: index,
    score: point.score
  }));

  if (data.length === 0) {
    return (
      <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.muted }}>Sem dados para exibir</Text>
      </View>
    );
  }

  if (data.length === 1) {
    // Se houver apenas um ponto, mostrar como indicador simples
    return (
      <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
        <View className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
          <Text className="text-sm text-muted text-center mb-2">Score Atual</Text>
          <Text className="text-4xl font-bold text-primary text-center">
            {data[0].score.toFixed(1)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ height }}>
      <CartesianChart
        data={chartData}
        xKey="x"
        yKeys={["score"]}
        domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
      >
        {({ points }) => (
          <Line
            points={points.score}
            color={colors.primary}
            strokeWidth={3}
            animate={{ type: "timing", duration: 300 }}
          />
        )}
      </CartesianChart>
    </View>
  );
}
