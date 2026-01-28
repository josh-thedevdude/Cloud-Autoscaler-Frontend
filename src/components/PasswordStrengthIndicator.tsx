import { cn } from "@/lib/utils"
import { useMemo } from "react"

function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = useMemo(() => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }, [password])

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Excellent"][strength]
  const strengthColor = [
    "bg-muted",
    "bg-critical",
    "bg-warning",
    "bg-warning",
    "bg-success",
    "bg-success",
  ][strength]

  if (!password) return null

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= strength ? strengthColor : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength: <span className={cn(
          strength <= 1 ? "text-critical" :
            strength <= 3 ? "text-warning" :
              "text-success"
        )}>{strengthLabel}</span>
      </p>
    </div>
  )
}

export default PasswordStrengthIndicator