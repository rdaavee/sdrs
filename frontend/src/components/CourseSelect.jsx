import React, { useState, useRef, useEffect } from "react";
import courses from "../constants/courses";

const CourseSelect = ({ value, onChange }) => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filtered = courses.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div ref={wrapperRef} className="w-full sm:w-auto flex-1 relative">
            <input
                type="text"
                value={search !== "" ? search : value}
                onChange={(e) => {
                    setSearch(e.target.value);
                    onChange("");
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Search or select course..."
                className="w-full border border-gray-300 rounded px-3 py-2"
            />

            {open && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-40 overflow-y-auto shadow">
                    {filtered.length > 0 ? (
                        filtered.map((course, i) => (
                            <li
                                key={i}
                                onClick={() => {
                                    onChange(course);
                                    setSearch("");
                                    setOpen(false);
                                }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {course}
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-gray-400">
                            No results found
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CourseSelect;
