const mysql = require('mysql2/promise');

const data = `GUDEPU KIRANDEEP 2501010050 gudepu.kirandeep.sot25@pwioi.com
SARTHAK GUPTA 2501010139 sarthak.gupta.sot25@pwioi.com
BHUMIKA 2501010044 bhumika.sot25@pwioi.com
SHUBHADITYA 2501010020 shubhaditya.sot25@pwioi.com
GAURAVI ROY 2501010049 gauravi.roy.sot25@pwioi.com
SOUMYADEEP CHAKRABORTY 2501010021 soumyadeep.chakraborty.sot25@pwioi.com
SAI ADITYA SAHANI ADITYA SAHANI 2501010083 sai.sahani.sot25@pwioi.com
ANUJ UNIYAL 2501010129 anuj.uniyal.sot25@pwioi.com
SHYAM NATH PATRO 2501010130 shyam.patro.sot25@pwioi.com
SHOAIB KHAN 2501010093 shoaib.khan.sot25@pwioi.com
JAYATI SHARMA 2501010052 jayati.sharma.sot25@pwioi.com
SHIVANSHU SHUKLA 2501010127 shivanshu.shukla.sot25@pwioi.com
MAHENDRA YADAV 2501010119 mahendra.yadav.sot25@pwioi.com
SRISHTI KUMARI 2501010123 srishti.kumari.sot25@pwioi.com
ARYA PATEL 2501010126 arya.patel.sot25@pwioi.com
KUSHAGRA 2501010134 kushagra.sot25@pwioi.com
BATCHU LAKSHMI HASINI 2501010042 batchu.hasini.sot25@pwioi.com
ANURAG MISHRA 2501010005 anurag.mishra.sot25@pwioi.com
VISHESH SINGH RAJPUT 2501010024 vishesh.rajput.sot25@pwioi.com
VAIBHAV SINGH 2501010022 vaibhav.singh.sot25@pwioi.com
DHRUV SHARMA 2501010046 dhruv.sharma.sot25@pwioi.com
ABHISHEK JAIN 2501010002 abhishek.jain.sot25@pwioi.com
NIKHIL TIWARI 2501010136 nikhil.tiwari.sot25@pwioi.com
MD SHAHA UL ALAM 2501010061 md.alam.sot25@pwioi.com
NEMALIPURI RUPAK SAI 2501010063 nemalipuri.sai.sot25@pwioi.com
PIYUSH KUMAR BHARTI 2501010146 piyush.kumar.sot25@pwioi.com
VIKASH KUMAR 2501010141 vikash1.sot25@pwioi.com
ARIJITDEB 2501010037 arijitdeb.sot25@pwioi.com
SAGAR GUPTA 2501010080 sagar.gupta.sot25@pwioi.com
AAYUSH KUMAR MISHRA 2501010025 aayush.mishra.sot25@pwioi.com
KOMAL SONWANE 2501010055 komal.sonwane.sot25@pwioi.com
KRISHNA GUPTA 2501010125 krishna.gupta.sot25@pwioi.com
VAISHNAVIJOSHI 2501010111 vaishnavijoshi.sot25@pwioi.com
ABHILASH REDDY 2501010001 abhilash.reddy.sot25@pwioi.com
SUMEET 2501010096 sumeet.sot25@pwioi.com
PRIYANSHU SHARMA 2501010137 priyanshu.sharma.sot25@pwioi.com
Md Sabir Ahamed 2501010140 md.ahamed.sot25@pwioi.com
VIKASH 2501010023 vikash.sot25@pwioi.com
ARYAN SHRIVASTAVA 2501010007 aryan.shrivastava.sot25@pwioi.com
NIKHIL 2501010064 nikhil.sot25@pwioi.com
MAHAMMAD ZINNA 2501010013 mahammad.zinna.sot25@pwioi.com
DARPAN S GATTIRADDIHAL 2501010009 darpan.gattiraddihal.sot25@pwioi.com
SATYAM KUMAR JHA 2501010147 satyam.jha.sot25@pwioi.com
DIPANJAN MAITY 2501010010 dipanjan.maity.sot25@pwioi.com
SHAHIL HOSSAIN 2501010145 shahil.hossain.sot25@pwioi.com
ANUSHKA PAUL 2501010006 anushka.paul.sot25@pwioi.com
RITESH 2501010076 ritesh.sot25@pwioi.com
ARJUN V 2501010038 arjun.v.sot25@pwioi.com
ADARSH KUMAR RAI 2501010108 adarsh.rai.sot25@pwioi.com
MD SHAHNAWAZ SHAMIM 2501010014 md.shamim.sot25@pwioi.com
SANSKRITI RANA 2501010019 sanskriti.rana.sot25@pwioi.com
AKSHAR DHAKAD 2501010031 akshar.dhakad.sot25@pwioi.com
CHETAN R 2501010115 chetan.r.sot25@pwioi.com
RADHIKA 2501010018 radhika.sot25@pwioi.com
PRIYANSHU KUMAR SINGH 2501010017 priyanshu.singh.sot25@pwioi.com
SURYANJALI PANDEY 2501010098 suryanjali.pandey.sot25@pwioi.com
UTKARSH VERMA 2501010117 utkarsh.verma.sot25@pwioi.com
OMKAR ANIL SHEWALE 2501010015 omkar.shewale.sot25@pwioi.com
SARANSH YADAV 2501010122 saransh.yadav.sot25@pwioi.com
RAM KARAN SUNIL 2501010135 ram.sunil.sot25@pwioi.com
CHIRU NAYAK 2501010114 chiru.nayak.sot25@pwioi.com
PINGILI SAKETH REDDY 2501010016 pingili.reddy.sot25@pwioi.com
HARSH GARG 2501010011 harsh.garg.sot25@pwioi.com
ANSHU NEGI 2501010004 anshu.negi.sot25@pwioi.com
VIJAY KUMAR 2501010103 vijay.kumar.sot25@pwioi.com
ANISH RAI 2501010003 anish.rai.sot25@pwioi.com
NITISH SINGH 2501010121 nitish.singh.sot25@pwioi.com
ADITYA PAL 2501010156 aditya.pal.sot25@pwioi.com
AVINASH M K 2501010040 avinash.k.sot25@pwioi.com
LAKSHYA SAXENA 2501010012 lakshya.saxena.sot25@pwioi.com
SAJIDUL ISLAM 2501010085 sajidul.islam.sot25@pwioi.com
SHASWAT DWIVEDI 2501010090 shaswat.dwivedi.sot25@pwioi.com
SOHAM PATEL 2501010095 soham.patel.sot25@pwioi.com
APURV RAI 2501010113 apurv.rai.sot25@pwioi.com
ANSHU KUMAR 2501010035 anshu.kumar.sot25@pwioi.com
MOTIUL ANSARI 2501010153 muhammad.sot25@pwioi.com
SHREYANSH BHARDWAJ 2501010094 shreyansh.bhardwaj.sot25@pwioi.com
ADITYA RAJ 2501010028 aditya.raj.sot25@pwioi.com
PIYUSH 2501010070 piyush.sot25@pwioi.com
JEEVAN PRAKASH SJ 2501010053 jeevan.sj.sot25@pwioi.com
DHRUMIL 2501010045 dhrumil.sot25@pwioi.com
ROHIT KUMAR YADAV 2501010132 rohit.yadav.sot25@pwioi.com
DISHA RAI 2501010116 disha.rai.sot25@pwioi.com
PRIYANSHU ROY 2501010074 priyanshu.roy.sot25@pwioi.com
SHRUTI SINGH 2501010149 shruti.singh.sot25@pwioi.com
BHAVYA KUMAR 2501010043 bhavya.kumar.sot25@pwioi.com
MEHUL RAJ 2501010062 mehul.raj.sot25@pwioi.com
ANISH KUMAR SINGH 2501010034 anish.singh.sot25@pwioi.com
GAURAV KALAL 2501010048 gaurav.kalal.sot25@pwioi.com
MANISH KUMAR 2501010059 manish.kumar.sot25@pwioi.com
AYUSH KUMAR 2501010041 ayush.kumar.sot25@pwioi.com
SAM GANDHI 2501010086 sam.gandhi.sot25@pwioi.com
SAI HRUDAI 2501010084 sai.hrudai.sot25@pwioi.com
SHRAVANYADAV 2501010128 shravanyadav.sot25@pwioi.com
SANDEEP SAHA 2501010087 sandeep.saha.sot25@pwioi.com
SHARATH KUMAR RAJU MUDDULURI 2501010088 sharath.mudduluri.sot25@pwioi.com
PAREE 2501010068 paree.sot25@pwioi.com
ROKY PAUL 2501010077 roky.paul.sot25@pwioi.com
RUBEN 2501010078 ruben.sot25@pwioi.com
LAKIT TAMANG 2501010058 lakit.tamang.sot25@pwioi.com
PRINCE KUMAR 2501010073 prince.kumar.sot25@pwioi.com
ABHISHEK DESHMUKH 2501010158 abhishek.deshmukh.sot25@pwioi.com
KSHITEESH PANDE 2501010143 kshiteesh.pandey.sot25@pwioi.com
NIKHIL KUMAR 2501010065 nikhil.kumar.sot25@pwioi.com
DHRUV 2501010152 dhruv.sot25@pwioi.com
GAGAN SAINI 2501010047 gagan.saini.sot25@pwioi.com
ARYAN GUPTA 2501010039 aryan.gupta.sot25@pwioi.com
PIYUSH DASH 2501010071 piyush.dash.sot25@pwioi.com
SAHIL BEHERA 2501010081 sahil.behera.sot25@pwioi.com
MRINAL KATARIYA 2501040155 mrinal.sot25@pwioi.com
ADITYA NARAYAN DASH 2501010027 aditya.dash.sot25@pwioi.com
AMRITA SINGH 2501010032 amrita.singh.sot25@pwioi.com
ALOK KUMAR MAHATO 2501010124 alok.mahato.sot25@pwioi.com
AMAN GUPTA 2501010109 aman.gupta.sot25@pwioi.com
ABHISHEK THAKUR 2501010026 abhishek.thakur.sot25@pwioi.com
YASH 2501010105 yash.sot25@pwioi.com
BHAGYASHREE PATIL 2501010151 bhagyashree.patil.sot25@pwioi.com
Samarth Swami 2501010150 samarth.sot25@pwioi.com
HIMADRISH BHOWMIK 2501010051 himadrish.bhowmik.sot25@pwioi.com
MUNSI GOWSAL 2501010142 munsi.gowsal.sot25@pwioi.com
ABHISHEK 2501010144 abhishek.sot25@pwioi.com
KUNAL ADTANI 2501010057 kunal.adtani.sot25@pwioi.com
AYUSH KUMAR SINGH 2501010159 ayush1.sot25@pwioi.com
CHETHAN SAI M 2501010157 chethan.m.sot25@pwioi.com
PUSHKAR PALLAV 2501010154 pushkar.pallav.sot25@pwioi.com
QUAMAR ABRAR 2501010112 quamar.abrar.sot25@pwioi.com
MOHIT BIRLA 2501010133 mohit.birla.sot25@pwioi.com
NIKITHA 2501010066 nikitha.sot25@pwioi.com
UTTKARSH CHAMBIYAL 2501010102 uttkarsh.chambiyal.sot25@pwioi.com
RUDRANIL MAJUMDER 2501010079 rudranil.majumder.sot25@pwioi.com
VISHAL WADHWANI 2501010104 vishal.wadhwani.sot25@pwioi.com
TANUJ RANA 2501010100 tanuj.rana.sot25@pwioi.com
SHIVAM SINGH 2501010092 shivam.singh.sot25@pwioi.com
RAJIV RANJAN JHA 2501010075 rajiv.jha.sot25@pwioi.com
NIMESH YADAV 2501010067 nimesh.yadav.sot25@pwioi.com
KANNE LAKSHMI KANTH 2501010054 kanne.kanth.sot25@pwioi.com
SAFIA ANJUM 2501010118 safia.anjum.sot25@pwioi.com
SUJEET RAY 2501010148 sujit.kumar.sot25@pwioi.com
AKASH VIKAS WAKADE 2501010030 akash.wakade.sot25@pwioi.com
SUPRATICK SAHA ROY 2501010097 supratick.roy.sot25@pwioi.com
ANUTTAMA MS BHAT 2501010107 anuttama.bhat.sot25@pwioi.com
ANAHADH BIRDH 2501010033 anahadh.birdh.sot25@pwioi.com
SHARIB CHAUHAN 2501010089 sharib.chauhan.sot25@pwioi.com
ROHIT KUMAWAT 2501030108 rohit.kumawat.sot25@pwioi.com
KRISH 2501010056 krish.sot25@pwioi.com
GOVIND SHARMA 2501010106 govind.sharma.sot25@pwioi.com
MANISH KUMAR KUNTAL 2501010060 manish.kuntal.sot25@pwioi.com
NEERAJ SAINI 2501010120 neeraj.saini.sot25@pwioi.com
APARNA VAISHNAVI 2501010036 aparna.vaishnavi.sot25@pwioi.com
PARVAZ AHMED MAZUMDER 2501010069 parvaz.mazumder.sot25@pwioi.com
DEEP NARAYAN 2502010005 deep.narayan.som25@pwioi.com
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

    try {
        await connection.query('ALTER TABLE Member ADD COLUMN email VARCHAR(100);');
        console.log('Added email column to Member table.');
    } catch(err) {
        if(err.code === 'ER_DUP_FIELDNAME') console.log('Email column already exists.');
        else throw err;
    }

    const lines = data.split('\n');
    let updatedCount = 0;

    for (const line of lines) {
        if (!line.trim()) continue;
        const match = line.match(/^(.+?)\s+(\d{10})\s+(\S+@pwioi\.com)$/);
        if (match) {
            const enrollId = match[2];
            const email = match[3];
            const addressSearch = `%${enrollId}%`;
            const [result] = await connection.query(
                'UPDATE Member SET email = ? WHERE address LIKE ?',
                [email, addressSearch]
            );
            if(result.affectedRows > 0) updatedCount++;
        }
    }
    
    console.log(`Successfully updated ${updatedCount} members with their emails.`);
    await connection.end();
}

main().catch(console.error);
