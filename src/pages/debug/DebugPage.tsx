import StyledCanvas from '@/components/StyledCanvas'
import SampleDialog from '@/components/dialogs/SampleDialog'
import useDebugViewModel from '@/pages/debug/DebugViewModel'

const DebugPage = () => {
    const vm = useDebugViewModel()

    return (
        <div className="flex flex-col gap-8 p-8">

            <div className="border-4 border-slate-200 p-4">
                <h1>Sample Dialog</h1>
                <SampleDialog
                    isDialogOpen={vm.isDialogOpen}
                    setIsDialogOpen={vm.setIsDialogOpen} />
            </div>

            <div className="border-4 border-red-200 p-4">
                <h1>Debug Data</h1>
                <div>
                    <StyledCanvas
                        className=""
                        width={600}
                        height={300}
                        ref={vm.canvasRef} />
                </div>
                <div><pre><code className="bg-white text-black">
                    {JSON.stringify(vm.data, null, 2)}
                </code></pre></div>
            </div>

        </div>
    )
}

export default DebugPage
