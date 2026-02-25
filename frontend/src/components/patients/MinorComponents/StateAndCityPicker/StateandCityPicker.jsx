import React, { useEffect, useMemo, useState } from 'react';
import { State, City } from "country-state-city";


function StateandCityPicker({ className }) {
     const IndiaCountryCode = "IN";
     
     const cachedVal = useMemo(() => State.getStatesOfCountry(IndiaCountryCode), []);

     const [ states, setState ] = useState(cachedVal);

     const [ cities, setCity ] = useState([]);

     const [ selectedState, setSelectedState ] = useState(null);
     const [ selectedCity, setSelectedCity ] = useState(null);
     

     useEffect(() => {
          console.log(selectedState);
          console.log(selectedCity);
     }, [selectedState, setSelectedState]);

     const handleStateChange = (state) => {
          setSelectedState(state.name);
          setCity(City.getCitiesOfState(IndiaCountryCode, state.isoCode));    
     }

  return (
     <div className="flex flex-col">
          <div className="col">
               <select
                    className={`form-select border border-black p-2 w-[25em] ${className} text-red-400`}
                    onChange={(e) => handleStateChange(states.find((st) => st.isoCode === e.target.value))}
               >
                    <option key={null} value="">SELECT STATE</option>
                    {states.map((state) => (
                         <option key={state.isoCode} value={state.isoCode}>
                              {state.name}
                         </option>
                    ))}
               </select>
          </div>
          <div className="col mt-8">
               <select
                    disabled={!selectedState}
                    className={`form-select border border-black p-2 w-[15em] ${className} text-slate-400`}
                    onChange={(e) => setSelectedCity(e.target.value)}
               >
                    <option key={null} value="">SELECT CITY</option>
                    {cities.map((city, ind) => (
                         <option key={ind} value={city.name}>
                              {city.name}
                         </option>
                    ))}
               </select>
          </div>
     </div>
  )
}

export default StateandCityPicker;