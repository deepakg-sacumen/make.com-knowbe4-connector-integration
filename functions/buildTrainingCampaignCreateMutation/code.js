function buildTrainingCampaignCreateMutation(parameters) {
  function formatDate(dateString) {
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d)) return null;
    return d.toISOString().slice(0, 10);
  }

  function removeEmpty(input) {
    if (Array.isArray(input)) {
      const cleanedArray = input
        .map(item => removeEmpty(item))
        .filter(item => item !== null && item !== undefined && (typeof item !== 'object' || Object.keys(item).length > 0));
      return cleanedArray.length > 0 ? cleanedArray : input;
    }

    if (typeof input === "object" && input !== null) {
      const cleanedObject = Object.entries(input).reduce((acc, [key, value]) => {
        if (value === null || value === "" || value === undefined) return acc;
        acc[key] = removeEmpty(value);
        return acc;
      }, {});
      return Object.keys(cleanedObject).length > 0 ? cleanedObject : input;
    }

    return input;
  }

  const cleanParams = removeEmpty(parameters);
  const attributes = [];

  if (cleanParams.name) attributes.push(`name: "${cleanParams.name}"`);
  if (cleanParams.startCampaignAtTime) attributes.push(`startCampaignAtTime: "${cleanParams.startCampaignAtTime}"`);
  if (cleanParams.startCampaignAtDate) {
    const formatted = formatDate(cleanParams.startCampaignAtDate);
    if (formatted) attributes.push(`startCampaignAtDate: "${formatted}"`);
  }
  if (cleanParams.enrollmentDuration !== undefined)
    attributes.push(`enrollmentDuration: ${cleanParams.enrollmentDuration}`);
  if (cleanParams.enrollmentDurationType)
    attributes.push(`enrollmentDurationType: ${cleanParams.enrollmentDurationType}`);
  if (cleanParams.autoEnroll !== undefined)
    attributes.push(`autoEnroll: ${cleanParams.autoEnroll}`);
  if (cleanParams.timeZone)
    attributes.push(`timeZone: ${cleanParams.timeZone}`);

  if (Array.isArray(cleanParams.selectedContent) && cleanParams.selectedContent.length > 0) {
    const formatted = cleanParams.selectedContent.map(item => `"${item}"`).join(", ");
    attributes.push(`selectedContent: [${formatted}]`);
  }

  if (Array.isArray(cleanParams.selectedGroups) && cleanParams.selectedGroups.length > 0) {
    const formatted = cleanParams.selectedGroups.join(", ");
    attributes.push(`selectedGroups: [${formatted}]`);
  }

  if (cleanParams.allowPastDueCompletions !== undefined)
    attributes.push(`allowPastDueCompletions: ${cleanParams.allowPastDueCompletions}`);
  if (cleanParams.allowSurveys !== undefined)
    attributes.push(`allowSurveys: ${cleanParams.allowSurveys}`);
  if (cleanParams.allowSurveyComments !== undefined)
    attributes.push(`allowSurveyComments: ${cleanParams.allowSurveyComments}`);
  if (cleanParams.allUsers !== undefined)
    attributes.push(`allUsers: ${cleanParams.allUsers}`);

  if (Array.isArray(cleanParams.notifications) && cleanParams.notifications.length > 0) {
    const formattedNotifications = cleanParams.notifications
      .map(n => `{ messageType: ${n.messageType}, enabled: ${n.enabled} }`)
      .join(", ");
    attributes.push(`notifications: [${formattedNotifications}]`);
  }

  if (cleanParams.endCampaignAtTime)
    attributes.push(`endCampaignAtTime: "${cleanParams.endCampaignAtTime}"`);
  if (cleanParams.endCampaignAtDate) {
    const formatted = formatDate(cleanParams.endCampaignAtDate);
    if (formatted) attributes.push(`endCampaignAtDate: "${formatted}"`);
  }

  const mutation = `mutation trainingCampaignCreate {
    trainingCampaignCreate(
      attributes: { ${attributes.join(", ")} },
      endCampaignOption: ${cleanParams.endCampaignOption}
    ) {
      errors {
        field
        placeholders
        reason
        recordId
      }
      node {
        id
        name
        startsAt
        endsAt
        active
        status
        autoEnroll
        timeZone
        allowPastDueCompletions
        allowSurveyComments
        allUsers
        endCampaignOption
        notifications {
          messageType
          id
          enabled
        }
        updatedAt
      }
    }
  }`;

  return mutation;
}