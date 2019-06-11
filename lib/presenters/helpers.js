const getNativeBoolean = booleanString => getNativeInteger(booleanString) === 1;

const getNativeDate = timeString => {
  const matches = timeString.match(
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
  );

  if (!matches) throw new Error("Not a date string");

  const [year, month, day, hour, min, sec] = matches
    .slice(1)
    .map(value => parseInt(value, 10));

  return new Date(year, month - 1, day, hour, min, sec);
};

const getNativeFloat = floatString => parseFloat(floatString);

const getNativeInteger = integerString => parseInt(integerString, 10);

module.exports = {
  getNativeBoolean,
  getNativeDate,
  getNativeFloat,
  getNativeInteger
};
