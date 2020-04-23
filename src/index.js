/**
 * Script ler cada linha do arquivo dados.txt que contem numeros de CPF
 * e faz a consulta do CPF no site https://www.situacao-cadastral.com e
 * registra o print do resultado.
 */
const puppeteer = require('puppeteer');
const lineReader = require('line-reader');

lineReader.eachLine('../data/dados.txt', function(line, last) {

  getCPF(line);

  if (last) {
    return false; // stop reading
  }
});

const getCPF = async (cpf) => {

  const browser = await puppeteer.launch({
    //headless: false
  });
  const page = await browser.newPage();

  try {

    await page.goto('https://www.situacao-cadastral.com/', {waitUntil: 'networkidle2'});
    await page.waitFor('input[name="doc"]');
    await page.type('input[name="doc"]', cpf, {delay: 180});
    await page.keyboard.press('Enter');

    try {
      await page.waitFor('#resultado', {waitUntil: 'networkidle2'});
    } catch (error) {
      console.log('Erro: Sem retorno!');
    }

    await page.screenshot({path:`../uploads/cpf-${cpf}.png`});
    console.log(`Dados do CPF: ${cpf} foram salvos`);

  } catch (error) {
    console.error(error);
  }

  await browser.close();
}
