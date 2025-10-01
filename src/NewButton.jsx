function NewButton(props) {
    return (
        <>
            <div className="fixed bottom right bottom-margin right-margin dark">
                <button className="no-margin circle extra" id="newPassword" onClick={props.onClick}>
                    <i className="round">add</i>
                </button>
            </div>
        </>
    )
}

export default NewButton