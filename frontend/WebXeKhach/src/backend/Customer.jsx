import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const CustomerManager = () => {
    const [customers, setCustomers] = useState([]); // Store list of customers
    const [form, setForm] = useState({
        MaKH: '',
        HoVaTen: '',
        NgaySinh: '',
        DiaChi: '',
        Email: '',
        SDT: ''
    });
    const [editing, setEditing] = useState(null); // Track editing customer
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const customersPerPage = 5; // Number of customers displayed per page

    // Fetch customers from the server
    const fetchCustomers = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8081/khachhang');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setMessage('Failed to fetch customers.');
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // Handle input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submit for adding/updating customer
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editing) {
                response = await axios.put(`http://localhost:8081/khachhang/${editing}`, form);
            } else {
                response = await axios.post('http://localhost:8081/khachhang', form);
            }
            if (response.status === 200 || response.status === 201) {
                setMessage('Customer added/updated successfully!');
                setForm({
                    MaKH: '',
                    HoVaTen: '',
                    NgaySinh: '',
                    DiaChi: '',
                    Email: '',
                    SDT: ''
                });
                setEditing(null);
                fetchCustomers();
            }
        } catch (error) {
            console.error('Error submitting customer form:', error);
            setMessage('Failed to add/update customer. Please try again.');
        }
    };

    // Handle editing customer
    const handleEdit = (customer) => {
        setForm(customer);
        setEditing(customer.MaKH);
    };

    // Handle deleting customer
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/khachhang/${id}`);
            fetchCustomers();
            setMessage('Customer deleted successfully!');
        } catch (error) {
            console.error('Error deleting customer:', error);
            setMessage('Failed to delete customer. Please try again.');
        }
    };

    // Handle canceling the form
    const handleCancel = () => {
        setEditing(null);
        setForm({
            MaKH: '',
            HoVaTen: '',
            NgaySinh: '',
            DiaChi: '',
            Email: '',
            SDT: ''
        });
    };

    return (
        <div className="customer-manager">
            <h2>Customer Manager</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="MaKH"
                    value={form.MaKH}
                    onChange={handleChange}
                    placeholder="Customer ID"
                    required
                    disabled={!!editing}
                />
                <input
                    type="text"
                    name="HoVaTen"
                    value={form.HoVaTen}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                />
                <input
                    type="date"
                    name="NgaySinh"
                    value={form.NgaySinh}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="DiaChi"
                    value={form.DiaChi}
                    onChange={handleChange}
                    placeholder="Address"
                />
                <input
                    type="email"
                    name="Email"
                    value={form.Email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="text"
                    name="SDT"
                    value={form.SDT}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                />
                <button type="submit">{editing ? 'Update' : 'Add'} Customer</button>
                {editing && <button onClick={handleCancel}>Cancel</button>}
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>Full Name</th>
                        <th>Date of Birth</th>
                        <th>Address</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.slice((currentPage - 1) * customersPerPage, currentPage * customersPerPage).map(customer => (
                        <tr key={customer.MaKH}>
                            <td>{customer.MaKH}</td>
                            <td>{customer.HoVaTen}</td>
                            <td>{customer.NgaySinh}</td>
                            <td>{customer.DiaChi}</td>
                            <td>{customer.Email}</td>
                            <td>{customer.SDT}</td>
                            <td>
                                <button onClick={() => handleEdit(customer)}>Edit</button>
                                <button onClick={() => handleDelete(customer.MaKH)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button disabled={currentPage * customersPerPage >= customers.length} onClick={() => setCurrentPage(currentPage + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default CustomerManager;
