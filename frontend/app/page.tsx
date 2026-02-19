"use client";

import { useState, useEffect, FormEvent } from "react";
import { Plus, Search, List, Home as HomeIcon, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface Room {
  roomNo: string;
  capacity: number;
  hasAC: boolean;
  hasAttachedWashroom: boolean;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"view" | "add" | "allocate">("view");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [allocationResult, setAllocationResult] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [newRoom, setNewRoom] = useState({ roomNo: "", capacity: 1, hasAC: false, hasAttachedWashroom: false });
  const [searchParams, setSearchParams] = useState({ students: 1, needsAC: false, needsWashroom: false });

  const API_BASE_URL = "https://smart-hostel-room-allocation-system.onrender.com/api/rooms";

  const fetchRooms = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    }
  };

  // Clear messages and fetch rooms when switching tabs
  useEffect(() => {
    setErrorMsg("");
    setSuccessMsg("");
    setAllocationResult(null);
    if (activeTab === "view") {
      fetchRooms();
    }
  }, [activeTab]);

  // Add Room Logic
  const handleAddRoom = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); 
    setSuccessMsg("");

    // Frontend Validation
    if (!newRoom.roomNo.trim()) {
      setErrorMsg("Room Number cannot be empty or just spaces.");
      return;
    }
    if (newRoom.capacity < 1 || isNaN(newRoom.capacity)) {
      setErrorMsg("Capacity must be a valid number of 1 or greater.");
      return;
    }

    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });

      // Backend Error Handling
      if (!res.ok) {
        if (res.status === 409) {
          setErrorMsg(`Room ${newRoom.roomNo} is already added!`);
        } else {
          setErrorMsg("Failed to add room. Please try again.");
        }
        return;
      }

      setNewRoom({ roomNo: "", capacity: 1, hasAC: false, hasAttachedWashroom: false });
      setSuccessMsg("Room added successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Failed to add room", error);
      setErrorMsg("Network error. Make sure the backend server is running.");
    }
  };

  // Search and Allocate Room Logic
  const handleAllocate = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setAllocationResult(null);

    // Frontend Validation
    if (searchParams.students < 1 || isNaN(searchParams.students)) {
      setErrorMsg("Number of students must be a valid number of 1 or greater.");
      return;
    }

    try {
      const { students, needsAC, needsWashroom } = searchParams;
      const res = await fetch(`${API_BASE_URL}/allocate?students=${students}&needsAC=${needsAC}&needsWashroom=${needsWashroom}`);
      
      if (!res.ok) {
        setErrorMsg("Failed to process allocation request.");
        return;
      }

      const data = await res.json();
      setAllocationResult(data);
    } catch (error) {
      console.error("Failed to allocate room", error);
      setErrorMsg("Network error. Make sure the backend server is running.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
            <HomeIcon className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Smart Hostel Allocation</h1>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center border-b border-slate-200 mb-8">
          <button 
            onClick={() => setActiveTab("view")}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 ${activeTab === "view" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            <List className="w-5 h-5" /> View Rooms
          </button>
          <button 
            onClick={() => setActiveTab("add")}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 ${activeTab === "add" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            <Plus className="w-5 h-5" /> Add Room
          </button>
          <button 
            onClick={() => setActiveTab("allocate")}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 ${activeTab === "allocate" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            <Search className="w-5 h-5" /> Search & Allocate
          </button>
        </div>

        {/* TAB CONTENT: VIEW ROOMS */}
        {activeTab === "view" && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Available Rooms Dashboard</h2>
            {rooms.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No rooms added yet. Go to "Add Room" to get started.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left bg-white">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 font-semibold text-slate-600">Room No</th>
                      <th className="p-4 font-semibold text-slate-600">Capacity</th>
                      <th className="p-4 font-semibold text-slate-600">AC</th>
                      <th className="p-4 font-semibold text-slate-600">Washroom</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rooms.map((room) => (
                      <tr key={room.roomNo} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-indigo-600">{room.roomNo}</td>
                        <td className="p-4 text-slate-700">{room.capacity} Students</td>
                        <td className="p-4">{room.hasAC ? <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">Yes</span> : <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-bold">No</span>}</td>
                        <td className="p-4">{room.hasAttachedWashroom ? <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">Yes</span> : <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-bold">No</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: ADD ROOM */}
        {activeTab === "add" && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Register a New Room</h2>
            
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-3 animate-in fade-in">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" /> 
                <p className="font-medium">{errorMsg}</p>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> {successMsg}
              </div>
            )}

            <form onSubmit={handleAddRoom} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Room Number</label>
                  <input type="text" value={newRoom.roomNo} onChange={e => setNewRoom({...newRoom, roomNo: e.target.value})} className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 101" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Capacity</label>
                  <input type="number" min="1" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: parseInt(e.target.value)})} className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors flex-1">
                  <input type="checkbox" checked={newRoom.hasAC} onChange={e => setNewRoom({...newRoom, hasAC: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                  <span className="font-medium text-slate-700">Has Air Conditioning</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors flex-1">
                  <input type="checkbox" checked={newRoom.hasAttachedWashroom} onChange={e => setNewRoom({...newRoom, hasAttachedWashroom: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                  <span className="font-medium text-slate-700">Attached Washroom</span>
                </label>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                Save Room to Database
              </button>
            </form>
          </div>
        )}

        {/* TAB CONTENT: SEARCH & ALLOCATE */}
        {activeTab === "allocate" && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Find & Allocate Room</h2>
            
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-3 animate-in fade-in">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" /> 
                <p className="font-medium">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleAllocate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Number of Students</label>
                <input type="number" min="1" value={searchParams.students} onChange={e => setSearchParams({...searchParams, students: parseInt(e.target.value)})} className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors flex-1">
                  <input type="checkbox" checked={searchParams.needsAC} onChange={e => setSearchParams({...searchParams, needsAC: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                  <span className="font-medium text-slate-700">Needs AC</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors flex-1">
                  <input type="checkbox" checked={searchParams.needsWashroom} onChange={e => setSearchParams({...searchParams, needsWashroom: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                  <span className="font-medium text-slate-700">Needs Washroom</span>
                </label>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200">
                Execute Allocation Algorithm
              </button>
            </form>

            {/* OUTPUT PANEL */}
            {allocationResult && (
              <div className={`mt-8 p-6 rounded-xl text-center border-2 animate-in slide-in-from-bottom-2 ${allocationResult.message === "No room available" ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-800"}`}>
                {allocationResult.message === "No room available" ? (
                  <div className="flex flex-col items-center gap-2">
                    <XCircle className="w-8 h-8 text-red-500" />
                    {/* Exact string required by the assignment [cite: 37] */}
                    <p className="text-xl font-bold">No room available</p> 
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                    <p className="text-xl font-bold">Room Allocated Successfully!</p>
                    <div className="mt-2 inline-block bg-white px-6 py-3 rounded-lg border border-emerald-100 shadow-sm">
                      <span className="block text-sm text-slate-500 uppercase tracking-wider font-semibold">Assigned Room</span>
                      <span className="block text-3xl font-black text-indigo-600">{allocationResult.roomNo}</span>
                      <span className="block text-sm text-slate-600 mt-1">Capacity: {allocationResult.capacity} | AC: {allocationResult.hasAC ? "Yes" : "No"} | Washroom: {allocationResult.hasAttachedWashroom ? "Yes" : "No"}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
