/**
 * Authority Scoring Service
 * 
 * This service implements the Allie search algorithm's authority scoring system
 * to evaluate the credibility and quality of information sources.
 */

// Known authoritative domain data (sample)
const KNOWN_DOMAINS = {
  // Government domains
  '.gov': { baseScore: 40, category: 'regulatory' },
  '.gov.uk': { baseScore: 40, category: 'regulatory' },
  '.gc.ca': { baseScore: 38, category: 'regulatory' },
  
  // Educational domains
  '.edu': { baseScore: 38, category: 'academic' },
  '.ac.uk': { baseScore: 37, category: 'academic' },
  
  // Organizations
  '.org': { baseScore: 32, category: 'industry' },
  '.int': { baseScore: 34, category: 'regulatory' },
  '.io': { baseScore: 25, category: 'technology' },
  
  // Commercial
  '.com': { baseScore: 22, category: 'market' },
  '.co': { baseScore: 20, category: 'market' },
  '.net': { baseScore: 20, category: 'technology' },
  
  // Other
  '.info': { baseScore: 15, category: 'news' },
  '.biz': { baseScore: 15, category: 'market' },
};

// Known publisher reputation scores (sample)
const PUBLISHER_SCORES = {
  'nature.com': 38,
  'science.org': 37,
  'frontiersin.org': 34,
  'sciencedirect.com': 34,
  'springer.com': 33,
  'ieee.org': 35,
  'acm.org': 35,
  'wiley.com': 32,
  'nber.org': 33,
  'ssrn.com': 30,
  'brookings.edu': 33,
  'worldbank.org': 35,
  'bis.org': 35,
  'imf.org': 36,
  'oecd.org': 36,
  'who.int': 37,
  'un.org': 36,
  'europa.eu': 37,
  'gartner.com': 31,
  'forrester.com': 31,
  'mckinsey.com': 32,
  'bcg.com': 31,
  'deloitte.com': 30,
  'pwc.com': 30,
  'kpmg.com': 30,
  'economist.com': 33,
  'ft.com': 31,
  'reuters.com': 30,
  'bloomberg.com': 30,
  'wsj.com': 28,
  'nytimes.com': 27,
  'washingtonpost.com': 27,
  'medium.com': 15,
  'wordpress.com': 10,
  'blogspot.com': 7,
};

/**
 * Calculate the authority score for a source
 * 
 * The authority score combines domain reputation, content quality,
 * publisher credibility, and user-defined trust preferences.
 * 
 * @param {Object} source - The source object to evaluate
 * @param {Object} userPreferences - User trust preferences
 * @returns {Object} - Authority score details
 */
export const calculateAuthorityScore = (source, userPreferences = {}) => {
  // Initialize score components
  const scoreComponents = {
    domainScore: 0,
    publisherScore: 0,
    contentScore: 0,
    total: 0
  };
  
  try {
    // Calculate domain score (40% of total)
    scoreComponents.domainScore = calculateDomainScore(source.url, userPreferences);
    
    // Calculate publisher score (30% of total)
    scoreComponents.publisherScore = calculatePublisherScore(source);
    
    // Calculate content quality score (30% of total)
    scoreComponents.contentScore = calculateContentScore(source);
    
    // Calculate total score (weighted sum)
    scoreComponents.total = Math.round(
      (scoreComponents.domainScore * 0.4) + 
      (scoreComponents.publisherScore * 0.3) + 
      (scoreComponents.contentScore * 0.3)
    );
    
    // Determine source type based on domain
    const sourceType = determineSourceType(source.url, source.sourceType);
    
    return {
      authorityScore: scoreComponents.total,
      components: scoreComponents,
      sourceType,
      evaluatedAt: new Date()
    };
  } catch (error) {
    console.error('Error calculating authority score:', error);
    
    // Return a default score in case of error
    return {
      authorityScore: 50,
      components: scoreComponents,
      sourceType: 'unknown',
      evaluatedAt: new Date(),
      error: error.message
    };
  }
};

/**
 * Calculate the domain-based score component
 * 
 * @param {string} url - The URL to evaluate
 * @param {Object} userPreferences - User trust preferences
 * @returns {number} - Domain score (0-40)
 */
const calculateDomainScore = (url, userPreferences = {}) => {
  if (!url) return 20; // Default score for missing URL
  
  try {
    // Extract domain
    const domain = extractDomain(url);
    
    // Check if domain is in user trusted/untrusted lists
    if (userPreferences.trustedDomains) {
      const userTrustSetting = userPreferences.trustedDomains.find(
        d => domain.includes(d.domain)
      );
      
      if (userTrustSetting) {
        if (userTrustSetting.trust === 'trusted') {
          return 40; // Maximum score for user-trusted domain
        } else if (userTrustSetting.trust === 'untrusted') {
          return 5; // Minimum score for user-untrusted domain
        }
      }
    }
    
    // Check against known domains
    for (const [tld, data] of Object.entries(KNOWN_DOMAINS)) {
      if (domain.endsWith(tld)) {
        return data.baseScore;
      }
    }
    
    // Check against known publishers
    for (const [publisherDomain, score] of Object.entries(PUBLISHER_SCORES)) {
      if (domain.includes(publisherDomain)) {
        return Math.min(score, 40); // Cap at 40
      }
    }
    
    // Default score for unknown domains
    return 20;
  } catch (error) {
    console.error('Error calculating domain score:', error);
    return 20; // Default score on error
  }
};

/**
 * Calculate the publisher reputation score component
 * 
 * @param {Object} source - The source object to evaluate
 * @returns {number} - Publisher score (0-30)
 */
