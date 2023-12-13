import React, { useRef } from 'react';

const FilterForm = ({ filters }) => {
  const formRef = useRef(null);

  const childrenWithProps = filters.map((Filter, index) => (
    <Filter key={index} formRef={formRef} />
  ));

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
