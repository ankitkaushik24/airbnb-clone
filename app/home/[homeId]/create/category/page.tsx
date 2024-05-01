import { updateHomeCategory } from "@/actions";
import ActionBar from "@/components/shared/ActionBar";
import { SelectCategory } from "@/components/shared/SelectCategory";
import SubmitFormBtn from "@/components/shared/SubmitFormBtn";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";

const CreateHomeCategory: FC<{ params: { homeId: string } }> = ({ params }) => {
  return (
    <>
      <div className="w-3/5 mx-auto">
        <h2 className="text-3xl font-semibold tracking-tight transition-colors">
          Which of these best describe your Home?
        </h2>
      </div>

      <form action={updateHomeCategory}>
        <input type="hidden" name="homeId" value={params.homeId} />
        <SelectCategory />

        <ActionBar />
      </form>
    </>
  );
};

export default CreateHomeCategory;
