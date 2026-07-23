export class GenerateIdUtils {
  public static uniqueId() {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 10000);
    const uniqueId = `${timestamp}${randomNum}`;
    return uniqueId;
  }
}
