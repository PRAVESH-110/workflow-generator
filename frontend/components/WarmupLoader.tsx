import { Loader2, Zap } from 'lucide-react';

export function WarmupLoader() {
    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/30 rounded-xl shadow-2xl shadow-yellow-500/20 px-8 py-6 max-w-md mx-4 text-center space-y-4">
                <div className="relative inline-flex">
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-full">
                        <Zap className="h-8 w-8 text-black" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-bold font-outfit bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                        Warming Up Servers...
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Please wait while our servers start up. This may take 30-60 seconds on the first request.
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-yellow-400" />
                    <span className="text-sm text-gray-500">Establishing connection...</span>
                </div>

                <div className="flex justify-center gap-1.5 pt-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" style={{ animationDelay: '400ms' }}></div>
                </div>
            </div>
        </div>
    );
}
