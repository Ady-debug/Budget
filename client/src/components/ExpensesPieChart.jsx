import React, { useMemo, useState } from "react";
import Card from "./card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLOURS = {
  homeExpense: "#3b82f6", // blue
  utilities: "#8b5cf6", // purple
  servicesAndSubscriptions: "#ec4899", // pink
  transportAndTravel: "#f59e0b", // amber
  personal: "#10b981", // emerald
  pets: "#06b6d4", // cyan
  foodAndShopping: "#f97316", // orange
  accountsAndSavings: "#6366f1", // indigo
};

const CATEGORY_LABELS = {
  homeExpense: "Home Expense",
  utilities: "Utilities",
  servicesAndSubscriptions: "Services & Subscriptions",
  transportAndTravel: "Transport & Travel",
  personal: "Personal",
  pets: "Pets",
  foodAndShopping: "Food & Shopping",
  accountsAndSavings: "Accounts & Savings",
};

export default function ExpensesPieChart(props) {
  const { data } = props;
  const [activeIndex, setActiveIndex] = useState(null);

  const chartData = useMemo(() => {
    // Transform budget data into chart-friendly format
    const expenses = [];

    for (let category in data) {
      if (category === "income") continue;

      let categoryTotal = 0;
      for (let item in data[category]) {
        const value = parseFloat(data[category][item]) || 0;
        categoryTotal += value;
      }

      if (categoryTotal > 0) {
        expenses.push({
          name: CATEGORY_LABELS[category] || category,
          value: parseFloat(categoryTotal.toFixed(2)),
          category: category,
        });
      }
    }

    return expenses;
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    //Custom tooltip to show formatted values
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="font-semibold text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            £{payload[0].value.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {(
              (payload[0].value /
                chartData.reduce((sum, item) => sum + item.value, 0)) *
              100
            ).toFixed(1)}
            % of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Handle pie chart slice interaction
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-2">
      <Card title="Expenses Breakdown" error={null}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={245}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationBegin={0}
                animationDuration={0}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLOURS[entry.category]}
                    opacity={
                      activeIndex === null || activeIndex === index ? 1 : 0.6
                    }
                    style={{
                      filter:
                        activeIndex === index
                          ? "drop-shadow(0 0 8px rgba(0,0,0,0.3))"
                          : "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{
                  paddingLeft: "20px",
                }}
                formatter={(value) => (
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-700 dark:text-gray-400 text-center py-8">
            No expense data to display. Start adding your expenses above!
          </p>
        )}
      </Card>
    </div>
  );
}
