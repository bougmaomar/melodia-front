import { useContext } from 'react';
import { createContext } from 'react';
export const AbilityContext = createContext();
export const useAbility = () => useContext(AbilityContext);
