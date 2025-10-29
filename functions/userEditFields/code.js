function userEditFields(parameters) {
  const paramObject = Array.isArray(parameters) ? parameters[0] : parameters;

  if (!paramObject || typeof paramObject !== 'object' || Object.keys(paramObject).length === 0) {
    throw new Error(paramObject);
  }

  function removeEmpty(input) {
    return Object.entries(input).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        const cleaned = value.filter(v => v !== null && v !== undefined && v !== "");
        if (cleaned.length > 0) acc[key] = cleaned;
        return acc;
      }
      if (typeof value === "object" && !(value instanceof Date)) {
        const nested = removeEmpty(value);
        if (Object.keys(nested).length > 0) acc[key] = nested;
        return acc;
      }
      if (value !== null && value !== undefined && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return null;
    return d.toISOString().split("T")[0];
  }

  const cleanParams = removeEmpty(paramObject);

  if (!cleanParams.userId) {
    throw new Error("userId is required");
  }
  if (!cleanParams.role) {
    throw new Error("role is required");
  }

  const attributes = [];

  const stringFields = [
    "firstName", "lastName", "employeeNumber", "jobTitle",
    "location", "managerEmail", "managerName", "mobilePhoneNumber"
  ];
  for (const field of stringFields) {
    if (cleanParams[field]) {
      attributes.push(`${field}: "${cleanParams[field]}"`);
    }
  }

  const dateFields = ["employeeStartDate", "outOfOfficeStart", "outOfOfficeEnd"];
  for (const field of dateFields) {
    if (cleanParams[field]) {
      const formatted = formatDate(cleanParams[field]);
      if (formatted) attributes.push(`${field}: "${formatted}"`);
    }
  }

  const ldapEnabled = cleanParams.ldapEnabled === true ? "true" : "false";
  attributes.push(`ldapEnabled: ${ldapEnabled}`);

  attributes.push(`role: ${cleanParams.role}`);

  const mutation = `mutation {
    userEdit(
      attributes: { ${attributes.join(', ')} },
      userId: ${cleanParams.userId}
    ) {
      errors {
        field
        placeholders
        reason
        recordId
      }
      node {
        employeeNumber
        employeeStartDate
        firstName
        lastName
        jobTitle
        ldapEnabled
        location
        managerEmail
        managerName
        mobilePhoneNumber
        outOfOfficeStart
        outOfOfficeEnd
        outOfOfficeUntil
        role
      }
    }
  }`;

  return mutation;
}
