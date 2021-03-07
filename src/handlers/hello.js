'use strict';

module.exports.sayHello = async function (context) {
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: process.env,
  };
};
