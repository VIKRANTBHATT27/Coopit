import * as React from 'react';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function PickDate({ inputClass }) {
     const [value, setValue] = React.useState(null);     
     
     let dob = "1/1/2000";
     if (value !== null) {
          dob = `${value?.$D}/${value?.$M+1}/${value?.$y}`;
     }

     console.log(dob);

     
  return (
     <div className={`transform transition-all duration-300 hover:scale-[1.02]`}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
               <DemoContainer components={['DatePicker']}>
                    <DatePicker 
                         value={value} 
                         onChange={(newValue) => setValue(newValue)} 
                         format='DD/MM/YYYY'
                         className={`${inputClass}`}
                    />
               </DemoContainer>
          </LocalizationProvider>
     </div>
  )
}

export default PickDate