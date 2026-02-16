import { useTranslation } from 'react-i18next';

/**
 * Hook to get the translated label for a topic
 * @param topic - The topic enum value (e.g., "veranstaltungskalender")
 * @returns The translated topic label or the original topic if no translation exists
 */
export const useTopicLabel = (topic: string | undefined): string => {
  const { t } = useTranslation();

  if (!topic) {
    return '';
  }

  // Try to get the translation for the topic
  const translationKey = `topics.${topic}`;
  const translatedLabel = t(translationKey);

  // If the translation key is returned as-is, it means no translation was found
  // In that case, return the original topic with first letter capitalized
  if (translatedLabel === translationKey) {
    return topic.charAt(0).toUpperCase() + topic.slice(1);
  }

  return translatedLabel;
};
