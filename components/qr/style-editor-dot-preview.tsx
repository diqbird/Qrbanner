'use client';

export function StyleEditorDotPreview({ type, active }: { type: string; active: boolean }) {
  const cells = [
    [1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1],
    [1, 0, 1, 1, 1],
  ];
  return (
    <div
      className={`grid grid-cols-5 gap-[2px] rounded-md p-1.5 ${
        active ? 'bg-primary/15 ring-2 ring-primary' : 'bg-muted/60'
      }`}
    >
      {cells.flat().map((on, i) => {
        const rounded =
          type === 'rounded' || type === 'extra-rounded' || type === 'classy-rounded'
            ? 'rounded-full'
            : type === 'dots'
              ? 'scale-75 rounded-full'
              : type === 'classy' || type === 'classy-rounded'
                ? 'rounded-sm'
                : 'rounded-none';
        return (
          <div
            key={i}
            className={`h-2 w-2 ${rounded} ${on ? 'bg-foreground' : 'bg-transparent'}`}
          />
        );
      })}
    </div>
  );
}
