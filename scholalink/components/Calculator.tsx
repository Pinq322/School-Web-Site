import React, { useState } from 'react';
import { X, Delete, Equal } from 'lucide-react';

interface CalculatorProps {
  onClose: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className="absolute top-16 right-4 z-50 w-72 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="p-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
        <span className="text-slate-100 font-semibold text-sm">Calculator</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={16} /></button>
      </div>
      
      <div className="p-6">
        <div className="text-right mb-4">
          <div className="text-slate-400 text-xs h-4">{equation}</div>
          <div className="text-white text-3xl font-bold truncate">{display}</div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {['C', '(', ')', '/'].map(btn => (
            <button 
              key={btn}
              onClick={() => btn === 'C' ? clear() : handleOperator(btn)}
              className="h-10 rounded-lg bg-slate-700 text-slate-200 font-medium hover:bg-slate-600 active:scale-95 transition-all"
            >
              {btn}
            </button>
          ))}
          {['7', '8', '9', '*'].map(btn => (
            <button 
              key={btn}
              onClick={() => ['*'].includes(btn) ? handleOperator(btn) : handleNumber(btn)}
              className={`h-10 rounded-lg font-medium hover:brightness-110 active:scale-95 transition-all ${
                ['*'].includes(btn) ? 'bg-slate-700 text-slate-200' : 'bg-slate-600 text-white'
              }`}
            >
              {btn}
            </button>
          ))}
          {['4', '5', '6', '-'].map(btn => (
            <button 
              key={btn}
              onClick={() => ['-'].includes(btn) ? handleOperator(btn) : handleNumber(btn)}
              className={`h-10 rounded-lg font-medium hover:brightness-110 active:scale-95 transition-all ${
                ['-'].includes(btn) ? 'bg-slate-700 text-slate-200' : 'bg-slate-600 text-white'
              }`}
            >
              {btn}
            </button>
          ))}
          {['1', '2', '3', '+'].map(btn => (
            <button 
              key={btn}
              onClick={() => ['+'].includes(btn) ? handleOperator(btn) : handleNumber(btn)}
              className={`h-10 rounded-lg font-medium hover:brightness-110 active:scale-95 transition-all ${
                ['+'].includes(btn) ? 'bg-slate-700 text-slate-200' : 'bg-slate-600 text-white'
              }`}
            >
              {btn}
            </button>
          ))}
          <button onClick={() => handleNumber('0')} className="col-span-2 h-10 rounded-lg bg-slate-600 text-white font-medium hover:bg-slate-500 active:scale-95 transition-all">0</button>
          <button onClick={() => handleNumber('.')} className="h-10 rounded-lg bg-slate-600 text-white font-medium hover:bg-slate-500 active:scale-95 transition-all">.</button>
          <button onClick={calculate} className="h-10 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 active:scale-95 transition-all">=</button>
        </div>
      </div>
    </div>
  );
};