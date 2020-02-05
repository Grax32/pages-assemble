const getRegex = (pattern: string, charlist: string): RegExp =>
  new RegExp(pattern.replace('charlist', charlist || 's'));

export default class StringUtility {
  public static trimRight(value: string, charlist: string) {
    return value.replace(getRegex('[charlist]+$', charlist), '');
  }

  public static trimLeft(value: string, charlist: string) {
    return value.replace(getRegex('^[charlist]+', charlist), '');
  }

  public static trim(value: string, charlist: string) {
    return StringUtility.trimRight(
        StringUtility.trimLeft(
            value, 
            charlist), 
        charlist);
  }
}
