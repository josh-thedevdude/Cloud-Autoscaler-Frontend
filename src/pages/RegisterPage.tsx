import { register } from "@/api/auth"
import FormField from "@/components/FormField"
import PasswordField from "@/components/PasswordField"
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator"
import SubmitButton from "@/components/SubmitButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const fullNameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    fullNameRef.current?.focus();
  }, []);

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // make axios request to the backend
    const result = await register(formData.email, formData.password)
    if (!result.success) {
      setErrors((prev) => ({ ...prev, ["register"]: result.error }))
      setIsLoading(false)
      return
    }

    setIsLoading(false)

    // Redirect to login after success
    navigate("/login")
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
          Create an account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Get started with Cloud Autoscaler
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errors.login && (
          <div className="flex items-center gap-2 rounded-md bg-critical/10 px-3 py-2 mb-4 text-sm text-critical">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errors.register}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            error={errors.email}
            onChange={(v) => handleChange("email", v)}
            disabled={isLoading}
            autoComplete="email"
          />

          <PasswordField
            id="password"
            label="Password"
            placeholder="Create a strong password"
            value={formData.password}
            error={errors.password}
            onChange={(v) => handleChange("password", v)}
            disabled={isLoading}
          >
            <PasswordStrengthIndicator password={formData.password} />
          </PasswordField>

          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            error={errors.confirmPassword}
            onChange={(v) => handleChange("confirmPassword", v)}
            disabled={isLoading}
          />

          <SubmitButton
            isLoading={isLoading}
            label="Create account"
          />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-chart-1 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}