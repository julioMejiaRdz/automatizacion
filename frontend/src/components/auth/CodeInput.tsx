import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

type CodeInputProps = {
  value: string
  onChange: (value: string) => void
  onComplete: (value: string) => void
  disabled?: boolean
}

/** Campo para el código de 6 dígitos que se envía por email. */
export default function CodeInput({ value, onChange, onComplete, disabled }: CodeInputProps) {
  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      value={value}
      onChange={onChange}
      onComplete={onComplete}
      disabled={disabled}
      autoFocus
      containerClassName="justify-center"
    >
      <InputOTPGroup className="gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <InputOTPSlot
            key={i}
            index={i}
            className="h-12 w-11 rounded-lg border bg-muted/60 font-mono text-lg text-foreground first:rounded-lg last:rounded-lg data-[active=true]:border-brand data-[active=true]:ring-brand/20"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
