import { Check, Circle } from 'lucide-react'
import { cn } from '../../utils/cn'

interface Step {
  label: string
  description: string
}

interface BookingStepperProps {
  steps: Step[]
  currentStep: number
}

export function BookingStepper({ steps, currentStep }: BookingStepperProps) {
  return (
    <nav aria-label="Booking progress" className="mb-8">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isComplete = index < currentStep
          const isCurrent = index === currentStep

          return (
            <li
              key={step.label}
              className={cn('flex items-center', index < steps.length - 1 && 'flex-1')}
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                    isComplete && 'border-primary-600 bg-primary-600 text-white',
                    isCurrent && 'border-primary-600 bg-white text-primary-600',
                    !isComplete && !isCurrent && 'border-slate-300 bg-white text-slate-400'
                  )}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Circle className={cn('h-5 w-5', isCurrent && 'fill-primary-600 text-primary-600')} />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      (isComplete || isCurrent) ? 'text-slate-900' : 'text-slate-400'
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="hidden text-xs text-slate-500 sm:block">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-4 h-0.5 flex-1',
                    isComplete ? 'bg-primary-600' : 'bg-slate-200'
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
