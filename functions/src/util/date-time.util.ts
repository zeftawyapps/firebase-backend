import moment = require("moment");
import { firestore } from "firebase-admin";

export default class DateTimeUtil {
  static format(
    time: any,
    format: string | null = "YYYY-MM-DD HH:mm a"
  ): string | moment.Moment {
    if (format) {
      return moment.utc(time).format(format);
    }
    return moment.utc(time);
  }

  static getCurrentDate() {
    return moment.utc();
  }

  static getDateStartEnd(date: any) {
    return {
      start: moment.utc(date).startOf("day").toDate(),
      end: moment.utc(date).endOf("day").toDate(),
    };
  }

  static convertToDate(date: string) {
    return moment.utc(date);
  }

  static convertFirebaseFormatToDate(firebaseDate: any) {
    return new firestore.Timestamp(
      firebaseDate.seconds,
      firebaseDate.nanoseconds
    );
  }

  static getNowFromFirebaseFormatDate(firebaseDate: any) {
    return firestore.Timestamp.now();
  }

  static getCurrentDateWithZeroHoursMins(dateTime: any) {
    const time = moment.utc(dateTime).toDate();
    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);
    return time;
  }

  static isLessThanOrEqual(date1: any, date2: any) {
    const d1 = moment.utc(date1).toDate();
    const d2 = moment.utc(date2).toDate();
    return new Date(d1) > new Date(d2);
  }

  static getDateDeference(date1: any, date2: any) {
    const d1 = moment.utc(date1).toDate();
    const d2 = moment.utc(date2).toDate();
    return new Date(d2).getTime() - new Date(d1).getTime();
  }

  static getDateDeferenceHours(date1: Date, date2: Date) {
    const diff = date1.getTime() - date2.getTime();
    const diffInHours = diff / 1000 / 60 / 60;
    return diffInHours;
  }
}
