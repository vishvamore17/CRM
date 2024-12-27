// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface LeadFormInput {
//   _id?: string;
//   companyName: string;
//   Name: string;
//   amount: number;
//   products: string;
//   mobileNo: string;
//   email: string;
//   notes: string;
//   date: string;
//   endDate: string;
//   status: string;
//   isActive: boolean;
// }

// const LeadTable = () => {
//   const [leads, setLeads] = useState<LeadFormInput[]>([]);
//   const [form, setForm] = useState<LeadFormInput>({
//     companyName: "",
//     Name: "",
//     amount: 0,
//     products: "",
//     mobileNo: "",
//     email: "",
//     notes: "N/A",
//     date: "",
//     endDate: "",
//     status: "",
//     isActive: true,
//   });

//   const [editId, setEditId] = useState<string | null>(null);
//   const [showForm, setShowForm] = useState(false);

//   const fetchLeads = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:8000/api/v1/lead/getAllLeads");
//       setLeads(data.data);
//     } catch (error) {
//       console.error("Error fetching leads:", error);
//       toast.error("Failed to fetch leads.");
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (editId) {
//         await axios.put(`http://localhost:8000/api/v1/lead/updateLead/${editId}`, form);
//         toast.success("Lead updated successfully.");
//       } else {
//         await axios.post("http://localhost:8000/api/v1/lead/createLead", form);
//         toast.success("Lead created successfully.");
//       }

//       fetchLeads();
//       setForm({ 
//         companyName: "",
//         Name: "",
//         amount: 0,
//         products: "",
//         mobileNo: "",
//         email: "",
//         notes: "N/A",
//         date: "",
//         endDate: "",
//         status: "",
//         isActive: true,
//        });
//       setEditId(null);
//       setShowForm(false);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       toast.error("Failed to submit form.");
//     }
//   };

//   const handleEdit = (lead: LeadFormInput) => {
//     setEditId(lead._id || "");
//     setForm({ 
//         companyName: lead.companyName,
//         Name: lead.Name,
//         amount: lead.amount,
//         products: lead.products,
//         mobileNo: lead.mobileNo,
//         email: lead.email,
//         notes: lead.notes,
//         date: lead.date,
//         endDate: lead.endDate,
//         status: lead.status,
//         isActive: lead.isActive,
//      });
//      setEditId(lead._id || null);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await axios.delete(`http://localhost:8000/api/v1/lead/deleteLead/${editId}`);
//       toast.success("Lead deleted successfully.");
//       fetchLeads();
//     } catch (error) {
//       console.error("Error deleting lead:", error);
//       toast.error("Failed to delete lead.");
//     }
//   };

//   const handleLeadclick = () => {
//     setForm({
//       companyName: "",
//       Name: "",
//       amount: 0,
//       products: "",
//       mobileNo: "",
//       email: "",
//       notes: "N/A",
//       date: "",
//       endDate: "",
//       status: "",
//       isActive: true,
//     });
//     setEditId(null);
//     setShowForm(true);
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div style={{ textAlign: "center", marginBottom: "20px" }}>
//         <button
//           onClick={() => setShowForm(true)}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#4CAF50",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           Add Lead
//         </button>
//       </div>

//       {showForm ? (
//         <form
//           onSubmit={handleSubmit}
//           style={{
//             maxWidth: "600px",
//             margin: "0 auto",
//             padding: "20px",
//             border: "1px solid #ccc",
//             borderRadius: "5px",
//             backgroundColor: "#f9f9f9",
//           }}
//         >
//           <h2 style={{ textAlign: "center" }}>{editId ? "Update Lead" : "Add Lead"}</h2>
//           <div style={{ marginBottom: "10px" }}>
//             <label>Company Name</label>
//             <input
//               type="text"
//               value={form.companyName}
//               onChange={(e) => setForm({ ...form, companyName: e.target.value })}
//               required
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 margin: "5px 0",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </div>
//           <div style={{ marginBottom: "10px" }}>
//             <label>Customer Name</label>
//             <input
//               type="text"
//               value={form.Name}
//               onChange={(e) => setForm({ ...form, Name: e.target.value })}
//               required
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 margin: "5px 0",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </div>
//           <div style={{ marginBottom: "10px" }}>
//             <label>Contact Number</label>
//             <input
//               type="text"
//               value={form.mobileNo}
//               onChange={(e) => setForm({ ...form, mobileNo: e.target.value })}
//               required
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 margin: "5px 0",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </div>
//           <div style={{ marginBottom: "10px" }}>
//             <label>Email Address</label>
//             <input
//               type="email"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               required
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 margin: "5px 0",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </div>
//           <div style={{ marginBottom: "10px" }}>
//             <label>Product Name</label>
//             <input
//               type="text"
//               value={form.products}
//               onChange={(e) => setForm({ ...form, products: e.target.value })}
//               required
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 margin: "5px 0",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </div>
//           <div style={{ marginBottom: "10px" }}>
//             <label>Product Amount</label>
//             <input
//               type="number"
//               value={form.amount}
//               onChange={(e) => setForm({ ...form, amount: parseFloat( e.target.value) })}
//               required
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 margin: "5px 0",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </div>
//           <div style={{ marginBottom: "10px" }}>
//             <label>Status</label>
//             <select
//               value={form.status}
//               onChange={(e) => setForm({ ...form, status: e.target.value })}
//               required
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//               }}
//             >
//               <option value="">Select Status</option>
//               <option value="Proposal">Proposal</option>
//               <option value="New">New</option>
//               <option value="Discussion">Discussion</option>
//               <option value="Demo">Demo</option>
//               <option value="Decided">Decided</option>
//             </select>
//           </div>

//           <div style={{ marginBottom: "10px" }}>
//             <label>Notes</label>
//             <input
//               type="text"
//               value={form.notes}
//               onChange={(e) => setForm({ ...form, notes: e.target.value })}
//               required
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 margin: "5px 0",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </div>

//           <div style={{ marginBottom: "10px" }}>
//             <label>Lead Date</label>
//             <input
//               type="date"
//               value={form.date}
//               onChange={(e) => setForm({ ...form, date: e.target.value })}
//               required
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 margin: "5px 0",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </div>
//           <div style={{ marginBottom: "10px" }}>
//             <label>End Date</label>
//             <input
//               type="date"
//               value={form.endDate}
//               onChange={(e) => setForm({ ...form, date: e.target.value })}
//               required
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 margin: "5px 0",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </div>
//           <button
//             type="submit"
//             style={{
//               width: "100%",
//               padding: "10px",
//               backgroundColor: "#4CAF50",
//               color: "white",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             {editId ? "Update" : "Add"} Lead
//           </button>
//         </form>
//       ) : (
//         <div style={{ overflowX: "auto" }}>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               margin: "20px 0",
//               fontSize: "18px",
//               textAlign: "left",
//             }}
//           >
//             <thead>
//               <tr>
//                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Company Name</th>
//                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Customer Name</th>
//                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Contact Number</th>
//                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Email Address</th>
//                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Product Name</th>
//                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Product Amount</th>
//                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Status</th>
//                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Notes</th>
//                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Lead Date</th>
//                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>End Date</th>
//                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {leads.map((lead) => (
//                 <tr key={lead._id}>
//                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.companyName}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.Name}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.mobileNo}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.email}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.products}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.amount}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.status}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.notes}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.date}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.endDate}</td>
//                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>
//                     <button
//                       onClick={() => handleEdit(lead)}
//                       style={{
//                         padding: "5px 10px",
//                         margin: "5px",
//                         backgroundColor: "#2196F3",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "5px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(lead._id!)}
//                       style={{
//                         padding: "5px 10px",
//                         margin: "5px",
//                         backgroundColor: "#f44336",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "5px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LeadTable;


"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LeadFormInput {
  _id?: string;
  companyName: string;
  Name: string;
  amount: number;
  products: string;
  mobileNo: string;
  email: string;
  notes: string;
  date: string;
  endDate: string;
  status: string;
  isActive: boolean;
}

