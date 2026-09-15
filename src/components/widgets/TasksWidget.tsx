import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Check, Trash2 } from 'lucide-react';

interface Task {
  id: number;
  text: string;
  done: boolean;
}

const sample_tasks: Task[] = [
  { id: 1, text: 'Please give good ratings', done: false },
  { id: 2, text: 'Btw my real name is Satya', done: true },
  { id: 3, text: 'Byyyyyeeeee stranger...', done: false },
];

const TasksWidget = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('newtab_tasks');
    return saved ? JSON.parse(saved) : sample_tasks;
  });
  const [newTask, setNewTask] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('newtab_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const today_label = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const push_task = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
      setNewTask('');
    }
  };

  const flip_task = (id: number) =>
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));

  const bye_task = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="flex flex-col h-[320px] bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-xl shadow-lg relative">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-zinc-500" />
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">{today_label}</h3>
        </div>
      </div>

      <div className="flex items-center px-3 py-2.5 mb-3 border border-zinc-700/50 bg-zinc-950/50 rounded-xl focus-within:border-zinc-500 transition-colors shadow-inner">
        <Plus className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={push_task}
          placeholder="Add a task..."
          className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1 pr-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2">
            <Check className="w-8 h-8 opacity-20" />
            <span className="text-xs italic">All caught up.</span>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              onClick={() => flip_task(task.id)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800/60 cursor-pointer group transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className={`w-4 h-4 shrink-0 flex items-center justify-center rounded border transition-all duration-300 ${
                    task.done
                      ? 'bg-zinc-300 border-zinc-300'
                      : 'bg-zinc-900 border-zinc-600 group-hover:border-zinc-400'
                  }`}
                >
                  {task.done && <Check className="w-3 h-3 text-zinc-900" />}
                </div>
                <span
                  className={`text-sm transition-all duration-300 truncate ${
                    task.done ? 'text-zinc-600 line-through' : 'text-zinc-300 group-hover:text-white'
                  }`}
                >
                  {task.text}
                </span>
              </div>
              <button
                onClick={e => bye_task(task.id, e)}
                className="w-6 h-6 shrink-0 flex items-center justify-center rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksWidget;
