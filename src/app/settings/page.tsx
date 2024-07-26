"use client"

import { handleChangeLogin } from "../lib/actions";
import { useActionState } from "react";

export default function Settings() {
 
  const [state, changeLoginAction] = useActionState(handleChangeLogin, {message:""})

    return (
    <div className="p-6">
        <div className="is-size-1">Setting</div>
        <div className="columns">
            <div className="column is-two-fifths p-4">
                <form className="box" action={changeLoginAction}>
                    {state?.message && <p style={{color: 'orange'}}>{state?.message}</p>}
                    <div className="field my-4">
                        <input 
                        type="password" 
                        className="input is-dark"
                        placeholder="please enter your current password"
                        name="password"
                    />
                    </div>
                    <div className="field my-4">
                        <input 
                        type="text" 
                        className="input is-dark"
                        placeholder="please enter your new login"
                        name="newlogin"
                    />
                    </div>
                    <button className="button is-danger" type="submit" >Save</button>
                </form>
            </div>
        </div>
    </div>
    )
}