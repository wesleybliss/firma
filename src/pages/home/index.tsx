import HomeReady from "./HomeReady"
import HomeLanding from "./HomeLanding"

const HomePage = ({
    state,
    actions
}: {
    state: any
    actions: any
}) => {

    return state.pdfFile ? (
        <HomeReady state={state} actions={actions} />
    ) : (
        <HomeLanding actions={actions} />
    )

}

export default HomePage
