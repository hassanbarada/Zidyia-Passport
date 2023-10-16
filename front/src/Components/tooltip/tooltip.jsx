import "./tooltip.css"

const Tooltip = ({ text, children,margin }) => {
  return (
    <div className="tooltip-container">
      <div style={{marginLeft:margin}} className="tooltip">
        {text}
      </div>
      {children}
    </div>
  );
};

export default Tooltip;
