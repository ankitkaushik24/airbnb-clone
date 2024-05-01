"use client";

import { updateHomeLocation } from "@/actions";
import ActionBar from "@/components/shared/ActionBar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import worldCountries from "@/lib/getCountries";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

export default function CreateHomeAddress({
  params,
}: {
  params: { homeId: string };
}) {
  const { allCountries } = worldCountries;
  const [locationValue, setLocationValue] = useState("");

  const DynamicMap = useMemo(
    () =>
      dynamic(() => import("@/components/shared/Map"), {
        ssr: false,
        loading: () => <Skeleton className="h-[50vh] w-full" />,
      }),
    []
  );

  return (
    <>
      <div className="w-3/5 mx-auto">
        <h2 className="text-3xl font-semibold tracking-tight transition-colors mb-10">
          Where is your Home located?
        </h2>
      </div>

      <form action={updateHomeLocation}>
        <input type="hidden" name="homeId" value={params.homeId} />
        <input type="hidden" name="countryValue" value={locationValue} />
        <div className="w-3/5 mx-auto mb-36">
          <div className="mb-5">
            <Select required onValueChange={(value) => setLocationValue(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Countries</SelectLabel>
                  {allCountries.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.flag} {item.label} / {item.region}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DynamicMap locationValue={locationValue} />
        </div>

        <ActionBar />
      </form>
    </>
  );
}
