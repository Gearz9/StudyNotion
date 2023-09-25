import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const RequirementsField = ({
  name,
  label,
  register,
  setValue,
  getValues,
  errors,
}) => {
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState([]);

  const handleAddRequirement = () => {
    if (requirement) {
      setRequirementList([...requirementList, requirement]);
      setRequirement("");
    }
  };

  const handleRemoveRequirement = (index) => {
    const updateRequirementList = [...requirementList];
    // remove entry from the list using splice
    updateRequirementList.splice(index, 1);
    setRequirementList(updateRequirementList);
  };

  //   we must register in our first render
  useEffect(() => {
    register(name, { require: true, validate: (value) => value.length > 0 });
  }, []);

  //   whenever requirementList gets Updated we need to setValue of the register
  useEffect(() => {
    setValue(name, requirementList);
  }, [requirementList]);

  return (
    <div>
      <label className="text-richblack-5" htmlFor={name}>
        {" "}
        {label} <sup>*</sup>{" "}
      </label>
      <div>
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="w-full"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          ADD
        </button>
      </div>

      {requirementList.length > 0 && (
        <ul>
          {requirementList.map((requirement, index) => {
            return (
              <li key={index} className="flex items-center text-richblack-5">
                <span> {requirement} </span>
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(index)}
                  className="text-xs text-pure-greys-300"
                >
                  clear
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {errors[name] && <span> {label} is required </span>}
    </div>
  );
};

export default RequirementsField;
