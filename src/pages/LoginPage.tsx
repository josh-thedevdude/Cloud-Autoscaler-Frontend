import { login as authLogin } from "@/api/auth";
import FormField from "@/components/FormField";
import PasswordField from "@/components/PasswordField";
import SubmitButton from "@/components/SubmitButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // make axios request to the backend
    const result = await authLogin(formData.email, formData.password)
    if (!result.success) {
      setErrors((prev) => ({ ...prev, ["login"]: result.error }))
      setIsLoading(false)
      return
    }

    login({ token: result.data.token, expires_in: result.data.expires_in, username: result.data.username })
    setIsLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="w-full max-w-md border-border bg-card/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-semibold text-foreground">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to access your autoscaler dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errors.login && (
          <div className="flex items-center gap-2 rounded-md bg-critical/10 px-3 py-2 mb-4 text-sm text-critical">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errors.login}</span>
          </div>
        )}
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <FormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(v) => handleChange("email", v)}
            disabled={isLoading}
            autoComplete="email"
            placeholder="you@company.com"
            inputRef={emailRef}
            error={errors.email}
          />

          {/* Password */}
          <PasswordField
            id="password"
            label="Password"
            value={formData.password}
            onChange={(v) => handleChange("password", v)}
            disabled={isLoading}
            placeholder="Confirm Your Password"
            error={errors.password}
          >
          </PasswordField>

          {/* Submit */}
          <SubmitButton
            isLoading={isLoading}
            label="Sign in"
          />

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-chart-1 hover:text-chart-1/80 font-medium"
            >
              Create account
            </Link>
          </p>
        </form>

      </CardContent>
    </Card>
  )
}