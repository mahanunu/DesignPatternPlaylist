export type NotificationType =
  | "success"
  | "error"
  | "info";

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
};

export class NotificationFactory {

  static success(message: string): Notification {
    return {
      id: crypto.randomUUID(),
      type: "success",
      message
    };
  }

  static error(message: string): Notification {
    return {
      id: crypto.randomUUID(),
      type: "error",
      message
    };
  }

  static info(message: string): Notification {
    return {
      id: crypto.randomUUID(),
      type: "info",
      message
    };
  }
}