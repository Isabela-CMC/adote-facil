import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

export const BASE_URL = 'http://localhost:3000';
export const TIMEOUT = 10000;

/**
 * Cria uma instancia do Chrome WebDriver em modo headless.
 */
export function buildDriver() {
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1280,900');

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

/**
 * Gera um email unico usando timestamp pra evitar conflito
 */
export function generateUniqueEmail() {
  const timestamp = Date.now();
  return `testuser_${timestamp}@test.com`;
}

/**
 * Registra um novo usuario pela pagina /cadastro
 * Retorna o email e senha que foi usado
 */
export async function registerUser(driver, { name, email, password } = {}) {
  const userEmail = email || generateUniqueEmail();
  const userPassword = password || 'Test1234!';
  const userName = name || 'Testuser';

  await driver.get(`${BASE_URL}/cadastro`);
  await driver.wait(until.elementLocated(By.css('h1')), TIMEOUT);

  // Preenche os campos do formulario
  const nameInput = await driver.findElement(By.css('input[name="name"]'));
  await nameInput.clear();
  await nameInput.sendKeys(userName);

  const emailInput = await driver.findElement(By.css('input[name="email"]'));
  await emailInput.clear();
  await emailInput.sendKeys(userEmail);

  // Os campos de senha ficam dentro do componente PasswordInput
  const passwordInputs = await driver.findElements(By.css('input[type="password"]'));
  await passwordInputs[0].clear();
  await passwordInputs[0].sendKeys(userPassword);

  await passwordInputs[1].clear();
  await passwordInputs[1].sendKeys(userPassword);

  // Envia o formulario
  const submitButton = await driver.findElement(By.xpath("//button[contains(text(),'Cadastrar')]"));
  await submitButton.click();

  // Espera o alerta aparecer e aceita ele
  await driver.wait(until.alertIsPresent(), TIMEOUT);
  const alert = await driver.switchTo().alert();
  const alertText = await alert.getText();
  await alert.accept();

  return { email: userEmail, password: userPassword, name: userName, alertText };
}

/**
 * Faz login de um usuario existente pela pagina /login.
 */
export async function login(driver, email, password) {
  await driver.get(`${BASE_URL}/login`);
  await driver.wait(until.elementLocated(By.css('h1')), TIMEOUT);

  const emailInput = await driver.findElement(By.css('input[type="email"]'));
  await emailInput.clear();
  await emailInput.sendKeys(email);

  const passwordInput = await driver.findElement(By.css('input[type="password"]'));
  await passwordInput.clear();
  await passwordInput.sendKeys(password);

  const submitButton = await driver.findElement(By.xpath("//button[contains(text(),'Login')]"));
  await submitButton.click();

  // Espera a navegação pra area logada
  await driver.wait(until.urlContains('/area_logada'), TIMEOUT);
}
