import React from 'react';
import { MOCK_SUBJECTS } from '../services/mockData';
import { Clock, MapPin } from 'lucide-react';

export const Schedule: React.FC = () => {
  // Simple Mock Parsing for the prototype
  // We will map subjects to fixed slots based on their "schedule" string description logic
  // "Mon, Wed, Fri 09:00 AM" -> Mon 9am, Wed 9am, Fri 9am
  
  const timeSlots = [
    "09:00 AM",
    "10:30 AM",
    "12:00 PM",
    "01:00 PM",
    "02:30 PM",
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const getSubjectForSlot = (day: string, time: string) => {
    return MOCK_SUBJECTS.find(s => s.schedule.includes(day) && s.schedule.includes(time));
  };

  const getSlotColor = (index: number) => {
    const colors = [
      'bg-blue-100 border-blue-200 text-blue-700',
      'bg-purple-100 border-purple-200 text-purple-700',
      'bg-emerald-100 border-emerald-200 text-emerald-700',
      'bg-orange-100 border-orange-200 text-orange-700',
      'bg-pink-100 border-pink-200 text-pink-700',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Class Schedule</h2>
          <p className="text-slate-500">Weekly timetable for Fall Semester 2024</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
             Current Week: <span className="font-semibold text-slate-900">Oct 23 - Oct 27</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50">
                <div className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">
                    Time
                </div>
                {days.map(day => (
                    <div key={day} className="p-4 text-center text-sm font-bold text-slate-700 border-r border-slate-200 last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="divide-y divide-slate-200">
                {timeSlots.map(time => (
                    <div key={time} className="grid grid-cols-6">
                        <div className="p-4 flex items-center justify-center text-xs font-semibold text-slate-500 bg-slate-50/50 border-r border-slate-200">
                            {time}
                        </div>
                        {days.map((day, dayIndex) => {
                            const subject = getSubjectForSlot(day, time);
                            // Simple visual tweak for 12:00 PM lunch break
                            if (time === "12:00 PM") {
                                return dayIndex === 0 ? (
                                    <div key={day} className="col-span-5 bg-slate-50 p-2 flex items-center justify-center text-slate-400 text-sm italic tracking-widest uppercase">
                                        Lunch Break
                                    </div>
                                ) : null; 
                            }

                            return (
                                <div key={`${day}-${time}`} className="p-2 border-r border-slate-200 last:border-r-0 min-h-[100px]">
                                    {subject ? (
                                        <div className={`h-full p-3 rounded-lg border ${getSlotColor(parseInt(subject.id.replace('s', '')))} flex flex-col justify-between transition-transform hover:scale-[1.02] cursor-pointer shadow-sm`}>
                                            <div>
                                                <div className="font-bold text-sm leading-tight mb-1">{subject.name}</div>
                                                <div className="text-[10px] opacity-80 uppercase tracking-wide">Standard Class</div>
                                            </div>
                                            <div className="mt-2 flex flex-col gap-1 text-xs opacity-90">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={10} />
                                                    <span>1h 30m</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={10} />
                                                    <span>{subject.room}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            {/* Empty slot */}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};