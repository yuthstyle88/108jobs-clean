const LoadingMultiCircle = () => {
  return (
    <div className="text-[rgb(153, 153, 153)] px-2 py-3 box-border">
      <div className="relative inline-block w-[5rem] h-[0.8125rem] text-primary">
        <div className="absolute top-0 left-[0.5rem] w-[0.8125rem] h-[0.8125rem] rounded-full bg-current animate-loader1"></div>

        <div className="absolute top-0 left-[0.5rem] w-[0.8125rem] h-[0.8125rem] rounded-full bg-current animate-loader2"></div>

        <div className="absolute top-0 left-[2rem] w-[0.8125rem] h-[0.8125rem] rounded-full bg-current animate-loader2"></div>

        <div className="absolute top-0 left-[3.5rem] w-[0.8125rem] h-[0.8125rem] rounded-full bg-current animate-loader3"></div>
      </div>
    </div>
  );
};

export default LoadingMultiCircle;
