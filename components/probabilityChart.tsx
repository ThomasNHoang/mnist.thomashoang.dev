import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

interface data {
  number: number | string;
  probability: number;
}

const chartConfig = {
  probability: {
    label: "Probability",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ProbabilityChart({ chartData }: { chartData: data[] }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="w-full border border-gray-300"
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="number"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <Bar dataKey="probability" />
      </BarChart>
    </ChartContainer>
  );
}
