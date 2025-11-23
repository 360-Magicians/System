/**
 * 360 Magicians SDK
 * A JavaScript SDK for the 360 Magicians API, designed with accessibility in mind
 * for the DEAF FIRST platform.
 */

class MagiciansSDK {
  /**
   * Initialize the SDK with configuration options
   * @param {Object} config - Configuration object
   * @param {string} config.baseUrl - Base URL for the API
   * @param {string} config.apiToken - JWT authentication token
   */
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:8080/api';
    this.apiToken = config.apiToken || '';
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (this.apiToken) {
      this.headers['Authorization'] = `Bearer ${this.apiToken}`;
    }
  }

  /**
   * Set the authentication token
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    this.apiToken = token;
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Make an HTTP request to the API
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
   * @param {Object} data - Request data (for POST, PUT methods)
   * @returns {Promise} - Promise resolving to response data
   */
  async request(endpoint, method = 'GET', data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: this.headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      // Only parse JSON if there's content to parse
      if (response.status !== 204) {
        return await response.json();  
      }
      
      return true;
    } catch (error) {
      console.error('SDK request error:', error);
      throw error;
    }
  }

  // ======= Awareness API Methods =======

  /**
   * Get awareness and outreach information
   * @returns {Promise<AwarenessResponse>}
   */
  async getAwareness() {
    return this.request('/awareness');
  }

  // ======= Jobs API Methods =======

  /**
   * Get job placement services
   * @returns {Promise<JobPlacementResponse>}
   */
  async getJobPlacement() {
    return this.request('/job-placement');
  }

  /**
   * Submit a job application
   * @param {JobApplication} application - Job application data
   * @returns {Promise<boolean>} - Success indicator
   */
  async submitJobApplication(application) {
    return this.request('/job-placement', 'POST', application);
  }

  // ======= Business API Methods =======

  /**
   * Get business mentorship programs
   * @param {string} type - Type of mentorship (startup, growth, established)
   * @returns {Promise<MentorshipResponse>}
   */
  async getBusinessMentorship(type = null) {
    const endpoint = type ? `/business-mentorship?type=${type}` : '/business-mentorship';
    return this.request(endpoint);
  }

  // ======= Accessibility API Methods =======

  /**
   * Update accessibility preferences
   * @param {AccessibilityPreferences} preferences - User accessibility preferences
   * @returns {Promise<boolean>} - Success indicator
   */
  async updateAccessibilityPreferences(preferences) {
    return this.request('/accessibility-preferences', 'PUT', preferences);
  }
}

// ======= Type Definitions (for reference) =======

/**
 * @typedef {Object} AwarenessResponse
 * @property {string} objective
 * @property {string[]} activities
 */

/**
 * @typedef {Object} JobPlacementResponse
 * @property {JobOpportunity[]} opportunities
 */

/**
 * @typedef {Object} JobOpportunity
 * @property {string} id - UUID
 * @property {string} title
 * @property {string} company
 * @property {string} location
 * @property {boolean} isRemote
 * @property {string[]} accessibilityFeatures
 */

/**
 * @typedef {Object} JobApplication
 * @property {string} jobId - UUID
 * @property {string} applicantId - UUID
 * @property {string} resume - URI
 * @property {string} coverLetter
 */

/**
 * @typedef {Object} MentorshipResponse
 * @property {MentorshipProgram[]} programs
 */

/**
 * @typedef {Object} MentorshipProgram
 * @property {string} id - UUID
 * @property {string} name
 * @property {string} description
 * @property {('startup'|'growth'|'established')} type
 * @property {string} duration
 */

/**
 * @typedef {Object} AccessibilityPreferences
 * @property {string} userId - UUID
 * @property {('sign-language'|'text'|'audio')} communicationPreference
 * @property {boolean} pinksyncEnabled
 * @property {string[]} assistiveTechnologies
 * @property {Object} notificationSettings
 * @property {boolean} notificationSettings.visual
 * @property {boolean} notificationSettings.haptic
 * @property {boolean} notificationSettings.audio
 */

// Export the SDK
export default MagiciansSDK;