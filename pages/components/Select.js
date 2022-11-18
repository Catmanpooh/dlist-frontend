const Select = ({ title, name = "",  value, disabled, required, postTypes, onChange }) => {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{title}</span>
      </label>
      <select
        disabled={disabled}
        required={required}
        defaultValue={value || 'Select'}
        onChange={onChange}
        name={name}
        className="select select-bordered"
      >
        <option disabled  value={'Select'}>
          Pick one
        </option>
        {postTypes?.map((postType, i) => {
          return (
            <option key={i} value={postType}>
              {postType}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default Select;
