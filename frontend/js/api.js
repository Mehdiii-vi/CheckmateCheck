/**
 * CheckmateCheck - API Service
 */

const ChessAPI = {
  async analyze(matrix) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ANALYZE_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ matrix })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error('API Error during analysis:', err);
      throw err;
    }
  },

  async getPresets() {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.PRESETS_ENDPOINT}`);
      if (!response.ok) {
        throw new Error(`Failed to load presets: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error('API Error fetching presets:', err);
      throw err;
    }
  },

  async checkHealth() {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.HEALTH_ENDPOINT}`);
      return res.ok;
    } catch {
      return false;
    }
  }
};
