import Link from "next/link";
import { Button } from "../ui/button";
import SubmitFormBtn from "./SubmitFormBtn";

const ActionBar = () => {
  return (
    <div className="fixed w-full bottom-0 z-10 bg-white border-t h-24">
      <div className="flex items-center justify-between mx-auto px-5 lg:px-10 h-full">
        <Button type="button" variant="secondary" size="lg" asChild>
          <Link href="/">Cancel</Link>
        </Button>
        <SubmitFormBtn />
      </div>
    </div>
  );
};

export default ActionBar;
