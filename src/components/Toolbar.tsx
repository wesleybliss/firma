import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, SearchCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from '@/lib/constants'

interface ToolbarProps {
    scale: number
    currentPage: number
    numPages: number
    onZoomChange: (value: number[]) => void
    onZoomAdjust: (step: number) => void
    onZoomReset: () => void
    onPageChange: (offset: number) => void
}

export function Toolbar({
    scale,
    currentPage,
    numPages,
    onZoomChange,
    onZoomAdjust,
    onZoomReset,
    onPageChange,
}: ToolbarProps) {
    return (
        <div className="flex flex-col justify-between gap-4 p-2 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
                <Button variant="outline" size="icon-sm" onClick={() => onZoomAdjust(-0.1)} disabled={scale <= ZOOM_MIN}>
                    <ZoomOut className="size-4" />
                </Button>
                <Slider
                    className="w-40"
                    min={ZOOM_MIN}
                    max={ZOOM_MAX}
                    step={ZOOM_STEP}
                    value={[scale]}
                    onValueChange={onZoomChange}/>
                <Button variant="outline" size="icon-sm" onClick={() => onZoomAdjust(0.1)} disabled={scale >= 2}>
                    <ZoomIn className="size-4" />
                </Button>

                <Button variant="outline" size="icon-sm" onClick={() => onZoomAdjust(ZOOM_MAX)} disabled={scale <= 0.5}>
                    <SearchCode className="size-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={onZoomReset} disabled={scale === 1}>
                    Reset
                </Button>
                <span className="text-xs font-medium text-slate-500">{Math.round(scale * 100)}%</span>
            </div>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <Button variant="outline" size="icon-sm" onClick={() => onPageChange(-1)} disabled={currentPage <= 1}>
                    <ChevronLeft className="size-4" />
                </Button>
                <span className="text-sm font-medium text-slate-900">
                    Page {currentPage} of {numPages}
                </span>
                <Button variant="outline" size="icon-sm" onClick={() => onPageChange(1)} disabled={currentPage >= numPages}>
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    )
}
