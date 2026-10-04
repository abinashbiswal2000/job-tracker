import { useNavigate } from "react-router";
import { useState } from "react"

export default function AddJobPage () {
    
    const navigate = useNavigate();
    const [variablesObject, updateVariables] = useState({
        companyName: "",
        position: "",
        date: new Date().toISOString().slice(0, 10)
    });

    const [selectValue, handleSelect] = useState("APPLIED");

    function handleChange (e : React.ChangeEvent<HTMLInputElement>) {
        updateVariables((prev) => {
            return {...prev, [e.target.name]: e.target.value}
        });
    }

    return (
        <form
            className="p-2 border-2 border-gray-300 rounded-lg flex flex-col max-w-sm mx-auto mt-10 gap-2"
            onSubmit={async (e : React.SubmitEvent<HTMLFormElement>) => {
                e.preventDefault();
                try {
                    const response = await fetch(
                        "http://localhost:4913/jobs",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem("token")}`
                            },
                            body: JSON.stringify({...variablesObject, status: selectValue})
                        }
                    )
                    if (response.ok === false) {
                        alert("Job Creation Failed");
                        throw new Error("Job Creation Failed");
                    }
                    const data = await response.json();
                    console.log(data);
                    navigate('/')                    
                } catch (e) {
                    console.error(e);
                } 
            }}
        >
            <h1 className="text-2xl">Add a New Job</h1>
            
            <hr />
            
            <span>Company name</span>
            <input onChange={handleChange} value={variablesObject.companyName} name="companyName" className="focus:outline-blue-300 p-2 border border-gray-300" type="text" placeholder="Company Name"/>
            
            <span className="mt-1">Position</span>
            <input onChange={handleChange} value={variablesObject.position} name="position" className="focus:outline-blue-300 p-2 border border-gray-300" type="text" placeholder="Position"/>
            
            <span className="mt-1">Status</span>
            <select value={selectValue} onChange={(e : React.ChangeEvent<HTMLSelectElement>) => {handleSelect(e.target.value)}} name="status" className="focus:outline-blue-300 p-2 border border-gray-300">
                <option value="APPLIED">APPLIED</option>
                <option value="INTERVIEW">INTERVIEW</option>
                <option value="OFFER">OFFER</option>
                <option value="REJECTED">REJECTED</option>
                <option value="WITHDRAWN">WITHDRAWN</option>
            </select>
            
            <span className="mt-1">Date</span>
            <input onChange={handleChange} value={variablesObject.date} name="date" className="focus:outline-blue-300 p-2 border border-gray-300" type="date" id="" />
            
            <button 
                className="bg-blue-500 cursor-pointer hover:bg-blue-600 transtion duration-300 text-white p-2 rounded-lg"
                type="submit"
            >
                Submit
            </button>
        </form>
    )
}