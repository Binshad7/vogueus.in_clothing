const Input = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  className = "", 
  rows,
  options = [],
  onError = null,
  subCategoryError =null,
  categoryError= null
}) => {
  const baseInputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  
  const renderInput = () => {
    if (type === "textarea") {
      return (
        <textarea
          value={value}
          onChange={onChange}
          rows={rows || 4}
          className={`${baseInputStyles} ${className}`}
          placeholder={placeholder}
        />
      );
    }
    
    if (type === "select") {
      return (
        <>
        <select
          value={value}
          onChange={onChange}
          className={`${baseInputStyles} ${className}`}
          >
          <option value="">select option</option>
          {options?.map((option) => (
            <option key={option._id} value={option.categoryName}>
              {option.categoryName}
            </option>
          ))}

        </select>
        {categoryError&& <p className="text-red-500 text-sm">{categoryError}</p>}
          </>
      );
    }
    if (type === "Subcategory") {
      return (
        <>
        <select
          value={value}
          onChange={onChange}
          className={`${baseInputStyles} ${className}`}
          >
          <option value="">select option</option>
          {options?.map((option) => (
            <option key={option._id} value={option.subcategoryName}>
              {option.subcategoryName}
            </option>
          ))}
        </select>
        {subCategoryError&& <p className="text-red-500 text-sm">{subCategoryError}</p>}

          </>
      );
    }
    
    return (
      <input
        min={0}
        type={type}
        value={value}
        onChange={onChange}
        className={`${baseInputStyles} ${className}`}
        placeholder={placeholder}
      />
    );
  };

  return (
    <div>
      {label && (
        <label className={`block text-sm font-medium bg-green mb-1 ${onError ? "text-red-500": "text-gray-700"}`}>
          {onError || label}
        </label>
      )}
      {renderInput()}
    </div>
  );
};

export default Input