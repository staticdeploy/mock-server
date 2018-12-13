/*
 *  Code taken from webpack-dev-server and adapted to mock-server's needs
 */
const del = require("del");
const { existsSync, readFileSync, statSync, writeFileSync } = require("fs");
const { join } = require("path");
const selfsigned = require("selfsigned");

// Generates a self-signed certificate, cycled every 30 days
module.exports = function getCert() {
    const certPath = join(__dirname, "../ssl/server-cert.pem");
    const keyPath = join(__dirname, "../ssl/server-key.pem");
    let certExists = existsSync(certPath);

    // If certificate exists, ensure it's not older than 30 days, otherwise
    // delete it
    if (certExists) {
        const certStat = statSync(certPath);
        const certTtl = 1000 * 60 * 60 * 24;
        const now = new Date();
        if ((now - certStat.ctime) / certTtl > 30) {
            del.sync([certPath, keyPath], { force: true });
            certExists = false;
        }
    }

    // If certificate doesn't exist, generate it
    if (!certExists) {
        const attrs = [{ name: "commonName", value: "localhost" }];
        const pems = selfsigned.generate(attrs, {
            algorithm: "sha256",
            days: 30,
            keySize: 2048,
            extensions: [
                { name: "basicConstraints", cA: true },
                {
                    name: "keyUsage",
                    keyCertSign: true,
                    digitalSignature: true,
                    nonRepudiation: true,
                    keyEncipherment: true,
                    dataEncipherment: true
                },
                {
                    name: "subjectAltName",
                    altNames: [
                        // type 2 is DNS
                        { type: 2, value: "localhost" },
                        { type: 2, value: "localhost.localdomain" },
                        { type: 2, value: "lvh.me" },
                        { type: 2, value: "*.lvh.me" },
                        { type: 2, value: "[::1]" },
                        // type 7 is IP
                        { type: 7, ip: "127.0.0.1" },
                        { type: 7, ip: "fe80::1" }
                    ]
                }
            ]
        });
        writeFileSync(certPath, pems.cert);
        writeFileSync(keyPath, pems.private);
    }

    return {
        cert: readFileSync(certPath),
        key: readFileSync(keyPath)
    };
};
