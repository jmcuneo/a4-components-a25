import './App.css'
import 'beercss'
function NewButton() {
    return (
        <>
            <div className="fixed bottom right bottom-margin right-margin dark">
                <button className="no-margin circle extra" id="newPassword">
                    <i className="round">add</i>
                </button>
            </div>
        </>
    )
}

export default NewButton