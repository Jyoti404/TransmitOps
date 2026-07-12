import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { TripStatus } from '../../api/trips';

type NodeState = 'done' | 'current' | 'future';

const NODES: { key: TripStatus; label: string }[] = [
  { key: 'DRAFT', label: 'Draft' },
  { key: 'DISPATCHED', label: 'Dispatched' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

function getNodeStates(status: TripStatus, wasDispatched: boolean): Record<TripStatus, NodeState> {
  switch (status) {
    case 'DRAFT':
      return { DRAFT: 'current', DISPATCHED: 'future', COMPLETED: 'future', CANCELLED: 'future' };
    case 'DISPATCHED':
      return { DRAFT: 'done', DISPATCHED: 'current', COMPLETED: 'future', CANCELLED: 'future' };
    case 'COMPLETED':
      return { DRAFT: 'done', DISPATCHED: 'done', COMPLETED: 'current', CANCELLED: 'future' };
    case 'CANCELLED':
      return {
        DRAFT: 'done',
        DISPATCHED: wasDispatched ? 'done' : 'future',
        COMPLETED: 'future',
        CANCELLED: 'current',
      };
  }
}

const DOT_CLASSES: Record<NodeState, string> = {
  done: 'bg-emerald-500',
  current: 'bg-brand-600 ring-2 ring-brand-200',
  future: 'bg-slate-200',
};

const LABEL_CLASSES: Record<NodeState, string> = {
  done: 'text-emerald-700',
  current: 'text-brand-700 font-medium',
  future: 'text-slate-400',
};

const FLASH_DURATION_MS = 900;

interface TripLifecycleStepperProps {
  status: TripStatus;
  dispatchedAt: string | null;
}

export function TripLifecycleStepper({ status, dispatchedAt }: TripLifecycleStepperProps) {
  // Cancelled renders in red instead of the default "current" blue, matching the status badge convention elsewhere.
  const states = getNodeStates(status, dispatchedAt !== null);

  // Detect an actual stage change (not just a re-render) so we can flash
  // confirmation on whichever node just became current — this is what makes
  // "the action was applied" visible, rather than the color silently snapping.
  const [justChangedTo, setJustChangedTo] = useState<TripStatus | null>(null);
  const prevStatusRef = useRef(status);

  useEffect(() => {
    if (prevStatusRef.current !== status) {
      prevStatusRef.current = status;
      setJustChangedTo(status);
      const timer = setTimeout(() => setJustChangedTo(null), FLASH_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="flex items-center" aria-label={`Trip status: ${status}`}>
      {NODES.map((node, i) => {
        const state = states[node.key];
        const isCancelledCurrent = node.key === 'CANCELLED' && state === 'current';
        const isFlashing = justChangedTo === status && node.key === status;

        return (
          <div key={node.key} className="flex items-center">
            <div className="flex flex-col items-center" style={{ width: 56 }}>
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                {isFlashing && (
                  <span
                    className={clsx(
                      'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                      isCancelledCurrent ? 'bg-red-500' : 'bg-brand-500',
                    )}
                  />
                )}
                <span
                  className={clsx(
                    'relative block h-2.5 w-2.5 rounded-full transition-colors duration-500 ease-out',
                    isCancelledCurrent ? 'bg-red-600 ring-2 ring-red-200' : DOT_CLASSES[state],
                  )}
                />
              </span>
              <span
                className={clsx(
                  'mt-1 text-[10px] leading-none transition-colors duration-500 ease-out',
                  isCancelledCurrent ? 'font-medium text-red-700' : LABEL_CLASSES[state],
                )}
              >
                {node.label}
              </span>
            </div>
            {i < NODES.length - 1 && (
              <span
                className={clsx(
                  'h-px w-4 transition-colors duration-500 ease-out',
                  state === 'done' ? 'bg-emerald-400' : 'bg-slate-200',
                )}
                style={{ marginBottom: 14 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
