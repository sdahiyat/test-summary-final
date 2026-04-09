'use client';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  labels: string[];
}

export function StepIndicator({ totalSteps, currentStep, labels }: StepIndicatorProps) {
  return (
    <div className="w-full px-2">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-200
                  ${
                    index < currentStep
                      ? 'bg-emerald-600 text-white'
                      : index === currentStep
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {index < currentStep ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {/* Label — hidden on mobile, shown on sm+ */}
              <span
                className={`
                  hidden sm:block mt-1 text-xs font-medium whitespace-nowrap
                  ${index === currentStep ? 'text-emerald-700' : index < currentStep ? 'text-emerald-600' : 'text-gray-400'}
                `}
              >
                {labels[index]}
              </span>
            </div>

            {/* Connector line */}
            {index < totalSteps - 1 && (
              <div
                className={`
                  h-0.5 w-10 sm:w-16 mx-1 transition-all duration-200
                  ${index < currentStep ? 'bg-emerald-600' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
