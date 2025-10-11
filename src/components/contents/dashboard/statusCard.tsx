"use client";

import { motion } from 'framer-motion';
import { FileText, MapPin } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string;
  type: 'status' | 'ruangan';
  index?: number;
}

export default function StatusCard({ title, value, type, index = 0 }: StatusCardProps) {
  const Icon = type === 'status' ? FileText : MapPin;
  
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-xl font-semibold text-gray-800">{value}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <Icon size={24} className="text-blue-600" />
        </div>
      </div>
    </motion.div>
  );
}