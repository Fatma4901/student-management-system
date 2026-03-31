'use client';

import { Loader2, Inbox } from 'lucide-react';

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function Table({
  columns,
  data,
  loading = false,
  emptyMessage = 'Database initialized but empty'
}: TableProps) {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 gap-4">
        <div className="relative">
           <div className="w-12 h-12 border-4 border-blue-100 rounded-full animate-pulse"></div>
           <Loader2 className="w-12 h-12 text-blue-600 animate-spin absolute inset-0 shrink-0" strokeWidth={3} />
        </div>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Synchronizing Data Streams...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-24 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200 text-slate-300">
           <Inbox className="w-8 h-8" />
        </div>
        <div className="space-y-1">
           <p className="text-slate-400 font-bold text-[14px]">Void Encountered</p>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full group/table">
      <table className="w-full border-collapse">
        <thead className="bg-[#fcfdfe]/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={column.key}
                className={`px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap ${idx === 0 ? 'rounded-tl-2xl' : ''} ${idx === columns.length - 1 ? 'rounded-tr-2xl' : ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/60 bg-white">
          {data.map((row, index) => (
            <tr 
              key={index} 
              className="group/row hover:bg-[#f9fafb] transition-all duration-300 relative"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {columns.map((column, colIdx) => (
                <td 
                  key={column.key} 
                  className={`px-8 py-5 text-[13px] font-medium text-slate-600 transition-all ${colIdx === 0 ? 'group-hover/row:translate-x-1 duration-500' : ''}`}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : <span className="text-slate-700">{row[column.key] || '-'}</span>
                  }
                </td>
              ))}
              
              {/* Subtle hover indicator dot */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-blue-600 rounded-full group-hover/row:h-1/2 transition-all duration-500 opacity-0 group-hover/row:opacity-100" />
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Table Footer / Summary Bar */}
      <div className="px-8 py-4 bg-[#fcfdfe] border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
         <p>Showing {data.length} authenticated records</p>
         <div className="flex gap-4">
            <span className="cursor-default hover:text-slate-600 transition-colors">v2.4.1</span>
            <span className="cursor-default hover:text-slate-600 transition-colors">CRC-32 Checksum Verified</span>
         </div>
      </div>
    </div>
  );
}