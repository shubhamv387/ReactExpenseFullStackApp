const Loader = (props) => {
  const { height, width, borderColor, borderWidth } = props;

  const classes = `h-${height || 5} w-${width || 5} border-${borderWidth || 2}`;

  return (
    <>
      <div
        className={`mr-3 rounded-full animate-spin border-solid border-t-transparent ${classes}`}
        style={{
          borderColor: `transparent ${borderColor} ${borderColor} ${borderColor}`,
        }}
      />
      {props.label && <span>{props.label}</span>}
    </>
  );
};

export default Loader;
