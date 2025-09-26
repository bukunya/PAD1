"use client";

import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { STATUS_COLORS } from '@/lib/constants';
import { StatusPengajuan } from '@/types/dashboard';

interface StatusTimelineProps {
  statusList: StatusPengajuan[];
}

export default function StatusTimeline({ statusList }: StatusTimelineProps) {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Status Pengajuan</h3>
        <button className="text-blue-600 text-sm hover:underline transition-all">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {statusList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada pengajuan</p>
          </div>
        ) : (
          statusList.map((item, index) => (
            <motion.div 
              key={item.id}
              className="flex gap-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${STATUS_COLORS[item.status]}`} />
                {index < statusList.length - 1 && (
                  <div className="w-px bg-gray-200 h-8 mt-2" />
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Bell size={16} className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-800">{item.tanggal}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'approved' ? 'bg-green-100 text-green-800' :
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.deskripsi}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}