const LeadTable = () => {
  const [leads, setLeads] = useState<LeadFormInput[]>([]);
  const [form, setForm] = useState<LeadFormInput>({
    companyName: "",
    Name: "",
    amount: 0,
    products: "",
    mobileNo: "",
    email: "",
    notes: "N/A",
    date: "",
    endDate: "",
    status: "",
    isActive: true,
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchLeads = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/lead/getAllLeads");
      setLeads(data.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to fetch leads.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:8000/api/v1/lead/updateLead/${editId}`, form);
        toast.success("Lead updated successfully.");
      } else {
        await axios.post("http://localhost:8000/api/v1/lead/createLead", form);
        toast.success("Lead created successfully.");
      }

      fetchLeads();
      setForm({ 
        companyName: "",
        Name: "",
        amount: 0,
        products: "",
        mobileNo: "",
        email: "",
        notes: "N/A",
        date: "",
        endDate: "",
        status: "",
        isActive: true,
      });
      setEditId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form.");
    }
  };

  const handleEdit = (lead: LeadFormInput) => {
    setEditId(lead._id || "");
    setForm({ 
      companyName: lead.companyName,
      Name: lead.Name,
      amount: lead.amount,
      products: lead.products,
      mobileNo: lead.mobileNo,
      email: lead.email,
      notes: lead.notes,
      date: lead.date,
      endDate: lead.endDate,
      status: lead.status,
      isActive: lead.isActive,
    });
    setEditId(lead._id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/lead/deleteLead/${id}`);
      toast.success("Lead deleted successfully.");
      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead.");
    }
  };

  const handleLeadclick = () => {
    setForm({
      companyName: "",
      Name: "",
      amount: 0,
      products: "",
      mobileNo: "",
      email: "",
      notes: "N/A",
      date: "",
      endDate: "",
      status: "",
      isActive: true,
    });
    setEditId(null);
    setShowForm(true);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Lead
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2 style={{ textAlign: "center" }}>{editId ? "Update Lead" : "Add Lead"}</h2>
          <div style={{ marginBottom: "10px" }}>
            <label>Company Name</label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                margin: "5px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Customer Name</label>
            <input
              type="text"
              value={form.Name}
              onChange={(e) => setForm({ ...form, Name: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                margin: "5px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Contact Number</label>
            <input
              type="text"
              value={form.mobileNo}
              onChange={(e) => setForm({ ...form, mobileNo: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                margin: "5px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                margin: "5px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Product Name</label>
            <input
              type="text"
              value={form.products}
              onChange={(e) => setForm({ ...form, products: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                margin: "5px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Product Amount</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
              required
              style={{
                width: "100%",
                padding: "10px",
                margin: "5px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select Status</option>
              <option value="Proposal">Proposal</option>
              <option value="New">New</option>
              <option value="Discussion">Discussion</option>
              <option value="Demo">Demo</option>
              <option value="Decided">Decided</option>
            </select>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Notes</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                margin: "5px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
             <label>Lead Date</label>
             <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                margin: "5px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px",
                margin: "5px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
     

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {editId ? "Update" : "Add"} Lead
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Company Name</th>
                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Customer Name</th>
                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Contact Number</th>
                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Email Address</th>
                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Product Name</th>
                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Product Amount</th>
                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Status</th>
                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Notes</th>
                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Lead Date</th>
                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>End Date</th>
                 <th style={{ border: "1px solid #ddd", padding: "10px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.companyName}</td>
                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.Name}</td>
                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.mobileNo}</td>
                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.email}</td>
                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.products}</td>
                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.amount}</td>
                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.status}</td>
                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.notes}</td>
                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{new Date(lead.date).toISOString().split("T")[0]}</td>
                   <td style={{ border: "1px solid #ddd", padding: "10px" }}>{new Date(lead.endDate).toISOString().split("T")[0]}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => handleEdit(lead)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ff9800",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lead._id || "")}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeadTable;
