//wmocode relative table
exports.c_w = function change_weathercode(code){
  let weather;
    switch(code){
      case 0:
        weather = "快晴";
      break;
      case 1:
        weather = "晴れ";
      break;
      case 2:
        weather = "晴れ所により曇り";
      break;
      case 3:
        weather = "曇り";
      break;
      case 45:
        weather = "霧";
      break;
      case 48:
        weather = "白霜";
      break;
      case 51:
        weather = "軽い霧雨";
      break;
      case 53:
        weather = "霧雨";
      break;
      case 55:
        weather = "濃い霧雨";
      break;
      case 56:
        weather = "軽い着氷性の霧雨";
      break;
      case 57:
        weather = "濃い着氷性の霧雨";
      break;
      case 61:
        weather = "わずかな雨";
      break;
      case 63:
        weather = "雨";
      break;
      case 65:
        weather = "激しい雨";
      break;
      case 66:
        weather = "軽い雨氷";
      break;
      case 67:
        weather = "雨氷";
      break;
      case 71:
        weather = "わずかな雪";
      break;
      case 73:
        weather = "雪";
      break;
      case 75:
        weather = "大雪";
      break;
      case 77:
        weather = "霧雪";
      break;
      case 80:
        weather = "わずかなにわか雨";
      break;
      case 81:
        weather = "にわか雨";
      break;
      case 82:
        weather = "激しいにわか雨";
      break;
      case 85:
        weather = "軽いにわか雪";
      break;
      case 86:
        weather = "重いにわか雪";
      break;
      case 95:
        weather = "雷雨";
      break;
      case 96:
        weather = "わずかな雹";
      break;
      case 99:
        weather = "激しい雹を伴う雷雨";
      break;
      default:
        weather = "WMOコード"+code;
    }
  return weather;
}