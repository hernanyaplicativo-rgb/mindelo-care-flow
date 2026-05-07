import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'admin' | 'doctor' | 'reception' | 'patient';
export type Unit = 'Clínica Sede (Madeiralzinho)' | 'Unidade Monte Sossego';

interface RoleContextType {
  currentRole: Role;
  setRole: (role: Role) => void;
  currentUnit: Unit;
  setUnit: (unit: Unit) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setRole] = useState<Role>('admin');
  const [currentUnit, setUnit] = useState<Unit>('Clínica Sede (Madeiralzinho)');

  return (
    <RoleContext.Provider value={{ currentRole, setRole, currentUnit, setUnit }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
