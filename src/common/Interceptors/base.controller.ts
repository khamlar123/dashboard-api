// base.controller.ts
export class BaseController {
  formatResponse(data: any, message?: string, status = 'success') {
    return {
      message: message || 'Success',
      data,
      status,
    };
  }
}
