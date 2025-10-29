function listUsersFields(parameters) {
  const paramObject = Array.isArray(parameters) ? parameters[0] : parameters;

  function removeEmpty(input) {
    if (typeof input !== "object" || input === null) return undefined;

    return Object.entries(input).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        const cleanedArray = value.filter(item => item !== null && item !== undefined);
        if (cleanedArray.length > 0) {
          acc[key] = cleanedArray;
        }
        return acc;
      }

      if (typeof value === "object" && value !== null && !(value instanceof Date)) {
        const cleaned = removeEmpty(value);
        if (cleaned && Object.keys(cleaned).length > 0) {
          acc[key] = cleaned;
        }
        return acc;
      }

      if (value === null || value === "" || value === undefined) return acc;

      acc[key] = value;
      return acc;
    }, {});
  }

  const cleanParams = removeEmpty(paramObject);

  const formatArrayValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  };

  const queryParams = [];
  queryParams.push('per: 1000');

  if (cleanParams.filterGroups && cleanParams.filterGroups.length > 0) {
    queryParams.push(`filterGroups: [${formatArrayValue(cleanParams.filterGroups)}]`);
  }

  if (cleanParams.filterNoGroups !== undefined) {
    queryParams.push(`filterNoGroups: ${cleanParams.filterNoGroups}`);
  }

  if (cleanParams.managersOnly !== undefined) {
    queryParams.push(`managersOnly: ${cleanParams.managersOnly}`);
  }

  if (cleanParams.status !== undefined) {
    queryParams.push(`status: ${cleanParams.status}`);
  }

  if (cleanParams.type !== undefined) {
    queryParams.push(`type: ${cleanParams.type}`);
  }

  const query = `query {
    users(${queryParams.join(', ')}) {
      nodes {
        firstName
        lastName
        id
        email
        jobTitle
        archived
      }
      pagination {
        page
        pages
      }
    }
  }`;

  return query;
}
