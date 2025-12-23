/**
 * Standard API Response Handler
 * Ensures consistent response format across all endpoints
 */

class ResponseHandler {
  /**
   * Send success response
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      message
    });
  }

  /**
   * Send error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {*} data - Additional error data (optional)
   */
  static error(res, message = 'Internal Server Error', statusCode = 500, data = null) {
    return res.status(statusCode).json({
      success: false,
      data,
      message
    });
  }

  /**
   * Send validation error response
   * @param {Object} res - Express response object
   * @param {*} errors - Validation errors
   * @param {string} message - Error message
   */
  static validationError(res, errors, message = 'Validation Error') {
    return res.status(400).json({
      success: false,
      data: errors,
      message
    });
  }

  /**
   * Send not found response
   * @param {Object} res - Express response object
   * @param {string} message - Not found message
   */
  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      data: null,
      message
    });
  }

  /**
   * Send unauthorized response
   * @param {Object} res - Express response object
   * @param {string} message - Unauthorized message
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return res.status(401).json({
      success: false,
      data: null,
      message
    });
  }

  /**
   * Send forbidden response
   * @param {Object} res - Express response object
   * @param {string} message - Forbidden message
   */
  static forbidden(res, message = 'Forbidden') {
    return res.status(403).json({
      success: false,
      data: null,
      message
    });
  }
}

module.exports = ResponseHandler;
