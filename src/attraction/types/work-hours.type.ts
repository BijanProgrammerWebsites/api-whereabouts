export type TimeType = {
  start: string;
  end: string;
};

export type WorkHoursType = {
  day: string;
  time: TimeType | null;
};
