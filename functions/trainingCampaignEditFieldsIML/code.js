function trainingCampaignEditFieldsIML(parameters) {
  const paramObject = Array.isArray(parameters) ? parameters[0] : parameters;
  function formatDate(value) {
    const date = new Date(value);
    if (isNaN(date)) return null;
    return date.toISOString().split('T')[0];
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
  const cleanParams = removeEmpty(paramObject);

  if (!cleanParams.id) {
    throw new Error("`id` is required for trainingCampaignEdit mutation.");
  }
  if (!cleanParams.notifications && cleanParams.messageType && cleanParams.notificationID !== undefined) {
    cleanParams.notifications = [{
      messageType: cleanParams.messageType,
      enabled: cleanParams.enabled,
      id: cleanParams.notificationID
    }];
  }
  const attributes = [];

  if (cleanParams.name) attributes.push(`name: "${cleanParams.name}"`);
  if (cleanParams.startCampaignAtTime) attributes.push(`startCampaignAtTime: "${cleanParams.startCampaignAtTime}"`);
  if (cleanParams.startCampaignAtDate) {
    const formatted = formatDate(cleanParams.startCampaignAtDate);
    if (formatted) attributes.push(`startCampaignAtDate: "${formatted}"`);
  }
  if (cleanParams.endCampaignAtTime) attributes.push(`endCampaignAtTime: "${cleanParams.endCampaignAtTime}"`);
  if (cleanParams.endCampaignAtDate) {
    const formatted = formatDate(cleanParams.endCampaignAtDate);
    if (formatted) attributes.push(`endCampaignAtDate: "${formatted}"`);
  }
  if (cleanParams.autoEnroll !== undefined) attributes.push(`autoEnroll: ${cleanParams.autoEnroll}`);
  if (cleanParams.enrollmentDuration !== undefined) attributes.push(`enrollmentDuration: ${cleanParams.enrollmentDuration}`);
  if (cleanParams.enrollmentDurationType) attributes.push(`enrollmentDurationType: ${cleanParams.enrollmentDurationType}`);
  if (cleanParams.timeZone) attributes.push(`timeZone: ${cleanParams.timeZone}`);
  if (cleanParams.allowPastDueCompletions !== undefined) attributes.push(`allowPastDueCompletions: ${cleanParams.allowPastDueCompletions}`);
  if (cleanParams.allowSurveys !== undefined) attributes.push(`allowSurveys: ${cleanParams.allowSurveys}`);
  if (cleanParams.allowSurveyComments !== undefined) attributes.push(`allowSurveyComments: ${cleanParams.allowSurveyComments}`);
  if (cleanParams.allUsers !== undefined) attributes.push(`allUsers: ${cleanParams.allUsers}`);

  if (Array.isArray(cleanParams.selectedGroups) && cleanParams.selectedGroups.length > 0) {
    const formattedGroups = cleanParams.selectedGroups.join(', ');
    attributes.push(`selectedGroups: [${formattedGroups}]`);
  }

  if (Array.isArray(cleanParams.selectedContent) && cleanParams.selectedContent.length > 0) {
    const formattedContent = cleanParams.selectedContent.map(item => `"${item}"`).join(', ');
    attributes.push(`selectedContent: [${formattedContent}]`);
  }

  if (Array.isArray(cleanParams.notifications) && cleanParams.notifications.length > 0) {
    const formattedNotifications = cleanParams.notifications.map(n => {
      const fields = [`messageType: ${n.messageType}`, `enabled: ${n.enabled}`];
      if (n.notificationID !== undefined) {
        fields.push(`id: ${n.notificationID}`);
      } else if (n.id !== undefined) {
        fields.push(`id: ${n.id}`);
      }
      return `{ ${fields.join(", ")} }`;
    }).join(', ');
    attributes.push(`notifications: [${formattedNotifications}]`);
  }

  const mutation = `mutation TrainingCampaignEdit {
    trainingCampaignEdit(
      id: ${cleanParams.id},
      attributes: {
        ${attributes.join(',\n        ')}
      },
      endCampaignOption: ${cleanParams.endCampaignOption}
    ) {
      errors { field placeholders reason recordId }
      node {
        id
        name
        startsAt
        endsAt
        active
        status
        autoEnroll
        timeZone
        groups {
          displayName
          groupType
          id
          memberCount
          name
          riskBooster
          riskScore
          status
        }
        allowPastDueCompletions
        allowSurveyComments
        allUsers
        endCampaignOption
        updatedAt
        enrollmentDuration
        enrollmentDurationType
        notifications {
          id
          messageType
          enabled
        }
      }
    }
  }`;

  return mutation;
}
