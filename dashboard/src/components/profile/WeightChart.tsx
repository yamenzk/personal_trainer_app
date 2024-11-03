// src/components/profile/WeightChart.tsx
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus } from "lucide-react";
import { Weight } from "../../types/client";

interface WeightChartProps {
  weights: Weight[];
  onAddWeight: () => void;
}

const WeightChart = ({ weights, onAddWeight }: WeightChartProps) => {
  const chartData = weights
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(w => ({
      date: new Date(w.date).toLocaleDateString(),
      weight: w.weight
    }));

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Weight Progress</h2>
        <Button
          color="primary"
          variant="flat"
          size="sm"
          startContent={<Plus size={18} />}
          onPress={onAddWeight}
        >
          Log Weight
        </Button>
      </CardHeader>
      <CardBody className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="date"
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              width={30}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="currentColor"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default WeightChart;