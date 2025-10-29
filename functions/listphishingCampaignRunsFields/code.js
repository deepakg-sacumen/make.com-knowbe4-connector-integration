function listphishingCampaignRunsFields(parameters) {
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

    if (cleanParams.campaignId !== undefined) {
        queryParams.push(`campaignId: ${cleanParams.campaignId}`);
    }

    queryParams.push('page: 1');
    queryParams.push('per: 1000');

    const query = `query { 
    phishingCampaignRuns(${queryParams.join(', ')}) { 
      nodes { 
        aidaSelectedTemplate 
        campaign { 
          active 
          aidaSelectedTemplate 
          allUsers 
          businessDays 
          businessHoursEndHour 
          businessHoursStartHour 
          callbackPhishingGreetingTemplateTranslationUuid 
          callbackPhishingPhoneNumberRegion 
          campaignType 
          createdAt 
          emailTemplateTranslationUuid 
          frequencyPeriod 
          fullRandom 
          hideFromReports 
          id 
          isHideLocked 
          isPhishflip 
          isRecurring 
          isSeiEnabled 
          lastRunDate 
          name 
          nextRun 
          overridePhishingLanguages 
          phishingCampaignRunCount 
          rating 
          replyDomainPrefix 
          selectedGroups 
          selectedTemplateTopics 
          sendEmailAfterRun 
          sendingDuration 
          sendingDurationUnits 
          spreadEmails 
          storeFullCallbackPhoneNumber 
          storeReplyContent 
          templateSelection 
          timeZone 
          trackOutOfOfficeReplies 
          trackReplies 
          trackingDuration 
          trackingDurationUnits 
          updatedAt 
        } 
        campaignDeliveryMethods { 
          deliverableId 
          deliverableType 
          deliveryMethod 
          domain 
        } 
        campaignNonRecipientsCount 
        completedAt 
        createdAt 
        customReplyTo 
        duration 
        emailTemplateId 
        fullRandomTemplate 
        groupNames 
        groups { 
          accountId 
          accountName 
          accountNameWithDomain 
          createdAt 
          displayName 
          groupType 
          hasCampaignRuns 
          id 
          ldapObjectGuid 
          memberCount 
          name 
          riskBooster 
          riskScore 
          status 
          updatedAt 
          userPhishingLocales 
        } 
        id 
        landingPage { 
          contentHtml 
          createdAt 
          id 
          markedAsUpdatedAt 
          previewUrl 
          slug 
          title 
          type 
          updatedAt 
          url 
        } 
        landingPagePreview 
        output 
        phishDomain 
        phishPronePercentage 
        phishingTemplate { 
          archived 
          attachmentFilename 
          attachmentType 
          contentHtml 
          createdAt 
          excluded 
          from 
          fromDisplayName 
          hidden 
          id 
          isAida 
          landingDomainId 
          landingPageId 
          languageCode 
          name 
          rating 
          replyTo 
          replyToDisplayName 
          subject 
          templateTranslationUuid 
          type 
          updatedAt 
        } 
        replyDomainPrefix 
        replyPhishDomainId 
        scheduledCount 
        sendingDuration 
        startedAt 
        status 
        storeReplyContent 
        updatedAt 
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