const calculatePublisherScore = (source) => {
  let score = 0;
  
  // Based on publisher if available
  if (source.publisher) {
    const publisherDomain = extractDomain(source.publisher.toLowerCase());
    
    for (const [domain, domainScore] of Object.entries(PUBLISHER_SCORES)) {
      if (publisherDomain.includes(domain)) {
        score = Math.min(domainScore * 0.75, 30); // Scale to 0-30 range
        break;
      }
    }
  }
  
  // Add points for citation count if available
  if (source.citationCount) {
    const citationPoints = Math.min(source.citationCount / 10, 10);
    score += citationPoints;
  }
  
  // Add points for author credentials if available
  if (source.hasAuthorCredentials) {
    score += 5;
  }
  
  // Add points for publication date (recency)
  if (source.publishedAt) {
    const ageInDays = calculateAgeInDays(source.publishedAt);
    
    if (ageInDays < 30) { // Less than a month old
      score += 5;
    } else if (ageInDays < 365) { // Less than a year old
      score += 3;
    }
  }
  
  return Math.min(score, 30); // Cap at 30
};

/**
 * Calculate the content quality score component
 * 
 * @param {Object} source - The source object to evaluate
 * @returns {number} - Content quality score (0-30)
 */
const calculateContentScore = (source) => {
  let score = 0;
  
  // Text length (0-10 points)
  if (source.contentLength) {
    if (source.contentLength > 5000) {
      score += 10;
    } else if (source.contentLength > 2000) {
      score += 7;
    } else if (source.contentLength > 1000) {
      score += 5;
    } else if (source.contentLength > 500) {
      score += 3;
    } else {
      score += 1;
    }
  } else {
    score += 5; // Default if length unknown
  }
  
  // References (0-10 points)
  if (source.referenceCount) {
    score += Math.min(source.referenceCount, 10);
  } else if (source.hasReferences) {
    score += 5;
  }
  
  // Data presence (0-10 points)
  if (source.hasDataTables) {
    score += 4;
  }
  if (source.hasCharts) {
    score += 3;
  }
  if (source.hasStatistics) {
    score += 3;
  }
  
  return Math.min(score, 30); // Cap at 30
};

/**
 * Determine the source type based on domain and metadata
 * 
 * @param {string} url - The URL to evaluate
 * @param {string} providedType - Type provided in the source data
 * @returns {string} - Source type category
 */
const determineSourceType = (url, providedType = null) => {
  // Use provided type if available
  if (providedType) {
    return providedType;
  }
  
  if (!url) return 'unknown';
  
  try {
    const domain = extractDomain(url);
    
    // Check against known domains
    for (const [tld, data] of Object.entries(KNOWN_DOMAINS)) {
      if (domain.endsWith(tld) && data.category) {
        return data.category;
      }
    }
    
    // Check for common domains
    if (domain.includes('news') || domain.includes('media')) {
      return 'news';
    }
    
    if (domain.includes('journal') || domain.includes('research')) {
      return 'academic';
    }
    
    if (domain.includes('institute') || domain.includes('association')) {
      return 'industry';
    }
    
    // Default to 'unknown'
    return 'unknown';
  } catch (error) {
    return 'unknown';
  }
};

/**
 * Helper to extract domain from URL
 * 
 * @param {string} url - URL to process
 * @returns {string} - Extracted domain
 */
const extractDomain = (url) => {
  try {
    // If url is already a domain without protocol, just return it
    if (!url.includes('://') && !url.includes('www.')) {
      return url.toLowerCase();
    }
    
    // Otherwise extract domain from URL
    let domain = url.toLowerCase();
    
    // Remove protocol
    if (domain.includes('://')) {
      domain = domain.split('://')[1];
    }
    
    // Remove path and query
    if (domain.includes('/')) {
      domain = domain.split('/')[0];
    }
    
    // Remove www.
    if (domain.startsWith('www.')) {
      domain = domain.substring(4);
    }
    
    return domain;
  } catch (error) {
    console.error('Error extracting domain:', error);
    return url.toLowerCase();
  }
};

/**
 * Calculate age in days from date string or timestamp
 * 
 * @param {string|Date} date - Date to calculate age from
 * @returns {number} - Age in days
 */
const calculateAgeInDays = (date) => {
  try {
    const publishDate = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = now - publishDate;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch (error) {
    return 0;
  }
};

/**
 * Determines if a URL should be excluded based on user preferences
 * 
 * @param {string} url - URL to check
 * @param {Object} userPreferences - User preferences including excluded domains
 * @returns {boolean} - True if URL should be excluded
 */
export const shouldExcludeUrl = (url, userPreferences = {}) => {
  if (!url || !userPreferences.trustedDomains) return false;
  
  const domain = extractDomain(url);
  
  return userPreferences.trustedDomains.some(
    d => domain.includes(d.domain) && d.trust === 'untrusted'
  );
};

/**
 * Batch process multiple sources
 * 
 * @param {Array} sources - Array of sources to score
 * @param {Object} userPreferences - User preferences for scoring
 * @returns {Array} - Array of sources with authority scores
 */
export const batchProcessSources = (sources, userPreferences = {}) => {
  return sources.map(source => {
    const authorityData = calculateAuthorityScore(source, userPreferences);
    return {
      ...source,
      authorityScore: authorityData.authorityScore,
      authorityComponents: authorityData.components,
      sourceType: authorityData.sourceType
    };
  });
};

export default {
  calculateAuthorityScore,
  shouldExcludeUrl,
  batchProcessSources
};