const mysql = require('mysql2/promise');

const data = `DEEP NARAYAN 2502010005 deep.narayan.som25@pwioi.com
ISHAN SARODE 2502010015 ishan.sarode.som25@pwioi.com
KAPIL KUMAR 2502010008 kapil.kumar.som25@pwioi.com
HEET DESAI 2502010003 heet.desai.som25@pwioi.com
SATWIKK 2502010012 satwikk.som25@pwioi.com
HARSHIT CHAND 2502010014 harshit.chand.som25@pwioi.com
PREKSHA JAIN 2502010018 preksha.jain.som25@pwioi.com
HIMESH BHOWMIK 2502010002 himesh.bhowmik.som25@pwioi.com
SHANKAR PARMESHWAR YEMLE 2502010007 shankar.yemle.som25@pwioi.com
AADITYA AGRAWAL 2502010017 aaditya.agrawal.som25@pwioi.com
RAMIJ MANDAL 2502010016 ramij.mandal.som25@pwioi.com
SUJOY DEY 2502010010 sujoy.dey.som25@pwioi.com
HIMANSHU KARMAKAR 2502010006 himanshu.karmakar.som25@pwioi.com
MD ZEESHAN HUSSAIN 2502010001 md.hussain.som25@pwioi.com
NISHKARSH MAURYA 2502010011 nishkarsh.maurya.som25@pwioi.com
NITIN CHAUDHARY 2502010013 nitin.chaudhary.som25@pwioi.com
ABHIRAJ MISHRA 2502010004 abhiraj.mishra.som25@pwioi.com
PRATYUSH PRADHAN 2502010009 pratyush.pradhan.som25@pwioi.com`;

async function main() {
    const connection = await mysql.createConnection({
        host: '34.63.32.231',
        user: 'root',
        password: 'library_root_password',
        database: 'library_management_system'
    });

    const lines = data.split('\n');
    let insertedCount = 0;

    const [rows] = await connection.query('SELECT MAX(memb_id) as maxId FROM Member');
    let maxId = rows[0].maxId || 0;

    for (const line of lines) {
        if (!line.trim()) continue;
        const match = line.match(/^(.+?)\s+(\d{10})\s+(\S+@pwioi\.com)$/);
        if (match) {
            maxId++;
            const name = match[1].trim();
            const enrollId = match[2];
            const address = `pwioi bangalore, ${enrollId}`;
            const memb_type = 'Student';
            const memb_date = new Date().toISOString().split('T')[0];
            const expiry_date = new Date();
            expiry_date.setFullYear(expiry_date.getFullYear() + 1);
            const formattedExpiry = expiry_date.toISOString().split('T')[0];

            await connection.query(
                'INSERT INTO Member (memb_id, name, address, memb_type, memb_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?)',
                [maxId, name, address, memb_type, memb_date, formattedExpiry]
            );
            insertedCount++;
        }
    }
    
    console.log(`Successfully imported ${insertedCount} members.`);
    await connection.end();
}

main().catch(console.error);
