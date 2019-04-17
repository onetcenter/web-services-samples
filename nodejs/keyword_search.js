"use strict"
const OnetWebService = require('./OnetWebService')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function get_user_input_once(prompt) {
  return new Promise((resolve, reject) => {
      rl.question(prompt + ': ', (input) => resolve(input.trim()) )
    })
}
async function get_user_input(prompt) {
  let input = ''
  while (!input.length) {
    input = await get_user_input_once(prompt)
  }
  return input
}

function check_for_error(service_result) {
  if (service_result.hasOwnProperty('error')) {
    throw new Error(service_result.error)
  }
}

(async () => {
  try {
    const username = await get_user_input('O*NET Web Services username')
    const password = await get_user_input('O*NET Web Services password')
    const onet_ws = new OnetWebService(username, password)

    const vinfo = await onet_ws.call('about')
    check_for_error(vinfo)
    console.log('Connected to O*NET Web Services version ' + vinfo.api_version)
    console.log('')

    const kwquery = await get_user_input('Keyword search query')
    const kwresults = await onet_ws.call('online/search', {
                                            keyword: kwquery,
                                            end: 5 })
    check_for_error(kwresults)
    if (!kwresults.hasOwnProperty('occupation') || !kwresults.occupation.length) {
      console.log('No relevant occupations were found.')
      console.log('')
    } else {
      console.log('Most relevant occupations for "' + kwquery + '":')
      for (let occ of kwresults.occupation) {
        console.log('  ' + occ.code + ' - ' + occ.title)
      }
      console.log('')
    }
  } catch (error) {
    console.error(error.message)
  }
  rl.close()
})()
