import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllSubjects } from "@/lib/quizData";
import { Search, Timer } from "lucide-react";

export default function PracticePage() {
  const [q, setQ] = useState("");
  const subjects = useMemo(() => getAllSubjects(), []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return subjects;
    return subjects
      .map((s) => ({
        ...s,
        topics: s.topics.filter((t) => t.name.toLowerCase().includes(query) || s.name.toLowerCase().includes(query)),
      }))
      .filter((s) => s.topics.length > 0);
  }, [q, subjects]);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search topics..."
              className="pl-9 rounded-xl"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Start a quiz or timed challenge from any topic.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filtered.map((s) => (
          <div key={s.id} className="space-y-2">
            <div className="text-sm font-semibold">{s.name}</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {s.topics.map((t) => (
                <Card key={t.id} className="rounded-2xl">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.questions.length} questions</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" className="rounded-xl">
                        <Link to={`/subject/${s.id}/topic/${t.id}/quiz`}>Start</Link>
                      </Button>
                      <Button asChild size="sm" variant="secondary" className="rounded-xl">
                        <Link to={`/subject/${s.id}/topic/${t.id}/timed`}>
                          <Timer className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
