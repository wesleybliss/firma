import HomeReady from './HomeReady'
import HomeLanding from './HomeLanding'
import { usePdfStore } from '@/store/pdf'

const HomePage = ({ onOpenFileDialog }: { onOpenFileDialog: () => void }) => {
    const pdfFile = usePdfStore(state => state.pdfFile)

    return pdfFile ? (
        <HomeReady />
    ) : (
        <HomeLanding onOpenFileDialog={onOpenFileDialog} />
    )
}

export default HomePage
