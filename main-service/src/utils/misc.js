const _get = require('lodash/get');

function endpointResponse(response) {
  const error = _get(response, 'error')
    ? { error: _get(response, 'error') }
    : {};
  const errorMessgae = _get(response, 'errorMessage')
    ? { errorMessgae: _get(response, 'errorMessage') }
    : {};
  const message = _get(response, 'message')
    ? { message: _get(response, 'message') }
    : {};
  const code = _get(response, 'code') ? { code: _get(response, 'code') } : {};
  return {
    ...error,
    ...errorMessgae,
    ...message,
    ...code
  };
}

module.exports = {
  endpointResponse
};
