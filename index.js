const fs = require('fs')
const cheerio = require('cheerio')

const html = fs.readFileSync('./source.html',{encoding: 'utf8'})

const $ = cheerio.load(html)

const skillToLevelDict = {}

$('table.wikitable tbody tr td ul li').each((i, {children, ...restOfElem}) => {
  const xpInfoArr = children[0] && children[0] && children[0].children
  const level = parseInt(xpInfoArr[0] && xpInfoArr[0].data)
  
  const skillName = xpInfoArr[3] && xpInfoArr[3].children && xpInfoArr[3].children[0] && xpInfoArr[3].children[0].children && xpInfoArr[3].children[0].children[0] && xpInfoArr[3].children[0].children[0].data

  if(!skillToLevelDict[skillName]) skillToLevelDict[skillName] = []
  skillToLevelDict[skillName].push(level)
})

const outWrite = fs.createWriteStream('./output.txt',{encoding: 'utf8'})
Object.keys(skillToLevelDict).map(skill => {
  const test = []
  const skillArr = skillToLevelDict[skill].sort((a,b) => b-a)
  const maxSkillLvl = skillArr[0]
  outWrite.write(`${skill}: ${maxSkillLvl} \n`)
  // console.log(`${skill}: ${maxSkillLvl}`)
})