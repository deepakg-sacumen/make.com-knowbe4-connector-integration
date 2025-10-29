function listTrainingCampaignsFields(parameters) {
    if (Array.isArray(parameters) && parameters.length === 1) {
        parameters = parameters[0];
    }

    function removeEmpty(input) {
        if (typeof input !== "object" || input === null) return undefined;

        return Object.entries(input).reduce((acc, [key, value]) => {
            if (Array.isArray(value)) {
                const cleanedArray = value.filter(
                    item => item !== null && item !== "" && item !== undefined
                );
                if (cleanedArray.length > 0) {
                    acc[key] = cleanedArray;
                }
                return acc;
            }

            if (typeof value === "object" && !(value instanceof Date)) {
                const cleaned = removeEmpty(value);
                if (cleaned && Object.keys(cleaned).length > 0) {
                    acc[key] = cleaned;
                }
                return acc;
            }

            if (value !== null && value !== "" && value !== undefined) {
                acc[key] = value;
            }

            return acc;
        }, {});
    }

    const formatArrayValue = (value) => {
        if (Array.isArray(value)) {
            return value.map(item => {
                if (typeof item === 'string') {
                    const isEnum = /^[A-Z0-9_]+$/.test(item);
                    return isEnum ? item : `"${item}"`;
                }
                return item;
            }).join(', ');
        }
        return value;
    };

    const cleanParams = removeEmpty(parameters);
    const queryParams = ['per: 1000'];

    if (typeof cleanParams?.filter === 'string') {
        const isEnum = /^[A-Z0-9_]+$/.test(cleanParams.filter);
        const formattedFilter = isEnum ? cleanParams.filter : `"${cleanParams.filter}"`;
        queryParams.push(`filter: ${formattedFilter}`);
    }

    if (Array.isArray(cleanParams?.statuses) && cleanParams.statuses.length > 0) {
        queryParams.push(`statuses: [${formatArrayValue(cleanParams.statuses)}]`);
    }

    const query = `query {
  trainingCampaigns(${queryParams.join(', ')}) {
    nodes {
      id
      name
      status
      active
      endCampaignOption
      allUsers
    }
    pagination {
      page
      pages
      per
    }
  }
}`;

    return query;
}
