"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Invoice {
  _id: string;
  companyName: string;
  customerName: string;
  contactNumber: string;
  emailAddress: string;
  address: string;
  gstNumber: string;
  productName: string;
  amount: number;
  discount: number;
  gstRate: number;
  date: string;
  status: string;
  isActive: boolean;
}
const RecordTable = () => {
  const [records, setRecords] = useState<Invoice[]>([]);
  const [form, setForm] = useState({
    companyName: "",
    customerName: "",
    contactNumber: "",
    emailAddress: "",
    address: "",
    gstNumber: "",
    productName: "",
    amount: 0,
    discount: 0,
    gstRate: 0,
    date: "",
    status: "",
    isActive: true,
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/invoice/getAllInvoices");
      setRecords(data.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:8000/api/v1/invoice/updateInvoice/${editId}`, form);
        toast.success("Invoice updated successfully.");
      } else {
        await axios.post("http://localhost:8000/api/v1/invoice/invoiceAdd", form);
        toast.success("Invoice created successfully.");
      }
      fetchRecords();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form.");
    }
  };

  const handleEdit = (invoice : Invoice) => {
    setEditId(invoice._id || null);
    setForm(invoice);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/invoice/deleteInvoice/${id}`);
      toast.success("Invoice deleted successfully.");
      fetchRecords();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice.");
    }
  };

  const resetForm = () => {
    setForm({
      companyName: "",
      customerName: "",
      contactNumber: "",
      emailAddress: "",
      address: "",
      gstNumber: "",
      productName: "",
      amount: 0,
      discount: 0,
      gstRate: 0,
      date: "",
      status: "",
      isActive: true,
    });
    setEditId(null);
    setShowForm(false);
  };

  const calculateInvoice = () => {
    const originalAmount = form.amount;
    const discountAmount = (originalAmount * form.discount) / 100;
    const finalAmount = originalAmount - discountAmount;
    const gst = (finalAmount * form.gstRate) / 100;
    const cgst = gst / 2;
    const sgst = gst / 2;
    const totalWithGst = finalAmount + gst;
    const paidAmount = form.status === "Paid" ? totalWithGst : 0;

    return {
      totalWithoutGst: finalAmount,
      totalWithGst,
      cgst,
      sgst,
      paidAmount,
      remainingAmount: totalWithGst - paidAmount,
    };
  };

  const { totalWithoutGst, totalWithGst, cgst, sgst, paidAmount, remainingAmount } = calculateInvoice();

  const handlePrintInvoice = () => {
    const invoiceHtml = `
            <div style="text-align: center; font-size: 24px; font-weight: bold;">Sprier Technology Consultancy</div>
            <div style="text-align: center; font-size: 18px;">Contact Number: +91 96019 99151</div>
            <div style="text-align: center; font-size: 18px;">Email: info@spriertechnology.com</div>
            <div style="text-align: center; font-size: 18px;">GST No: 24FHUPP2154Q1ZF</div>
            <div style="text-align: center; font-size: 18px;">Website: spriertechnology.com</div>
            <div style="text-align: center; font-size: 18px;">Generated Date: ${form.date}</div>
            <hr style="border: 1px solid black; margin-bottom: 20px;">
            <br>
            <div style="font-size: 18px; font-weight: bold;">Company Name: ${form.companyName}</div>
            <div style="font-size: 18px;">Customer Name: ${form.customerName}</div>
            <div style="font-size: 18px;">Contact Number: ${form.contactNumber}</div>
            <div style="font-size: 18px;">Email Address: ${form.emailAddress}</div>
            <div style="font-size: 18px;">Company Address: ${form.address}</div>
            <div style="font-size: 18px;">GST Number: ${form.gstNumber}</div>
            <br>
            <div style="font-size: 18px;">Product Name: ${form.productName}</div>
            <div style="font-size: 18px;">Product Amount: ₹${form.amount}</div>
            <div style="font-size: 18px;">Discount: ${form.discount}%</div>
            <br>
            <div style="font-size: 18px;">Total: ₹${totalWithoutGst.toFixed(2)}</div>
            <div style="font-size: 18px;">CGST: ₹${cgst.toFixed(2)}</div>
            <div style="font-size: 18px;">SGST: ₹${sgst.toFixed(2)}</div>
            <div style="font-size: 18px; font-weight: bold;">Grand Total: ₹${totalWithGst.toFixed(2)}</div>
            <br>
            <div style="font-size: 18px;">Paid Amount: ₹${paidAmount.toFixed(2)}</div>
            <div style="font-size: 18px;">Remaining Amount: ₹${remainingAmount.toFixed(2)}</div>
        `;

    const printWindow = window.open("", "PrintInvoice", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      alert("Error: Unable to open print window.");
    }
  };


  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f5" }}>
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
          Create Invoice
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            {editId ? "Update Invoice" : "Add Invoice"}
          </h2>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>Company Name</label>
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
            <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>Customer Name</label>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
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
              <label  style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }} htmlFor="contactNumber">
                Contact Number (Optional)
              </label>
              <input
                type="text"
                value={form.contactNumber}
                onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
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
              <label  style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }} htmlFor="emailAddress">
                Email Address (Optional) 
              </label>
              <input
                 type="text"
                 value={form.emailAddress}
                 onChange={(e) => setForm({ ...form, emailAddress: e.target.value })}
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
              <label  style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }} htmlFor="address">Company Address (Optional)</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
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
              <label  style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }} htmlFor="gstNumber">GST Number (Optional)</label>
              <input
                 type="number"
                 value={form.gstNumber}
                 onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
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
              <label  style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
                Product Name
              </label>
              <input
                type="text"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
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
              <label  style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }} htmlFor="amount">
                Product Amount
              </label>
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
              <label  style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }} htmlFor="discount">
                Discount (%)
              </label>
              <input
               type="number"
               value={form.discount}
               onChange={(e) => setForm({ ...form, discount:parseFloat (e.target.value) })}
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
              <label  style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }} htmlFor="gstRate">
                GST (%)
              </label>
              <select
                 value={form.gstRate}
                 onChange={(e) => setForm({ ...form, gstRate: parseFloat(e.target.value) })}
                 required
                 style={{
                   width: "100%",
                   padding: "10px",
                   margin: "5px 0",
                   borderRadius: "5px",
                   border: "1px solid #ccc",
                 }}
              >
                <option value={0}>0%</option>
                <option value={1}>1%</option>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18%</option>
                <option value={28}>28%</option>
                <option value={35}>35%</option>
              </select>
            </div>
          
          <div style={{ marginBottom: "10px" }}>
            
              <label  style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }} htmlFor="status">
                Status
              </label>
              <select
                 value={form.status}
                 onChange={(e) => setForm({ ...form, status: e.target.value })}
                 required
                 style={{
                   width: "100%",
                   padding: "10px",
                   margin: "5px 0",
                   borderRadius: "5px",
                   border: "1px solid #ccc",
                 }}
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label  style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }} htmlFor="date">
                Date
              </label>
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

          {/* Summary Section */}
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f9f9f9",
              borderRadius: "5px",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ margin: "0 0 10px", fontWeight: "bold" }}>Summary</h3>
            <p>Total: ₹{totalWithoutGst.toFixed(2)}</p>
            <p>CGST: ₹{cgst.toFixed(2)}</p>
            <p>SGST: ₹{sgst.toFixed(2)}</p>
            <p>Grand Total: ₹{totalWithGst.toFixed(2)}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                width: "48%",
              }}
            >
              {editId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => resetForm()}
              style={{
                backgroundColor: "#dc3545",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                width: "48%",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              style={{
                backgroundColor: "#dc3545",
                color: "#fff",
                padding: "5px 10px",
                borderRadius: "3px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={handlePrintInvoice}
            >
              Print
            </button>
          </div>
        </form>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            margin: "20px 0",
            fontSize: "18px",
            textAlign: "left",
            backgroundColor: "#fff",
            borderRadius: "5px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
              <th style={{ padding: "12px 15px" }}>Company Name</th>
              <th style={{ padding: "12px 15px" }}>Customer Name</th>
              <th style={{ padding: "12px 15px" }}>GST Number</th>
              <th style={{ padding: "12px 15px" }}>Product Name</th>
              <th style={{ padding: "12px 15px" }}>Amount</th>
              <th style={{ padding: "12px 15px" }}>Discount</th>
              <th style={{ padding: "12px 15px" }}>GST Rate</th>
              <th style={{ padding: "12px 15px" }}>Status</th>
              <th style={{ padding: "12px 15px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#fff",
                  transition: "background-color 0.2s",
                }}
              >
                <td style={{ padding: "12px 15px" }}>{record.companyName}</td>
                <td style={{ padding: "12px 15px" }}>{record.customerName}</td>
                <td style={{ padding: "12px 15px" }}>{record.gstNumber}</td>
                <td style={{ padding: "12px 15px" }}>{record.productName}</td>
                <td style={{ padding: "12px 15px" }}>{record.amount}</td>
                <td style={{ padding: "12px 15px" }}>{record.discount}</td>
                <td style={{ padding: "12px 15px" }}>{record.gstRate}</td>
                <td style={{ padding: "12px 15px" }}>{record.status}</td>
                <td style={{ padding: "12px 15px" }}>
                  <button
                    onClick={() => handleEdit(record)}
                    style={{
                      backgroundColor: "#ffc107",
                      color: "#fff",
                      padding: "5px 10px",
                      borderRadius: "3px",
                      cursor: "pointer",
                      margin: "0 5px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      padding: "5px 10px",
                      borderRadius: "3px",
                      cursor: "pointer",
                      margin: "0 5px",
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

}
export default RecordTable;
