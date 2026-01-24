import { useState } from "react";

export const useLeaveCommunity = (leaveFn) => {
  const [isOpen, setIsOpen] = useState(false);
  const [community, setCommunity] = useState(null);

  const open = (community) => {
    setCommunity(community);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setCommunity(null);
  };

  const confirm = async () => {
    if (!community) return;
    await leaveFn(community.id);
    close();
  };

  return {
    isOpen,
    community,
    open,
    close,
    confirm,
  };
};
