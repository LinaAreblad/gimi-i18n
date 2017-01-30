/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

// @martin, alright, i would first do this as a seperate project called anna becuase we dont want to screw up sara and this might not work
var fs = require('fs')
var translate = require('google-translate-api')

let templateDir = './text_strings/notifications'
let getPath = (file) => `${templateDir}/${file}`

let translateTextStringForFile = (file, textId) => {
  if (file === 'default.json') { return Promise.resolve() }
  if (file.indexOf('.json') === -1) { return Promise.resolve() }

  if (file === 'sv.json') {
    return Promise.resolve()
  }

  var path = getPath(file)
  var TextStrings = fs.readFileSync(path, {encoding: 'utf8'})
  TextStrings = JSON.parse(TextStrings)
  var stringToReplace = TextStrings[textId]
  var lang = file.replace('TextStrings_', '').replace('.json', '')
  if (lang === 'nb') {
    lang = 'no'
  }

  return translate(stringToReplace, {to: lang}).then(res => {
    console.log(`Translated text: '${stringToReplace}' to: '${res.text}' in ${file}`)
    TextStrings[textId] = res.text
    TextStrings = JSON.stringify(TextStrings, undefined, 2)
    fs.unlinkSync(path)
    fs.writeFileSync(path, TextStrings, {encoding: 'utf8'})
  }).catch(err => {
    return Promise.reject(new Error(`Error on textId ${textId}. message: ${err}. file: ${file}`))
  })
  // replace gamla med nya
  // sen spara till fil

  // Save changes
}

let textIdToTranslate = process.argv[2]

// @martin parse process.argv which contains the inputs you executed the app with, for example, npm run anna -- text_id,
// then the value of textid will be in the process.argv array at place 3 or 4
Promise.all(fs.readdirSync(templateDir).map((file) => translateTextStringForFile(file, textIdToTranslate)))
.then(() => console.log('saved Successfully :)'))
.catch((err) => console.error(err))
