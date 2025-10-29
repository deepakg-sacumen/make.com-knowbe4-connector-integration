function listEnrollmentsPaginationFields(parameters) {
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

  queryParams.push('page: $page');
  queryParams.push('per: 1000');

  if (cleanParams.trainingCampaignId !== undefined) {
    queryParams.push(`trainingCampaignId: ${cleanParams.trainingCampaignId}`);
  }

  if (cleanParams.status !== undefined) {
    queryParams.push(`status: ${cleanParams.status}`);
  }

  const query = `query Enrollments($page: Int) { 
    enrollments(${queryParams.join(', ')}) { 
      nodes { 
        id 
        status
        active
        enrollmentItem { 
          ... on KnowledgeRefresher { 
            title 
          } 
          ... on Policy { 
            title 
          } 
          ... on PurchasedCourse { 
            title 
          } 
        } 
        trainingCampaign { 
          id 
          name 
        } 
      } 
      pagination { 
        page 
        pages 
        per 
        totalCount 
      } 
    } 
  }`;

  return query;
}
