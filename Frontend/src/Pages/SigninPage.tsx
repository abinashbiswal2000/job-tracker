import { Link , useNavigate , Navigate} from "react-router"
import React, { useState } from "react";

export default function SigninPage() {
    
    const [variablesObject, updateVariable] = useState({
        password: "",
        email: ""
    });
    
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        updateVariable((prev) => {
            return { ...prev, [e.target.name]: e.target.value }
        });
    }
    
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    if (token) {
        return <Navigate to="/"/>
    }

    return (
        <form
            action=""
            className="p-2 border-2 border-gray-300 rounded-lg flex flex-col max-w-sm mx-auto mt-10 gap-2"
            onSubmit={async (e: React.SubmitEvent<HTMLFormElement>) => {
                e.preventDefault();
                try {

                    const response = await fetch(
                        "http://localhost:4913/signin",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(variablesObject)
                        }
                    ) 

                    if (response.ok === false) {
                        alert("Signin Failed");
                        throw new Error("Signin Failed");
                    }

                    const data = await response.json();
                    // console.log(data);
                    localStorage.setItem("token", data.jwt);

                    navigate("/");
                } catch (error) {
                    console.error(error)
                }
            }}
        >

            <h1 className="text-2xl text-center my-2">Sign In Form</h1>

            <hr />

            <input
                className="border border-gray-300 p-2 rounded-lg focus:bg-blue-50 focus:outline-white"
                value={variablesObject.email}
                onChange={handleChange}
                type="email"
                name="email"
                id=""
                placeholder="Email"
            />
            <input
                className="border border-gray-300 p-2 rounded-lg focus:bg-blue-50 focus:outline-white"
                value={variablesObject.password}
                onChange={handleChange}
                type="password"
                name="password"
                id=""
                placeholder="Password"
            />

            <button
                className="cursor-pointer transition duration-300 hover:bg-blue-600 bg-blue-500 text-white border border-blue-500 p-2 rounded-lg focus:bg-blue-50 focus:outline-white"
                type="submit"
            >
                Submit
            </button>

            <hr />

            <Link to="/signup" className="text-center text-blue-500 hover:underline">Create New Account</Link>

        </form>
    )
}