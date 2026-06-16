const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.ycz9fbs.mongodb.net",
  (err, addresses) => {
    console.log("ERROR:", err);
    console.log("ADDRESSES:", addresses);
  }
);