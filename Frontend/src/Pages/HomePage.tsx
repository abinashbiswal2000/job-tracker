import { useNavigate } from "react-router"
import { Navigate } from "react-router";
import { useEffect, useState } from "react";

export default function HomePage() {

    function formatDate(isoString: string) {
        return new Date(isoString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    type Job = {
        id: String,
        companyName: String,
        position: String
        status: String,
        appliedOn: string
    }

    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(
        () => {
            async function loadData() {
                const response = await fetch(
                    "http://localhost:4913/jobs",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                const data = await response.json();
                setJobs(data.jobs);
            }
            loadData()
        },
        []
    );

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    if (token == undefined) {
        return <Navigate to="/signin" />
    }

    return (
        <div className="mt-10 flex flex-col max-w-5xl mx-auto justify-center gap-1">
            <div className="p-5 text-center text-5xl">Job Application Tracker</div>
            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-max text-sm text-left border border-gray-300 border-2">
                    <thead>
                        <tr>
                            <th className="p-3 border-1 border-gray-300">SL No</th>
                            <th className="p-3 border-1 border-gray-300">Company</th>
                            <th className="p-3 border-1 border-gray-300">Position</th>
                            <th className="p-3 border-1 border-gray-300">Status</th>
                            <th className="p-3 border-1 border-gray-300">Date Applied</th>
                            <th className="p-3 border-1 border-gray-300">Edit</th>
                            <th className="p-3 border-1 border-gray-300">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => {
                            return (
                                <tr key={Number(job.id)} className="">
                                    <td className="p-3 border-1 border-gray-300">{jobs.indexOf(job) + 1}</td>
                                    <td className="p-3 border-1 border-gray-300">{job.companyName}</td>
                                    <td className="p-3 border-1 border-gray-300">{job.position}</td>
                                    <td className="p-3 border-1 border-gray-300">{job.status}</td>
                                    <td className="p-3 border-1 border-gray-300">{formatDate(job.appliedOn)}</td>
                                    <td className="p-0 border-1 border-gray-300 bg-yellow-300 cursor-pointer hover:bg-black hover:text-white transition duration-500">
                                        <button className="cursor-pointer p-3 w-full h-full" onClick={() => { navigate(`/jobs/${job.id}/edit`) }}>
                                            Edit
                                        </button>
                                    </td>
                                    <td
                                        className="p-0 border-1 border-gray-300 bg-red-300 cursor-pointer hover:bg-black hover:text-white transition duration-500"
                                    >
                                        <button
                                            className="cursor-pointer p-3 w-full h-full"
                                            onClick={async () => {
                                                try {
                                                    const response = await fetch(
                                                        `http://localhost:4913/jobs/${job.id}`,
                                                        {
                                                            method: "DELETE",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                "Authorization": `Bearer ${localStorage.getItem("token")}`
                                                            }
                                                        }
                                                    )
                                                    if (response.ok === false) {
                                                        alert("Delete Failed");
                                                        throw new Error("Delete Failed");
                                                    }
                                                    await response.json();
                                                    setJobs(
                                                        (prev) => {
                                                            return prev.filter((j) => { return j.id !== job.id })
                                                        }
                                                    );
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-row gap-1">
                <button
                    className="flex-1 transition duration-300 hover:bg-black bg-blue-500  text-white p-4 rounded-lg cursor-pointer"
                    onClick={() => {
                        navigate('/jobs/new');
                    }}
                >
                    Add Job
                </button>
                <button
                    className="flex-1 transition duration-300 hover:bg-black bg-blue-500  text-white p-4 rounded-lg cursor-pointer"
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/signin")
                    }}
                >
                    logout
                </button>
                <button
                    className="flex-1 transition duration-300 hover:bg-black bg-red-500  text-white p-4 rounded-lg cursor-pointer"
                    onClick={async () => {
                        try {
                            const response = await fetch(
                                "http://localhost:4913/users/me",
                                {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                                    }
                                }
                            );
                            if (response.ok === false) {
                                alert("Delete Failed")
                                throw new Error("Delete Failed");
                            }
                            await response.json();
                            localStorage.removeItem("token");
                            navigate('/signin');
                        } catch (e) {
                            // console.log(e);
                        }
                    }}
                >
                    Delete Account
                </button>
            </div>
        </div>
    )
}