const Input = ({
  title,
  name="", 
  value,
  required,
  type,
  min = "",
  max = "",
  onChange,
}) => {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{title}</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        min={min}
        max={max}
        onChange={onChange}
        className="input input-bordered w-full max-w-xs"
      />
    </div>
  );
};
export default Input;
