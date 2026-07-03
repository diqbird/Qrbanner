'use client';

import { useCallback, useState } from 'react';
import { type QRStyleConfig, normalizeQRStyle } from '@/lib/qr-style';

const MAX_HISTORY = 30;

function stylesEqual(a: QRStyleConfig, b: QRStyleConfig): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useQRStyleHistory(initial: QRStyleConfig) {
  const [state, setState] = useState(() => ({
    stack: [normalizeQRStyle(initial)],
    index: 0,
  }));

  const style = state.stack[state.index] ?? normalizeQRStyle(initial);

  const setStyle = useCallback((next: QRStyleConfig) => {
    const normalized = normalizeQRStyle(next);
    setState((prev) => {
      const current = prev.stack[prev.index];
      if (current && stylesEqual(current, normalized)) return prev;
      const stack = [...prev.stack.slice(0, prev.index + 1), normalized].slice(-MAX_HISTORY);
      return { stack, index: stack.length - 1 };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => ({ ...prev, index: Math.max(0, prev.index - 1) }));
  }, []);

  const redo = useCallback(() => {
    setState((prev) => ({
      ...prev,
      index: Math.min(prev.stack.length - 1, prev.index + 1),
    }));
  }, []);

  const resetHistory = useCallback((next: QRStyleConfig) => {
    const normalized = normalizeQRStyle(next);
    setState({ stack: [normalized], index: 0 });
  }, []);

  return {
    style,
    setStyle,
    undo,
    redo,
    resetHistory,
    canUndo: state.index > 0,
    canRedo: state.index < state.stack.length - 1,
  };
}
