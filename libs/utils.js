"use strict";

var _ = require("lodash");
var moment = require("moment-timezone");

/**
 * Extends source dictionaries into the target dictionary
 * @param  {Object}   target        Target to extend into
 * @param  {Objects}  sources       Sources to extend from
 * @return {Object}   Returns the target
 */
module.exports.extend = function(target) {
  var sources = [].slice.call(arguments, 1);
  sources.forEach(function(source) {
    for (var prop in source) {
      target[prop] = source[prop];
    }
  });
  return target;
};

/**
 * Slices a dictionary
 * @param  {Object}   dict        Object to slice
 * @param  {Integer}  limit       Number of items to return
 * @param  {Integer}  offset      Offset to slice to (From limit)
 * @return {Object}   Sliced dictionary
 */
module.exports.sliceDictionary = function(dict, limit, offset) {
  var keys = [];

  limit = limit || -1;
  offset = offset || -1;

  for (var key in dict) {
    if (dict.hasOwnProperty(key)) {
      keys.push(key);
    }
  }

  if (limit !== -1 && offset !== -1) {
    keys = keys.slice(offset, offset + limit);
  } else if (limit !== -1) {
    keys = keys.slice(0, limit);
  } else if (offset !== -1) {
    keys = keys.slice(offset);
  }

  var slicedDict = {};

  keys.forEach(function(key) {
    slicedDict[key] = dict[key];
  });

  return slicedDict;
};

module.exports.slice = function(data, limit, offset) {
  if (Array.isArray(data)) {
    return data.slice(offset, limit + offset);
  } else {
    return this.sliceDictionary(data, limit, offset);
  }
};

module.exports.each = function(obj, cb) {
  _.each(obj, cb);
};

// Handle custom type path here
// Basically, if there is a custom path defined, throw out newPath and construct it from base
// newPath should be ./.build/<typename> so repace newPath.split('/')[2] with new thing

// Support dates in the url and the typename
// All refer to the publish date of the item
// #Y - Year Full
// #y - Year last two digits
// #m - Month number, leading zero
// #n - Month number, no leading zero
// #F - Month name full (january, october, etc)
// #M - Month short name (jan, oct, etc)
// #d - Day leading zero
// #j - Day, no leading zero
// #T - The typename (e.g. articles)
module.exports.parseCustomUrl = function(url, object) {
  var publishDate = object.publish_date ? object.publish_date : object;

  publishDate = moment(publishDate);

  function replacer(match, timeIdent, offset, string) {
    if (timeIdent === "Y") {
      return publishDate.format("YYYY").toLowerCase();
    } else if (timeIdent === "y") {
      return publishDate.format("YY").toLowerCase();
    } else if (timeIdent === "m") {
      return publishDate.format("MM").toLowerCase();
    } else if (timeIdent === "n") {
      return publishDate.format("M").toLowerCase();
    } else if (timeIdent === "F") {
      return publishDate.format("MMMM").toLowerCase();
    } else if (timeIdent === "M") {
      return publishDate.format("MMM").toLowerCase();
    } else if (timeIdent === "d") {
      return publishDate.format("DD").toLowerCase();
    } else if (timeIdent === "j") {
      return publishDate.format("D").toLowerCase();
    } else if (timeIdent === "T") {
      return object._type.toLowerCase();
    } else {
      return match;
    }
  }

  url = url.replace(/#(\w)/g, replacer);

  return url;
};

module.exports.timeComparators = function timeComparators() {
  var buildTime = moment().tz("America/New_York");

  var compareArgs = function(base_date_string, compare_date_string) {
    if (compare_date_string) {
      var base = moment(base_date_string);
      var compare = moment(compare_date_string);
    } else {
      var base = buildTime.clone();
      var compare = moment(base_date_string);
    }
    return { base: base, compare: compare };
  };

  return {
    time: buildTime.format(),
    isToday: function(base_date_string, compare_date_string) {
      var args = compareArgs(base_date_string, compare_date_string);
      return args.base.isSame(args.compare, "day");
    },
    isBefore: function(base_date_string, compare_date_string) {
      var args = compareArgs(base_date_string, compare_date_string);
      return args.base.isBefore(args.compare);
    },
    isBeforeStartOfDay: function(base_date_string, compare_date_string) {
      var args = compareArgs(base_date_string, compare_date_string);
      return args.base.startOf("day").isBefore(args.compare);
    },
    isAfter: function(base_date_string, compare_date_string) {
      var args = compareArgs(base_date_string, compare_date_string);
      return args.base.isAfter(args.compare);
    },
    isAfterEndOfDay: function(base_date_string, compare_date_string) {
      var args = compareArgs(base_date_string, compare_date_string);
      return args.base.endOf("day").isAfter(args.compare);
    },
    isBetween: function(base_date_string, start_date_string, end_date_string) {
      if (!end_date_string) {
        end_date_string = start_date_string;
        start_date_string = base_date_string;
        base_date_string = buildTime.format();
      }
      return moment(base_date_string).isBetween(
        moment(start_date_string),
        moment(end_date_string),
        null,
        "[]"
      );
    },
    isBetweenDay: function(
      base_date_string,
      start_date_string,
      end_date_string
    ) {
      if (!end_date_string) {
        end_date_string = start_date_string;
        start_date_string = base_date_string;
        base_date_string = buildTime.format();
      }
      return moment(base_date_string).isBetween(
        moment(start_date_string).startOf("day"),
        moment(end_date_string).endOf("day"),
        null,
        "[]"
      );
    }
  };
};
