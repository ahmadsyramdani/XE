const formatCurrency = function(num) {
  return '$' + Number(num.toFixed(2)).toLocaleString() + ' ';
}

const textTruncate = function(str, length, ending) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = '...';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
}

export default { formatCurrency, textTruncate }
