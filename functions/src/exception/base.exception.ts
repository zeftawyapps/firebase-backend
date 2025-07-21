export class BaseException extends Error {
  apiStatusCode: string;
  httpStatusCode: number;
  message: string;
  devMessage: string;
  translateMessage: boolean;

  constructor(
    message: string,
    apiStatusCode: string,
    httpStatusCode: number,
    devMessage: string,
    translateMessage: boolean
  ) {
    super(message);
    this.apiStatusCode = apiStatusCode;
    this.httpStatusCode = httpStatusCode;
    this.message = message;
    this.devMessage = devMessage;
    this.translateMessage = translateMessage;
  }
}
