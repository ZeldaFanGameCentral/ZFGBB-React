import React from "react";

const BBInput:React.FC<{value: string, disabled?: boolean, placeholder?: string}> = ({value, disabled, placeholder}) => {

    return <input
                type="text"
                value={value || ""}
                className="w-full p-2 bg-default border border-default "
                disabled={disabled || false}
                placeholder={placeholder || ""}
              />

};

export default BBInput;