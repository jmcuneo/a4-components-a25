import { useState } from 'react'
import './App.css'
import 'beercss'
import React from "react";
import NewButton from "./NewButton.jsx";

const response =await fetch("/passwords", {
    method: "GET"
})

const passwords = JSON.parse(await response.text())

function App() {

  return (
    <>
        {passwords.map((entry) =>
            (<tr>
                <td>
                    {entry.website}
                </td>
                <td>
                    {entry.username}
                </td>
                <td>
                    {entry.password}
                </td>
                <td>
                    {entry.strength}
                </td>
            </tr>)
        )}
        <NewButton></NewButton>
    </>
  )
}

export default App
