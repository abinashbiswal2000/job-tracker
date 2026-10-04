import { Link , Navigate , useNavigate } from "react-router"
import { useState } from "react";

export default function SignupPage() {
    
    const [variablesObject, updateVariable] = useState({
        name: "",
        email: "",
        password: ""
    });
    
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        updateVariable((prev) => {
            return { ...prev, [e.target.name]: e.target.value }
        });
    }

    const navigate = useNavigate();

    if (localStorage.getItem("token")) {
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
                        "http://localhost:4913/signup",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(variablesObject)
                        }
                    )
                    if (response.ok === false) {
                        alert("Signup Failed")
                        throw new Error("Signup Failed");
                    }

                    const data = await response.json();
                    console.log(data);

                    alert("Account Created Please sign in.");

                    navigate("/signin");


                } catch (error) {
                    console.error(error)
                }
            }}
        >

            <h1 className="text-2xl text-center my-2">Sign Up Form</h1>

            <hr />

            <input
                className="border border-gray-300 p-2 rounded-lg focus:bg-blue-50 focus:outline-white"
                type="text"
                name="name"
                id=""
                placeholder="Full Name"
                value={variablesObject.name}
                onChange={handleChange}
            />
            <input
                className="border border-gray-300 p-2 rounded-lg focus:bg-blue-50 focus:outline-white"
                type="email"
                name="email"
                id=""
                placeholder="Email"
                value={variablesObject.email}
                onChange={handleChange}
            />
            <input
                className="border border-gray-300 p-2 rounded-lg focus:bg-blue-50 focus:outline-white"
                type="password"
                name="password"
                id=""
                placeholder="Password"
                value={variablesObject.password}
                onChange={handleChange}
            />

            <button
                className="cursor-pointer transition duration-300 hover:bg-blue-600 bg-blue-500 text-white border border-blue-500 p-2 rounded-lg focus:bg-blue-50 focus:outline-white"
                type="submit"
            >
                Submit
            </button>

            <hr />

            <Link to="/signin" className="text-center text-blue-500 hover:underline">Sign In</Link>

        </form>
    )
}