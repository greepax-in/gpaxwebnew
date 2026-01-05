export function extractLongTasks(lh: any) {
  const items =
    lh?.audits?.["long-tasks"]?.details?.items ?? [];

  let totalBlockingMs = 0;

  const tasks = items.map((t: any) => {
    totalBlockingMs += Math.max(0, t.duration - 50);

    return {
      startTime: t.startTime,
      duration: t.duration,
      attribution: (t.attribution ?? []).map((a: any) => ({
        type: a.type,
        url: a.url ?? null,
        name: a.name ?? null,
        totalTime: a.totalTime ?? null,
      })),
    };
  });

  return {
    totalBlockingMs: Math.round(totalBlockingMs),
    tasks,
  };
}
