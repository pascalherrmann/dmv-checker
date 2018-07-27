function formatDate(date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const minutes = date.getMinutes();
  const minutesString = minutes < 10 ? `0${minutes}` : minutes;

  const dateString = `${
    months[date.getMonth()]
  } ${date.getDate()} ${date.getFullYear()}, ${date.getHours()}:${minutesString}`;
  return dateString;
}

module.exports.formatDate = formatDate;
