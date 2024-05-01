"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "../ui/button";
import { Loader2 } from "lucide-react";
import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const PendingBtn: FC<
  ButtonProps & { children?: ReactNode; loaderClass?: string }
> = ({ children, loaderClass = "", ...props }) => {
  return (
    <Button disabled size="lg" {...props}>
      <Loader2 className={cn("mr-2 h-4 w-4 animate-spin", loaderClass)} />
      {children}
    </Button>
  );
};

export const SubmitBtn: FC<ButtonProps & { children: ReactNode }> = ({
  children,
  ...props
}) => {
  return (
    <Button type="submit" size="lg" {...props}>
      {children}
    </Button>
  );
};

const SubmitFormBtn = ({
  pendingBtn = <PendingBtn>Please wait...</PendingBtn>,
  submitBtn = <SubmitBtn>Submit</SubmitBtn>,
}) => {
  const { pending } = useFormStatus();
  if (pending) {
    return pendingBtn;
  }

  return submitBtn;
};

export default SubmitFormBtn;
