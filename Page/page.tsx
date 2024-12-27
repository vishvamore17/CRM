"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import { FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa'; // Import WhatsApp, Mail, and Phone icons
// import Invoice from './Invoice';

interface UnpaidInvoice {
  _id: string;
  companyName: string;
  customerName: string;
  contactNumber: string;
  emailAddress: string;
  productName: ReactNode;
  remainingAmount: number;
  date: string;
}

const ReminderPage: React.FC = () => {
  const [unpaidInvoices, setUnpaidInvoices] = useState<UnpaidInvoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState(null);

  // const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch unpaid invoices from the backend   
        const responce = await axios.get('http://localhost:8000/api/v1/invoice/getUnpaidInvoices')
        if (responce.data.success) {
          setUnpaidInvoices(responce.data.data);
          // navigate("/ReminderPage")
        }
      } catch (error) {
        console.log("Failed to Fetch the Data");
      }
    };
    fetchData();
  }, []);



  // Function to handle WhatsApp link generation
  const createWhatsAppLink = (invoiceId: string) => {
    const invoice = unpaidInvoices.find((invoice) => invoice._id === invoiceId);

    if (invoice) {
      const { customerName, remainingAmount, contactNumber } = invoice;
      const message = `Hello ${customerName},\n\nThis is a reminder to pay your outstanding invoice of ₹${remainingAmount}. Please make the payment at your earliest convenience.`;

      // Properly encode the message to handle special characters and spaces
      const encodedMessage = encodeURIComponent(message);

      // Create the WhatsApp link with the encoded message
      const whatsAppLink = `https://wa.me/${contactNumber}?text=${encodedMessage}`;

      // Redirect to WhatsApp, which should open WhatsApp Web or the app and auto-fill the message
      window.location.href = whatsAppLink; // Triggers the WhatsApp action
    }
  };

  // Function to handle Email reminder logic
  const sendReminderEmail = async (invoiceId: string) => {
    const invoice = unpaidInvoices.find((invoice) => invoice._id === invoiceId);

    if (invoice) {
      try {
        // Make an API call to trigger the sendReminder backend function
        await axios.post(`http://localhost:8000/api/v1/invoice/sendEmailReminder/${invoiceId}`, {
          email: invoice.emailAddress,
          remainingAmount: invoice.remainingAmount,
          customerName: invoice.customerName,
        });
        alert(`Reminder email sent to ${invoice.customerName}`);
      } catch (error) {
        console.error("Error sending reminder email:", error);
        alert("Failed to send the reminder email. Please try again.");
      }
    }
  };

  // Function to handle Call link generation (triggering a phone call)
  const createCallLink = (invoiceId: string) => {
    const invoice = unpaidInvoices.find((invoice) => invoice._id === invoiceId);

    if (invoice) {
      const { contactNumber } = invoice;

      // Create the call link (tel: is used to trigger a phone call)
      const callLink = `tel:${contactNumber}`;

      // Trigger the phone call action
      window.location.href = callLink; // Triggers the phone call
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#e3f2fd] to-white">
      <div style={containerStyle}>
        <h2 style={headerStyle}>Reminder Management</h2>

        {error && <div style={errorStyle}>{error}</div>}

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerCellStyle}>Company Name</th>
              <th style={headerCellStyle}>Customer Name</th>
              <th style={headerCellStyle}>Contact Number</th>
              <th style={headerCellStyle}>Email Address</th>
              <th style={headerCellStyle}>Product Name</th>
              <th style={headerCellStyle}>Product Amount</th>
              <th style={headerCellStyle}>Due Date</th>
              <th style={headerCellStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {unpaidInvoices.length > 0 ? (
              unpaidInvoices.map(invoice => (
                <tr key={invoice._id} style={rowStyle}>
                  <td style={cellStyle}>{invoice.companyName}</td>
                  <td style={cellStyle}>{invoice.customerName}</td>
                  <td style={cellStyle}>{invoice.contactNumber}</td>
                  <td style={cellStyle}>{invoice.emailAddress}</td>
                  <td style={cellStyle}>{invoice.productName}</td>
                  <td style={cellStyle}>{`${invoice.remainingAmount.toFixed(2)}`}</td>
                  <td style={cellStyle}>{new Date(invoice.date).toLocaleDateString()}</td>
                  <td style={cellStyle}>
                    <div style={iconContainerStyle}>
                      <FaWhatsapp
                        onClick={() => createWhatsAppLink(invoice._id)}
                        style={whatsAppIconStyle}
                      />
                      <FaEnvelope
                        onClick={() => sendReminderEmail(invoice._id)}
                        style={mailIconStyle}
                      />
                      <FaPhone
                        onClick={() => createCallLink(invoice._id)}
                        style={callIconStyle}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={cellStyle}>No unpaid invoices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles (unchanged)
const containerStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#f4f7fb',
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  maxWidth: '2000px',
  width: '100%',
  margin: '20px auto',
  color: '#000',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '3rem',
  color: '#000',
  marginBottom: '20px',
  fontWeight: '600',
};

const errorStyle: React.CSSProperties = {
  color: '#d9534f',
  backgroundColor: '#f2dede',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '20px',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '1.5rem',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
  overflowX: 'auto',
};

const headerCellStyle: React.CSSProperties = {
  padding: '14px 18px',
  backgroundColor: '#007bff',
  color: '#fff',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: '1.5rem',
};

const cellStyle: React.CSSProperties = {
  padding: '12px 18px',
  border: '1px solid #ddd',
  textAlign: 'center',
  fontSize: '1.4rem',
  color: '#000',
};

const rowStyle: React.CSSProperties = {
  transition: 'background-color 0.3s',
};

const iconContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
};

const whatsAppIconStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  color: '#28a745',
  cursor: 'pointer',
  transition: 'color 0.3s',
};

const mailIconStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  color: '#28a745',
  cursor: 'pointer',
  transition: 'color 0.3s',
};

const callIconStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  color: '#007bff',
  cursor: 'pointer',
  transition: 'color 0.3s',
};

export default ReminderPage;
