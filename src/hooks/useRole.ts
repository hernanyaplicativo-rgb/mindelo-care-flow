import { create } from 'zustand';

type Role = 'admin' | 'doctor' | 'reception' | 'patient';

interface RoleState {
  currentRole: Role;
  setRole: (role: Role) => void;
}

export const useRole = create<RoleState>((set) => ({
  currentRole: 'admin',
  setRole: (role) => set({ currentRole: role }),
}));
