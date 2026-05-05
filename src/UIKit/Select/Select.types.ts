import type { SelectHTMLAttributes } from "react";
import type { SelectOption } from "@/modules/MovieSearch/types/common.types";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}
