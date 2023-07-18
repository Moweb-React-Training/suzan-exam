import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const DateFn = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  return (
    
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      minDate={today}
      placeholderText="Select a date"
    />
  )
}

export default DateFn