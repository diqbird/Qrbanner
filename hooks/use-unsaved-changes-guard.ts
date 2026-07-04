'use client';

import { useEffect } from 'react';

/** Warn on tab close / refresh when the form has unsaved edits. */
export function useUnsavedChangesGuard(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);
}
