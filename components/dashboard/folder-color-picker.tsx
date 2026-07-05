'use client';

import { FOLDER_COLORS } from '@/lib/organize-utils';

type FolderColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export function FolderColorPicker({ value, onChange }: FolderColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FOLDER_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`h-7 w-7 rounded-full border-2 transition-transform ${
            value === c ? 'border-foreground scale-110' : 'border-transparent'
          }`}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}
