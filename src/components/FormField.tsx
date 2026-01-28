import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  onChange: (value: string) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

const FormField = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  error,
  disabled,
  autoComplete,
  onChange,
  inputRef
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <Input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "bg-secondary border-border text-foreground placeholder:text-muted-foreground",
          error && "border-critical"
        )}
      />

      {error && (
        <p className="text-xs text-critical flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
