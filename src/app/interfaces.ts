export interface TimerPart {
  header?: string;
  value: string;
  isEditable?: boolean;
  type: TimerPartType;
  hide?: boolean;
}

export enum TimerPartType {
  h,
  m,
  s,
  ms,
}

export const headerTypeMap = new Map<TimerPartType, string>([
  [TimerPartType.h, 'Hours'],
  [TimerPartType.m, 'Minutes'],
  [TimerPartType.s, 'Seconds'],
  [TimerPartType.ms, 'Milliseconds'],
]);

export const DEFAULT_TIMER_PARTS: TimerPart[] = [
  {
    type: TimerPartType.h,
    value: '00',
    isEditable: false,
    header: headerTypeMap.get(TimerPartType.h),
    hide: false,
  },
  {
    type: TimerPartType.m,
    value: '00',
    isEditable: false,
    header: headerTypeMap.get(TimerPartType.m),
    hide: false,
  },
  {
    type: TimerPartType.s,
    value: '00',
    isEditable: false,
    header: headerTypeMap.get(TimerPartType.s),
    hide: false,
  },
  {
    type: TimerPartType.ms,
    value: '00',
    isEditable: false,
    header: headerTypeMap.get(TimerPartType.ms),
    hide: false,
  }
];

export const INTERVAL = 25; // ms
export const TITLE = 'Timer';
