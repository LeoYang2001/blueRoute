import { createContext, useContext } from "react";

export const ContactContext = createContext<() => void>(() => {});

export function useContact() {
  return useContext(ContactContext);
}
