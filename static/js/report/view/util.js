class UtilClass {

    constructor() {

    }

    truncStringPortion(str, firstCharCount = str.length, endCharCount = 0, dotCount = 3) {
        if (str.length <= 80) {
            return str;
        }
        var convertedStr = "";
        convertedStr += str.substring(0, firstCharCount);
        convertedStr += ".".repeat(dotCount);
        convertedStr += str.substring(str.length - endCharCount, str.length);
        return convertedStr;
    }


    number_format(val) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
}