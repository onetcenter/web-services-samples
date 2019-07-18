"use strict"
const OnetWebService = require('./OnetWebService')

const consumeStdin = async () => {
  return new Promise((resolve, reject) => {
    process.stdin.setEncoding('utf8')
    const allChunks = []
    process.stdin.on('readable', () => {
      let chunk
      while ((chunk = process.stdin.read()) !== null) {
        allChunks.push(chunk)
      }
    })
    process.stdin.on('end', () => {
      resolve(allChunks.join(''))
    })
  })
}

(async () => {
  try {
    // read JSON input
    const input = JSON.parse(await consumeStdin())
    
    // initialize Web Services and results objects
    const onet_ws = new OnetWebService(input.config.username, input.config.password)
    const max_results = Math.max(1, input.config.max_results)
    const output = { output: [] }
    
    // call keyword search for each input query
    for (let q of input.queries) {
      const res = []
      const kwresults = await onet_ws.call('online/search', {
                                            keyword: q,
                                            end: max_results })
      if (kwresults.hasOwnProperty('occupation') && kwresults.occupation.length) {
        for (let occ of kwresults.occupation) {
          res.push({ code: occ.code, title: occ.title })
        }
      }
      output.output.push({ query: q, results: res })
    }

    // print results to stdout
    console.log(JSON.stringify(output, null, 2))
    
  } catch (error) {
    console.error(error.message)
  }
})()
