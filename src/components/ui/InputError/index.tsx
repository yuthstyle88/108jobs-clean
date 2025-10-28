export const InputError = ({message}: {message?: string}) =>
  message ? <p className="mt-1 text-[12px] font-sans font-normal text-[#EA6357]">{message}</p> : null;
  