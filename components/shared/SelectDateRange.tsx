"use client";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import { DateRange } from "react-date-range";
import { useState } from "react";
import { eachDayOfInterval } from "date-fns";

const SelectDateRange = (props: {
  occupiedIntervals: { startDate: Date; endDate: Date }[] | undefined;
}) => {
  const [ranges, setRanges] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const disabledDates = (props.occupiedIntervals || [])
    .map(({ startDate, endDate }) => {
      return eachDayOfInterval({
        start: startDate,
        end: endDate,
      });
    })
    .flat();

  return (
    <>
      <input
        type="hidden"
        name="startDate"
        value={ranges[0].startDate.toISOString()}
      />
      <input
        type="hidden"
        name="endDate"
        value={ranges[0].endDate.toISOString()}
      />
      <DateRange
        date={new Date()}
        showDateDisplay={false}
        rangeColors={["hsl(var(--primary))"]}
        ranges={ranges}
        onChange={(item) => setRanges([item.selection] as any)}
        minDate={new Date()}
        direction="vertical"
        disabledDates={disabledDates}
      />
    </>
  );
};

export default SelectDateRange;
