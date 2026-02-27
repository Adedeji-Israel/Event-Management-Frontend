import { useEffect, useMemo, useState } from "react";

/* ================= TYPES ================= */
export interface Event {
  id: string;
  title: string;
  date: string; // ISO string
  category: string;
  location?: string;
  image?: string;
  tickets?: unknown[];
}

interface EventsFilterBarProps {
  events: Event[];
  onFilter: (filtered: Event[]) => void;
}

type DateFilter = "All" | "Upcoming" | "Past";

const EventsFilterBar = ({ events, onFilter }: EventsFilterBarProps) => {
  const [dateFilter, setDateFilter] = useState<DateFilter>("All");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [month, setMonth] = useState("All Months");

  /* ================= DERIVED DATA ================= */
  const categories = useMemo(() => {
    const unique = new Set(events.map(e => e.category).filter(Boolean));
    return ["All Categories", ...Array.from(unique)];
  }, [events]);

  const months = useMemo(() => {
    const unique = new Set(
      events
        .map(e => {
          const d = new Date(e.date);
          if (isNaN(d.getTime())) return null;
          return `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`;
        })
        .filter(Boolean)
    );

    return ["All Months", ...Array.from(unique)];
  }, [events]);

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    let filtered = [...events];
    const today = new Date();

    // Date filter
    if (dateFilter === "Upcoming") {
      filtered = filtered.filter(e => new Date(e.date) >= today);
    }

    if (dateFilter === "Past") {
      filtered = filtered.filter(e => new Date(e.date) < today);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== "All Categories") {
      filtered = filtered.filter(e => e.category === category);
    }

    // Month
    if (month !== "All Months") {
      filtered = filtered.filter(e => {
        const d = new Date(e.date);
        const monthYear = `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`;
        return monthYear === month;
      });
    }

    onFilter(filtered);
  }, [events, dateFilter, search, category, month, onFilter]);

  const clearAll = () => {
    setDateFilter("All");
    setSearch("");
    setCategory("All Categories");
    setMonth("All Months");
  };

  /* ================= RENDER ================= */
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(["All", "Upcoming", "Past"] as DateFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setDateFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              dateFilter === f
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}

        <button
          onClick={clearAll}
          className="ml-auto px-4 py-2 rounded-lg text-sm bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          Clear All
        </button>
      </div>

      {/* Search + Selects */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search events…"
          className="border rounded-lg px-3 py-2 text-sm min-w-[160px]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2 text-sm cursor-pointer"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          className="border rounded-lg px-3 py-2 text-sm cursor-pointer"
          value={month}
          onChange={e => setMonth(e.target.value)}
        >
          {months.map(m => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EventsFilterBar;
