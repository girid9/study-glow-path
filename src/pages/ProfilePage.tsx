import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearMistakes, loadProgress, setDailyGoal } from "@/lib/progress";

export default function ProfilePage() {
  const initial = useMemo(() => loadProgress(), []);
  const [goal, setGoal] = useState(String(initial.dailyGoal.questions));
  const [saved, setSaved] = useState("");

  const mistakes = Object.keys(initial.mistakes).length;
  const bookmarks = Object.keys(initial.bookmarks).length;

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">Daily goal (questions)</div>
          <div className="flex items-center gap-2">
            <Input
              value={goal}
              onChange={(e) => setGoal(e.target.value.replace(/[^0-9]/g, ""))}
              className="max-w-32 rounded-xl"
            />
            <Button
              className="rounded-xl"
              onClick={() => {
                const g = Number(goal || 20);
                setDailyGoal(g);
                setSaved("Saved!");
                setTimeout(() => setSaved(""), 1200);
              }}
            >
              Save
            </Button>
            {saved && <span className="text-sm text-muted-foreground">{saved}</span>}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border p-4">
              <div className="text-sm font-semibold">Mistake notebook</div>
              <div className="text-2xl font-semibold">{mistakes}</div>
              <div className="text-xs text-muted-foreground">questions saved</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-sm font-semibold">Bookmarks</div>
              <div className="text-2xl font-semibold">{bookmarks}</div>
              <div className="text-xs text-muted-foreground">questions saved</div>
            </div>
          </div>

          <Button
            variant="secondary"
            className="rounded-xl"
            onClick={() => {
              clearMistakes();
              location.reload();
            }}
          >
            Clear mistake notebook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
