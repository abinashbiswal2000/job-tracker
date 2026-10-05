import { useNavigate } from "react-router";
import { useState } from "react";
import { useParams } from "react-router";
import { useEffect } from "react";

export default function EditJobPage() {
    
    const navigate = useNavigate();
    const [variablesObject, updateVariables] = useState({
        companyName: "",
        position: "",
        appliedOn: new Date().toISOString().slice(0, 10)
    });
    
    const [selectValue, handleSelect] = useState("APPLIED");

    const { id } = useParams();
    useEffect(
        () => {
            try {
                async function loadData () {
                    const response = await fetch(
                        `http://localhost:4913/jobs/${id}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    if (response.ok === false) {
                        alert("Job Fetch Failed");
                        throw new Error("Job fetch failed");
                    }

                    const data = await response.json();
                    // console.log(data.job);
                    updateVariables(
                        {
                            companyName: data.job.companyName,
                            position: data.job.position,
                            appliedOn: data.job.appliedOn.slice(0, 10)
                        }
                    );
                    handleSelect(data.job.status);
                }
                loadData();
            } catch (e) {
                console.error(e);
            }
        },
        []
    );

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        updateVariables((prev) => {
            if (e.target.name === "appliedOn") {
                return { ...prev, [e.target.name]: new Date(e.target.value).toISOString().slice(0, 10) }
            }
            return { ...prev, [e.target.name]: e.target.value }
        });
    }

    return (
        <form
            className="p-2 border-2 border-gray-300 rounded-lg flex flex-col max-w-sm mx-auto mt-10 gap-2"
            onSubmit={async (e: React.SubmitEvent<HTMLFormElement>) => {
                e.preventDefault();
                try {
                    const response = await fetch(
                        `http://localhost:4913/jobs/${id}`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem("token")}`
                            },
                            body: JSON.stringify({ ...variablesObject, status: selectValue, "appliedOn": new Date(variablesObject.appliedOn) })
                        }
                    )
                    if (response.ok === false) {
                        alert("Job Edit Failed");
                        throw new Error("Job Edit Failed");
                    }
                    await response.json();
                    navigate('/')
                } catch (e) {
                    console.error(e);
                }
            }}
        >
            <h1 className="text-2xl">Edit Job</h1>

            <hr />

            <span>Company name</span>
            <input onChange={handleChange} value={variablesObject.companyName} name="companyName" className="focus:outline-blue-300 p-2 border border-gray-300" type="text" placeholder="Company Name" />

            <span className="mt-1">Position</span>
            <input onChange={handleChange} value={variablesObject.position} name="position" className="focus:outline-blue-300 p-2 border border-gray-300" type="text" placeholder="Position" />

            <span className="mt-1">Status</span>
            <select value={selectValue} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { handleSelect(e.target.value) }} name="status" className="focus:outline-blue-300 p-2 border border-gray-300">
                <option value="APPLIED">APPLIED</option>
                <option value="INTERVIEW">INTERVIEW</option>
                <option value="OFFER">OFFER</option>
                <option value="REJECTED">REJECTED</option>
                <option value="WITHDRAWN">WITHDRAWN</option>
            </select>

            <span className="mt-1">Date</span>
            <input onChange={handleChange} value={variablesObject.appliedOn} name="appliedOn" className="focus:outline-blue-300 p-2 border border-gray-300" type="date" id="" />

            <button
                className="bg-blue-500 cursor-pointer hover:bg-blue-600 transtion duration-300 text-white p-2 rounded-lg"
                type="submit"
            >
                Submit
            </button>
        </form>
    )
}