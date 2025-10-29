function listPhishingCampaignsFields(parameters) {
  function removeEmpty(input) {
    if (typeof input !== "object" || input === null) return undefined;
    return Object.entries(input).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        acc[key] = value.map(item => removeEmpty(item));
        return acc;
      }
      if (typeof value === "object" && value !== null && !(value instanceof Date)) {
        if (Object.keys(value).length === 0) return acc;
        acc[key] = removeEmpty(value);
        return acc;
      }
      if (value === null) return acc;
      if (value === "") return acc;
      if (value === undefined) return acc;
      acc[key] = value;
      return acc;
    }, {});
  }

  const cleanParams = removeEmpty(parameters);

  const queryParams = [];

  queryParams.push('per: 1000');

  if (cleanParams.filter !== undefined) {
    queryParams.push(`filter: ${cleanParams.filter}`);
  }

  if (cleanParams.type !== undefined) {
    queryParams.push(`type: ${cleanParams.type}`);
  }

  const query = `query { 
    phishingCampaigns(${queryParams.join(', ')}) { 
      nodes { 
        id 
        name 
        active
        campaignType
        frequencyPeriod
        nextRun
      } 
      pagination { 
        page 
        pages 
      } 
    } 
  }`;

  return query;
}
