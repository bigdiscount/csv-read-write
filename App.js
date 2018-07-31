const express = require('express')
const app = express()
const fs = require('fs')
const csv = require('fast-csv')
const port = process.env.PORT || 3456

app.get('/', (req, res)=>{

   var dtHolder = []
    var dtLine = {}
    let dataObj = [{        
        postalFrom: 0,
        postalTo: 0,
        weightFrom: 0,
        weightTo: 0,
        basePrice: 0,
        priceRate: 0,
    }]

    const readfn = 'matrixrates.csv'
    var stream = fs.createReadStream(readfn)
    var csvStream = csv
    .parse()
    .on("data", function(data){
        dataObj.postalFrom = Number(data[3])
        dataObj.postalTo = Number(data[4])
        dataObj.weightFrom = Number(data[5])
        dataObj.weightTo = Number(data[6])
        dataObj. basePrice = Number(data[7])
        dataObj.priceRate = Number(data[8])

        //  generation the shipping cost for the weight range from 6kg to 21 where i represent the weight range
         for(var i=6; i<=21; i++){
            let price = '$' + (i * dataObj.priceRate +  dataObj.basePrice).toFixed(2)
            let wt = i + 1
            dtHolder.push({
                postalFrom: dataObj.postalFrom,
                postalTo: dataObj.postalTo,
                weightFrom: i,
                weightTo: i+1,
                priceRate: price
            })
        }
        
         
    })
    .on("end", function(){
        
        writeCSV(dtHolder)
         console.log("++++++done++++++++");
    });

    stream.pipe(csvStream)

    

function writeCSV() {
    // write data 

    const writefn = 'postcode-weight-range.csv'
    var csvStream = csv.createWriteStream({ headers: true }),
        writableStream = fs.createWriteStream(writefn);

    writableStream.on("finish", function () {
        console.log("DONE!");
        res.send('data in console')
    });

    csv 
        .write(dtHolder, {headers: true}).pipe(writableStream)
    
}

})



app.listen(3456, (req, res)=>{
    console.log("server runnning on port: " + port)
})