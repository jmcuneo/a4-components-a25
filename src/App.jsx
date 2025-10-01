import React, {useState} from 'react'
import NewButton from "./NewButton.jsx";
import 'beercss'
import './App.css'
import AccountHeader from "./AccountHeader.jsx";
import PasswordTable from "./PasswordTable.jsx";


function App() {


    const [activeEditRow, setActiveEditRow] = useState(-1)
    const [showNewPasswordRow, setShowNewPasswordRow] = useState(false)


    return (
        <>
            <div className={"mainContainer"}>
                <AccountHeader></AccountHeader>
                <div id="header">
                    <h2>
                        My Passwords
                    </h2>
                </div>
                <PasswordTable showNewPasswordRow={showNewPasswordRow} activeEditRow={activeEditRow}
                               setShowNewPasswordRow={setShowNewPasswordRow}
                               setActiveEditRow={setActiveEditRow}></PasswordTable>
            </div>
            {
                (!showNewPasswordRow && activeEditRow === -1) && (<NewButton onClick={() => {
                    setShowNewPasswordRow(true)
                }}></NewButton>)
            }

        </>
    )
}

export default App
