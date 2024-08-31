import { FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import { SignInFormSchema } from "@/lib/utils";

interface CustomInputProps {
  control: Control<z.infer<typeof SignInFormSchema>>;
  name: FieldPath<z.infer<typeof SignInFormSchema>>;
  placeholder: string;
  label: string;
}

const CustomInput = ({ control, name, placeholder, label }: CustomInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className={"input-class"}
                {...field}
                type={name === "password" ? "password" : "text"}
              />
            </FormControl>
            <FormMessage className={"form-message mt-2"} />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;