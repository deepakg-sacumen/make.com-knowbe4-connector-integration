function editPhishingCampaignFields(parameters) {
    function removeEmpty(input) {
        if (typeof input !== "object" || input === null) return undefined;
        return Object.entries(input).reduce((acc, [key, value]) => {
            if (Array.isArray(value)) {
                acc[key] = value.filter(item => item !== null && item !== undefined && item !== "");
                return acc;
            }
            if (typeof value === "object" && value !== null && !(value instanceof Date)) {
                if (Object.keys(value).length === 0) return acc;
                acc[key] = removeEmpty(value);
                return acc;
            }
            if (value === null || value === "" || value === undefined) return acc;
            acc[key] = value;
            return acc;
        }, {});
    }

    const cleanParams = removeEmpty(parameters);

    const formatArrayValue = (value) => {
        if (Array.isArray(value)) {
            return value.length > 0 ? value.join(', ') : '[]';
        }
        return value;
    };

    const formatStringValue = (value) => {
        return typeof value === 'string' ? `"${value}"` : value;
    };

    const attributes = [];

    if (cleanParams.frequencyPeriod !== undefined) {
        attributes.push(`frequencyPeriod: ${cleanParams.frequencyPeriod}`);
    }

    if (cleanParams.name !== undefined) {
        attributes.push(`name: ${formatStringValue(cleanParams.name)}`);
    }

    if (cleanParams.selectedGroups !== undefined) {
        attributes.push(`selectedGroups: [${formatArrayValue(cleanParams.selectedGroups)}]`);
    }

    if (cleanParams.nextRun !== undefined) {
        const formattedNextRun = new Date(cleanParams.nextRun).toISOString();
        attributes.push(`nextRun: "${formattedNextRun}"`);
    }

    if (cleanParams.selectedTemplateTopics !== undefined) {
        attributes.push(`selectedTemplateTopics: [${formatArrayValue(cleanParams.selectedTemplateTopics)}]`);
    }

    if (cleanParams.timeZone !== undefined) {
        attributes.push(`timeZone: ${cleanParams.timeZone}`);
    }

    if (cleanParams.spreadEmails !== undefined) {
        attributes.push(`spreadEmails: ${cleanParams.spreadEmails}`);
    }

    if (cleanParams.sendingDuration !== undefined) {
        attributes.push(`sendingDuration: ${cleanParams.sendingDuration}`);
    }

    if (cleanParams.sendingDurationUnits !== undefined) {
        attributes.push(`sendingDurationUnits: ${cleanParams.sendingDurationUnits}`);
    }

    if (cleanParams.businessHoursStartHour !== undefined) {
        attributes.push(`businessHoursStartHour: ${formatStringValue(cleanParams.businessHoursStartHour)}`);
    }

    if (cleanParams.businessHoursEndHour !== undefined) {
        attributes.push(`businessHoursEndHour: ${formatStringValue(cleanParams.businessHoursEndHour)}`);
    }

    if (cleanParams.businessDays !== undefined) {
        attributes.push(`businessDays: [${formatArrayValue(cleanParams.businessDays)}]`);
    }

    if (cleanParams.trackingDuration !== undefined) {
        attributes.push(`trackingDuration: ${cleanParams.trackingDuration}`);
    }

    if (cleanParams.trackingDurationUnits !== undefined) {
        attributes.push(`trackingDurationUnits: ${cleanParams.trackingDurationUnits}`);
    }

    const mutation = `mutation { 
    phishingCampaignEdit(
      attributes: { ${attributes.join(', ')} }, 
      id: ${cleanParams.id}
    ) { 
      errors { 
        field 
        placeholders 
        reason 
        recordId 
      } 
      node { 
        createdAt 
        campaignType
        id 
        name 
        nextRun 
        frequencyPeriod
        spreadEmails
        selectedGroups
        timeZone
        selectedTemplateTopics
      } 
    } 
  }`;

    return mutation;
}
