'use client';

import React, { useState } from 'react';
import { Product, UserRole } from '@/types/inventory';
import { Filter, Download, Plus, Minus, Edit3, Layers, Lock, ChevronLeft, ChevronRight } from 'lucide-react';

interface StockTableProps {
  products: Product[];
  role: UserRole;
  onOpenAdjustModal: (product: Product, type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT') => void;
  onOpenBatchDrawer: (product: Product) => void;
  selectedStatusFilter: string | null;
  onClearStatusFilter: () => void;
}

export const StockTable: React.FC<StockTableProps> = ({
  products,
  role,
  onOpenAdjustModal,
  onOpenBatchDrawer,
  selectedStatusFilter,
  onClearStatusFilter
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSize, setSelectedSize] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSize = selectedSize === 'ALL' || p.size === selectedSize;
    const matchesStatus = !selectedStatusFilter || p.status === selectedStatusFilter;
    return matchesCategory && matchesSize && matchesStatus;
  });

  const totalEntries = filteredProducts.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalEntries);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalEntries / rowsPerPage) || 1;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OUT_OF_STOCK':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
            <span className="h-2 w-2 rounded-full bg-rose-600"></span>
            OUT OF STOCK
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-600"></span>
            LOW STOCK
          </span>
        );
      case 'EXPIRING_SOON':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
            <span className="h-2 w-2 rounded-full bg-purple-600 animate-ping"></span>
            EXPIRING (&lt;60d)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
            IN STOCK
          </span>
        );
    }
  };

  return (
    <div className="dashboard-card rounded-2xl overflow-hidden mb-8">
      {/* Table Header Bar */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            HBTX Catalog Inventory Stock
          </h2>
          {selectedStatusFilter && (
            <button
              onClick={onClearStatusFilter}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Clear Filter ({selectedStatusFilter})
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Nanoplastia">Nanoplastia</option>
              <option value="Bo-tox">Bo-tox</option>
              <option value="Keratin">Keratin</option>
              <option value="Hair Care & Serums">Hair Care & Serums</option>
              <option value="Smoothing & Blonder">Smoothing & Blonder</option>
            </select>
          </div>

          {/* Size Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
            <select
              value={selectedSize}
              onChange={(e) => { setSelectedSize(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Sizes</option>
              <option value="50ml">50ml</option>
              <option value="250ml">250ml</option>
              <option value="300ml">300ml</option>
              <option value="500ml">500ml</option>
              <option value="1000ml">1000ml</option>
              <option value="500g">500g</option>
            </select>
          </div>

          <button
            onClick={() => alert('Exporting live stock data as CSV...')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Table without Image Column */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="table-header-bg border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Product Name</th>
              <th className="py-4 px-6">SKU Code</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Size</th>
              <th className="py-4 px-6 text-right">MRP (₹)</th>
              <th className="py-4 px-6 text-center">Stock Quantity</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-center">Lots</th>
              <th className="py-4 px-6 text-center">Easy Add / Remove Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800 font-medium bg-white">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-400 font-semibold">
                  No inventory products found matching selected filters.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  {/* Name */}
                  <td className="py-4 px-6 font-extrabold text-slate-900">
                    {p.name}
                  </td>
                  {/* SKU */}
                  <td className="py-4 px-6 font-mono font-bold text-blue-600">
                    {p.sku}
                  </td>
                  {/* Category */}
                  <td className="py-4 px-6 text-slate-600 font-semibold">
                    {p.category}
                  </td>
                  {/* Size */}
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-bold font-mono">
                      {p.size}
                    </span>
                  </td>
                  {/* MRP */}
                  <td className="py-4 px-6 text-right font-mono font-bold text-slate-900 text-sm">
                    ₹{p.priceINR.toLocaleString('en-IN')}
                  </td>
                  {/* Stock Quantity */}
                  <td className="py-4 px-6 text-center">
                    <span className={`font-mono text-base font-extrabold px-3 py-1 rounded-lg ${
                      p.stockQuantity <= 0 ? 'bg-rose-100 text-rose-800' :
                      p.stockQuantity <= p.reorderLevel ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-900'
                    }`}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  {/* Status Badge */}
                  <td className="py-4 px-6 text-center">
                    {getStatusBadge(p.status)}
                  </td>
                  {/* Lots Drawer Button */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => onOpenBatchDrawer(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition border border-slate-200"
                    >
                      <Layers className="h-3.5 w-3.5 text-blue-600" />
                      <span>{p.batchLots.length} Lots</span>
                    </button>
                  </td>

                  {/* PROMINENT EASY ADD / REMOVE BUTTONS FOR ADMIN AND STAFF */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onOpenAdjustModal(p, 'STOCK_IN')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-sm"
                        title="Add Stock (+)"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add</span>
                      </button>

                      <button
                        onClick={() => onOpenAdjustModal(p, 'STOCK_OUT')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition shadow-sm"
                        title="Delete/Remove Stock (-)"
                      >
                        <Minus className="h-4 w-4" />
                        <span>Delete</span>
                      </button>

                      <button
                        onClick={() => onOpenAdjustModal(p, 'ADJUSTMENT')}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
                        title="Manual Adjustment"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600">
        <div>
          Showing <span className="text-slate-900 font-bold">{totalEntries === 0 ? 0 : startIndex + 1}</span> to{' '}
          <span className="text-slate-900 font-bold">{endIndex}</span> of{' '}
          <span className="text-slate-900 font-bold">{totalEntries}</span> entries
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-8 w-8 rounded-lg text-xs font-bold transition ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-800 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
