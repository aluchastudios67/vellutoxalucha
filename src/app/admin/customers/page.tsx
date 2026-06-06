'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import DataTable from '../components/DataTable';
import Icon from '@/components/ui/AppIcon';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  segment: 'VIP' | 'Regular' | 'New';
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
}

export default function CustomersManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit customer state
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState('');
  const [segment, setSegment] = useState<'VIP' | 'Regular' | 'New'>('New');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (e) {
      console.error('Failed to load customers list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleRowClick = (cust: Customer) => {
    setEditingCustomer(cust);
    setNotes(cust.notes);
    setSegment(cust.segment);
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCustomer.id,
          notes,
          segment
        }),
      });

      if (res.ok) {
        alert('Customer profile updated successfully.');
        setEditingCustomer(null);
        loadCustomers();
      } else {
        alert('Failed to update customer profile.');
      }
    } catch (e) {
      alert('Error updating customer profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const columns = [
    {
      header: 'Customer Name',
      accessor: (c: Customer) => <span className="font-semibold text-neutral-900 dark:text-white">{c.name}</span>,
      sortable: true,
      sortKey: 'name',
    },
    {
      header: 'Contact details',
      accessor: (c: Customer) => (
        <div>
          <p className="font-medium text-neutral-800 dark:text-neutral-200">{c.phone}</p>
          <p className="text-[10px] text-neutral-400 font-light mt-0.5">{c.email}</p>
        </div>
      ),
      sortable: true,
      sortKey: 'phone',
    },
    {
      header: 'Delivery Address',
      accessor: (c: Customer) => <span className="font-light text-neutral-500 dark:text-neutral-400">{c.address}</span>,
    },
    {
      header: 'Segment',
      accessor: (c: Customer) => (
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            c.segment === 'VIP'
              ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400'
              : c.segment === 'Regular'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
              : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
          }`}
        >
          {c.segment}
        </span>
      ),
      sortable: true,
      sortKey: 'segment',
    },
    {
      header: 'Orders placed',
      accessor: (c: Customer) => <span className="font-semibold">{c.ordersCount}</span>,
      sortable: true,
      sortKey: 'ordersCount',
      className: 'text-center',
    },
    {
      header: 'Total Spent',
      accessor: (c: Customer) => <span className="font-bold text-neutral-900 dark:text-white">{c.totalSpent.toLocaleString()} GEL</span>,
      sortable: true,
      sortKey: 'totalSpent',
      className: 'text-right font-semibold',
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest font-semibold text-neutral-400">Loading Client Database...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header Title */}
        <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">Customer Database</h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">View client purchase history, segmentation, and add notes</p>
          </div>
        </div>

        {/* Dynamic Data Table */}
        <DataTable
          columns={columns}
          data={customers}
          searchPlaceholder="Search customers by name, phone..."
          searchKey="name"
          onRowClick={handleRowClick}
          emptyMessage="No customer records logged yet."
        />

        {/* Customer Edit Sidebar / Modal */}
        {editingCustomer && (
          <div className="fixed inset-0 bg-neutral-950/60 flex justify-end z-50 animate-fade-in">
            <div className="fixed inset-0" onClick={() => setEditingCustomer(null)} />
            <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 h-full p-6 flex flex-col justify-between shadow-2xl z-10 animate-slide-in">
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">Edit Customer Profile</h3>
                    <p className="text-[10px] text-neutral-400 uppercase mt-0.5 font-semibold">Metadata editor</p>
                  </div>
                  <button
                    onClick={() => setEditingCustomer(null)}
                    className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg"
                  >
                    <Icon name="XMarkIcon" size={18} />
                  </button>
                </div>

                {/* Details info */}
                <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-150 dark:border-neutral-800/80 space-y-2 text-xs">
                  <p className="flex justify-between">
                    <span className="text-neutral-400">Client Name:</span>
                    <strong className="text-neutral-900 dark:text-white">{editingCustomer.name}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-neutral-400">Phone Number:</span>
                    <strong className="text-neutral-900 dark:text-white">{editingCustomer.phone}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-neutral-400">Orders Placed:</span>
                    <strong className="text-neutral-900 dark:text-white">{editingCustomer.ordersCount}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-neutral-400">Total Spent:</span>
                    <strong className="text-neutral-900 dark:text-white">{editingCustomer.totalSpent.toLocaleString()} GEL</strong>
                  </p>
                </div>

                <form onSubmit={handleUpdateCustomer} className="space-y-4">
                  {/* Segment selection */}
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Customer Segment</label>
                    <select
                      value={segment}
                      onChange={(e) => setSegment(e.target.value as Customer['segment'])}
                      className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Regular">Regular</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>

                  {/* Customer Comments/Notes */}
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Special Comments / Sizing Details</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={5}
                      placeholder="e.g. Ring size 16.5, likes yellow gold rings, preferred courier..."
                      className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCustomer(null)}
                      className="flex-1 border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 py-2.5 rounded-lg text-xs uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="flex-[2] bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold py-2.5 rounded-lg text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
                    >
                      {isUpdating ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
