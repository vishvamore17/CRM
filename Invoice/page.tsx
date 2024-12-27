"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
// import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

// import {useRouter} from 'next/router';

interface InvoiceProps {
  invoiceId: string;  // Assuming you have the invoiceId passed to this page
}


const Invoice: React.FC<InvoiceProps> = ({ invoiceId }) => {

  const router = useRouter();

  const [companyName, setCompanyName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [gstRate, setGstRate] = useState(18); // Default GST rate
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState('Unpaid'); // Track the status of the invoice
  const [submitted, setSubmitted] = useState(false); // Track the submission status

  // useEffect(() => {
  //   const fetchInvoiceData = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:8000/api/v1/lead/getAllLeads/${invoiceId}`);
  //       const { companyName, customerName, contactNumber, emailAddress, productName, amount } = response.data;

  //       // Set the state with the fetched data
  //       setCompanyName(companyName);
  //       setCustomerName(customerName);
  //       setContactNumber(contactNumber);
  //       setEmailAddress(emailAddress);
  //       setProductName(productName);
  //       setAmount(amount);
  //     } catch (error) {
  //       console.error("Error fetching invoice data:", error);
  //       alert("Error fetching invoice data. Please try again.");
  //     }
  //   };

  //   fetchInvoiceData();
  // }, [invoiceId]);





  const calculateInvoice = () => {
    const originalAmount = parseFloat(amount.toString());
    const discountAmount = (originalAmount * (parseFloat(discount.toString()) / 100));
    const finalAmount = originalAmount - discountAmount;
    const gst = finalAmount * (gstRate / 100);

    const cgst = gst / 2;
    const sgst = gst / 2;

    // Adjust the grand total based on the status of the invoice
    let totalWithGst = finalAmount + gst;
    let paidAmount = 0;

    if (status === 'Paid') {
      paidAmount = totalWithGst; // Full paid amount
      totalWithGst = totalWithGst; // Grand total is 0 if paid fully
    }

    return {
      totalWithoutGst: finalAmount,
      totalWithGst,
      cgst,
      sgst,
      paidAmount, // Added the paid amount to be displayed
      remainingAmount: totalWithGst // Remaining amount after partial payment
    };
  };

  const { totalWithoutGst, totalWithGst, cgst, sgst, paidAmount, remainingAmount } = calculateInvoice();

  const printInvoice = () => {
    const invoice = `
      <div style="text-align: center; font-size: 24px; font-weight: bold;">Sprier Technology Consultancy</div>
      <div style="text-align: center; font-size: 18px;">Contact Number : +91 96019 99151</div>
      <div style="text-align: center; font-size: 18px;">Email Id : info@spriertechnology.com</div>
      <div style="text-align: center; font-size: 18px;">GST No : 24FHUPP2154Q1ZF</div>
      <div style="text-align: center; font-size: 18px;">Website : spriertechnology.com</div>
      <div style="text-align: center; font-size: 18px;">Generated Date : ${date}</div>
      <hr style="border: 1px solid black; margin-bottom: 20px;">
      <div style="font-size: 18px; font-weight: bold;">Company Name : ${companyName}</div>
      <div style="font-size: 18px;">Customer Name : ${customerName}</div>
      <div style="font-size: 18px;">Contact Number : ${contactNumber}</div>
      <div style="font-size: 18px;">Email Address : ${emailAddress}</div>
      <div style="font-size: 18px;">Product Name : ${productName}</div>
      <div style="font-size: 18px;">Amount : ₹${amount}</div>
      <div style="font-size: 18px;">Discount : ${discount}%</div>
      <br>
      <div style="font-size: 18px;">Total : ₹${totalWithoutGst.toFixed(2)}</div>
      <div style="font-size: 18px;">CGST : ₹${cgst.toFixed(2)}</div>
      <div style="font-size: 18px;">SGST : ₹${sgst.toFixed(2)}</div>
      <div style="font-size: 18px;">Grand Total : ₹${totalWithGst.toFixed(2)}</div>
      <div style="font-size: 18px;">Paid Amount : ₹${paidAmount.toFixed(2)}</div>
      <div style="font-size: 18px;">Remaining Amount : ₹${remainingAmount.toFixed(2)}</div>
      <hr style="border: 1px solid black; margin-top: 20px;">
    `;
    const iframe = document.createElement('iframe');
    iframe.name = 'invoice';
    iframe.src = 'about:blank';
    iframe.style.width = '100%';
    iframe.style.height = '500px';
    iframe.style.border = 'none';
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    document.body.appendChild(iframe);

    const win = iframe.contentWindow;
    if (win) {
      win.document.write(invoice);
      win.document.close();
      win.focus();
      win.print();
      document.body.removeChild(iframe);
    } else {
      console.error('Error: Unable to access iframe contentWindow');
      document.body.removeChild(iframe);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true); // Set form as submitted

    // Prepare the data to send to the server
    const invoiceData = {
      companyName,
      customerName,
      contactNumber,
      emailAddress,
      productName,
      amount,
      discount,
      gstRate,
      status,
      date,
      totalWithoutGst,
      totalWithGst,
      paidAmount,
      remainingAmount,
    };

    try {
      // Make the API call to store the invoice
      const response = await axios.post("http://localhost:8000/api/v1/invoice/invoiceAdd", invoiceData);

      if (response.data.success) {
        alert("Invoice submitted successfully!");
        router.push('/Reminder')

      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert("Error submitting invoice, please try again.");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#e3f2fd] to-white">
      <div>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold text-gray-900">Invoice</h2>

          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="companyName">Company Name</label>
                  <input
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="customerName">Customer Name</label>
                  <input
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="contactNumber">Contact Number</label>
                  <input
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
                    id="contactNumber"
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="emailAddress">Email ID</label>
                  <input
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
                    id="emailAddress"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="productName">Product Name</label>
                  <input
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="amount">Product Amount</label>
                  <input
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                  />
                  
                
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="discount">Discount (%)</label>
                  <input
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
                    id="discount"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="gstRate">GST Rate (%)</label>
                  <select
                    id="gstRate"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
                    value={gstRate}
                    onChange={(e) => setGstRate(parseFloat(e.target.value))}
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="status">Status</label>
                  <select
                    id="status"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="date">Date</label>
                  <input
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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
                {status === 'Paid' && (
                  <div className="mt-2 text-gray-700">
                    <span>Paid Amount: ₹{paidAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={printInvoice}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition duration-300"
                >
                  Print Invoice
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition duration-300"
                >
                  Submit Invoice
                </button>
              </div>

              {submitted && (
                <div className="mt-4 text-green-600 font-semibold">
                  Invoice Submitted Successfully!
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Invoice;