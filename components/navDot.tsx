import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface NavDotProps {
    root: string;
    title: string;
    accentColor: string;
    isActive: boolean;
    scrollToSection: (id: string) => void;
    showTooltip?: boolean;
    index: number;
}

// HUD tick: index number + a bar that stretches and glows in the accent color when active.
export default function NavDot({ root, title, accentColor, isActive, scrollToSection, showTooltip, index }: NavDotProps) {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip open={showTooltip && (isActive || undefined)} onOpenChange={(open) => !isActive && open}>
                <TooltipTrigger
                    className="group flex items-center gap-2 p-1.5 font-[family-name:var(--font-hud)]"
                    onClick={() => scrollToSection(root)}
                    data-sound="ui"
                >
                    <span className={`w-5 text-left text-[11px] font-semibold tabular-nums transition-colors ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-300'}`}>
                        {String(index).padStart(2, '0')}
                    </span>
                    <span
                        className={`h-[2px] transition-all duration-300 ${isActive ? 'w-8' : 'w-3 group-hover:w-5'}`}
                        style={{
                            backgroundColor: isActive ? accentColor : '#52525b',
                            boxShadow: isActive ? `0 0 8px ${accentColor}` : undefined,
                        }}
                    />
                </TooltipTrigger>
                <TooltipContent side="right">{title}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
