import React, { useRef } from 'react';

const FilterForm = ({ children }) => {
  const formRef = useRef(null);

  const childrenWithProps = React.Children.map(children, (child) => {
    const props = { formRef };
    if (React.isValidElement(child)) {
      return React.cloneElement(child, props);
    }
    return child;
  });

  return (
    <form ref={formRef}>
      {childrenWithProps}
      <button type='reset' className='btn-clear'>
        Clear Filters
      </button>
    </form>
  );
};
export default FilterForm;
