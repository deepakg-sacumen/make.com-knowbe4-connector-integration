function listGroupsFields(parameters) {
  const isValidValue = (value) => {
    return value !== null && value !== undefined && value !== '';
  };

  const formatStringValue = (value) => {
    return typeof value === 'string' ? `"${value}"` : value;
  };

  const queryParams = [];

  queryParams.push('per: 1000');

  if (isValidValue(parameters.status)) {
    queryParams.push(`status: ${parameters.status}`);
  }

  if (isValidValue(parameters.type)) {
    queryParams.push(`type: ${parameters.type}`);
  }

  if (isValidValue(parameters.search)) {
    queryParams.push(`search: ${formatStringValue(parameters.search)}`);
  }

  const query = `query Groups { 
    groups(${queryParams.join(', ')}) { 
      nodes { 
        name 
        id 
        groupType
        status
      } 
      pagination { 
        page 
        pages 
      } 
    } 
  }`;

  return query;
}
