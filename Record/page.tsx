"use client";

import React, { useEffect, useState } from "react";

interface Invoice {
  _id?: string;
  companyName: string;
  customerName: string;
  contactNumber: string;
  emailAddress: string;
  address: string | number | readonly string[] | undefined;
  gstNumber: string | number | readonly string[] | undefined;
  productName: string;
  amount: number;
  discount: number;
  gstRate: number;
  date: string;
  status: string;
  isActive: boolean;
}

interface InvoiceFormProps {
  Invoice?: Invoice | null;
  onClose: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ Invoice, onClose }) => {
    const [records,setRecords] = useState<Invoice[]>([]);
    const [formData, setFormData] = useState<Invoice>({
    companyName: "",
    customerName: "",
    contactNumber: "N/A",
    emailAddress: "N/A",
    productName: "",
    amount: 0,
    discount: 0,
    gstRate: 18, // Default GST rate
    date: "",
    status: "Unpaid", // Default status
    isActive: true,
    gstNumber: "N/A", // Add GST Number
    address: "N/A", // Add Address
  });

  useEffect(() => {
    if (Invoice) {
      setFormData({
        ...Invoice,
        date: Invoice.date ? new Date(Invoice.date).toISOString().split("T")[0] : "",
      });
    } else {
      const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format
      setFormData((prevData) => ({
        ...prevData,
        date: today, // Set the date to today's date
      }));
    }
  }, [Invoice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "amount" || name === "discount" || name === "gstRate"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { totalWithoutGst, totalWithGst, remainingAmount } = calculateInvoice();

    const method = Invoice ? "PUT" : "POST";
    const url = Invoice
      ? `http://localhost:8000/api/v1/invoice/updateInvoice/${Invoice._id}`
      : "http://localhost:8000/api/v1/invoice/invoiceAdd";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          totalWithoutGst,  // Include totalWithoutGst
          totalWithGst,     // Include totalWithGst
          remainingAmount,  // Include remainingAmount
        }),
      });
      const data = await response.json();

      if (data.success) {
        alert(Invoice ? "Invoice updated successfully" : "Invoice created successfully");
        onClose();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Error submitting the form.");
      console.error(error);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const element = e.target;
    element.style.borderColor = "#007bff";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const element = e.target;
    element.style.borderColor = "#ccc";
  };
  const calculateInvoice = () => {
    const originalAmount = formData.amount;
    const discountAmount = (originalAmount * formData.discount) / 100;
    const finalAmount = originalAmount - discountAmount;
    const gst = (finalAmount * formData.gstRate) / 100;
    const cgst = gst / 2;
    const sgst = gst / 2;
    const totalWithGst = finalAmount + gst;
    const paidAmount = formData.status === "Paid" ? totalWithGst : 0;

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
            <div style="text-align: center; font-size: 18px;">Generated Date: ${formData.date}</div>
            <hr style="border: 1px solid black; margin-bottom: 20px;">
            <br>
            <div style="font-size: 18px; font-weight: bold;">Company Name: ${formData.companyName}</div>
            <div style="font-size: 18px;">Customer Name: ${formData.customerName}</div>
            <div style="font-size: 18px;">Contact Number: ${formData.contactNumber}</div>
            <div style="font-size: 18px;">Email Address: ${formData.emailAddress}</div>
            <div style="font-size: 18px;">Company Address: ${formData.address}</div>
            <div style="font-size: 18px;">GST Number: ${formData.gstNumber}</div>
            <br>
            <div style="font-size: 18px;">Product Name: ${formData.productName}</div>
            <div style="font-size: 18px;">Product Amount: ₹${formData.amount}</div>
            <div style="font-size: 18px;">Discount: ${formData.discount}%</div>
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
    <div style={formContainerStyle}>
      {/* <div style={formStyleWithScroll}> */}
      <div style={scrollContainerStyle}>
        <h2 style={headingStyle}>
          {"Create Invoice"}
        </h2>
        <form onSubmit={handleSubmit} style={formContentStyle}>
          <div style={inputGroupStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="companyName">
                Company Name
              </label>
              <input
                style={inputStyle}
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="customerName">
                Customer Name
              </label>
              <input
                style={inputStyle}
                id="customerName"
                name="customerName"
                type="text"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div style={inputGroupStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="contactNumber">
                Contact Number (Optional)
              </label>
              <input
                style={inputStyle}
                id="contactNumber"
                name="contactNumber"
                type="text"
                value={formData.contactNumber}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="emailAddress">
                Email Address (Optional) 
              </label>
              <input
                style={inputStyle}
                id="emailAddress"
                name="emailAddress"
                type="text"
                value={formData.emailAddress}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div style={inputGroupStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="address">Company Address (Optional)</label>
              <input
                style={inputStyle}
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="gstNumber">GST Number (Optional)</label>
              <input
                style={inputStyle}
                id="gstNumber"
                name="gstNumber"
                type="text"
                value={formData.gstNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={inputGroupStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Product Name
              </label>
              <input
                style={inputStyle}
                id="productName"
                name="productName"
                type="text"
                value={formData.productName}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="amount">
                Product Amount
              </label>
              <input
                style={inputStyle}
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>
          <div style={inputGroupStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="discount">
                Discount (%)
              </label>
              <input
                style={inputStyle}
                id="discount"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="gstRate">
                GST (%)
              </label>
              <select
                id="gstRate"
                name="gstRate"
                style={inputStyle}
                value={formData.gstRate}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
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
          </div>
          <div style={inputGroupStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                style={selectStyle}
                value={formData.status}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="date">
                Date
              </label>
              <input
                style={inputStyle}
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow">
            <h3 className="text-lg font-bold text-gray-800">Summary</h3>
            <div className="flex justify-between mt-2 text-gray-700">
              <span>Total</span>
              <span className="font-semibold">₹{totalWithoutGst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>CGST</span>
              <span className="font-semibold">₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>SGST</span>
              <span className="font-semibold">₹{sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 border-t border-gray-400 mt-2 pt-2">
              <span>Grand Total</span>
              <span className="text-blue-600">₹{totalWithGst.toFixed(2)}</span>
            </div>
          </div>
          <div style={buttonContainerStyle}>
            <button
              type="submit"
              style={submitButtonStyle}
            >
              {"Create"}
            </button>&nbsp;
            <button
              type="button"
              style={cancelButtonStyle}
              onClick={onClose}
            >
              Cancel
            </button>&nbsp;

            {/* <div className="mt-4"> */}
            <button
              type="button"
              style={submitButtonStyle}
              onClick={handlePrintInvoice}
            >
              Print
            </button>
            {/* </div> */}
          </div>
        </form>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              margin: "20px 0",
              fontSize: "18px",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
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
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.date}</td>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>{lead.endDate}</td>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                    <button
                      onClick={() => handleEdit(lead)}
                      style={{
                        padding: "5px 10px",
                        margin: "5px",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lead._id!)}
                      style={{
                        padding: "5px 10px",
                        margin: "5px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
    // </div>
  );

};

const formStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "40px 50px",
  borderRadius: "8px",
  width: "600px",
  maxWidth: "90%",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
  height: "auto",
};

const scrollContainerStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "10px 20px",
  borderRadius: "8px",
  width: "600px",
  maxWidth: "90%",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
  height: "95vh",
  overflowY: "auto",
};

const headingStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#333",
  marginBottom: "20px",
  textAlign: "center",
};

const formContentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "5px",
  width: "100%",
  flexWrap: "wrap",
};

const fieldStyle: React.CSSProperties = {
  width: "48%",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#555",
  marginBottom: "3px",
  display: "block",
};

const inputStyle: React.CSSProperties = {
  padding: "7px 10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "14px",
  width: "100%",
  height: "50%",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease",
  outline: "none",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  color: "black",
};

const submitButtonStyle: React.CSSProperties = {
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "background-color 0.3s ease, transform 0.3s ease",
  width: "48%",
  boxShadow: "0 4px 8px rgba(0, 123, 255, 0.2)",
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "background-color 0.3s ease, transform 0.3s ease",
  width: "48%",
  boxShadow: "0 4px 8px rgba(220, 53, 69, 0.2)",
};

const selectStyle: React.CSSProperties = {
  padding: "7px 10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "14px",
  width: "100%",
  height: "50%",
  boxSizing: "border-box",
  outline: "none",
  color: "black",
};

const formContainerStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 5000,
  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
  padding: "10px",
};

const buttonContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px",
};
export default InvoiceForm;
