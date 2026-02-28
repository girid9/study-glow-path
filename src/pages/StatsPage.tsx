import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadProgress } from "@/lib/progress";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { format } from "date-fns";

export default function StatsPage() {
  const state = useMemo(() => loadProgress(), []);

  const daily = useMemo(() => {
    const buckets = new Map<string, { day: string; correct: number; total: number }>();
    for (const a of state.attempts) {
      const day = format(new Date(a.timestamp), "yyyy-MM-dd");
      const b = buckets.get(day) ?? { day, correct: 0, total: 0 };
      b.total += 1;
      if (a.correct) b.correct += 1;
      buckets.set(day, b);
    }
    return Array.from(buckets.values())
      .sort((a, b) => a.day.localeCompare(b.day))
      .map((d) => ({ ...d, accuracy: d.total ? Math.round((d.correct / d.total) * 100) : 0 }));
  }, [state.attempts]);

  const totals = useMemo(() => {
    const total = state.attempts.length;
    const correct = state.attempts.filter((a) => a.correct).length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const mistakes = Object.keys(state.mistakes).length;
    const bookmarks = Object.keys(state.bookmarks).length;
    return { total, correct, accuracy, mistakes, bookmarks };
  }, [state]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader><CardTitle className="text-sm">Accuracy</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{totals.accuracy}%</CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader><CardTitle className="text-sm">Attempts</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{totals.total}</CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader><CardTitle className="text-sm">Mistakes saved</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{totals.mistakes}</CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Accuracy over time</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {daily.length === 0 ? (
            <div className="h-full grid place-items-center text-sm text-muted-foreground">
              No data yet. Take a quiz to see stats.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily}>
                <XAxis dataKey="day" tickFormatter={(v) => v.slice(5)} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="currentColor" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
