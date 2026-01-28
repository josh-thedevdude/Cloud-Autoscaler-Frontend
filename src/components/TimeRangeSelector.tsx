import { TIME_RANGE_OPTIONS } from "@/lib/chartHelpers";
import type { TimeRange } from "@/types/common";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}

const TimeRangeSelector = ({
  value,
  onChange,
  className = "",
}: TimeRangeSelectorProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label
        htmlFor="time-range"
        className="text-sm font-medium text-muted-foreground"
      >
        Time Range:
      </label>
      <select
        id="time-range"
        value={value}
        onChange={(e) => onChange(e.target.value as TimeRange)}
        className="block rounded-lg border border-border bg-card text-foreground px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
      >
        {TIME_RANGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeRangeSelector;