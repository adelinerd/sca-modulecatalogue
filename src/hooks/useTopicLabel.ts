/*
 * Modulbibliothek
 *
 * Copyright (c) 2026 Fraunhofer IESE, Adeline Silva Schäfer
 *
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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
