
export function mockRequest(user = null) {
  return {
    user: user || { id: 1, email: "mockuser@armanfit.com", role: "user" }
  };
}

export function mockResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };
}
