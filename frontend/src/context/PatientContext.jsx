import { createContext, useContext } from 'react';

const PatientsContext = createContext([]);

export const usePatients = () => useContext(PatientsContext);

export default PatientsContext;