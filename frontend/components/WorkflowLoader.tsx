import { Loader2 } from 'lucide-react';

interface WorkflowLoaderProps {
    currentStep?: string;
    totalSteps?: number;
    currentStepIndex?: number;
}

export function WorkflowLoader({ currentStep, totalSteps, currentStepIndex }: WorkflowLoaderProps) {
    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-gradient-to-r from-zinc-900 to-black border border-yellow-500/40 rounded-xl shadow-2xl shadow-yellow-500/20 px-6 py-4 flex items-center gap-4 min-w-[320px] backdrop-blur-md">
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md"></div>
                    <Loader2 className="h-6 w-6 animate-spin text-yellow-400 relative z-10" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold font-montserrat bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                        Running Workflow...
                    </p>
                    {currentStep && (
                        <p className="text-xs text-gray-500 mt-0.5">
                            Step {currentStepIndex && totalSteps ? `${currentStepIndex}/${totalSteps}` : ''}: {currentStep}
                        </p>
                    )}
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}
