export class orderStatus {
  static pending = 0;
  static processing = 2;

  static delivered = 6;
  static cancelledFromClient = 7;
  static returned = 9;
  static refunded = 10;
  static cancelledFromSupplier = 11;
}
