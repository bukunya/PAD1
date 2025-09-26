"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { AgendaItem } from '@/types/dashboard';
import clientOnly from '@/components/providers/clientOnly';

interface CalendarProps {
  agenda: AgendaItem[];
}

export default function Calendar({ agenda }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 10)); // September 2025
  
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = [];
  
  // Previous month days
  for (let i = 0; i < firstDayOfMonth; i++) {
    const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), -firstDayOfMonth + i + 1);
    days.push({ date: prevDate.getDate(), isCurrentMonth: false, isSelected: false });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ 
      date: i, 
      isCurrentMonth: true, 
      isSelected: i === 10 // Highlight 10th as selected date
    });
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs text-gray-500 text-center py-2 font-medium">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {days.map((day, index) => (
          <motion.button
            key={index}
            className={`aspect-square flex items-center justify-center text-sm rounded-md transition-all ${
              day.isSelected
                ? 'bg-blue-600 text-white font-semibold'
                : day.isCurrentMonth
                ? 'text-gray-900 hover:bg-gray-100'
                : 'text-gray-400'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {day.date}
          </motion.button>
        ))}
      </div>
      
      {/* Agenda Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">Agenda</h4>
          <MoreHorizontal size={16} className="text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {agenda.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Tidak ada agenda</p>
          ) : (
            agenda.map((item, index) => (
              <motion.div 
                key={item.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.ruangan}</p>
                </div>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                  {item.waktu}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
