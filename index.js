#!/usr/bin/env node

var fs = require("fs");
var totp = require("notp").totp;
var URL = require("url");
var qs = require("qs-lite");
var Base32 = require("hi-base32");

function CLI(otpauth) {
  var prev;
  next();

  function next() {
    var s = gen(otpauth);
    if (s !== prev) console.log(s);
    prev = s;
    setTimeout(next, 1);
  }
}

CLI(process.argv[2]);

/**
 * @param {String} URL
 * @returns {String} TOTP: Time-based One-Time Password
 */

function gen(otpauth) {
  if (!otpauth) {
    console.warn("Usage: totp otpauth://totp/...."); 
    return process.exit(1);
  }

  if (otpauth.indexOf("otpauth://") < 0) {
    otpauth = fs.readFileSync(otpauth, "utf-8");
  }

  var url = URL.parse(otpauth);
  var query = qs.parse(url.query);
  var secret = Base32.decode.asBytes(query.secret);
  return totp.gen(secret);
}
