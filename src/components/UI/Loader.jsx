export const Loader = (props) => {
  return (
    <div className='flex items-center justify-center gap-2'>
      <div
        className={`h-fit w-fit rounded-full animate-spin border-solid border-t-transparent ${props.className}`}
      />
      {props.label && <span>{props.label}</span>}
    </div>
  );
};

const PageLoader = (props) => {
  return (
    <div className='absolute z-50 flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-white'>
      <div
        className={`h-fit w-fit rounded-full animate-spin border-solid border-t-transparent p-5 border-[6px] border-blue-500`}
      />
    </div>
  );
};

export default PageLoader;
